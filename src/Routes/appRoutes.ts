export const appRoutes = {
  signInPage: "/auth",
  dashboard: "/",

  course: {
    path: "/course",
    children: {
      courseDetails: "/course/:courseId",
    },
  },
};
