import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useTheme } from '../../utils/useTheme';
import { clearAuthSession, getStoredUser } from '../../utils/auth';
import LogoutModal from '../common/LogoutModal';
import { useLanguage } from '../../context/LanguageContext';
import { formatUserName } from '../../utils/arabicNames';

import logoMascot from '../../assets/icons/logo-mascot-transparent.png';
import logoWordmark from '../../assets/icons/logo-wordmark.png';
import chevronRightIcon from '../../assets/icons/dashboard/chevron-right.svg';

export default function AdminHeader({ onOpenMobileMenu }) {
  const navigate = useNavigate();
  const { isDark, toggle: toggleTheme } = useTheme();
  const { lang, toggleLang, t } = useLanguage();
  const tr = t('admin').header;

  const [user] = useState(() => getStoredUser());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const dropdownRef = useRef(null);

  const formattedUser = formatUserName(user, lang);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const confirmLogout = () => {
    clearAuthSession();
    toast.info(tr.loggedOut);
    setShowLogoutModal(false);
    setIsDropdownOpen(false);
    navigate('/login', { replace: true });
  };

  return (
    <>
      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <LogoutModal
          onConfirm={confirmLogout}
          onCancel={() => setShowLogoutModal(false)}
          title={tr.logoutModalTitle}
          subtitle={tr.logoutModalSubtitle}
        />
      )}

      <header className="sticky top-0 z-30 border-b border-[var(--border-color)] bg-[var(--surface-bg)]">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={onOpenMobileMenu}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border-color)] text-[var(--secondary-text)] hover:bg-[var(--surface-soft)] hover:text-[var(--primary-text)] lg:hidden cursor-pointer"
              aria-label="Open navigation menu"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Logo */}
            <Link
              to="/admin"
              aria-label="Go to admin dashboard"
              className="flex shrink-0 items-center gap-2 rounded-lg transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c53938]"
            >
              <img
                src={logoMascot}
                alt="El-D7E7 Mascot"
                width="56"
                height="56"
                className="h-10 w-10 sm:h-13 sm:w-13 object-contain transition-transform hover:scale-105"
              />
              <img
                src={logoWordmark}
                alt="الدحيح El-D7E7"
                width="135"
                height="44"
                className="hidden h-9 w-auto object-contain md:block"
              />
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">

            {/* Language Toggle (EN | AR) */}
            <button
              type="button"
              onClick={toggleLang}
              aria-label={lang === 'en' ? 'Switch to Arabic' : 'التبديل للإنجليزية'}
              className="flex h-9 items-center gap-1.5 rounded-full border border-[var(--border-color)] bg-[var(--surface-soft)] px-3 text-xs font-semibold text-[var(--secondary-text)] transition hover:border-[#ef5350] hover:text-[#ef5350] cursor-pointer"
            >
              <span className={lang === 'en' ? 'text-[#c94545] font-bold' : 'text-[var(--muted-text)]'}>EN</span>
              <span className="text-[var(--border-color)]">|</span>
              <span className={lang === 'ar' ? 'text-[#c94545] font-bold' : 'text-[var(--muted-text)]'}>AR</span>
            </button>

            {/* View Store link */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--surface-soft)] px-4 py-2 text-xs font-semibold text-[var(--primary-text)] transition hover:border-[#c53938] hover:text-[#c53938] sm:flex cursor-pointer"
            >
              <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 9V7a2 2 0 0 1 .4-1.2L5.6 4.2A2 2 0 0 1 7.2 3.5h9.6a2 2 0 0 1 1.6.7l1.2 1.6A2 2 0 0 1 20 7v2M4 9h16M4 9v10a1 1 0 0 0 1 1h4v-6h6v6h4a1 1 0 0 0 1-1V9" />
              </svg>
              <span>{tr.viewStore}</span>
            </a>

            {/* Account Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen((p) => !p)}
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
                aria-label="Admin menu"
                className="flex items-center gap-2 rounded-full p-0.5 transition hover:ring-2 hover:ring-[#c53938]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c53938] cursor-pointer"
              >
                <span className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-[#c53938] text-white font-bold">
                  {formattedUser.initial || '👑'}
                </span>
                <div className="hidden text-start sm:block">
                  <p className="text-sm font-semibold leading-tight text-[var(--primary-text)]">
                    {formattedUser.fullName || tr.admin}
                  </p>
                  <p className="text-[11px] text-[var(--secondary-text)]">{tr.superAdmin}</p>
                </div>
                <img
                  src={chevronRightIcon}
                  alt=""
                  aria-hidden="true"
                  width="12"
                  height="12"
                  className={`hidden sm:block icon-invert transition-transform ${isDropdownOpen ? '-rotate-90' : 'rotate-90'}`}
                />
              </button>

              {isDropdownOpen && (
                <div
                  id="admin-account-menu"
                  role="menu"
                  aria-label="Admin menu"
                  className="absolute ltr:right-0 rtl:left-0 top-[calc(100%+10px)] z-[100] w-[min(280px,calc(100vw-32px))] overflow-hidden rounded-[14px] border border-[var(--border-color)] bg-[var(--page-bg)] shadow-[0_12px_35px_rgba(0,0,0,0.25)]"
                >
                  {/* Profile info row */}
                  <Link
                    to="/admin/settings"
                    role="menuitem"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-5 py-4 transition hover:bg-[var(--surface-soft)] text-start"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#c53938]/10 text-[#c53938] font-bold text-lg">
                      {formattedUser.initial || '👑'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[var(--primary-text)] m-0">
                        {formattedUser.fullName || tr.admin}
                      </p>
                      <p className="truncate text-xs text-[var(--secondary-text)] m-0">
                        {user?.email || 'admin@eld7e7.com'}
                      </p>
                    </div>
                    <span aria-hidden="true" className="text-lg text-[var(--secondary-text)] rtl:rotate-180">›</span>
                  </Link>

                  <div className="h-px bg-[var(--border-color)]" />

                  {/* Customer Dashboard Link */}
                  <Link
                    to="/account/dashboard"
                    role="menuitem"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-[var(--secondary-text)] transition hover:bg-[var(--surface-soft)] hover:text-[#c53938] text-start"
                  >
                    <span aria-hidden="true" className="flex h-5 w-5 items-center justify-center text-base">⌂</span>
                    <span>{lang === 'ar' ? 'لوحة حساب العميل' : 'Customer Dashboard'}</span>
                  </Link>

                  <div className="h-px bg-[var(--border-color)]" />

                  {/* Settings Link */}
                  <Link
                    to="/admin/settings"
                    role="menuitem"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-[var(--secondary-text)] transition hover:bg-[var(--surface-soft)] hover:text-[var(--primary-text)] text-start"
                  >
                    <span aria-hidden="true" className="flex h-5 w-5 items-center justify-center text-base">⚙</span>
                    <span>{tr.settings}</span>
                  </Link>

                  <div className="h-px bg-[var(--border-color)]" />

                  {/* Dark Mode Toggle */}
                  <button
                    type="button"
                    role="menuitem"
                    aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
                    aria-pressed={isDark}
                    onClick={toggleTheme}
                    className="flex w-full items-center gap-3 px-5 py-3.5 text-start text-sm font-medium text-[var(--secondary-text)] transition hover:bg-[var(--surface-soft)] cursor-pointer"
                  >
                    <span aria-hidden="true" className="flex h-5 w-5 items-center justify-center text-lg">
                      {isDark ? '☾' : '☀'}
                    </span>
                    <span className="flex-1">{isDark ? tr.darkMode : tr.lightMode}</span>
                    <span
                      aria-hidden="true"
                      className={`relative h-5 w-9 rounded-full transition-colors ${isDark ? 'bg-[#c94545]' : 'bg-[#d1d5dc]'}`}
                    >
                      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${isDark ? 'ltr:left-4.5 rtl:right-4.5' : 'ltr:left-0.5 rtl:right-0.5'}`} />
                    </span>
                  </button>

                  <div className="h-px bg-[var(--border-color)]" />

                  {/* Logout Button */}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => { setIsDropdownOpen(false); setShowLogoutModal(true); }}
                    className="flex w-full items-center gap-3 px-5 py-3.5 text-start text-sm font-medium text-[var(--secondary-text)] transition hover:bg-[var(--surface-soft)] hover:text-[#c53938] cursor-pointer"
                  >
                    <svg className="h-5 w-5 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>{tr.signOut}</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>
    </>
  );
}
