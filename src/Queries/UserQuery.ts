import axiosInstance from "@utils/axios";
import { useQuery } from "@tanstack/react-query";
import { apiRoutes } from "@/routes/apiRoutes";
import type { UserMeResponse } from "@/types/userTypes";
import { authHandler } from "@/utils/authHandler";
import { handleApiError } from "@/utils/handleApiError";

export const useFetchUserMe = () => {
  const token = authHandler();
  const fetchUserMe = async (): Promise<UserMeResponse> => {
    try {
      const res = await axiosInstance.get<UserMeResponse>(apiRoutes.user, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    } catch (error) {
      handleApiError(error);
    }
  };

  return useQuery({
    queryKey: ["user-me", token],
    queryFn: fetchUserMe,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};
