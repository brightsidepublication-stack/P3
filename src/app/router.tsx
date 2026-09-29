import { Navigate, createBrowserRouter } from 'react-router-dom';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { ROUTES } from '@/constants/routes';
import { LoginPage } from '@/pages/LoginPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { SignupPage } from '@/pages/SignupPage';
import { MyPropertiesPage } from '@/pages/MyPropertiesPage';
import { PropertyCreatePage } from '@/pages/PropertyCreatePage';
import { PropertyDetailsPage } from '@/pages/PropertyDetailsPage';
import { PropertyEditPage } from '@/pages/PropertyEditPage';
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
        path: ROUTES.properties.root,
        element: (
          <ProtectedRoute>
            <MyPropertiesPage />
          </ProtectedRoute>
        ),
      },

      {
        path: ROUTES.properties.new,
        element: (
          <ProtectedRoute>
            <PropertyCreatePage />
          </ProtectedRoute>
        ),
      },

      {
        path: ROUTES.properties.details(':id'),
        element: (
          <ProtectedRoute>
            <PropertyDetailsPage />
          </ProtectedRoute>
        ),
      },

      {
        path: ROUTES.properties.edit(':id'),
        element: (
          <ProtectedRoute>
            <PropertyEditPage />
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