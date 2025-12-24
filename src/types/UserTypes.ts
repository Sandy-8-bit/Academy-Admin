export interface UserMe {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user"; // extend if more roles exist
  created_at: string; // ISO date string
}

export interface UserMeResponse {
  success: boolean;
  data: UserMe;
}
