import { useMemo, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';

import CartItem from '../components/cart/CartItem';
import OrderSummary from '../components/cart/OrderSummary';

import { initialCartItems } from '../data/cartItems';

import chevronRightIcon from '../assets/icons/cart/chevron-right.svg';

export default function Cart() {
  const [cartItems, setCartItems] = useState(initialCartItems);

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

  const increaseQuantity = (itemId) => {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity: Math.min(item.quantity + 1, 99),
            }
          : item,
      ),
    );
  };

  const decreaseQuantity = (itemId) => {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity: Math.max(item.quantity - 1, 1),
            }
          : item,
      ),
    );
  };

  const removeItem = (itemId) => {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.id !== itemId),
    );
  };

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      ),
    [cartItems],
  );

  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--primary-text)]">
      <Helmet>
        <title>Your Cart | El-D7E7</title>

        <meta
          name="description"
          content="Review your El-D7E7 shopping cart, update quantities, apply a promo code and continue to checkout."
        />

        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <DashboardHeader />

      <div
        className={[
          'mx-auto grid w-full max-w-[1440px] gap-6 lg:gap-8 px-4 py-8 sm:px-8 transition-all duration-300 ease-in-out lg:px-6',
          isCollapsed
            ? 'lg:grid-cols-[80px_minmax(0,1fr)]'
            : 'lg:grid-cols-[280px_minmax(0,1fr)]',
        ].join(' ')}
      >
        <DashboardSidebar
          isCollapsed={isCollapsed}
          onToggleCollapse={toggleCollapse}
        />

        <main className="min-w-0 transition-all duration-300 ease-in-out">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-3 text-base"
          >
            <Link
              to="/"
              className="text-[var(--secondary-text)] transition hover:text-[#c53938]"
            >
              Home
            </Link>

            <img
              src={chevronRightIcon}
              alt=""
              width="16"
              height="16"
              className="h-4 w-4 object-contain"
            />

            <span aria-current="page">
              Cart
            </span>
          </nav>

          <h1 className="mb-0 mt-4 text-[40px] font-bold leading-tight text-[var(--primary-text)]">
            Your Cart
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
                <h2 className="m-0 text-2xl font-semibold">
                  Your cart is empty
                </h2>

                <p className="mt-3 text-[var(--secondary-text)]">
                  Add some products before continuing to checkout.
                </p>

                <Link
                  to="/"
                  className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-[#c94545] px-7 text-white transition hover:bg-[#ef5350]"
                >
                  Continue Shopping
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