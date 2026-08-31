import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import CartItem from '../components/cart/CartItem';
import OrderSummary from '../components/cart/OrderSummary';
import { useCart } from '../context/CartContext';
import chevronRightIcon from '../assets/icons/cart/chevron-right.svg';
import { useLanguage } from '../context/LanguageContext';

export default function Cart() {
  const { cartItems, increaseQuantity, decreaseQuantity, removeItem, subtotal } = useCart();
  const { t } = useLanguage();
  const tr = t('cart');
  const trSidebar = t('sidebar');

  const [isCollapsed, setIsCollapsed] = useState(
    () => localStorage.getItem('sidebar_collapsed') === 'true'
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('sidebar_collapsed', String(next));
      return next;
    });
  };

  useEffect(() => {
    const handleStorageChange = () => {
      setIsCollapsed(localStorage.getItem('sidebar_collapsed') === 'true');
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--primary-text)]">
      <Helmet>
        <title>Your Cart | El-D7E7</title>
        <meta name="description" content="Review your El-D7E7 shopping cart, update quantities, apply a promo code and continue to checkout." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <DashboardHeader onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

      <div
        className={`mx-auto w-full items-stretch max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 transition-all duration-300 ${
          isCollapsed
            ? 'lg:grid lg:grid-cols-[80px_minmax(0,1fr)] lg:gap-8'
            : 'lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8'
        }`}
      >
        {/* Desktop Sidebar (hidden on mobile) */}
        <div className="hidden lg:block h-full">
          <DashboardSidebar
            isCollapsed={isCollapsed}
            onToggleCollapse={toggleCollapse}
          />
        </div>

        {/* Mobile Slide-Over Sidebar Drawer */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="fixed inset-y-0 ltr:left-0 rtl:right-0 z-50 w-[290px] max-w-[85vw] bg-[var(--surface-bg)] p-4 shadow-2xl ltr:border-r rtl:border-l border-[var(--border-color)] overflow-y-auto animate-in ltr:slide-in-from-left rtl:slide-in-from-right duration-300">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)] mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--secondary-text)]">
                  {trSidebar?.accountMenu || 'Account Menu'}
                </span>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-lg p-1.5 text-[var(--secondary-text)] hover:bg-[var(--surface-soft)] hover:text-[var(--primary-text)] transition cursor-pointer"
                  aria-label="Close mobile menu"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <DashboardSidebar
                isCollapsed={false}
                onToggleCollapse={() => setIsMobileMenuOpen(false)}
                onNavClick={() => setIsMobileMenuOpen(false)}
                isMobile
              />
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1 transition-all duration-300 ease-in-out">
          <nav aria-label="Breadcrumb" className="flex items-center gap-3 text-base">
            <Link to="/" className="text-[var(--secondary-text)] transition hover:text-[#c53938]">
              {tr?.breadcrumbHome || 'Home'}
            </Link>
            <img src={chevronRightIcon} alt="" width="16" height="16" className="h-4 w-4 object-contain rtl:rotate-180" />
            <span aria-current="page">{tr?.breadcrumbCart || 'Cart'}</span>
          </nav>

          <h1 className="mb-0 mt-4 text-[32px] sm:text-[40px] font-bold leading-tight text-[var(--primary-text)]">
            {tr?.pageTitle || 'Your Cart'}
          </h1>

          <section
            aria-label="Cart products"
            className="mt-3 rounded-[20px] border border-[var(--border-color)] bg-[var(--surface-bg)] px-4 sm:px-6 py-0"
          >
            {cartItems.length > 0 ? (
              cartItems.map((item, index) => (
                <div key={item.id}>
                  <CartItem
                    item={item}
                    onIncrease={increaseQuantity}
                    onDecrease={decreaseQuantity}
                    onRemove={removeItem}
                  />
                  {index < cartItems.length - 1 && (
                    <div className="h-px bg-[var(--border-color)]" />
                  )}
                </div>
              ))
            ) : (
              <div className="px-6 py-16 text-center">
                <h2 className="m-0 text-2xl font-semibold">{tr?.emptyTitle || 'Your cart is empty'}</h2>
                <p className="mt-3 text-[var(--secondary-text)]">{tr?.emptySubtitle || 'Add some products before continuing to checkout.'}</p>
                <Link
                  to="/"
                  className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-[#c94545] px-7 text-white transition hover:bg-[#ef5350]"
                >
                  {tr?.continueShopping || 'Continue Shopping'}
                </Link>
              </div>
            )}
          </section>

          <div className="mt-4">
            <OrderSummary subtotal={subtotal} />
          </div>
        </main>
      </div>
    </div>
  );
}