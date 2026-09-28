export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  PROFILE: '/profile',

  AGENT: '/agent',
  ADMIN: '/admin',

  properties: {
    root: '/properties',
    new: '/properties/new',
    details: (id: string) => `/properties/${id}`,
    edit: (id: string) => `/properties/${id}/edit`,
  },
} as const;

export const AUTH_ROUTES: readonly string[] = [
  ROUTES.LOGIN,
  ROUTES.SIGNUP,
];