import { Helmet } from 'react-helmet-async';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, Package, Home } from 'lucide-react';

import DashboardHeader from '../components/dashboard/DashboardHeader';

export default function OrderSuccess() {
  const location = useLocation();

  const orderNumber =
    location.state?.orderNumber ??
    `D7E7-${Math.floor(100000 + Math.random() * 900000)}`;

  const total = location.state?.total;

  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--primary-text)]">
      <Helmet>
        <title>Order Confirmed | El-D7E7</title>

        <meta
          name="description"
          content="Your order has been placed successfully."
        />

        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <DashboardHeader />

      <main className="mx-auto flex w-full max-w-[640px] flex-col items-center px-5 py-20 text-center sm:px-8">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#c53938]/10">
          <CheckCircle2
            size={44}
            color="#c53938"
            strokeWidth={2}
          />
        </span>

        <h1 className="mt-6 text-3xl font-bold text-[var(--primary-text)] sm:text-4xl">
          Order Placed Successfully!
        </h1>

        <p className="mt-3 text-[var(--secondary-text)]">
          Thanks{location.state?.fullName ? `, ${location.state.fullName}` : ''}!
          Your order has been confirmed and is being prepared.
        </p>

        <div className="mt-8 w-full rounded-[20px] border border-[var(--border-color)] bg-[var(--surface-bg)] p-6">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-[var(--secondary-text)]">
              Order Number
            </span>

            <span className="text-sm font-bold text-[var(--primary-text)]">
              {orderNumber}
            </span>
          </div>

          {typeof total === 'number' && (
            <>
              <div className="my-4 h-px bg-[var(--border-color)]" />

              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-[var(--secondary-text)]">
                  Total Paid
                </span>

                <span className="text-sm font-bold text-[var(--primary-text)]">
                  EGP {total.toFixed(2)}
                </span>
              </div>
            </>
          )}

          <div className="my-4 h-px bg-[var(--border-color)]" />

          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-[var(--secondary-text)]">
              Estimated Delivery
            </span>

            <span className="text-sm font-bold text-[var(--primary-text)]">
              2 - 4 business days
            </span>
          </div>
        </div>

        <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
          <Link
            to="/account/orders"
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#c94545] text-sm font-bold text-white transition hover:bg-[#ef5350]"
          >
            <Package size={18} />
            Track My Order
          </Link>

          <Link
            to="/"
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-[var(--border-color)] text-sm font-bold text-[var(--primary-text)] transition hover:border-[#c53938] hover:text-[#c53938]"
          >
            <Home size={18} />
            Continue Shopping
          </Link>
        </div>
      </main>
    </div>
  );
}
