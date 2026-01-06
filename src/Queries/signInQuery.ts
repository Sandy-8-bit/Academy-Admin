import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { ZodError } from "zod";
import Cookies from "js-cookie";

import { SignInSchema } from "../utils/validationSchema";
import type {
  signInRequestType,
  SignInResponseType,
} from "../types/authApiTypes";
import { supabase } from "../utils/supabase";

/* ------------------------------------------------------------------
 * SIGN IN (Supabase)
 * ------------------------------------------------------------------ */
const signInRequest = async (
  data: signInRequestType
): Promise<SignInResponseType> => {
  try {
    const parsed = SignInSchema.parse(data);

    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: parsed.identifier,
      password: parsed.password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!authData.session) {
      throw new Error("No active session");
    }

    const accessToken = authData.session.access_token;
    console.log(authData);
    localStorage.setItem("token-dmif", accessToken);

    // ✅ SAVE TOKEN IN COOKIE
    Cookies.set("token-dmif", accessToken, {
      expires: 1,
      secure: import.meta.env.PROD, // ✅ safe for localhost
      sameSite: "strict",
      path: "/",
    });

    toast.success("Sign-in successful!");

    return {
      token: accessToken,
    };
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      toast.error(error.issues?.[0]?.message ?? "Invalid input");
    } else if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error("Something went wrong during sign-in");
    }
    throw error;
  }
};

/* ------------------------------------------------------------------
 * LOGOUT (Supabase)
 * ------------------------------------------------------------------ */
const logoutRequest = async (): Promise<boolean> => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }

  Cookies.remove("token-dmif", { path: "/" });

  return true;
};

/* ------------------------------------------------------------------
 * REACT QUERY HOOKS
 * ------------------------------------------------------------------ */
export const useSignInMutation = () => {
  return useMutation({
    mutationFn: signInRequest,
  });
};

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: logoutRequest,
    onSuccess: () => {
      toast.success("Logged out successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Logout failed");
    },
  });
};
