export const appRoutes = {
  signInPage: "/auth",
  dashboard: "/",

  management: {
    path: "/management",
    children: {
      courseCreate: "/management/course",
      moduleCreate: "/management/module",
      contentCreate: "/management/content",
    },
  },
};
