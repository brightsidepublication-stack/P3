import { X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { ROUTES } from '../../constants/routes';
import { useFocusTrap } from '../../hooks/useFocusTrap';

type MobileDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export function MobileDrawer({
  open,
  onClose,
}: MobileDrawerProps) {
  const drawerRef = useRef<HTMLElement>(null);
  const location = useLocation();

  useFocusTrap(drawerRef, open);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <button
        type="button"
        aria-label="بستن منو"
        className="absolute inset-0 bg-slate-900/50"
        onClick={onClose}
      />

      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="منوی ناوبری"
        className="absolute inset-y-0 start-0 w-[min(85vw,320px)] overflow-y-auto bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
          <span className="font-semibold text-slate-900">
            منو
          </span>

          <button
            type="button"
            onClick={onClose}
            aria-label="بستن"
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        <nav
          aria-label="ناوبری اصلی"
          className="flex flex-col p-3"
        >
          <Link
            to={ROUTES.HOME}
            onClick={onClose}
            className={`rounded-xl px-4 py-3 text-sm font-medium ${
              isActive(ROUTES.HOME)
                ? 'bg-slate-100 text-slate-900'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            خانه
          </Link>

          <Link
            to={ROUTES.PROFILE}
            onClick={onClose}
            className={`rounded-xl px-4 py-3 text-sm font-medium ${
              isActive(ROUTES.PROFILE)
                ? 'bg-slate-100 text-slate-900'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            پروفایل
          </Link>

          <Link
            to={ROUTES.LOGIN}
            onClick={onClose}
            className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            ورود
          </Link>
        </nav>
      </aside>
    </div>
  );
}