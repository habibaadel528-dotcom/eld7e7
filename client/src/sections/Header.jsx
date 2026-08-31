import { useEffect, useRef, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import logoWordmark from '../assets/icons/logo-wordmark.png';
import logoMascot   from '../assets/icons/logo-mascot-transparent.png';
import iconSearch   from '../assets/icons/icon-search.svg';
import iconMapPin from '../assets/icons/icon-map-pin.svg';
import iconChevronDown from '../assets/icons/icon-chevron-down.svg';
import iconShoppingCart from '../assets/icons/icon-shopping-cart.svg';
import iconUser from '../assets/icons/icon-user.svg';

import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { productApi } from '../services/api';
import AccountMenu from './AccountMenu';

const CATEGORY_ROUTES = {
  stationery: '/stationery',
  'cultural-books': '/cultural-books-clearance',
  'school-books': '/external-school-books',
  handcraft: '/handcraft-supplies',
};

const CATEGORY_NAMES = {
  stationery: { en: 'Stationery', ar: 'الأدوات المكتبية' },
  'cultural-books': { en: 'Cultural Books', ar: 'الكتب الثقافية' },
  'school-books': { en: 'School Books', ar: 'الكتب الخارجية' },
  handcraft: { en: 'Handcraft Supplies', ar: 'الأعمال اليدوية' },
};

function normalizeText(str = '') {
  return str
    .toLowerCase()
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .trim();
}

export default function Header({ cartCount: propCartCount }) {
  const navigate = useNavigate();
  const { cartCount: contextCartCount, addToCart } = useCart();
  const { lang, toggleLang, t } = useLanguage();
  const tr = t('header');
  const cartCount = propCartCount !== undefined && propCartCount !== 0 ? propCartCount : contextCartCount;

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const accountMenuRef = useRef(null);
  const desktopSearchRef = useRef(null);
  const mobileSearchRef = useRef(null);

  // Fetch products once for live instant search
  useEffect(() => {
    let isMounted = true;
    productApi.getProducts({ limit: 100 })
      .then((data) => {
        if (isMounted) {
          setAllProducts(data.products || []);
        }
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, []);

  // Filter products live
  const searchResults = useMemo(() => {
    const q = normalizeText(searchQuery);
    if (!q || q.length < 1) return [];

    return allProducts.filter((product) => {
      const name = normalizeText(product.name || '');
      const desc = normalizeText(product.description || '');
      const cat = normalizeText(product.category || '');
      const sub = normalizeText(product.subcategory || '');
      const catAr = normalizeText(CATEGORY_NAMES[product.category]?.ar || '');
      const catEn = normalizeText(CATEGORY_NAMES[product.category]?.en || '');

      return (
        name.includes(q) ||
        desc.includes(q) ||
        cat.includes(q) ||
        sub.includes(q) ||
        catAr.includes(q) ||
        catEn.includes(q)
      );
    }).slice(0, 8);
  }, [searchQuery, allProducts]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target)
      ) {
        setIsAccountMenuOpen(false);
      }

      const clickedDesktopSearch = desktopSearchRef.current && desktopSearchRef.current.contains(event.target);
      const clickedMobileSearch = mobileSearchRef.current && mobileSearchRef.current.contains(event.target);

      if (!clickedDesktopSearch && !clickedMobileSearch) {
        setIsSearchOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsAccountMenuOpen(false);
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;

    setIsSearchOpen(false);

    // If top result has a category, go to that category with the search term
    const topResult = searchResults[0];
    const targetRoute = topResult?.category ? (CATEGORY_ROUTES[topResult.category] || '/stationery') : '/stationery';
    navigate(`${targetRoute}?search=${encodeURIComponent(q)}`);
  };

  const handleSelectProduct = (product) => {
    setIsSearchOpen(false);
    const targetRoute = CATEGORY_ROUTES[product.category] || '/stationery';
    navigate(`${targetRoute}?search=${encodeURIComponent(product.name)}`);
  };

  const handleQuickAdd = (e, product) => {
    e.stopPropagation();
    addToCart(product);
    toast.success(
      lang === 'ar'
        ? `تمت إضافة "${product.name}" إلى عربة التسوق!`
        : `Added "${product.name}" to cart!`
    );
  };

  const renderSearchResultsDropdown = () => {
    if (!isSearchOpen || !searchQuery.trim()) return null;

    return (
      <div className="absolute ltr:left-0 rtl:right-0 top-[calc(100%+8px)] z-50 w-full overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--surface-bg)] shadow-[0_16px_40px_rgba(0,0,0,0.2)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-color)] bg-[var(--surface-soft)] px-4 py-2.5 text-xs text-[var(--secondary-text)]">
          <span className="font-semibold">
            {lang === 'ar'
              ? `نتائج البحث عن "${searchQuery}" (${searchResults.length})`
              : `Search results for "${searchQuery}" (${searchResults.length})`}
          </span>
          {searchResults.length > 0 && (
            <button
              type="button"
              onClick={handleSearchSubmit}
              className="text-xs font-semibold text-[#c53938] hover:underline cursor-pointer"
            >
              {lang === 'ar' ? 'عرض الكل ↵' : 'View all ↵'}
            </button>
          )}
        </div>

        {/* Results List */}
        {searchResults.length > 0 ? (
          <div className="max-h-[380px] divide-y divide-[var(--border-color)] overflow-y-auto">
            {searchResults.map((product) => {
              const catName = CATEGORY_NAMES[product.category]?.[lang] || product.category;
              const productImage = product.images?.[0] || product.image;

              return (
                <div
                  key={product._id || product.id}
                  onClick={() => handleSelectProduct(product)}
                  className="flex items-center justify-between gap-3 p-3 transition hover:bg-[var(--surface-soft)] cursor-pointer text-start"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {productImage ? (
                      <img
                        src={productImage}
                        alt={product.name}
                        className="h-12 w-12 shrink-0 rounded-xl object-cover border border-[var(--border-color)]"
                      />
                    ) : (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--surface-soft)] text-lg">
                        📦
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[var(--primary-text)] m-0">
                        {product.name}
                      </p>
                      <div className="mt-0.5 flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-[var(--surface-soft)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--secondary-text)]">
                          {catName}
                        </span>
                        {product.subcategory && (
                          <span className="text-[11px] text-[var(--muted-text)]">
                            • {product.subcategory}
                          </span>
                        )}
                        <span className="text-xs font-bold text-[#c53938]">
                          {lang === 'ar' ? `${product.price} ج.م` : `EGP ${product.price}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleQuickAdd(e, product)}
                    title={lang === 'ar' ? 'إضافة للسلة' : 'Add to cart'}
                    className="flex shrink-0 items-center gap-1 rounded-full bg-[#c53938] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#ef5350] active:scale-95 cursor-pointer shadow-xs"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    <span className="hidden sm:inline">{lang === 'ar' ? 'أضف' : 'Add'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6 text-center">
            <p className="text-sm font-semibold text-[var(--primary-text)]">
              {lang === 'ar' ? `لم يتم العثور على منتجات لـ "${searchQuery}"` : `No products found for "${searchQuery}"`}
            </p>
            <p className="mt-1 text-xs text-[var(--muted-text)]">
              {lang === 'ar' ? 'جرّب البحث بكلمات شائعة مثل:' : 'Try searching for:'}
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-1.5">
              {['كشكول', 'أقلام', 'روايات', 'ألوان', 'دفتر'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setSearchQuery(tag);
                    setIsSearchOpen(true);
                  }}
                  className="rounded-full border border-[var(--border-color)] bg-[var(--surface-soft)] px-2.5 py-1 text-xs text-[var(--secondary-text)] transition hover:border-[#c53938] hover:text-[#c53938] cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <header className="relative z-50 border-b border-[var(--soft-border-color)] bg-[var(--page-bg)]">
      <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-8">
        <div className="flex min-h-[80px] items-center justify-between gap-5">
          {/* Logo */}
          <Link
            to="/"
            aria-label={tr.logoAriaLabel}
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
          <div ref={desktopSearchRef} className="relative hidden w-full max-w-[520px] flex-1 md:block xl:max-w-[672px]">
            <form onSubmit={handleSearchSubmit} className="relative">
              <img
                src={iconSearch}
                alt=""
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 object-contain ltr:left-4 rtl:right-4 rtl:left-auto"
              />

              <input
                type="search"
                value={searchQuery}
                onFocus={() => setIsSearchOpen(true)}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setIsSearchOpen(true);
                }}
                placeholder={tr.searchPlaceholder}
                aria-label={tr.searchAriaLabel}
                autoComplete="off"
                className="h-[52px] w-full rounded-full border border-[var(--border-color)] bg-[var(--surface-bg)] py-3 pl-[49px] pr-6 text-base text-[var(--primary-text)] outline-none placeholder:text-[var(--muted-text)] focus:border-[#ef5350] rtl:pr-[49px] rtl:pl-6"
              />
            </form>

            {renderSearchResultsDropdown()}
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

              <span>{tr.yourLocation}</span>

              <img
                src={iconChevronDown}
                alt=""
                className="h-4 w-4 object-contain"
              />
            </button>

            {/* Language Toggle */}
            <button
              type="button"
              onClick={toggleLang}
              aria-label={lang === 'en' ? 'Switch to Arabic' : 'التبديل للإنجليزية'}
              className="hidden h-9 items-center gap-1 rounded-full border border-[var(--border-color)] bg-[var(--surface-bg)] px-3 text-xs font-semibold text-[var(--secondary-text)] transition hover:border-[#ef5350] hover:text-[#ef5350] sm:flex cursor-pointer"
            >
              <span className={lang === 'en' ? 'text-[#c94545]' : 'text-[var(--muted-text)]'}>EN</span>
              <span className="text-[var(--border-color)]">|</span>
              <span className={lang === 'ar' ? 'text-[#c94545]' : 'text-[var(--muted-text)]'}>AR</span>
            </button>

            <div className="flex items-center gap-2 sm:gap-4">
              {/* Cart */}
              <Link
                to="/cart"
                aria-label={tr.openCartLabel(cartCount)}
                className="relative flex h-10 w-10 items-center justify-center rounded-lg"
              >
                <img
                  src={iconShoppingCart}
                  alt=""
                  className="h-6 w-6 object-contain"
                />

                {cartCount > 0 && (
                  <span className="absolute right-0 top-0 flex min-h-4 min-w-4 items-center justify-center rounded-full border-2 border-[var(--page-bg)] bg-[#ef5350] px-1 text-[9px] font-bold leading-none text-white">
                    {cartCount}
                  </span>
                )}
              </Link>

              <span className="hidden h-6 w-px bg-[var(--border-color)] sm:block" />

              {/* Account Menu */}
              <div ref={accountMenuRef} className="relative">
                <button
                  type="button"
                  aria-label={tr.openAccountLabel}
                  aria-expanded={isAccountMenuOpen}
                  aria-controls="account-menu"
                  onClick={() =>
                    setIsAccountMenuOpen((currentValue) => !currentValue)
                  }
                  className="flex h-10 items-center justify-center gap-1 rounded-lg cursor-pointer"
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
        <div ref={mobileSearchRef} className="relative mb-4 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative">
            <img
              src={iconSearch}
              alt=""
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 object-contain rtl:right-4 rtl:left-auto"
            />

            <input
              type="search"
              value={searchQuery}
              onFocus={() => setIsSearchOpen(true)}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setIsSearchOpen(true);
              }}
              placeholder={tr.searchPlaceholder}
              aria-label={tr.searchAriaLabel}
              autoComplete="off"
              className="h-12 w-full rounded-full border border-[var(--border-color)] bg-[var(--surface-bg)] pl-12 pr-5 text-sm text-[var(--primary-text)] outline-none placeholder:text-[var(--muted-text)] focus:border-[#ef5350] rtl:pr-12 rtl:pl-5"
            />

            {/* Mobile Language Toggle */}
            <button
              type="button"
              onClick={toggleLang}
              aria-label={lang === 'en' ? 'Switch to Arabic' : 'التبديل للإنجليزية'}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-[var(--border-color)] bg-[var(--surface-bg)] px-2 py-1 text-[10px] font-bold text-[var(--secondary-text)] rtl:left-3 rtl:right-auto cursor-pointer"
            >
              {lang === 'en' ? 'AR' : 'EN'}
            </button>
          </form>

          {renderSearchResultsDropdown()}
        </div>
      </div>
    </header>
  );
}