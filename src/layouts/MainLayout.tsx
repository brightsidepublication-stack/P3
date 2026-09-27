import { Outlet, useLocation } from 'react-router-dom';
import { AppShell } from './AppShell';
import { AUTH_ROUTES } from '../constants/routes';

export function MainLayout() {
  const location = useLocation();

  const showBottomNav = !AUTH_ROUTES.includes(location.pathname);

  return (
    <AppShell showBottomNav={showBottomNav}>
      <Outlet />
    </AppShell>
  );
}