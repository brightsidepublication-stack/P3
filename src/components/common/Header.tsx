import { Menu, UserCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import { APP_NAME } from '../../constants/app';
import { ROUTES } from '../../constants/routes';
import { Container } from '../ui/Container';

type HeaderProps = {
  title?: string;
  onMenuClick?: () => void;
};

export function Header({ title, onMenuClick }: HeaderProps) {
  const location = useLocation();
  const { user, loading } = useAuth();

  const isAuthPage =
    location.pathname === ROUTES.login ||
    location.pathname === ROUTES.signup;

  if (title) {
    return (
      <header className="border-b border-slate-200 bg-white">
        <Container>
          <div className="flex min-h-14 items-center gap-3">
            {onMenuClick ? (
              <button
                type="button"
                onClick={onMenuClick}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100"
                aria-label="باز کردن منو"
              >
                <Menu size={22} aria-hidden="true" />
              </button>
            ) : null}

            <h1 className="text-base font-semibold text-slate-900">
              {title}
            </h1>
          </div>
        </Container>
      </header>
    );
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <Container>
        <div className="flex min-h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {onMenuClick && !isAuthPage ? (
              <button
                type="button"
                onClick={onMenuClick}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 md:hidden"
                aria-label="باز کردن منو"
              >
                <Menu size={22} aria-hidden="true" />
              </button>
            ) : null}

            <Link
              to={ROUTES.home}
              className="text-lg font-bold text-slate-900"
            >
              {APP_NAME}
            </Link>
          </div>

          {!isAuthPage ? (
            <nav
              className="hidden items-center gap-5 md:flex"
              aria-label="ناوبری اصلی"
            >
              <Link
                to={ROUTES.home}
                className="text-sm text-slate-700 hover:text-slate-950"
              >
                خانه
              </Link>

              <Link
                to={ROUTES.search}
                className="text-sm text-slate-700 hover:text-slate-950"
              >
                جستجو
              </Link>

              <Link
                to={ROUTES.favorites}
                className="text-sm text-slate-700 hover:text-slate-950"
              >
                علاقه‌مندی‌ها
              </Link>
            </nav>
          ) : null}

          {!isAuthPage ? (
            <div className="flex items-center">
              {loading ? (
                <span
                  className="h-9 w-20 animate-pulse rounded-lg bg-slate-100"
                  aria-hidden="true"
                />
              ) : user ? (
                <Link
                  to={ROUTES.profile}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-700 hover:bg-slate-100"
                  aria-label="پروفایل"
                >
                  <UserCircle size={24} aria-hidden="true" />
                </Link>
              ) : (
                <Link
                  to={ROUTES.login}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  ورود
                </Link>
              )}
            </div>
          ) : null}
        </div>
      </Container>
    </header>
  );
}