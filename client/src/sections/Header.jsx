import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import logoWordmark from '../assets/icons/logo-wordmark.png';
import logoMascot   from '../assets/icons/logo-mascot-transparent.png';
import iconSearch   from '../assets/icons/icon-search.svg';
import iconMapPin from '../assets/icons/icon-map-pin.svg';
import iconChevronDown from '../assets/icons/icon-chevron-down.svg';
import iconShoppingCart from '../assets/icons/icon-shopping-cart.svg';
import iconUser from '../assets/icons/icon-user.svg';

import AccountMenu from './AccountMenu';

export default function Header({ cartCount = 0 }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const accountMenuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target)
      ) {
        setIsAccountMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsAccountMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <header className="relative z-50 border-b border-[var(--soft-border-color)] bg-[var(--page-bg)]">
      <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-0">
        <div className="flex min-h-[80px] items-center justify-between gap-5">
          {/* Logo */}
          <Link
            to="/"
            aria-label="Go to home page"
            className="flex shrink-0 items-center gap-2.5 rounded-lg transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c53938]"
          >
            <img
              src={logoMascot}
              alt="El-D7E7 Mascot"
              width="60"
              height="60"
              className="h-14 w-14 object-contain lg:h-[60px] lg:w-[60px]"
            />
            <img
              src={logoWordmark}
              alt="الدحيح El-D7E7"
              width="140"
              height="46"
              className="hidden h-[44px] w-auto object-contain sm:block lg:h-[48px]"
            />
          </Link>

          {/* Desktop Search */}
          <div className="relative hidden w-full max-w-[520px] flex-1 md:block xl:max-w-[672px]">
            <img
              src={iconSearch}
              alt=""
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 object-contain"
            />

            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search..."
              aria-label="Search products"
              autoComplete="off"
              className="h-[52px] w-full rounded-full border border-[var(--border-color)] bg-[var(--surface-bg)] py-3 pl-[49px] pr-6 text-base text-[var(--primary-text)] outline-none placeholder:text-[var(--muted-text)] focus:border-[#ef5350]"
            />
          </div>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-3 lg:gap-6">
            {/* Location */}
            <button
              type="button"
              className="hidden h-10 items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--surface-bg)] px-4 text-sm text-[var(--secondary-text)] transition hover:border-[#ef5350] lg:flex"
            >
              <img
                src={iconMapPin}
                alt=""
                className="h-4 w-4 object-contain"
              />

              <span>Your Location</span>

              <img
                src={iconChevronDown}
                alt=""
                className="h-4 w-4 object-contain"
              />
            </button>

            <div className="flex items-center gap-2 sm:gap-4">
              {/* Cart */}
              <Link
                to="/cart"
                aria-label={`Open shopping cart with ${cartCount} items`}
                className="relative flex h-10 w-10 items-center justify-center rounded-lg"
              >
                <img
                  src={iconShoppingCart}
                  alt=""
                  className="h-6 w-6 object-contain"
                />

                <span className="absolute right-0 top-0 flex min-h-4 min-w-4 items-center justify-center rounded-full border-2 border-[var(--page-bg)] bg-[#ef5350] px-1 text-[9px] font-bold leading-none text-white">
                  {cartCount}
                </span>
              </Link>

              <span className="hidden h-6 w-px bg-[var(--border-color)] sm:block" />

              {/* Account Menu */}
              <div ref={accountMenuRef} className="relative">
                <button
                  type="button"
                  aria-label="Open account menu"
                  aria-expanded={isAccountMenuOpen}
                  aria-controls="account-menu"
                  onClick={() =>
                    setIsAccountMenuOpen((currentValue) => !currentValue)
                  }
                  className="flex h-10 items-center justify-center gap-1 rounded-lg"
                >
                  <img
                    src={iconUser}
                    alt=""
                    className="h-6 w-6 object-contain"
                  />

                  <img
                    src={iconChevronDown}
                    alt=""
                    className={`hidden h-4 w-4 object-contain transition-transform sm:block ${isAccountMenuOpen ? 'rotate-180' : ''
                      }`}
                  />
                </button>

                {isAccountMenuOpen && (
                  <AccountMenu
                    onClose={() => setIsAccountMenuOpen(false)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="relative mb-4 md:hidden">
          <img
            src={iconSearch}
            alt=""
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 object-contain"
          />

          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search..."
            aria-label="Search products"
            autoComplete="off"
            className="h-12 w-full rounded-full border border-[var(--border-color)] bg-[var(--surface-bg)] pl-12 pr-5 text-sm text-[var(--primary-text)] outline-none placeholder:text-[var(--muted-text)] focus:border-[#ef5350]"
          />
        </div>
      </div>
    </header>
  );
}