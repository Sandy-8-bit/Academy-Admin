export const appRoutes = {
  signInPage: '/auth',
  home: '/',
  courses: {
    path: '/courses',
    children: {
      details: '/courses/:id',
    },
  },
}
