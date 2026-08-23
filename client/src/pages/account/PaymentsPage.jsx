import { useState, useEffect } from 'react';
import { orderApi } from '../../services/api';

/* ── Payment methods supported by El-D7E7 ── */
const PAYMENT_METHODS = [
  {
    id: 'cash_on_delivery',
    label: 'Cash on Delivery',
    description: 'Pay when your order arrives at your door',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18v10H3V7Zm9 2.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z" />
      </svg>
    ),
    color: 'bg-emerald-100 text-emerald-600',
    available: true,
  },
  {
    id: 'instapay',
    label: 'InstaPay',
    description: 'Transfer via InstaPay · Account: 01111291542',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <rect width="24" height="24" rx="6" fill="#5C2D91" />
        <path d="M5 17L12 6L19 17H13L12 14L11 17H5Z" fill="white" />
      </svg>
    ),
    color: 'bg-purple-100 text-purple-700',
    available: true,
  },
  {
    id: 'vodafone_cash',
    label: 'Vodafone Cash',
    description: 'Transfer via Vodafone Cash · Wallet: 012266251423',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <rect width="24" height="24" rx="6" fill="#E60000" />
        <circle cx="12" cy="12" r="6" stroke="white" strokeWidth="2" fill="none" />
        <path d="M12 9v3l2 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    color: 'bg-red-100 text-red-600',
    available: true,
  },
];

const paymentStatusConfig = {
  pending:              { label: 'Pending',              className: 'bg-gray-100 text-gray-600' },
  pending_verification: { label: 'Pending Verification', className: 'bg-amber-100 text-amber-700' },
  paid:                 { label: 'Paid',                 className: 'bg-emerald-100 text-emerald-700' },
  rejected:             { label: 'Rejected',             className: 'bg-red-100 text-[#c53938]' },
};

function formatEGP(n) {
  return `EGP ${Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function TxnIcon({ method, paymentStatus }) {
  const base = 'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm';
  if (method === 'instapay') {
    return (
      <span className={`${base} bg-purple-100`}>
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
          <rect width="24" height="24" rx="6" fill="#5C2D91" />
          <path d="M5 17L12 6L19 17H13L12 14L11 17H5Z" fill="white" />
        </svg>
      </span>
    );
  }
  if (method === 'vodafone_cash') {
    return (
      <span className={`${base} bg-red-100`}>
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
          <rect width="24" height="24" rx="6" fill="#E60000" />
          <circle cx="12" cy="12" r="6" stroke="white" strokeWidth="2" fill="none" />
          <path d="M12 9v3l2 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </span>
    );
  }
  // COD
  return (
    <span className={`${base} bg-[#c53938]/10 text-[#c53938]`}>
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18v10H3V7Zm9 2.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z" />
      </svg>
    </span>
  );
}

function SkeletonRow() {
  return (
    <li className="flex items-center gap-3 py-3 animate-pulse">
      <span className="h-10 w-10 shrink-0 rounded-full bg-[var(--surface-soft)]" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-48 rounded bg-[var(--surface-soft)]" />
        <div className="h-2.5 w-28 rounded bg-[var(--surface-soft)]" />
      </div>
      <div className="h-3 w-20 rounded bg-[var(--surface-soft)]" />
    </li>
  );
}

export default function PaymentsPage() {
  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    orderApi.getMyOrders({ limit: 50 })
      .then((data) => {
        const list = data.orders || [];
        setOrders(list);
        const spent = list
          .filter((o) => !['cancelled', 'returned'].includes(o.status))
          .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        setTotalSpent(spent);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  /* split orders for display */
  const pendingVerification = orders.filter((o) => o.paymentStatus === 'pending_verification');
  const recentOrders        = orders.slice(0, 8);

  const methodLabel = (m) => {
    if (m === 'cash_on_delivery') return 'Cash on Delivery';
    if (m === 'instapay')         return 'InstaPay';
    if (m === 'vodafone_cash')    return 'Vodafone Cash';
    return m || 'N/A';
  };

  return (
    <div className="flex flex-col gap-1">
      {/* ── Page header ── */}
      <h1 className="text-2xl font-bold text-[var(--primary-text)]">Payments</h1>
      <p className="mb-5 text-sm text-[var(--secondary-text)]">
        Your payment methods, order history and payment status
      </p>

      {/* ── Pending Verification Alert ── */}
      {pendingVerification.length > 0 && (
        <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 text-lg">⏳</span>
            <div>
              <p className="text-sm font-bold text-amber-800">
                {pendingVerification.length} order{pendingVerification.length > 1 ? 's' : ''} awaiting payment verification
              </p>
              <p className="mt-0.5 text-xs text-amber-700">
                Our team is reviewing your payment proof. You'll receive an email once it's verified.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {pendingVerification.map((o) => (
                  <span key={o._id} className="rounded-full bg-amber-200 px-2.5 py-1 text-[11px] font-bold text-amber-800">
                    #{o.orderNumber}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* ══════════════ LEFT COLUMN (2/3) ══════════════ */}
        <div className="flex flex-col gap-5 lg:col-span-2">

          {/* ── Order Payment History ── */}
          <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface-bg)] p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[var(--primary-text)]">Order Payment History</h2>
              <span className="text-xs text-[var(--muted-text)]">{orders.length} orders</span>
            </div>

            <ul className="flex flex-col divide-y divide-[var(--border-color)]">
              {loading && [1, 2, 3, 4].map((i) => <SkeletonRow key={i} />)}

              {!loading && recentOrders.length === 0 && (
                <li className="py-10 text-center text-sm text-[var(--muted-text)]">
                  No orders yet.
                </li>
              )}

              {!loading && recentOrders.map((o) => {
                const ps  = paymentStatusConfig[o.paymentStatus] || paymentStatusConfig.pending;
                const date = new Date(o.createdAt).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric',
                });

                return (
                  <li key={o._id} className="flex items-center gap-3 py-3">
                    <TxnIcon method={o.paymentMethod} paymentStatus={o.paymentStatus} />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-[var(--primary-text)]">
                        Order #{o.orderNumber} — {o.items?.length} item{o.items?.length !== 1 ? 's' : ''}
                      </p>
                      <div className="mt-0.5 flex flex-wrap items-center gap-2">
                        <span className="text-[11px] text-[var(--secondary-text)]">{date}</span>
                        <span className="text-[11px] text-[var(--muted-text)]">·</span>
                        <span className="text-[11px] text-[var(--secondary-text)]">{methodLabel(o.paymentMethod)}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className="text-sm font-bold text-[var(--primary-text)]">
                        -{formatEGP(o.totalAmount)}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${ps.className}`}>
                        {ps.label}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        {/* ══════════════ RIGHT COLUMN (1/3) ══════════════ */}
        <div className="flex flex-col gap-5">

          {/* ── Total Spent Card ── */}
          <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#c53938] to-[#8f2524] p-5 text-white">
            <span className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10" />
            <span className="pointer-events-none absolute -bottom-12 -right-4 h-28 w-28 rounded-full bg-white/5" />

            <div className="relative flex items-center gap-2 text-xs font-semibold uppercase tracking-wide opacity-80">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3m-6 0V5a2 2 0 0 1 4 0v2m-4 0h4" />
              </svg>
              Total Spent
            </div>

            {loading ? (
              <div className="mt-2 h-9 w-36 animate-pulse rounded-lg bg-white/20" />
            ) : (
              <p className="relative mt-2 text-3xl font-bold">{formatEGP(totalSpent)}</p>
            )}
            <p className="relative mb-1 mt-0.5 text-xs opacity-70">Across {orders.filter(o => !['cancelled','returned'].includes(o.status)).length} orders</p>
          </section>

          {/* ── Available Payment Methods ── */}
          <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface-bg)] p-5">
            <h2 className="mb-1 text-sm font-semibold text-[var(--primary-text)]">Available Payment Methods</h2>
            <p className="mb-4 text-[11px] text-[var(--muted-text)]">Methods accepted at checkout</p>

            <ul className="flex flex-col gap-3">
              {PAYMENT_METHODS.map((m) => (
                <li key={m.id} className="flex items-center gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--surface-soft)] px-4 py-3">
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${m.color}`}>
                    {m.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[var(--primary-text)]">{m.label}</p>
                    <p className="truncate text-[11px] text-[var(--muted-text)]">{m.description}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                    Active
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* ── Payment Status Legend ── */}
          <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface-bg)] p-5">
            <h2 className="mb-3 text-sm font-semibold text-[var(--primary-text)]">Payment Status Guide</h2>
            <ul className="flex flex-col gap-2.5">
              {Object.entries(paymentStatusConfig).map(([key, val]) => (
                <li key={key} className="flex items-center gap-2.5">
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${val.className}`}>
                    {val.label}
                  </span>
                  <span className="text-[11px] text-[var(--muted-text)]">
                    {key === 'pending'              && 'COD — paid on delivery'}
                    {key === 'pending_verification' && 'Proof uploaded — awaiting admin review'}
                    {key === 'paid'                 && 'Payment confirmed by admin'}
                    {key === 'rejected'             && 'Proof rejected — re-upload required'}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}