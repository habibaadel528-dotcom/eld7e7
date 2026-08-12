import { useMemo, useState } from 'react';

/* ── Mock data — replace with real API data later ── */
const initialOrders = [
  { id: 'ELD-7291', customer: 'Eman Mohamed', email: 'eman.m@gmail.com', date: 'Jul 28, 2026', items: 3, total: 8499, payment: 'Visa •4291', status: 'Shipped' },
  { id: 'ELD-7204', customer: 'Ahmed Sayed', email: 'ahmed.s@outlook.com', date: 'Jul 22, 2026', items: 1, total: 39999, payment: 'Cash', status: 'Processing' },
  { id: 'ELD-7144', customer: 'Mariam Khalil', email: 'mariam.k@gmail.com', date: 'Jul 18, 2026', items: 1, total: 28999, payment: 'Fawry', status: 'Delivered' },
  { id: 'ELD-7091', customer: 'Youssef Hassan', email: 'youssef.h@gmail.com', date: 'Jul 15, 2026', items: 4, total: 12340, payment: 'Visa •7835', status: 'Delivered' },
  { id: 'ELD-6988', customer: 'Nour El-Din', email: 'nour.e@gmail.com', date: 'Jul 5, 2026', items: 2, total: 5899, payment: 'Cash', status: 'Delivered' },
  { id: 'ELD-6899', customer: 'Sara Mostafa', email: 'sara.m@yahoo.com', date: 'Jun 28, 2026', items: 1, total: 3299, payment: 'Mastercard •2241', status: 'Returned' },
  { id: 'ELD-6712', customer: 'Omar Fathy', email: 'omar.f@gmail.com', date: 'Jun 20, 2026', items: 1, total: 3299, payment: 'Vodafone Cash', status: 'Cancelled' },
  { id: 'ELD-6530', customer: 'Dina Ramzy', email: 'dina.r@gmail.com', date: 'Jun 8, 2026', items: 1, total: 24999, payment: 'Visa •1193', status: 'Returned' },
];

const filterTabs = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'];

const statusStyles = {
  Processing: 'text-sky-600',
  Shipped: 'text-amber-600',
  Delivered: 'text-emerald-600',
  Cancelled: 'text-[#c53938]',
  Returned: 'text-violet-600',
};

function formatEGP(n) {
  return `EGP ${n.toLocaleString('en-US')}`;
}

export default function OrderManagementPage() {
  const [orders, setOrders] = useState(initialOrders);
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      const matchesFilter = activeFilter === 'All' || o.status === activeFilter;
      const matchesQuery =
        !q || o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [orders, query, activeFilter]);

  const updateStatus = (id, status) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  return (
    <div className="flex flex-col gap-5">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary-text)]">Order Management</h1>
          <p className="text-sm text-[var(--secondary-text)]">{orders.length} total orders</p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg bg-[#c53938] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15V3m0 12-4-4m4 4 4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
          </svg>
          Export CSV
        </button>
      </div>

      {/* ── Search + filters ── */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[240px] flex-1">
          <svg className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--secondary-text)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path strokeLinecap="round" d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by ID or customer..."
            className="h-11 w-full rounded-xl border border-[var(--border-color)] bg-[var(--surface-bg)] pl-10 pr-4 text-sm text-[var(--primary-text)] placeholder-[var(--secondary-text)] focus:border-[#c53938] focus:outline-none focus:ring-2 focus:ring-[#c53938]/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveFilter(tab)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                activeFilter === tab
                  ? 'bg-[#c53938] text-white'
                  : 'border border-[var(--border-color)] bg-[var(--surface-bg)] text-[var(--secondary-text)] hover:text-[var(--primary-text)]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto rounded-2xl border border-[var(--border-color)] bg-[var(--surface-bg)]">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border-color)] text-[11px] uppercase tracking-wide text-[var(--secondary-text)]">
              <th className="px-5 py-3 font-medium">Order ID</th>
              <th className="px-5 py-3 font-medium">Customer</th>
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">Items</th>
              <th className="px-5 py-3 font-medium">Total</th>
              <th className="px-5 py-3 font-medium">Payment</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-color)]">
            {filtered.map((o) => (
              <tr key={o.id} className="transition hover:bg-[var(--surface-soft)]">
                <td className="px-5 py-3 font-semibold text-[#c53938]">#{o.id}</td>
                <td className="px-5 py-3">
                  <p className="font-medium text-[var(--primary-text)]">{o.customer}</p>
                  <p className="text-xs text-[var(--secondary-text)]">{o.email}</p>
                </td>
                <td className="px-5 py-3 text-[var(--secondary-text)]">{o.date}</td>
                <td className="px-5 py-3 text-[var(--primary-text)]">{o.items}</td>
                <td className="px-5 py-3 font-semibold text-[var(--primary-text)]">{formatEGP(o.total)}</td>
                <td className="px-5 py-3 text-[var(--secondary-text)]">{o.payment}</td>
                <td className="px-5 py-3">
                  <div className="relative inline-block">
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      className={`appearance-none rounded-lg border border-[var(--border-color)] bg-transparent py-1.5 pl-2.5 pr-7 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#c53938]/20 ${statusStyles[o.status]}`}
                    >
                      {Object.keys(statusStyles).map((s) => (
                        <option key={s} value={s} className="text-[var(--primary-text)]">
                          {s}
                        </option>
                      ))}
                    </select>
                    <svg className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
                    </svg>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      title="View order"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--secondary-text)] transition hover:bg-[var(--surface-soft)] hover:text-[var(--primary-text)]"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      title="Delete order"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--secondary-text)] transition hover:bg-[#c53938]/10 hover:text-[#c53938]"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M9 7V4h6v3m-8 0 1 13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-13" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}