import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/utils/axios";
import { authHandler } from "@/utils/authHandler";
import { handleApiError } from "@/utils/handleApiError";
import {
  type CreateTierContentPayload,
  type TierContentItem,
  type TierContentsResponse,
} from "@/types/courseContent";
import { apiRoutes } from "@/routes/apiRoutes";
import toast from "react-hot-toast";

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

/* -------------------- CREATE TIER CONTENT -------------------- */
export const useCreateTierContent = () => {
  const queryClient = useQueryClient();

  const createTierContent = async ({
    tierId,
    payload,
  }: {
    tierId: string;
    payload: CreateTierContentPayload;
  }): Promise<TierContentItem> => {
    const token = authHandler();

    try {
      const res = await axiosInstance.post<TierContentItem>(
        `${apiRoutes.contentById}/${tierId}/contents`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data;
    } catch (error) {
      handleApiError(error, "create tier content");
    }
  };

  return useMutation({
    mutationFn: createTierContent,
    onSuccess: (_, variables) => {
      toast.success("Content added successfully");
      queryClient.invalidateQueries({
        queryKey: ["tier-contents", variables.tierId],
      });
    },
  });
};
