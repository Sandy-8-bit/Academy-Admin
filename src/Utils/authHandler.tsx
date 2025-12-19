import Cookies from "js-cookie";
import { appRoutes } from "@/routes/appRoutes";
import { toast } from "react-hot-toast";

export function authHandler() {
  const token = Cookies.get("token");

  if (!token) {
    toast.error("Unauthorized. Please login again.");

    setTimeout(() => {
      window.location.href = appRoutes.signInPage;
    }, 800);

    return null;
  }

  return token;
}
