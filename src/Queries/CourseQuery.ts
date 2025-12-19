import Cookies from "js-cookie";
import axiosInstance from "../utils/axios";
import axios from "axios";
import toast from "react-hot-toast";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { apiRoutes } from "../routes/apiRoutes";
import type {
  CourseResponse,
  CourseRequest,
} from "../types/CourseTypes";

/* -------------------- AUTH HEADER -------------------- */
const getAuthHeader = () => {
  const token = Cookies.get("token");
  if (!token) throw new Error("Unauthorized");

  return {
    Authorization: `Bearer ${token}`,
  };
};

/* -------------------- GET ALL COURSES -------------------- */
export const useFetchCourses = () => {
  const fetchCourses = async (): Promise<CourseResponse[]> => {
    try {
      const res = await axiosInstance.get<CourseResponse[]>(
        apiRoutes.course,
        {
          headers: getAuthHeader(),
        }
      );
      return res.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to fetch courses"
        );
      }
      throw error;
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
    const res = await axiosInstance.post<CourseResponse>(
      apiRoutes.course,
      payload,
      {
        headers: getAuthHeader(),
      }
    );
    return res.data;
  };

  return useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      toast.success("Course created successfully");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to create course"
      );
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
    const res = await axiosInstance.put<CourseResponse>(
      `${apiRoutes.course}/${courseId}`,
      payload,
      {
        headers: getAuthHeader(),
      }
    );
    return res.data;
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
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to update course"
      );
    },
  });
};

/* -------------------- DELETE COURSE -------------------- */
export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  const deleteCourse = async (
    courseId: string
  ): Promise<{ success: boolean }> => {
    const res = await axiosInstance.delete<{ success: boolean }>(
      `${apiRoutes.course}/${courseId}`,
      {
        headers: getAuthHeader(),
      }
    );
    return res.data;
  };

  return useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      toast.success("Course deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete course"
      );
    },
  });
};

/* -------------------- GET COURSE BY ID -------------------- */
export const useFetchCourseById = (courseId: string) => {
  const fetchCourseById = async (): Promise<CourseResponse> => {
    const res = await axiosInstance.get<CourseResponse>(
      `${apiRoutes.course}/${courseId}`,
      {
        headers: getAuthHeader(),
      }
    );
    return res.data;
  };

  return useQuery({
    queryKey: ["course", courseId],
    queryFn: fetchCourseById,
    enabled: !!courseId,
  });
};
