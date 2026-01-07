import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axios";
import { authHandler } from "@/utils/authHandler";
import { handleApiError } from "@/utils/handleApiError";
import { type TierContentsResponse } from "@/types/courseContent";
import { apiRoutes } from "@/routes/apiRoutes";

/* -------------------- GET TIER CONTENTS -------------------- */
export const useFetchTierContents = (tierId: string | undefined) => {
  const fetchTierContents = async (): Promise<TierContentsResponse> => {
    const token = authHandler();

    try {
      const res = await axiosInstance.get<TierContentsResponse>(
        `${apiRoutes.contentById}/${tierId}/contents`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data;
    } catch (error) {
      handleApiError(error, "fetch tier contents");
    }
  };

  return useQuery({
    queryKey: ["tier-contents", tierId],
    queryFn: fetchTierContents,
    enabled: !!tierId && tierId !== undefined,
  });
};
