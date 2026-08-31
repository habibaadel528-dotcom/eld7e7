import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useTheme } from '../../utils/useTheme';
import { useCart } from '../../context/CartContext';
import { getStoredUser, clearAuthSession } from '../../utils/auth';
import { authApi } from '../../services/api';
import LogoutModal from '../common/LogoutModal';
import { useLanguage } from '../../context/LanguageContext';
import { formatUserName } from '../../utils/arabicNames';

import logoMascot from '../../assets/icons/logo-mascot-transparent.png';
import logoWordmark from '../../assets/icons/logo-wordmark.png';
import cartIcon from '../../assets/icons/dashboard/cart.svg';
import chevronRightIcon from '../../assets/icons/dashboard/chevron-right.svg';

export default function DashboardHeader({ onOpenMobileMenu }) {
  const navigate = useNavigate();
  const { isDark, toggle: toggleTheme } = useTheme();
  const { cartCount } = useCart();
  const { lang, toggleLang, t } = useLanguage();
  const tr = t('sidebar');
  const accTr = t('accountMenu');

  const [user, setUser] = useState(() => getStoredUser());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const dropdownRef = useRef(null);
  const formattedUser = formatUserName(user, lang);

  useEffect(() => {
    authApi.me()
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    clearAuthSession();
    toast.info(tr.loggedOut);
    setShowLogoutModal(false);
    setIsDropdownOpen(false);
    navigate('/login', { replace: true });
  };

  return (
    <>
      {showLogoutModal && (
        <LogoutModal
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutModal(false)}
          title={lang === 'ar' ? 'تسجيل الخروج' : 'Log Out'}
          subtitle={lang === 'ar' ? 'هل أنت متأكد أنك تريد تسجيل الخروج؟' : 'Are you sure you want to log out?'}
        />
      )}

      <header className="sticky top-0 z-30 border-b border-[var(--border-color)] bg-[var(--surface-bg)] w-full max-w-full overflow-hidden sm:overflow-visible">
        <div className="mx-auto flex h-[72px] max-w-[1440px] w-full items-center justify-between gap-2.5 sm:gap-4 px-3 sm:px-6 lg:px-8">

          {/* ── Left: Mobile Hamburger & Brand Logo ── */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={onOpenMobileMenu}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border-color)] text-[var(--secondary-text)] hover:bg-[var(--surface-soft)] hover:text-[var(--primary-text)] lg:hidden cursor-pointer"
              aria-label={lang === 'ar' ? 'فتح القائمة الجانبية' : 'Open navigation menu'}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Logo */}
            <Link
              to="/"
              aria-label="El-D7E7 Home"
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

          {/* ── Right Actions ── */}
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

            {/* Cart Link (Desktop / Tablet) */}
            <Link
              to="/cart"
              aria-label={`Shopping cart with ${cartCount} items`}
              className="hidden sm:flex relative h-9 items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--surface-soft)] px-3.5 text-xs font-semibold text-[var(--primary-text)] transition hover:border-[#c53938] hover:text-[#c53938] cursor-pointer"
            >
              <img src={cartIcon} alt="" aria-hidden="true" width="16" height="16" className="icon-invert" />
              <span>{lang === 'ar' ? 'السلة' : 'Cart'}</span>
              {cartCount > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[#c53938] px-1 text-[9px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Account Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen((p) => !p)}
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
                aria-label="Account menu"
                className="flex items-center gap-2 rounded-full p-0.5 transition hover:ring-2 hover:ring-[#c53938]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c53938] cursor-pointer"
              >
                <span className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-[#c53938] text-white font-bold text-sm sm:text-base">
                  {formattedUser.initial || '👤'}
                </span>
                <div className="hidden text-start sm:block">
                  <p className="text-sm font-semibold leading-tight text-[var(--primary-text)]">
                    {formattedUser.fullName}
                  </p>
                  <p className="text-[11px] text-[var(--secondary-text)]">
                    {user?.role === 'admin' ? accTr.superAdmin : accTr.customer}
                  </p>
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
                  id="dashboard-account-menu"
                  role="menu"
                  aria-label="Account menu"
                  className="absolute ltr:right-0 rtl:left-0 top-[calc(100%+10px)] z-[100] w-[min(280px,calc(100vw-32px))] overflow-hidden rounded-[14px] border border-[var(--border-color)] bg-[var(--page-bg)] shadow-[0_12px_35px_rgba(0,0,0,0.25)]"
                >
                  {/* Profile info row */}
                  <Link
                    to="/account/settings"
                    role="menuitem"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-5 py-4 transition hover:bg-[var(--surface-soft)] text-start"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#c53938]/10 text-[#c53938] font-bold text-lg">
                      {formattedUser.initial || '👤'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[var(--primary-text)] m-0">
                        {formattedUser.fullName}
                      </p>
                      <p className="truncate text-xs text-[var(--secondary-text)] m-0">
                        {user?.email || 'user@eld7e7.com'}
                      </p>
                    </div>
                    <span aria-hidden="true" className="text-lg text-[var(--secondary-text)] rtl:rotate-180">›</span>
                  </Link>

                  <div className="h-px bg-[var(--border-color)]" />

                  {/* Nav Links */}
                  <div className="py-1">
                    {[
                      ...(user?.role === 'admin' ? [{ label: lang === 'ar' ? 'لوحة الإدارة' : 'Admin Panel', to: '/admin', icon: '🛡' }] : []),
                      { label: tr.dashboard, to: '/account/dashboard', icon: '⌂' },
                      { label: tr.myOrders,  to: '/account/orders',    icon: '▣' },
                      { label: tr.wishlist,  to: '/account/wishlist',  icon: '♡' },
                      { label: lang === 'ar' ? 'عربة التسوق' : 'Shopping Cart', to: '/cart', icon: '🛒', badge: cartCount > 0 ? cartCount : null },
                      { label: tr.settings,  to: '/account/settings',  icon: '⚙' },
                    ].map(({ label, to, icon, badge }) => (
                      <Link
                        key={to}
                        to={to}
                        role="menuitem"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center justify-between gap-3 px-5 py-2.5 text-sm font-medium text-[var(--secondary-text)] transition hover:bg-[var(--surface-soft)] hover:text-[#c53938] text-start"
                      >
                        <div className="flex items-center gap-3">
                          <span aria-hidden="true" className="flex h-5 w-5 items-center justify-center text-base">{icon}</span>
                          <span>{label}</span>
                        </div>
                        {badge && (
                          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#c53938] px-1.5 text-[10px] font-bold text-white">
                            {badge}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>

                  <div className="h-px bg-[var(--border-color)]" />

                  {/* Dark Mode Toggle */}
                  <button
                    type="button"
                    role="menuitem"
                    aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
                    aria-pressed={isDark}
                    onClick={toggleTheme}
                    className="flex w-full items-center gap-3 px-5 py-3 text-start text-sm font-medium text-[var(--secondary-text)] transition hover:bg-[var(--surface-soft)] cursor-pointer"
                  >
                    <span aria-hidden="true" className="flex h-5 w-5 items-center justify-center text-base">
                      {isDark ? '☾' : '☀'}
                    </span>
                    <span className="flex-1">{isDark ? accTr.darkMode : accTr.lightMode}</span>
                    <span
                      aria-hidden="true"
                      className={`relative h-5 w-9 rounded-full transition-colors ${isDark ? 'bg-[#c94545]' : 'bg-[#d1d5dc]'}`}
                    >
                      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${isDark ? 'ltr:left-4.5 rtl:right-4.5' : 'ltr:left-0.5 rtl:right-0.5'}`} />
                    </span>
                  </button>

                  <div className="h-px bg-[var(--border-color)]" />

                  {/* Logout */}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setShowLogoutModal(true);
                    }}
                    className="flex w-full items-center gap-3 px-5 py-3 text-start text-sm font-medium text-[var(--secondary-text)] transition hover:bg-[var(--surface-soft)] hover:text-[#c53938] cursor-pointer"
                  >
                    <svg className="h-5 w-5 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>{tr.logout}</span>
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