import { Menu, UserCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { Container } from '../ui/Container';

type HeaderProps = {
  title?: string;
  onMenuClick?: () => void;
};

export function Header({
  title,
  onMenuClick,
}: HeaderProps) {
  const location = useLocation();

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
          <Link
            to={ROUTES.PROFILE}
            aria-label="پروفایل"
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            <UserCircle
              aria-hidden="true"
              className="h-6 w-6"
            />
          </Link>
        ) : null}
      </Container>
    </header>
  );
}