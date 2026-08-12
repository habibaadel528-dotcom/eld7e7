import { NavLink } from 'react-router-dom';

import iconChevronDown from '../assets/icons/icon-chevron-down.svg';

const navItems = [
  {
    label: 'Home',
    to: '/',
  },
  {
    label: 'Cultural Books Clearance',
    to: '/cultural-books-clearance',
  },
  {
    label: 'Stationery',
    to: '/stationery',
    hasDropdown: true,
  },
  {
    label: 'External School Books',
    to: '/external-school-books',
    hasDropdown: true,
  },
  {
    label: 'Handcraft Supplies',
    to: '/handcraft-supplies',
    hasDropdown: true,
  },
];

export default function Navigation() {
  return (
    <nav
      aria-label="Main navigation"
      className="border-b border-[var(--soft-border-color)] bg-[var(--page-bg)]"
    >
      <div className="mx-auto w-full max-w-[1280px] overflow-x-auto px-5 sm:px-8 lg:px-0">
        <ul className="m-0 flex min-w-max list-none items-center gap-7 py-4 lg:gap-8">
          {navItems.map((item) => (
            <li key={item.label} className="flex items-center gap-1">
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `whitespace-nowrap text-sm leading-5 transition ${
                    isActive
                      ? 'font-bold text-[#c53938]'
                      : 'text-[var(--secondary-text)] hover:text-[#c53938]'
                  }`
                }
              >
                {item.label}
              </NavLink>

              {item.hasDropdown && (
                <img
                  src={iconChevronDown}
                  alt=""
                  className="h-4 w-4 object-contain opacity-80"
                />
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}