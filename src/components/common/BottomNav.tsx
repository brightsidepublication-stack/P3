import { Home, UserCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

export function BottomNav() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      aria-label="ناوبری پایین"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white md:hidden"
    >
      <div className="mx-auto flex max-w-md items-center justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        <Link
          to={ROUTES.HOME}
          className={`flex min-w-20 flex-col items-center gap-1 px-3 py-3 text-xs font-medium ${
            isActive(ROUTES.HOME)
              ? 'text-slate-900'
              : 'text-slate-500'
          }`}
        >
          <Home aria-hidden="true" className="h-5 w-5" />
          <span>خانه</span>
        </Link>

        <Link
          to={ROUTES.PROFILE}
          className={`flex min-w-20 flex-col items-center gap-1 px-3 py-3 text-xs font-medium ${
            isActive(ROUTES.PROFILE)
              ? 'text-slate-900'
              : 'text-slate-500'
          }`}
        >
          <UserCircle
            aria-hidden="true"
            className="h-5 w-5"
          />
          <span>پروفایل</span>
        </Link>
      </div>
    </nav>
  );
}