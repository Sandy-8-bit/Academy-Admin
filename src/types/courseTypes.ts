export interface CourseResponse {
  id: string;
  course_name: string;
  total_hours: number;
  price: number;
  course_description: string;
  thumbnail_url: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface CourseRequest {
  course_name: string;
  total_hours: number;
  price: number;
  course_description: string;
  thumbnail_url?: string;
}

