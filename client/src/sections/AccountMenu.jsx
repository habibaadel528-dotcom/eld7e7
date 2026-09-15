import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getStoredUser, clearAuthSession } from '../utils/auth';
import LogoutModal from '../components/common/LogoutModal';
import { useLanguage } from '../context/LanguageContext';
import { formatUserName } from '../utils/arabicNames';

import { SOCIAL_LINKS } from '../data/socialLinks';

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
        ...(isAdmin ? [{ label: tr.adminPanel, to: '/admin', icon: '🛡' }] : []),
        { label: tr.dashboard, to: '/account/dashboard', icon: '⌂' },
        { label: tr.myOrders, to: '/account/orders', icon: '▣' },
        { label: tr.accountSettings, to: '/account/settings', icon: '⚙' },
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
        to={isAdmin ? '/admin' : '/account/dashboard'}
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
          href={SOCIAL_LINKS.whatsapp.url}
          role="menuitem"
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          className="group flex items-center justify-between gap-3 px-5 py-3 text-[17px] font-medium text-[var(--secondary-text)] transition hover:bg-[var(--surface-soft)] hover:text-[#25D366] text-start"
        >
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="flex h-6 w-6 items-center justify-center text-[#25D366] transition-transform duration-200 group-hover:scale-115">
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.41a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.11-.23-.17-.48-.29z" />
              </svg>
            </span>
            <span>{tr.contact}</span>
          </div>
          <span className="text-[11px] font-semibold text-[var(--muted-text)] group-hover:text-[#25D366] transition-colors" dir="ltr">
            {lang === 'ar' ? SOCIAL_LINKS.whatsapp.phoneAr : SOCIAL_LINKS.whatsapp.phone}
          </span>
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

      {/* ── Social channels ── */}
      <div className="h-px bg-[var(--border-color)]" />
      <div className="flex items-center justify-between px-5 py-3 bg-[var(--surface-soft)]/40">
        <span className="text-xs font-semibold text-[var(--muted-text)]">
          {lang === 'ar' ? 'تابعنا على' : 'Follow us'}
        </span>
        <div className="flex items-center gap-1.5">
          {/* Facebook */}
          <a
            href={SOCIAL_LINKS.facebook.url}
            target="_blank"
            rel="noopener noreferrer"
            title="Facebook"
            aria-label="Facebook"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--border-color)] bg-[var(--surface-bg)] text-[var(--secondary-text)] transition-all hover:bg-[#1877F2] hover:border-[#1877F2] hover:text-white"
          >
            <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>

          {/* Instagram */}
          <a
            href={SOCIAL_LINKS.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            title="Instagram"
            aria-label="Instagram"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--border-color)] bg-[var(--surface-bg)] text-[var(--secondary-text)] transition-all hover:bg-[#E4405F] hover:border-[#E4405F] hover:text-white"
          >
            <svg className="h-3.5 w-3.5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <circle cx="12" cy="12" r="4.5"/>
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
            </svg>
          </a>

          {/* TikTok */}
          <a
            href={SOCIAL_LINKS.tiktok.url}
            target="_blank"
            rel="noopener noreferrer"
            title="TikTok"
            aria-label="TikTok"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--border-color)] bg-[var(--surface-bg)] text-[var(--secondary-text)] transition-all hover:bg-black hover:border-black hover:text-white dark:hover:border-white"
          >
            <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
            </svg>
          </a>

          {/* WhatsApp */}
          <a
            href={SOCIAL_LINKS.whatsapp.url}
            target="_blank"
            rel="noopener noreferrer"
            title="WhatsApp"
            aria-label="WhatsApp"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--border-color)] bg-[var(--surface-bg)] text-[var(--secondary-text)] transition-all hover:bg-[#25D366] hover:border-[#25D366] hover:text-white"
          >
            <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.41a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.11-.23-.17-.48-.29z"/>
            </svg>
          </a>
        </div>
      </div>

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