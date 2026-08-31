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
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(lang === 'ar' ? 'القاهرة، مصر' : 'Cairo, Egypt');
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const dropdownRef = useRef(null);
  const locationRef = useRef(null);

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
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsDropdownOpen(false);
      if (locationRef.current && !locationRef.current.contains(e.target)) setIsLocationOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const locations = lang === 'ar'
    ? ['القاهرة، مصر', 'الجيزة، مصر', 'الإسكندرية، مصر', 'المنصورة، مصر']
    : ['Cairo, Egypt', 'Giza, Egypt', 'Alexandria, Egypt', 'Mansoura, Egypt'];

  const handleLogout = () => {
    clearAuthSession();
    toast.info(tr.loggedOut);
    setIsDropdownOpen(false);
    navigate('/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border-color)] bg-[var(--surface-bg)]">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">

        {/* ── Left / Logo & Mobile Menu ── */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {onOpenMobileMenu && (
            <button
              type="button"
              onClick={onOpenMobileMenu}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--surface-soft)] text-[var(--secondary-text)] hover:bg-[var(--surface-bg)] hover:text-[var(--primary-text)] lg:hidden transition cursor-pointer"
              aria-label={lang === 'ar' ? 'فتح قائمة الحساب' : 'Open account navigation menu'}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

          <Link
            to="/"
            aria-label="Go to home page"
            className="flex shrink-0 items-center gap-2 rounded-lg transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c53938]"
          >
            <img
              src={logoMascot}
              alt="El-D7E7 Mascot"
              width="56"
              height="56"
              className="h-10 w-10 sm:h-12 sm:w-12 object-contain transition-transform hover:scale-105"
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
            className="flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-[var(--border-color)] bg-[var(--surface-soft)] px-3 text-xs font-semibold text-[var(--secondary-text)] transition hover:border-[#ef5350] hover:text-[#ef5350] cursor-pointer"
          >
            <span className={lang === 'en' ? 'text-[#c94545] font-bold' : 'text-[var(--muted-text)]'}>EN</span>
            <span className="text-[var(--border-color)]">|</span>
            <span className={lang === 'ar' ? 'text-[#c94545] font-bold' : 'text-[var(--muted-text)]'}>AR</span>
          </button>

          {/* Location */}
          <div className="relative hidden lg:block" ref={locationRef}>
            <button
              type="button"
              onClick={() => setIsLocationOpen((p) => !p)}
              aria-expanded={isLocationOpen}
              aria-haspopup="listbox"
              className="flex items-center gap-1.5 rounded-full border border-[var(--border-color)] bg-[var(--surface-soft)] px-3.5 py-2 text-xs font-medium text-[var(--secondary-text)] transition hover:border-[#c53938] hover:text-[#c53938] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c53938] cursor-pointer"
            >
              <svg className="h-3.5 w-3.5 shrink-0 text-[#c53938]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="max-w-[110px] truncate">{selectedLocation}</span>
              <img src={chevronRightIcon} alt="" aria-hidden="true" className={`icon-invert h-3 w-3 transition-transform ${isLocationOpen ? '-rotate-90' : 'rotate-90'}`} />
            </button>

            {isLocationOpen && (
              <ul role="listbox" className="absolute ltr:right-0 rtl:left-0 mt-2 w-44 rounded-2xl border border-[var(--border-color)] bg-[var(--surface-bg)] py-1.5 shadow-lg z-50">
                {locations.map((loc) => (
                  <li key={loc} role="option" aria-selected={selectedLocation === loc}>
                    <button
                      type="button"
                      onClick={() => { setSelectedLocation(loc); setIsLocationOpen(false); }}
                      className={`w-full px-4 py-2 text-start text-xs transition hover:bg-[var(--surface-soft)] cursor-pointer ${selectedLocation === loc ? 'font-semibold text-[#c53938]' : 'text-[var(--primary-text)]'
                        }`}
                    >
                      {loc}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Cart */}
          <Link
            to="/cart"
            aria-label={`Shopping cart with ${cartCount} items`}
            className="relative flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--surface-soft)] transition hover:border-[#c53938] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c53938] cursor-pointer"
          >
            <img src={cartIcon} alt="" aria-hidden="true" width="18" height="18" className="icon-invert" />
            {cartCount > 0 && (
              <span className="absolute ltr:-right-1 rtl:-left-1 -top-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-[#c53938] text-[9px] font-bold leading-none text-white shadow-xs">
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
              <span className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-[#c53938] text-white font-bold text-sm sm:text-base uppercase shadow-sm">
                {formattedUser.initial || '👤'}
              </span>
              <div className="hidden text-start sm:block">
                <p className="text-sm font-semibold leading-tight text-[var(--primary-text)]">
                  {formattedUser.fullName}
                </p>
                <p className="text-[11px] text-[var(--secondary-text)]">{user?.role === 'admin' ? accTr.superAdmin : accTr.customer}</p>
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
                className="absolute ltr:right-0 rtl:left-0 top-[calc(100%+10px)] z-[100] w-[min(360px,calc(100vw-32px))] overflow-hidden rounded-[14px] border border-[var(--border-color)] bg-[var(--page-bg)] shadow-[0_12px_35px_rgba(0,0,0,0.25)]"
              >
                {/* Profile row */}
                <Link
                  to="/account/dashboard"
                  role="menuitem"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-3 px-5 py-4 transition hover:bg-[var(--surface-soft)]"
                >
                  <div className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full bg-[#c53938]/10 text-2xl font-bold text-[#c53938] uppercase">
                    {formattedUser.initial}
                  </div>
                  <div className="min-w-0 flex-1 text-start">
                    <p className="m-0 truncate text-[17px] font-medium leading-6 text-[var(--primary-text)]">
                      {formattedUser.fullName}
                    </p>
                    <p className="m-0 truncate text-[14px] leading-6 text-[var(--secondary-text)]">
                      {user?.email || 'user@eld7e7.com'}
                    </p>
                  </div>
                  <span aria-hidden="true" className="text-xl text-[var(--secondary-text)] rtl:rotate-180">›</span>
                </Link>

                <div className="h-px bg-[var(--border-color)]" />

                {/* Nav links */}
                <div className="py-2">
                  {[
                    ...(user?.role === 'admin' ? [{ label: lang === 'ar' ? 'لوحة الإدارة' : 'Admin Panel', to: '/admin', icon: '🛡' }] : []),
                    { label: tr.dashboard, to: '/account/dashboard', icon: '⌂' },
                    { label: tr.myOrders,  to: '/account/orders',    icon: '▣' },
                    { label: tr.wishlist,  to: '/account/wishlist',  icon: '♡' },
                    { label: tr.settings,  to: '/account/settings',  icon: '⚙' },
                  ].map(({ label, to, icon }) => (
                    <Link
                      key={to}
                      to={to}
                      role="menuitem"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-5 py-3 text-[16px] font-medium text-[var(--secondary-text)] transition hover:bg-[var(--surface-soft)] hover:text-[#ef5350] text-start"
                    >
                      <span aria-hidden="true" className="flex h-6 w-6 items-center justify-center text-xl">{icon}</span>
                      <span>{label}</span>
                    </Link>
                  ))}
                </div>

                <div className="h-px bg-[var(--border-color)]" />

                {/* Dark mode toggle */}
                <button
                  type="button"
                  role="menuitem"
                  aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
                  aria-pressed={isDark}
                  onClick={toggleTheme}
                  className="flex w-full items-center gap-3 px-5 py-4 text-start text-[16px] font-medium text-[var(--secondary-text)] transition hover:bg-[var(--surface-soft)] cursor-pointer"
                >
                  <span aria-hidden="true" className="flex h-6 w-6 items-center justify-center text-xl">
                    {isDark ? '☾' : '☀'}
                  </span>
                  <span className="flex-1">{isDark ? accTr.darkMode : accTr.lightMode}</span>
                  <span
                    aria-hidden="true"
                    className={`relative h-6 w-10 rounded-full transition-colors ${isDark ? 'bg-[#c94545]' : 'bg-[#d1d5dc]'}`}
                  >
                    <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all ${isDark ? 'ltr:left-5 rtl:right-5' : 'ltr:left-1 rtl:right-1'}`} />
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
                  className="flex w-full items-center gap-3 px-5 py-4 text-start text-[16px] font-medium text-[var(--secondary-text)] transition hover:bg-[var(--surface-soft)] hover:text-[#ef5350] cursor-pointer"
                >
                  <span aria-hidden="true" className="flex h-6 w-6 items-center justify-center text-xl rtl:rotate-180">⇥</span>
                  <span>{tr.logout}</span>
                </button>
              </div>
            )}
          </div>

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
    </header>
  );
}