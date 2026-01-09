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

export type UpdateTierContentPayload =
  | {
      module_type: "video";
      week?: number;
      day?: number;
      video: {
        title: string;
        description: string;
        video_url: string;
        thumbnail_url: string;
        duration: number;
      };
    }
  | {
      module_type: "test";
      week?: number;
      day?: number;
      test: {
        title: string;
        test_duration: number;
        quizzes: Array<{
          question: string;
          choices: string[];
          answer: string[];
          isMultiChoice: boolean;
        }>;
      };
    };

interface VideoPlayResponse {
  video_url: string;   // adjust based on your backend response
  duration?: number;
}

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

// play video query



export const useFetchVideoPlayUrl = (videoId: string | undefined) => {
  const fetchVideoPlayUrl = async (): Promise<VideoPlayResponse> => {
    const token = authHandler();

    try {
      const res = await axiosInstance.get<VideoPlayResponse>(
        `${apiRoutes.mediaViewUrl}/${videoId}/play`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data;
    } catch (error) {
      handleApiError(error, "fetch video play url");
      throw error;
    }
  };

  return useQuery({
    queryKey: ["video-play", videoId],
    queryFn: fetchVideoPlayUrl,
    enabled: !!videoId,
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
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
      // Convert test_duration from minutes to seconds if it's a test
      const processedPayload = {
        ...payload,
        ...(payload.module_type === "test" && payload.test
          ? {
              test: {
                ...payload.test,
                test_duration: payload.test.test_duration * 60,
              },
            }
          : {}),
      };

      const res = await axiosInstance.post<TierContentItem>(
        `${apiRoutes.contentById}/${tierId}/contents`,
        processedPayload,
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

/* -------------------- UPDATE TIER CONTENT -------------------- */
export const useUpdateTierContent = () => {
  const queryClient = useQueryClient();

  const updateTierContent = async ({
    tierId,
    contentId,
    payload,
  }: {
    tierId: string;
    contentId: string;
    payload: UpdateTierContentPayload;
  }): Promise<TierContentItem> => {
    const token = authHandler();

    try {
      // Convert test_duration from minutes to seconds if it's a test
      const processedPayload = {
        ...payload,
        ...(payload.module_type === "test" && payload.test
          ? {
              test: {
                ...payload.test,
                test_duration: payload.test.test_duration * 60,
              },
            }
          : {}),
      };

      const res = await axiosInstance.patch<TierContentItem>(
        `${apiRoutes.contentById}/${tierId}/contents/${contentId}`,
        processedPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data;
    } catch (error) {
      handleApiError(error, "update tier content");
    }
  };

  return useMutation({
    mutationFn: updateTierContent,
    onSuccess: (_, variables) => {
      toast.success("Content updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["tier-contents", variables.tierId],
      });
    },
  });
};
