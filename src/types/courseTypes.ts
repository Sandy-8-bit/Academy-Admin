export interface CourseResponse {
  id: string;
  course_name: string;
  total_hours: number;
  price: number;
  description: string;
  thumbnail_url: string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export interface CourseRequest {
  course_name: string;
  total_hours: number;
  price: number;
  description: string;
  file?: File; // ✅ optional
}

