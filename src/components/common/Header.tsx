import { Building2, ClipboardList, Menu, Search, UserCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { Container } from '../ui/Container';
import { useAuth } from '@/features/auth/hooks/useAuth';

type HeaderProps = {
  title?: string;
  onMenuClick?: () => void;
};

export function Header({
  title,
  onMenuClick,
}: HeaderProps) {
  const location = useLocation();
  const { profile } = useAuth();
  const canReviewListings = profile?.role === 'admin' || profile?.role === 'super_admin';

  const isAuthPage =
    location.pathname === ROUTES.LOGIN ||
    location.pathname === ROUTES.SIGNUP;

  if (title) {
    return (
      <header className="border-b border-slate-200 bg-white">
        <Container className="flex min-h-16 items-center justify-between gap-4">
          <h1 className="text-lg font-bold text-slate-900">
            {title}
          </h1>

          {onMenuClick ? (
            <button
              type="button"
              onClick={onMenuClick}
              aria-label="باز کردن منو"
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
              <Menu aria-hidden="true" className="h-5 w-5" />
            </button>
          ) : null}
        </Container>
      </header>
    );
  }

  const linkClass = (path: string) =>
    `inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${location.pathname === path || location.pathname.startsWith(path + '/') ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`;

  return (
    <header className="border-b border-slate-200 bg-white">
      <Container className="flex min-h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onMenuClick && !isAuthPage ? (
            <button
              type="button"
              onClick={onMenuClick}
              aria-label="باز کردن منو"
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 md:hidden"
            >
              <Menu aria-hidden="true" className="h-5 w-5" />
            </button>
          ) : null}

          <Link
            to={ROUTES.HOME}
            className="text-lg font-bold text-slate-900"
          >
            املاک
          </Link>
        </div>

        {!isAuthPage ? (
          <nav aria-label="ناوبری دسکتاپ" className="hidden items-center gap-1 md:flex">
            <Link to={ROUTES.browse} className={linkClass(ROUTES.browse)}>
              <Search aria-hidden="true" className="h-4 w-4" />
              آگهی‌های عمومی
            </Link>
            <Link to={ROUTES.properties.root} className={linkClass(ROUTES.properties.root)}>
              <Building2 aria-hidden="true" className="h-4 w-4" />
              املاک من
            </Link>
            <Link to={ROUTES.listings.root} className={linkClass(ROUTES.listings.root)}>
              <ClipboardList aria-hidden="true" className="h-4 w-4" />
              آگهی‌های من
            </Link>
            {canReviewListings ? (
              <Link to={ROUTES.ADMIN} className={linkClass(ROUTES.ADMIN)}>
                <ClipboardList aria-hidden="true" className="h-4 w-4" />
                بررسی آگهی‌ها
              </Link>
            ) : null}
          </nav>
        ) : null}

        {!isAuthPage ? (
          <Link
            to={ROUTES.PROFILE}
            aria-label="پروفایل"
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            <UserCircle aria-hidden="true" className="h-6 w-6" />
          </Link>
        ) : null}
      </Container>
    </header>
  );
}
