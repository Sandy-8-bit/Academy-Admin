import Cookies from "js-cookie";
import axiosInstance from "../utils/axios";
import axios from "axios";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { apiRoutes } from "../routes/apiRoutes";
import type { UserMeResponse } from "../types/UserTypes";

export const useFetchUserMe = () => {
  const fetchUserMe = async (): Promise<UserMeResponse> => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized");

      const res = await axiosInstance.get<UserMeResponse>(
        apiRoutes.user,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status !== 200) {
        throw new Error(res.data?.success === false
          ? "Failed to fetch user data"
          : "Unexpected response");
      }

      return res.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(
          (error.response?.data as any)?.message ||
            "Failed to fetch user data"
        );
      } else {
        toast.error("Something went wrong while fetching user data");
      }
      throw new Error("User fetch failed");
    }
  };

  return useQuery<UserMeResponse>({
    queryKey: ["user-me"],
    queryFn: fetchUserMe,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};
