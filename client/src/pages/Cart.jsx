import { useMemo, useState, useEffect } from 'react';
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

  const [isCollapsed, setIsCollapsed] = useState(
    () => localStorage.getItem('sidebar_collapsed') === 'true'
  );

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

      <DashboardHeader />

      <div
        className={[
          'mx-auto grid w-full max-w-[1440px] gap-6 lg:gap-8 px-4 py-8 sm:px-8 transition-all duration-300 ease-in-out lg:px-6',
          isCollapsed ? 'lg:grid-cols-[80px_minmax(0,1fr)]' : 'lg:grid-cols-[280px_minmax(0,1fr)]',
        ].join(' ')}
      >
        <DashboardSidebar isCollapsed={isCollapsed} onToggleCollapse={toggleCollapse} />

        <main className="min-w-0 transition-all duration-300 ease-in-out">
          <nav aria-label="Breadcrumb" className="flex items-center gap-3 text-base">
            <Link to="/" className="text-[var(--secondary-text)] transition hover:text-[#c53938]">
              {tr.breadcrumbHome}
            </Link>
            <img src={chevronRightIcon} alt="" width="16" height="16" className="h-4 w-4 object-contain" />
            <span aria-current="page">{tr.breadcrumbCart}</span>
          </nav>

          <h1 className="mb-0 mt-4 text-[40px] font-bold leading-tight text-[var(--primary-text)]">
            {tr.pageTitle}
          </h1>

          <section
            aria-label="Cart products"
            className="mt-3 rounded-[20px] border border-[var(--border-color)] bg-[var(--surface-bg)] px-6 py-0"
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
                <h2 className="m-0 text-2xl font-semibold">{tr.emptyTitle}</h2>
                <p className="mt-3 text-[var(--secondary-text)]">{tr.emptySubtitle}</p>
                <Link
                  to="/"
                  className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-[#c94545] px-7 text-white transition hover:bg-[#ef5350]"
                >
                  {tr.continueShopping}
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