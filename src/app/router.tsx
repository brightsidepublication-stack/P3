import { Navigate, createBrowserRouter } from 'react-router-dom';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { ROUTES } from '@/constants/routes';
import { LoginPage } from '@/pages/LoginPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { SignupPage } from '@/pages/SignupPage';
import { MainLayout } from '@/layouts/MainLayout';

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: ROUTES.PROFILE,
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: `${ROUTES.AGENT}/*`,
        element: (
          <ProtectedRoute>
            <RoleGuard requiredRoles={['agent', 'admin']}>
              <div>Agent Area</div>
            </RoleGuard>
          </ProtectedRoute>
        ),
      },
      {
        path: `${ROUTES.ADMIN}/*`,
        element: (
          <ProtectedRoute>
            <RoleGuard requiredRoles={['admin']}>
              <div>Admin Area</div>
            </RoleGuard>
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.HOME,
        element: <Navigate to={ROUTES.PROFILE} replace />,
      },
    ],
  },
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />,
  },
  {
    path: ROUTES.SIGNUP,
    element: <SignupPage />,
  },
  {
    path: '*',
    element: <Navigate to={ROUTES.HOME} replace />,
  },
]);