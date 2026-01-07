export const appRoutes = {
  signInPage: "/auth",
  dashboard: "/",
  course: {
    path: "/course",
    children: {
      courseTiers: "/course/:id",
      courseDetails: "/course/:courseId",
      courseContent: "/course/:courseId/tier/:tierId",
    },
  },
};
