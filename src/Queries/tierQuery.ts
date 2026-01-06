import axiosInstance from "../utils/axios";
import toast from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { TierGet, TierPost, Tier } from "../types/tierTypes";
import { authHandler } from "@/utils/authHandler";
import { handleApiError } from "@/utils/handleApiError";

/* -------------------- GET TIERS BY COURSE -------------------- */
export const useFetchTiersByCourse = (courseId: string) => {
  const fetchTiers = async (): Promise<TierGet> => {
    const token = authHandler();

    try {
      const res = await axiosInstance.get<TierGet>(
        `/api/v1/courses/${courseId}/tiers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      handleApiError(error, "fetch tiers");
      throw error;
    }
  };

  return useQuery({
    queryKey: ["tiers", courseId],
    queryFn: fetchTiers,
    enabled: !!courseId,
  });
};

/* -------------------- CREATE TIER -------------------- */
export const useCreateTier = (courseId: string) => {
  const queryClient = useQueryClient();

  const createTier = async (payload: TierPost): Promise<Tier> => {
    const token = authHandler();

    try {
      const res = await axiosInstance.post<Tier>(
        `/api/v1/courses/${courseId}/tiers`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      handleApiError(error, "create tier");
      throw error;
    }
  };

  return useMutation({
    mutationFn: createTier,
    onSuccess: () => {
      toast.success("Tier created successfully");
      queryClient.invalidateQueries({ queryKey: ["tiers", courseId] });
    },
  });
};


/* -------------------- UPDATE TIER -------------------- */
export const useUpdateTier = () => {
  const queryClient = useQueryClient();

  const updateTier = async ({
    tierId,
    payload,
  }: {
    tierId: string;
    payload: TierPost;
    courseId: string;
  }): Promise<Tier> => {
    const token = authHandler();

    try {
      const res = await axiosInstance.put<Tier>(
        `/api/v1/courses/tiers/${tierId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      handleApiError(error, "update tier");
      throw error;
    }
  };

  return useMutation({
    mutationFn: updateTier,
    onSuccess: (_, variables) => {
      toast.success("Tier updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["tiers", variables.courseId],
      });
    },
  });
};

/* -------------------- DELETE TIER -------------------- */
export const useDeleteTier = (courseId: string) => {
  const queryClient = useQueryClient();

  const deleteTier = async (tierId: string): Promise<{ success: boolean }> => {
    const token = authHandler();

    try {
      const res = await axiosInstance.delete<{ success: boolean }>(
        `/api/v1/courses/tiers/${tierId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      handleApiError(error, "delete tier");
      throw error;
    }
  };

  return useMutation({
    mutationFn: deleteTier,
    onSuccess: () => {
      toast.success("Tier deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["tiers", courseId] });
    },
  });
};

