import { NavLink } from 'react-router-dom';
import { getStoredUser } from '../../utils/auth';

import dashboardIcon    from '../../assets/icons/dashboard/dashboard.svg';
import ordersIcon       from '../../assets/icons/dashboard/orders.svg';
import wishlistIcon     from '../../assets/icons/dashboard/wishlist.svg';
import addressIcon      from '../../assets/icons/dashboard/address.svg';
import paymentsIcon     from '../../assets/icons/dashboard/payments.svg';
import notificationsIcon from '../../assets/icons/dashboard/notifications.svg';
import settingsIcon     from '../../assets/icons/dashboard/settings.svg';
import supportIcon      from '../../assets/icons/dashboard/support.svg';
import logoutIcon       from '../../assets/icons/dashboard/logout.svg';

const mainNav = [
  { to: '/account/dashboard',     label: 'Dashboard',     icon: dashboardIcon },
  { to: '/account/orders',        label: 'My Orders',     icon: ordersIcon },
  { to: '/account/wishlist',      label: 'Wishlist',      icon: wishlistIcon },
  { to: '/account/address',       label: 'Address',       icon: addressIcon },
  { to: '/account/payments',      label: 'Payments',      icon: paymentsIcon },
];

const secondaryNav = [
  { to: '/account/notifications', label: 'Notifications', icon: notificationsIcon },
  { to: '/account/settings',      label: 'Settings',      icon: settingsIcon },
  { to: '/account/support',       label: 'Support',       icon: supportIcon },
];

function NavItem({ item, isCollapsed }) {
  return (
    <NavLink
      to={item.to}
      title={isCollapsed ? item.label : undefined}
      className={({ isActive }) =>
        `group flex items-center transition-all duration-150 ${
          isCollapsed
            ? 'h-10 w-10 justify-center p-0 mx-auto rounded-xl'
            : 'gap-3 rounded-xl px-3 py-2.5 text-sm font-medium'
        } ${
          isActive
            ? 'bg-[#c53938] text-white shadow-sm shadow-[#c53938]/30'
            : 'text-[var(--secondary-text)] hover:bg-[var(--surface-soft)] hover:text-[var(--primary-text)]'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <img
            src={item.icon}
            alt=""
            aria-hidden="true"
            width="18"
            height="18"
            className={`h-[18px] w-[18px] shrink-0 transition-transform duration-150 group-hover:scale-110 ${
              isActive ? 'brightness-0 invert' : 'icon-invert'
            }`}
          />
          {!isCollapsed && (
            <span className="truncate">{item.label}</span>
          )}
        </>
      )}
    </NavLink>
  );
}

export default function DashboardSidebar({ isCollapsed, onToggleCollapse }) {
  const currentUser = getStoredUser();
  const displayName = currentUser?.name || 'مستخدم';
  const displayEmail = currentUser?.email || '';
  const initialLetter = displayName.trim().charAt(0).toUpperCase() || '?';
  return (
<aside
  className={`relative flex h-full flex-col rounded-2xl border border-[var(--border-color)] bg-[var(--surface-bg)] transition-all duration-300 ease-in-out ${
    isCollapsed ? 'py-10 px-2 items-center' : 'p-4 sm:p-5'
  }`}
>
      {/* ── Top Header / Sleek Toggle Button ── */}
      <div className={`flex items-center w-full mb-3 ${isCollapsed ? 'justify-center' : 'justify-between px-1'}`}>
        {!isCollapsed && (
          <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--secondary-text)] opacity-70">
            Account Menu
          </span>
        )}
        <button
          type="button"
          onClick={onToggleCollapse}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-color)] bg-[var(--surface-soft)] text-[var(--secondary-text)] transition-all hover:bg-[#c53938] hover:text-white hover:border-[#c53938] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c53938]"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          <svg
            className={`h-4 w-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* ── Profile card ── */}
      <div
        className={`flex items-center transition-all duration-300 ${
          isCollapsed
            ? 'justify-center p-0 border-0 bg-transparent mb-2'
            : 'gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--surface-soft)] p-3.5 mb-1'
        }`}
      >
        <div className="relative shrink-0">
          <div
            aria-label={displayName}
            className={`flex items-center justify-center rounded-full bg-[#d1d5dc] font-semibold text-[#a72626] ring-2 ring-[var(--border-color)] transition-all ${
              isCollapsed ? 'h-10 w-10 text-base' : 'h-11 w-11 text-lg'
            }`}
          >
            {initialLetter}
          </div>
          {/* Online status indicator */}
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[var(--surface-bg)] bg-emerald-500" />
        </div>

        {!isCollapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[var(--primary-text)]">
              {displayName}
            </p>
            <p className="truncate text-[11px] text-[var(--secondary-text)]">
              {displayEmail}
            </p>
          </div>
        )}
      </div>

      {/* ── Navigation ── */}
      <nav aria-label="Account navigation" className={`mt-3 flex flex-1 flex-col gap-1 w-full ${isCollapsed ? 'items-center' : ''}`}>
        {mainNav.map((item) => (
          <NavItem key={item.to} item={item} isCollapsed={isCollapsed} />
        ))}

        <div className={`my-2 border-t border-[var(--border-color)] ${isCollapsed ? 'w-8 mx-auto' : 'w-full'}`} />

        {secondaryNav.map((item) => (
          <NavItem key={item.to} item={item} isCollapsed={isCollapsed} />
        ))}
      </nav>

      {/* ── Logout ── */}
      <div className={`mt-auto border-t border-[var(--border-color)] pt-3 w-full ${isCollapsed ? 'flex justify-center' : ''}`}>
        <button
          type="button"
          title={isCollapsed ? 'Logout' : undefined}
          className={`group flex items-center transition-all hover:bg-[var(--surface-soft)] ${
            isCollapsed
              ? 'h-10 w-10 justify-center p-0 mx-auto rounded-xl'
              : 'w-full gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#c53938]'
          }`}
        >
          <img
            src={logoutIcon}
            alt=""
            aria-hidden="true"
            width="18"
            height="18"
            className="h-[18px] w-[18px] shrink-0 transition-transform duration-150 group-hover:-translate-x-0.5"
            style={{ filter: 'invert(25%) sepia(90%) saturate(700%) hue-rotate(330deg) brightness(95%)' }}
          />
          {!isCollapsed && <span className="text-[#c53938]">Logout</span>}
        </button>
      </div>
    </aside>
  );
}