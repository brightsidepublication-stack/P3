export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  PROFILE: '/profile',

  AGENT: '/agent',
  ADMIN: '/admin',
} as const;

export const AUTH_ROUTES: readonly string[] = [
  ROUTES.LOGIN,
  ROUTES.SIGNUP,
];