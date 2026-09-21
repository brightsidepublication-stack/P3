import type { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/features/auth/hooks/useAuth';
import type { UserRoleEnum } from '@/types/database.types';

interface RoleGuardProps extends PropsWithChildren {
  requiredRoles: UserRoleEnum[];
}

export function RoleGuard({
  requiredRoles,
  children,
}: RoleGuardProps) {
  const { profile, isLoading, isProfileLoading } = useAuth();

  const allowed = requiredRoles;
  const role = profile?.role;

  if (isLoading || isProfileLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-slate-600">
          در حال بررسی دسترسی...
        </p>
      </div>
    );
  }

  if (!profile || !allowed.includes(role as UserRoleEnum)) {
    return <Navigate to={ROUTES.PROFILE} replace />;
  }

  return <>{children}</>;
}