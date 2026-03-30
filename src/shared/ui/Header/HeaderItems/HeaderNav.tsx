import { NavLink } from 'react-router-dom';
import { type NavItem } from '@shared/types/nav';

type HeaderNavProps = {
  navItems: readonly NavItem[];
};

export const HeaderNav = ({ navItems }: HeaderNavProps) => {
  return (
    <nav className="flex items-center gap-9 text-lg font-semibold tracking-tight">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `header-nav-link ${isActive ? 'text-primary' : 'text-text-secondary'} hover:text-primary hover:opacity-85`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
};
