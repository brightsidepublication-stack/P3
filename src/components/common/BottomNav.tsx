import { Heart, Home, Search, UserCircle } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

const items = [
  {
    to: ROUTES.home,
    label: 'خانه',
    icon: Home,
  },
  {
    to: ROUTES.search,
    label: 'جستجو',
    icon: Search,
  },
  {
    to: ROUTES.favorites,
    label: 'علاقه‌مندی‌ها',
    icon: Heart,
  },
  {
    to: ROUTES.profile,
    label: 'پروفایل',
    icon: UserCircle,
  },
] as const;

export function BottomNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white md:hidden"
      aria-label="ناوبری پایین"
    >
      <div className="mx-auto flex h-16 max-w-3xl items-stretch justify-around">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex min-w-16 flex-1 flex-col items-center justify-center gap-1 text-xs ${
                isActive
                  ? 'font-medium text-brand-600'
                  : 'text-slate-500 hover:text-slate-900'
              }`
            }
          >
            <Icon size={21} aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}