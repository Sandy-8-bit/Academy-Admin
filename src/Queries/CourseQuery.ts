import axiosInstance from "../utils/axios";
import toast from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRoutes } from "../routes/apiRoutes";
import type { CourseResponse, CourseRequest } from "../types/courseTypes";
import { authHandler } from "@/utils/authHandler";
import { handleApiError } from "@/utils/handleApiError";
import type { CourseContentsResponse } from "@/types/courseContent";

/* -------------------- GET ALL COURSES -------------------- */
export const useFetchCourses = () => {
  const fetchCourses = async (): Promise<CourseResponse[]> => {
    const token = authHandler();
    try {
      const res = await axiosInstance.get<CourseResponse[]>(apiRoutes.course, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (error) {
      handleApiError(error, "fetch courses");
    }
  };

  return useQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
    staleTime: 1000 * 60 * 5,
  });
};

/* -------------------- CREATE COURSE -------------------- */
export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  const createCourse = async (
    payload: CourseRequest
  ): Promise<CourseResponse> => {
    const token = authHandler();
    try {
      const res = await axiosInstance.post<CourseResponse>(
        apiRoutes.course,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      handleApiError(error, "create course");
    }
  };

  return useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      toast.success("Course created successfully");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};

/* -------------------- UPDATE COURSE -------------------- */
export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  const updateCourse = async ({
    courseId,
    payload,
  }: {
    courseId: string;
    payload: CourseRequest;
  }): Promise<CourseResponse> => {
    const token = authHandler();
    try {
      const res = await axiosInstance.put<CourseResponse>(
        `${apiRoutes.course}/${courseId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      handleApiError(error, "update course");
    }
  };

  return useMutation({
    mutationFn: updateCourse,
    onSuccess: (_, variables) => {
      toast.success("Course updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["course", variables.courseId],
      });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};

/* -------------------- DELETE COURSE -------------------- */
export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  const deleteCourse = async (
    courseId: string
  ): Promise<{ success: boolean }> => {
    const token = authHandler();
    try {
      const res = await axiosInstance.delete<{ success: boolean }>(
        `${apiRoutes.course}/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      handleApiError(error, "delete course");
    }
  };

  return useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      toast.success("Course deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};

/* -------------------- GET COURSE BY ID -------------------- */
export const useFetchCourseById = (courseId: string) => {
  const fetchCourseById = async (): Promise<CourseContentsResponse> => {
    const token = authHandler();

    const res = await axiosInstance.get<CourseContentsResponse>(
      `${apiRoutes.course}/${courseId}/contents`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };

  return useQuery({
    queryKey: ["course-contents", courseId],
    queryFn: fetchCourseById,
    retry: 1,
    enabled: !!courseId,
  });
};
