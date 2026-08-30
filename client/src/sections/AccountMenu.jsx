import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getStoredUser, clearAuthSession } from '../utils/auth';
import LogoutModal from '../components/common/LogoutModal';
import { useLanguage } from '../context/LanguageContext';
import { formatUserName } from '../utils/arabicNames';

function getInitialTheme() {
  return document.documentElement.dataset.theme || 'light';
}

export default function AccountMenu({ onClose }) {
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const tr = t('accountMenu');

  const [theme, setTheme] = useState(getInitialTheme);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const user = getStoredUser();

  const formatted = formatUserName(user, lang);
  const displayName = user ? formatted.fullName : null;
  const displayEmail = user?.email || null;
  const isAdmin = user?.role === 'admin';
  const isLoggedIn = Boolean(user);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const isDarkMode = theme === 'dark';

  const toggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme === 'dark' ? 'light' : 'dark',
    );
  };

  const handleLogout = () => {
    clearAuthSession();
    onClose();
    navigate('/login', { replace: true });
  };

  // Menu items differ based on auth state and role
  const menuItems = isLoggedIn
    ? [
        isAdmin
          ? { label: tr.adminPanel, to: '/admin/dashboard', icon: '🛡' }
          : { label: tr.dashboard, to: '/account/dashboard', icon: '⌂' },
        ...(!isAdmin ? [
          { label: tr.myOrders,        to: '/account/orders',    icon: '▣' },
          { label: tr.accountSettings, to: '/account/settings',  icon: '⚙' },
        ] : []),
      ]
    : [
        { label: tr.login,   to: '/login',  icon: '↪' },
        { label: tr.signUp,  to: '/signup', icon: '♙' },
      ];

  return (
    <div
      id="account-menu"
      role="menu"
      aria-label="Account menu"
      className="absolute ltr:right-0 rtl:left-0 top-[52px] z-[100] w-[min(380px,calc(100vw-32px))] overflow-hidden rounded-[14px] border border-[var(--border-color)] bg-[var(--page-bg)] shadow-[0_12px_35px_rgba(0,0,0,0.35)]"
    >
      {/* ── Profile row ── */}
      <Link
        to={isAdmin ? '/admin/dashboard' : '/account/dashboard'}
        role="menuitem"
        onClick={onClose}
        className="flex items-center gap-3 px-5 py-4 transition hover:bg-[var(--surface-soft)]"
      >
        <div className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full bg-[#c53938]/10 text-2xl text-[#c53938] font-bold">
          {displayName ? formatted.initial : isAdmin ? '👑' : '●'}
        </div>

        <div className="min-w-0 flex-1 text-start">
          <p className="m-0 truncate text-[17px] font-medium leading-6 text-[var(--primary-text)]">
            {displayName || (isLoggedIn ? tr.myAccount : tr.guest)}
          </p>
          <p className="m-0 truncate text-[13px] leading-6 text-[var(--secondary-text)]">
            {displayEmail
              ? displayEmail
              : isLoggedIn
              ? (isAdmin ? tr.superAdmin : tr.customer)
              : tr.notLoggedIn}
          </p>
          {isAdmin && (
            <span className="mt-0.5 inline-block rounded-full bg-[#c53938] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
              Admin
            </span>
          )}
        </div>

        <span aria-hidden="true" className="text-xl text-[var(--secondary-text)] rtl:rotate-180">›</span>
      </Link>

      <div className="h-px bg-[var(--border-color)]" />

      {/* ── Nav links ── */}
      <div className="py-2">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            role="menuitem"
            onClick={onClose}
            className="flex items-center gap-3 px-5 py-3 text-[17px] font-medium text-[var(--secondary-text)] transition hover:bg-[var(--surface-soft)] hover:text-[#ef5350] text-start"
          >
            <span aria-hidden="true" className="flex h-6 w-6 items-center justify-center text-xl">
              {item.icon}
            </span>
            <span>{item.label}</span>
          </Link>
        ))}

        <a
          href="https://wa.me/201005535668"
          role="menuitem"
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          className="flex items-center gap-3 px-5 py-3 text-[17px] font-medium text-[var(--secondary-text)] transition hover:bg-[var(--surface-soft)] hover:text-[#ef5350] text-start"
        >
          <span aria-hidden="true" className="flex h-6 w-6 items-center justify-center text-xl">◉</span>
          <span>{tr.contact}</span>
        </a>
      </div>

      <div className="h-px bg-[var(--border-color)]" />

      {/* ── Theme toggle ── */}
      <button
        type="button"
        role="menuitem"
        aria-label={isDarkMode ? tr.switchToLight : tr.switchToDark}
        aria-pressed={isDarkMode}
        onClick={toggleTheme}
        className="flex w-full items-center gap-3 px-5 py-4 text-start text-[17px] font-medium text-[var(--secondary-text)] transition hover:bg-[var(--surface-soft)]"
      >
        <span aria-hidden="true" className="flex h-6 w-6 items-center justify-center text-xl">
          {isDarkMode ? '☾' : '☀'}
        </span>
        <span className="flex-1">{isDarkMode ? tr.darkMode : tr.lightMode}</span>
        <span
          aria-hidden="true"
          className={`relative h-6 w-10 rounded-full transition-colors ${isDarkMode ? 'bg-[#c94545]' : 'bg-[#d1d5dc]'}`}
        >
          <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all ${isDarkMode ? 'ltr:left-5 rtl:right-5' : 'ltr:left-1 rtl:right-1'}`} />
        </span>
      </button>

      {/* ── Logout (only if logged in) ── */}
      {isLoggedIn && (
        <>
          <div className="h-px bg-[var(--border-color)]" />
          <button
            type="button"
            role="menuitem"
            onClick={() => setShowLogoutModal(true)}
            className="flex w-full items-center gap-3 px-5 py-4 text-start text-[17px] font-medium text-[var(--secondary-text)] transition hover:bg-[var(--surface-soft)] hover:text-[#ef5350] cursor-pointer"
          >
            <span aria-hidden="true" className="flex h-6 w-6 items-center justify-center text-xl rtl:rotate-180">⇥</span>
            <span>{tr.logout}</span>
          </button>
        </>
      )}

      {showLogoutModal && (
        <LogoutModal
          onConfirm={() => {
            setShowLogoutModal(false);
            handleLogout();
          }}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}
    </div>
  );
}