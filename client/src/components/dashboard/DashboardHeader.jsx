import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useTheme } from '../../utils/useTheme';
import { useCart } from '../../context/CartContext';
import { getStoredUser, clearAuthSession } from '../../utils/auth';
import { authApi } from '../../services/api';
import LogoutModal from '../common/LogoutModal';


import logoMascot from '../../assets/icons/logo-mascot-transparent.png';
import logoWordmark from '../../assets/icons/logo-wordmark.png';
import searchIcon from '../../assets/icons/dashboard/search.svg';
import cartIcon from '../../assets/icons/dashboard/cart.svg';
import bellIcon from '../../assets/icons/dashboard/bell.svg';
import chevronRightIcon from '../../assets/icons/dashboard/chevron-right.svg';

export default function DashboardHeader() {
  const navigate = useNavigate();
  const { isDark, toggle: toggleTheme } = useTheme();
  const { cartCount } = useCart();

  const [user, setUser] = useState(() => getStoredUser());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Cairo, Egypt');
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const dropdownRef = useRef(null);
  const locationRef = useRef(null);

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

  const locations = ['Cairo, Egypt', 'Giza, Egypt', 'Alexandria, Egypt', 'Mansoura, Egypt'];

  const handleLogout = () => {
    clearAuthSession();
    toast.info('You have been logged out.');
    setIsDropdownOpen(false);
    navigate('/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border-color)] bg-[var(--surface-bg)]">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

        {/* ── Logo ── */}
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

        {/* ── Search ── */}
        <form onSubmit={(e) => e.preventDefault()} role="search" className="relative flex-1 max-w-[500px] min-w-0">
          <label htmlFor="dash-search" className="sr-only">Search products</label>
          <img
            src={searchIcon}
            alt=""
            aria-hidden="true"
            width="16"
            height="16"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 icon-invert opacity-50"
          />
          <input
            id="dash-search"
            type="search"
            placeholder="Search…"
            className="h-9 sm:h-11 w-full rounded-full border border-[var(--border-color)] bg-[var(--surface-soft)] pl-9 sm:pl-10 pr-3 sm:pr-4 text-xs sm:text-sm text-[var(--primary-text)] placeholder-[var(--secondary-text)] transition focus:border-[#c53938] focus:outline-none focus:ring-2 focus:ring-[#c53938]/20"
          />
        </form>

        {/* ── Right Actions ── */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">

          {/* Location */}
          <div className="relative hidden lg:block" ref={locationRef}>
            <button
              type="button"
              onClick={() => setIsLocationOpen((p) => !p)}
              aria-expanded={isLocationOpen}
              aria-haspopup="listbox"
              className="flex items-center gap-1.5 rounded-full border border-[var(--border-color)] bg-[var(--surface-soft)] px-3.5 py-2 text-xs font-medium text-[var(--secondary-text)] transition hover:border-[#c53938] hover:text-[#c53938] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c53938]"
            >
              <svg className="h-3.5 w-3.5 shrink-0 text-[#c53938]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="max-w-[90px] truncate">{selectedLocation}</span>
              <img src={chevronRightIcon} alt="" aria-hidden="true" className={`icon-invert h-3 w-3 transition-transform ${isLocationOpen ? '-rotate-90' : 'rotate-90'}`} />
            </button>

            {isLocationOpen && (
              <ul role="listbox" className="absolute right-0 mt-2 w-44 rounded-2xl border border-[var(--border-color)] bg-[var(--surface-bg)] py-1.5 shadow-lg z-50">
                {locations.map((loc) => (
                  <li key={loc} role="option" aria-selected={selectedLocation === loc}>
                    <button
                      type="button"
                      onClick={() => { setSelectedLocation(loc); setIsLocationOpen(false); }}
                      className={`w-full px-4 py-2 text-left text-xs transition hover:bg-[var(--surface-soft)] ${selectedLocation === loc ? 'font-semibold text-[#c53938]' : 'text-[var(--primary-text)]'
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
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--surface-soft)] transition hover:border-[#c53938] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c53938]"
          >
            <img src={cartIcon} alt="" aria-hidden="true" width="18" height="18" className="icon-invert" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#c53938] text-[9px] font-bold leading-none text-white shadow-xs">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Notifications */}
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--surface-soft)] transition hover:border-[#c53938] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c53938]"
          >
            <img src={bellIcon} alt="" aria-hidden="true" width="18" height="18" className="icon-invert" />
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#c53938] text-[9px] font-bold leading-none text-white">2</span>
          </button>

          {/* Account Dropdown — same style as main site AccountMenu */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen((p) => !p)}
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
              aria-label="Account menu"
              className="flex items-center gap-2 rounded-full p-0.5 transition hover:ring-2 hover:ring-[#c53938]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c53938]"
            >
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-[#c53938]/10 ring-2 ring-[var(--border-color)] text-base font-bold text-[#c53938] uppercase">
                {(user?.name || user?.firstName || 'U').charAt(0)}
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-semibold leading-tight text-[var(--primary-text)]">
                  {user?.name || (user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'My Account')}
                </p>
                <p className="text-[11px] text-[var(--secondary-text)]">{user?.role === 'admin' ? 'Super Admin' : 'Customer Account'}</p>
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

            {/* Dropdown — same structure as AccountMenu.jsx */}
            {isDropdownOpen && (
              <div
                id="dashboard-account-menu"
                role="menu"
                aria-label="Account menu"
                className="absolute right-0 top-[calc(100%+10px)] z-[100] w-[min(360px,calc(100vw-32px))] overflow-hidden rounded-[14px] border border-[var(--border-color)] bg-[var(--page-bg)] shadow-[0_12px_35px_rgba(0,0,0,0.25)]"
              >
                {/* Profile row */}
                <Link
                  to="/account/dashboard"
                  role="menuitem"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-3 px-5 py-4 transition hover:bg-[var(--surface-soft)]"
                >
                  <div className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full bg-[#c53938]/10 text-2xl font-bold text-[#c53938] uppercase">
                    {(user?.name || user?.firstName || 'U').charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="m-0 truncate text-[17px] font-medium leading-6 text-[var(--primary-text)]">
                      {user?.name || (user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'User')}
                    </p>
                    <p className="m-0 truncate text-[14px] leading-6 text-[var(--secondary-text)]">
                      {user?.email || 'user@eld7e7.com'}
                    </p>
                  </div>
                  <span aria-hidden="true" className="text-xl text-[var(--secondary-text)]">›</span>
                </Link>

                <div className="h-px bg-[var(--border-color)]" />

                {/* Nav links */}
                <div className="py-2">
                  {[
                    { label: 'Dashboard', to: '/account/dashboard', icon: '⌂' },
                    { label: 'My Orders', to: '/account/orders', icon: '▣' },
                    { label: 'Wishlist', to: '/account/wishlist', icon: '♡' },
                    { label: 'Account Settings', to: '/account/settings', icon: '⚙' },
                  ].map(({ label, to, icon }) => (
                    <Link
                      key={to}
                      to={to}
                      role="menuitem"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-5 py-3 text-[16px] font-medium text-[var(--secondary-text)] transition hover:bg-[var(--surface-soft)] hover:text-[#ef5350]"
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
                  className="flex w-full items-center gap-3 px-5 py-4 text-left text-[16px] font-medium text-[var(--secondary-text)] transition hover:bg-[var(--surface-soft)]"
                >
                  <span aria-hidden="true" className="flex h-6 w-6 items-center justify-center text-xl">
                    {isDark ? '☾' : '☀'}
                  </span>
                  <span className="flex-1">{isDark ? 'Dark Mode' : 'Light Mode'}</span>
                  <span
                    aria-hidden="true"
                    className={`relative h-6 w-10 rounded-full transition-colors ${isDark ? 'bg-[#c94545]' : 'bg-[#d1d5dc]'}`}
                  >
                    <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all ${isDark ? 'left-5' : 'left-1'}`} />
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
                  className="flex w-full items-center gap-3 px-5 py-4 text-left text-[16px] font-medium text-[var(--secondary-text)] transition hover:bg-[var(--surface-soft)] hover:text-[#ef5350]"
                >
                  <span aria-hidden="true" className="flex h-6 w-6 items-center justify-center text-xl">⇥</span>
                  <span>Logout</span>
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