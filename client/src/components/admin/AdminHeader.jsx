import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import logoMascot from '../../assets/icons/logo-mascot-transparent.png';
import logoWordmark from '../../assets/icons/logo-wordmark.png';
import searchIcon from '../../assets/icons/dashboard/search.svg';
import chevronRightIcon from '../../assets/icons/dashboard/chevron-right.svg';

export default function AdminHeader() {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => document.documentElement.dataset.theme === 'dark');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.dataset.theme = next ? 'dark' : 'light';
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    setIsDropdownOpen(false);
    navigate('/admin/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border-color)] bg-[var(--surface-bg)]">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

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

        <form onSubmit={(e) => e.preventDefault()} role="search" className="relative flex-1 max-w-[500px] min-w-0">
          <label htmlFor="admin-search" className="sr-only">Search</label>
          <img
            src={searchIcon}
            alt=""
            aria-hidden="true"
            width="16"
            height="16"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 icon-invert opacity-50"
          />
          <input
            id="admin-search"
            type="search"
            placeholder="Search…"
            className="h-9 sm:h-11 w-full rounded-full border border-[var(--border-color)] bg-[var(--surface-soft)] pl-9 sm:pl-10 pr-3 sm:pr-4 text-xs sm:text-sm text-[var(--primary-text)] placeholder-[var(--secondary-text)] transition focus:border-[#c53938] focus:outline-none focus:ring-2 focus:ring-[#c53938]/20"
          />
        </form>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--surface-soft)] px-4 py-2 text-xs font-semibold text-[var(--primary-text)] transition hover:border-[#c53938] hover:text-[#c53938] sm:flex"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 9V7a2 2 0 0 1 .4-1.2L5.6 4.2A2 2 0 0 1 7.2 3.5h9.6a2 2 0 0 1 1.6.7l1.2 1.6A2 2 0 0 1 20 7v2M4 9h16M4 9v10a1 1 0 0 0 1 1h4v-6h6v6h4a1 1 0 0 0 1-1V9" />
            </svg>
            View Store
          </a>

          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--surface-soft)] transition hover:border-[#c53938] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c53938]"
          >
            <svg className="h-[18px] w-[18px] text-[var(--secondary-text)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#c53938]" />
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen((p) => !p)}
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
              aria-label="Admin menu"
              className="flex items-center gap-2 rounded-full p-0.5 transition hover:ring-2 hover:ring-[#c53938]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c53938]"
            >
              <span className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-[#c53938] text-white">
                <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3 4 6v5c0 4.5 3 8 8 10 5-2 8-5.5 8-10V6l-8-3Z" />
                </svg>
              </span>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-semibold leading-tight text-[var(--primary-text)]">Admin</p>
                <p className="text-[11px] text-[var(--secondary-text)]">Super Admin</p>
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
                className="absolute right-0 top-[calc(100%+10px)] z-[100] w-[min(260px,calc(100vw-32px))] overflow-hidden rounded-[14px] border border-[var(--border-color)] bg-[var(--page-bg)] shadow-[0_12px_35px_rgba(0,0,0,0.25)]"
              >
                <Link
                  to="/admin/settings"
                  role="menuitem"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-3 px-5 py-3.5 text-sm font-medium text-[var(--secondary-text)] transition hover:bg-[var(--surface-soft)] hover:text-[var(--primary-text)]"
                >
                  <span aria-hidden="true" className="flex h-5 w-5 items-center justify-center">⚙</span>
                  Settings
                </Link>

                <div className="h-px bg-[var(--border-color)]" />

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

                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-5 py-3.5 text-left text-sm font-medium text-[var(--secondary-text)] transition hover:bg-[var(--surface-soft)] hover:text-[#c53938]"
                >
                  <span aria-hidden="true" className="flex h-5 w-5 items-center justify-center">⇥</span>
                  Logout
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}