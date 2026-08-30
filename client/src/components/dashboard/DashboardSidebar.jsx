import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'sonner';
import { getStoredUser, clearAuthSession } from '../../utils/auth';
import LogoutModal from '../common/LogoutModal';
import { useLanguage } from '../../context/LanguageContext';

import dashboardIcon  from '../../assets/icons/dashboard/dashboard.svg';
import ordersIcon     from '../../assets/icons/dashboard/orders.svg';
import wishlistIcon   from '../../assets/icons/dashboard/wishlist.svg';
import addressIcon    from '../../assets/icons/dashboard/address.svg';
import paymentsIcon   from '../../assets/icons/dashboard/payments.svg';
import settingsIcon   from '../../assets/icons/dashboard/settings.svg';
import logoutIcon     from '../../assets/icons/dashboard/logout.svg';

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
          {!isCollapsed && <span className="truncate">{item.label}</span>}
        </>
      )}
    </NavLink>
  );
}

export default function DashboardSidebar({ isCollapsed, onToggleCollapse }) {
  const navigate = useNavigate();
  const user = getStoredUser();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { t } = useLanguage();
  const tr = t('sidebar');

  const mainNav = [
    { to: '/account/dashboard', label: tr.dashboard, icon: dashboardIcon },
    { to: '/account/orders',    label: tr.myOrders,  icon: ordersIcon },
    { to: '/account/wishlist',  label: tr.wishlist,  icon: wishlistIcon },
    { to: '/account/address',   label: tr.address,   icon: addressIcon },
    { to: '/account/payments',  label: tr.payments,  icon: paymentsIcon },
  ];

  const secondaryNav = [
    { to: '/account/settings', label: tr.settings, icon: settingsIcon },
  ];

  const handleLogout = () => {
    clearAuthSession();
    toast.info(tr.loggedOut);
    navigate('/login', { replace: true });
  };

  return (
    <aside
      className={`relative flex h-full flex-col rounded-2xl border border-[var(--border-color)] bg-[var(--surface-bg)] transition-all duration-300 ease-in-out ${
        isCollapsed ? 'py-10 px-2 items-center' : 'p-4 sm:p-5'
      }`}
    >
      <div className={`flex items-center w-full mb-3 ${isCollapsed ? 'justify-center' : 'justify-between px-1'}`}>
        {!isCollapsed && (
          <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--secondary-text)] opacity-70">
            {tr.accountMenu}
          </span>
        )}
        <button
          type="button"
          onClick={onToggleCollapse}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-color)] bg-[var(--surface-soft)] text-[var(--secondary-text)] transition-all hover:bg-[#c53938] hover:text-white hover:border-[#c53938] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c53938]"
          title={isCollapsed ? tr.expandSidebar : tr.collapseSidebar}
          aria-label={isCollapsed ? tr.expandSidebar : tr.collapseSidebar}
        >
          <svg
            className={`h-4 w-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Profile card */}
      <div
        className={`flex items-center transition-all duration-300 ${
          isCollapsed
            ? 'justify-center p-0 border-0 bg-transparent mb-2'
            : 'gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--surface-soft)] p-3.5 mb-1'
        }`}
      >
        <div className="relative shrink-0">
          <div
            className={`flex shrink-0 items-center justify-center rounded-full bg-[#c53938]/10 ring-2 ring-[var(--border-color)] font-bold text-[#c53938] uppercase transition-all ${
              isCollapsed ? 'h-10 w-10 text-base' : 'h-11 w-11 text-lg'
            }`}
          >
            {(user?.name || user?.firstName || 'U').charAt(0)}
          </div>
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[var(--surface-bg)] bg-emerald-500" />
        </div>

        {!isCollapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[var(--primary-text)]">
              {user?.name || (user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'User')}
            </p>
            <p className="truncate text-[11px] text-[var(--secondary-text)]">
              {user?.email || 'user@eld7e7.com'}
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav aria-label="Account navigation" className={`mt-3 flex flex-1 flex-col gap-1 w-full ${isCollapsed ? 'items-center' : ''}`}>
        {mainNav.map((item) => (
          <NavItem key={item.to} item={item} isCollapsed={isCollapsed} />
        ))}

        <div className={`my-2 border-t border-[var(--border-color)] ${isCollapsed ? 'w-8 mx-auto' : 'w-full'}`} />

        {secondaryNav.map((item) => (
          <NavItem key={item.to} item={item} isCollapsed={isCollapsed} />
        ))}
      </nav>

      {/* Logout */}
      <div className={`mt-auto border-t border-[var(--border-color)] pt-3 w-full ${isCollapsed ? 'flex justify-center' : ''}`}>
        <button
          type="button"
          title={isCollapsed ? tr.logout : undefined}
          onClick={() => setShowLogoutModal(true)}
          className={`group flex items-center transition-all hover:bg-[var(--surface-soft)] cursor-pointer ${
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
          {!isCollapsed && <span className="text-[#c53938]">{tr.logout}</span>}
        </button>
      </div>

      {showLogoutModal && (
        <LogoutModal
          onConfirm={() => { setShowLogoutModal(false); handleLogout(); }}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}
    </aside>
  );
}