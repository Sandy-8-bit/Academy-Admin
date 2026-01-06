export const appRoutes = {
  signInPage: "/auth",
  dashboard: "/",
  course: {
    path: "/course",
    children: {
<<<<<<< HEAD
      courseTiers: "/course/:id",
=======
      courseDetails: "/course/:courseId",
>>>>>>> cd097b2b9d9b01b9f558c5b54a22fde399d807f1
    },
  },
};
