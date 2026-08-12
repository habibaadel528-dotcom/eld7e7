import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Filter, Search, ChevronDown } from 'lucide-react';

import orderHeadphones from '../../assets/images/dashboard/order-headphones.png';
import orderPhone      from '../../assets/images/dashboard/order-phone.png';
import orderWatch      from '../../assets/images/dashboard/order-watch.png';
import orderSunglasses from '../../assets/images/dashboard/order-sunglasses.png';
import orderBag        from '../../assets/images/dashboard/order-bag.png';
import orderCoffee     from '../../assets/images/dashboard/order-coffee.png';

const ORDER_STATUSES = [
  { key: 'all',        label: 'All Orders',  count: 6 },
  { key: 'processing', label: 'Processing',  count: 1 },
  { key: 'shipped',    label: 'Shipped',     count: 1 },
  { key: 'delivered',  label: 'Delivered',   count: 2 },
  { key: 'cancelled',  label: 'Cancelled',   count: 1 },
  { key: 'returned',   label: 'Returned',    count: 1 },
];

const ORDERS = [
  {
    id: '#ELD-7291',
    image: orderHeadphones,
    title: 'Sony WH-1000XM5',
    status: 'Shipped',
    statusTone: 'shipped',
    date: 'Jul 28, 2026',
    expected: 'Expected Aug 3, 2026',
    price: 'EGP 8,499',
    actions: ['Track', 'Details'],
    badgeCount: 3,
  },
  {
    id: '#ELD-7204',
    image: orderPhone,
    title: 'iPhone 15 Pro Max',
    status: 'Processing',
    statusTone: 'processing',
    date: 'Jul 22, 2026',
    expected: 'Expected Jul 30, 2026',
    price: 'EGP 39,999',
    actions: ['Cancel', 'Details'],
    badgeCount: 1,
  },
  {
    id: '#ELD-7144',
    image: orderWatch,
    title: 'Apple Watch Series 9',
    status: 'Delivered',
    statusTone: 'delivered',
    date: 'Jul 18, 2026',
    expected: 'Delivered Jul 22, 2026',
    price: 'EGP 28,999',
    actions: ['Review', 'Details'],
    badgeCount: 1,
  },
  {
    id: '#ELD-6988',
    image: orderSunglasses,
    title: 'Ray-Ban Aviator',
    status: 'Delivered',
    statusTone: 'delivered',
    date: 'Jul 5, 2026',
    expected: 'Delivered Jul 10, 2026',
    price: 'EGP 5,899',
    actions: ['Review', 'Details'],
    badgeCount: 2,
  },
  {
    id: '#ELD-6712',
    image: orderBag,
    title: 'Coach Leather Bag',
    status: 'Cancelled',
    statusTone: 'cancelled',
    date: 'Jun 20, 2026',
    expected: 'Cancelled Jun 20, 2026',
    price: 'EGP 3,299',
    actions: ['Details'],
    badgeCount: 1,
  },
  {
    id: '#ELD-6530',
    image: orderCoffee,
    title: 'Nespresso Vertuo',
    status: 'Returned',
    statusTone: 'returned',
    date: 'Jun 8, 2026',
    expected: 'Returned Jun 15, 2026',
    price: 'EGP 24,999',
    actions: ['Details'],
    badgeCount: 1,
  },
];

function StatusPill({ tone, children }) {
  const styles = {
    shipped:    'bg-[#fff3e6] text-[#d97706] [html[data-theme="dark"]_&]:bg-[#d97706]/20',
    processing: 'bg-[#eef5ff] text-[#2563eb] [html[data-theme="dark"]_&]:bg-[#2563eb]/20',
    delivered:  'bg-[#ecfdf5] text-[#059669] [html[data-theme="dark"]_&]:bg-[#059669]/20',
    cancelled:  'bg-[#fff0f0] text-[#dc2626] [html[data-theme="dark"]_&]:bg-[#dc2626]/20',
    returned:   'bg-[#f3f4f6] text-[#6b7280] [html[data-theme="dark"]_&]:bg-[#6b7280]/20',
  };

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${styles[tone]}`}>
      {children}
    </span>
  );
}

function SmallAction({ label, variant = 'ghost' }) {
  const isPrimary = variant === 'primary';

  return (
    <button
      type="button"
      className={[
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium transition',
        isPrimary
          ? 'bg-[#c83738] text-white hover:bg-[#b72f30]'
          : 'border border-[var(--border-color)] bg-[var(--surface-bg)] text-[var(--secondary-text)] hover:border-[#c83738] hover:text-[#c83738]',
      ].join(' ')}
    >
      <span>{label}</span>
    </button>
  );
}

function OrderCard({ order }) {
  return (
    <article className="rounded-[15px] border border-[var(--border-color)] bg-[var(--surface-bg)] p-4 sm:px-5 sm:py-4 shadow-sm transition hover:border-[#c83738]/40">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-1.5 shrink-0">
            <img src={order.image} alt="" className="h-11 w-11 rounded-[15px] border-2 border-[var(--surface-bg)] object-cover" />
            <div className="h-11 w-11 rounded-[15px] border-2 border-[var(--surface-bg)] bg-[var(--surface-soft)]" />
          </div>

          <div className="min-w-0 flex-1 sm:hidden">
            <div className="flex flex-wrap items-center gap-2">
              <p className="m-0 text-[13px] font-semibold text-[var(--primary-text)]">{order.id}</p>
              <StatusPill tone={order.statusTone}>{order.status}</StatusPill>
            </div>
            <p className="mt-0.5 text-[11px] text-[var(--secondary-text)]">{order.date} · {order.price}</p>
          </div>
        </div>

        <div className="hidden min-w-0 flex-1 sm:block">
          <div className="flex flex-wrap items-center gap-2">
            <p className="m-0 text-[13px] font-semibold text-[var(--primary-text)]">{order.id}</p>
            <StatusPill tone={order.statusTone}>{order.status}</StatusPill>
          </div>

          <p className="mt-1 text-[11px] text-[var(--secondary-text)]">
            {order.date} · {order.badgeCount} item{order.badgeCount > 1 ? 's' : ''}
          </p>

          <p className="mt-0.5 text-[11px] text-[var(--secondary-text)]">{order.expected}</p>
        </div>

        <div className="flex items-center justify-between sm:flex-col sm:items-end sm:justify-center">
          <p className="hidden sm:block m-0 text-[15px] font-bold text-[var(--primary-text)]">{order.price}</p>
          <p className="sm:hidden text-xs text-[var(--secondary-text)]">{order.expected}</p>

          <div className="flex items-center gap-2">
            {order.actions.map((action) => (
              <SmallAction key={action} label={action} variant={action === 'Track' ? 'primary' : 'ghost'} />
            ))}
            <button type="button" aria-label="Expand order details" className="ml-1 text-[var(--secondary-text)] hover:text-[#c83738]">
              <ChevronDown size={16} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function MyOrders() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase();

    return ORDERS.filter((order) => {
      const matchesTab =
        activeTab === 'all' ? true : order.statusTone === activeTab;

      const matchesSearch =
        !q ||
        order.id.toLowerCase().includes(q) ||
        order.title.toLowerCase().includes(q) ||
        order.status.toLowerCase().includes(q);

      return matchesTab && matchesSearch;
    });
  }, [search, activeTab]);

  return (
    <>
      <Helmet>
        <title>My Orders | El-D7E7</title>
        <meta
          name="description"
          content="Track and manage all your orders in your El-D7E7 account."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-[19px] font-semibold leading-[26px] text-[var(--primary-text)]">
              My Orders
            </h1>
            <p className="mt-1 text-[13px] text-[var(--secondary-text)]">
              6 total orders
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <label className="relative w-full sm:w-auto">
              <span className="sr-only">Search orders</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--secondary-text)]" size={18} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for products or orders..."
                className="h-[41px] w-full sm:w-[320px] rounded-full border border-[var(--border-color)] bg-[var(--surface-bg)] pl-10 pr-4 text-[13px] text-[var(--primary-text)] outline-none placeholder:text-[var(--secondary-text)] focus:border-[#c83738]"
              />
            </label>

            <button
              type="button"
              className="inline-flex h-[41px] items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--surface-bg)] px-4 text-[13px] font-medium text-[var(--secondary-text)] transition hover:border-[#c83738] hover:text-[#c83738]"
            >
              <Filter size={16} />
              <span>Sort & Filter</span>
            </button>
          </div>
        </div>

        <div className="flex overflow-x-auto gap-2 rounded-[15px] border border-[var(--border-color)] bg-[var(--surface-bg)] p-2 max-w-full scrollbar-none">
          {ORDER_STATUSES.map((tab) => {
            const active = tab.key === activeTab;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={[
                  'inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium transition',
                  active
                    ? 'bg-[#c83738] text-white'
                    : 'text-[var(--secondary-text)] hover:bg-[var(--surface-soft)]',
                ].join(' ')}
              >
                <span>{tab.label}</span>
                <span className={active ? 'rounded-full bg-white/25 px-1.5 py-0.5 text-[10px] font-bold' : 'rounded-full bg-[var(--surface-soft)] px-1.5 py-0.5 text-[10px] font-bold'}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      </div>
    </>
  );
}