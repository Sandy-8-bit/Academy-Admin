export const apiRoutes = {
  // AUTH
  login: "/api/auth/login",
  register: "/api/auth/register",
  // USER
  user: "/api/v1/users/me",
  // COURSES
  course: "/api/v1/courses",
  // TIERS
  tierById: "/api/v1/tiers", // PUT, DELETE
  // CONTENT
  contentById: "/api/v1/courses/tiers", // PUT, DELETE
  // MEDIA
  mediaVideoUploadUrl: "/api/v1/media/videos/upload-url",
  mediaViewUrl:"/api/v1/media/videos"
};
