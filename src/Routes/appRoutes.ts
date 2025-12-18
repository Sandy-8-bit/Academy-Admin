export const appRoutes = {
  signInPage: '/auth',
  dashboard: '/',
  courses: {
    path: '/courses',
    children: {
      details: '/courses/:id',
    },
  },
}
