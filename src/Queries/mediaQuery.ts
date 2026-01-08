import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/utils/axios";
import { authHandler } from "@/utils/authHandler";
import { handleApiError } from "@/utils/handleApiError";
import { apiRoutes } from "@/routes/apiRoutes";

export interface VideoUploadUrlResponse {
  uploadUrl: string;
  video_url: string;
}

interface RequestVideoUploadUrlPayload {
  contentType: string;
  extension: string;
}

const requestVideoUploadUrl = async (
  payload: RequestVideoUploadUrlPayload
): Promise<VideoUploadUrlResponse> => {
  const token = authHandler();

  try {
    const res = await axiosInstance.post<VideoUploadUrlResponse>(
      apiRoutes.mediaVideoUploadUrl,
      {
        contentType: payload.contentType,
        extension: payload.extension,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    handleApiError(error, "request video upload url");
    throw error;
  }
};

export const useRequestVideoUploadUrl = () =>
  useMutation({
    mutationFn: requestVideoUploadUrl,
  });
