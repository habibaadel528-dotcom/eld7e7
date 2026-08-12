import { useMemo } from 'react';
import { getStoredUser } from '../../utils/auth';

import productAirpods from '../../assets/images/dashboard/product-airpods.png';
import productS24 from '../../assets/images/dashboard/product-s24.png';
import productJeans from '../../assets/images/dashboard/product-jeans.png';
import productCoffee from '../../assets/images/dashboard/product-coffee.png';

import orderCamera from '../../assets/images/dashboard/order-camera.png';
import orderHeadphones from '../../assets/images/dashboard/order-headphones.png';
import orderLaptop from '../../assets/images/dashboard/order-laptop.png';
import orderBag from '../../assets/images/dashboard/order-bag.png';
import orderSunglasses from '../../assets/images/dashboard/order-sunglasses.png';
import orderWatch from '../../assets/images/dashboard/order-watch.png';

/* ── Mock data — replace with real API data later ── */

const stats = [
  {
    id: 'orders',
    icon: 'bag',
    iconBg: 'bg-indigo-100 text-indigo-500',
    value: '24',
    label: 'Total Orders',
    note: '+3 this month',
    noteColor: 'text-indigo-500',
  },
  {
    id: 'wishlist',
    icon: 'heart',
    iconBg: 'bg-rose-100 text-rose-500',
    value: '8',
    label: 'Wishlist Items',
    note: '2 on sale now',
    noteColor: 'text-[#c53938]',
  },
  {
    id: 'loyalty',
    icon: 'check',
    iconBg: 'bg-amber-100 text-amber-500',
    value: '1,250',
    label: 'Loyalty Points',
    note: '+200 this week',
    noteColor: 'text-amber-500',
  },
  {
    id: 'wallet',
    icon: 'wallet',
    iconBg: 'bg-emerald-100 text-emerald-500',
    value: 'EGP 450',
    label: 'Wallet Balance',
    note: 'Ready to use',
    noteColor: 'text-emerald-500',
  },
];

const recentOrders = [
  {
    id: 'ELD-7291',
    status: 'Shipped',
    statusColor: 'bg-amber-100 text-amber-600',
    date: 'Jul 28, 2026',
    items: '3 items',
    amount: 'EGP 8,499',
    action: 'Track',
    thumbs: [orderCamera, orderHeadphones, orderSunglasses],
  },
  {
    id: 'ELD-7144',
    status: 'Delivered',
    statusColor: 'bg-emerald-100 text-emerald-600',
    date: 'Jul 18, 2026',
    items: '1 item',
    amount: 'EGP 28,999',
    action: 'Details',
    thumbs: [orderLaptop],
  },
  {
    id: 'ELD-6988',
    status: 'Delivered',
    statusColor: 'bg-emerald-100 text-emerald-600',
    date: 'Jul 5, 2026',
    items: '2 items',
    amount: 'EGP 5,899',
    action: 'Details',
    thumbs: [orderBag, orderWatch],
  },
];

const recommendedProducts = [
  {
    id: 'airpods-pro-2',
    name: 'AirPods Pro 2',
    price: 'EGP 6,499',
    originalPrice: 'EGP 7,999',
    rating: '4.9',
    image: productAirpods,
  },
  {
    id: 'galaxy-s24',
    name: 'Samsung Galaxy S24',
    price: 'EGP 24,999',
    originalPrice: 'EGP 28,999',
    rating: '4.7',
    image: productS24,
  },
  {
    id: 'levis-501',
    name: "Levi's 501 Jeans",
    price: 'EGP 1,299',
    originalPrice: 'EGP 1,799',
    rating: '4.5',
    image: productJeans,
  },
  {
    id: 'nescafe-gold',
    name: 'Nescafé Gold 200g',
    price: 'EGP 189',
    originalPrice: 'EGP 249',
    rating: '4.6',
    image: productCoffee,
  },
];

/* ── Small icon set (no extra deps) ── */
function StatIcon({ type }) {
  const paths = {
    bag: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12l1 13H5L6 7Zm3 0V5a3 3 0 1 1 6 0v2" />
    ),
    heart: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 20s-7-4.35-9.5-8.5C.9 8 2.5 4.5 6 4.5c2 0 3.5 1 6 3.5 2.5-2.5 4-3.5 6-3.5 3.5 0 5.1 3.5 3.5 7C19 15.65 12 20 12 20Z" />
    ),
    check: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path strokeLinecap="round" strokeLinejoin="round" d="m8.5 12.5 2.3 2.3L15.5 10" />
      </>
    ),
    wallet: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Zm14 5h2v3h-2a1.5 1.5 0 0 1 0-3Z" />
    ),
  };
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      {paths[type]}
    </svg>
  );
}

function ArrowUpRight() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg className="h-3.5 w-3.5 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
      <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" />
    </svg>
  );
}

export default function DashboardPage() {
  const currentUser = getStoredUser();
  const userFirstName = currentUser?.name?.split(' ')[0] || 'مستخدم';
  const today = useMemo(
    () =>
      new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
    []
  );
  const [weekday, ...rest] = today.split(', ');
  const restDate = rest.join(', ');

  return (
    <div className="flex flex-col gap-5">
      {/* ── Greeting header ── */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-[var(--primary-text)]">
            Good morning, {userFirstName}! <span>👋</span>
          </h1>
          <p className="text-sm text-[var(--secondary-text)]">
            Here's what's happening with your account today.
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[var(--secondary-text)]">{weekday}</p>
          <p className="text-sm font-semibold text-[var(--primary-text)]">{restDate}</p>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.id}
            className="relative rounded-2xl border border-[var(--border-color)] bg-[var(--surface-bg)] p-4"
          >
            <div className="mb-4 flex items-start justify-between">
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.iconBg}`}>
                <StatIcon type={s.icon} />
              </span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
                <ArrowUpRight />
              </span>
            </div>
            <p className="text-2xl font-bold text-[var(--primary-text)]">{s.value}</p>
            <p className="text-xs text-[var(--secondary-text)]">{s.label}</p>
            <p className={`mt-1 text-xs font-medium ${s.noteColor}`}>{s.note}</p>
          </div>
        ))}
      </div>

      {/* ── Recent Orders + Loyalty ── */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Recent Orders */}
        <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface-bg)] p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[var(--primary-text)]">Recent Orders</h2>
            <a href="/account/orders" className="flex items-center gap-1 text-xs font-semibold text-[#c53938] hover:underline">
              View all
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
              </svg>
            </a>
          </div>

          <ul className="flex flex-col divide-y divide-[var(--border-color)]">
            {recentOrders.map((o) => (
              <li key={o.id} className="flex items-center gap-3 py-3">
                <div className="flex -space-x-2">
                  {o.thumbs.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt=""
                      className="h-9 w-9 rounded-full border-2 border-[var(--surface-bg)] object-cover"
                    />
                  ))}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-[var(--primary-text)]">#{o.id}</p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${o.statusColor}`}>
                      {o.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--secondary-text)]">
                    {o.date} · {o.items}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold text-[var(--primary-text)]">{o.amount}</p>
                  <button type="button" className="text-[11px] font-medium text-[#c53938] hover:underline">
                    {o.action}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Loyalty card */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#c53938] to-[#8f2524] p-5 text-white">
          <span className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10" />
          <span className="pointer-events-none absolute -bottom-12 -right-4 h-28 w-28 rounded-full bg-white/5" />

          <p className="relative text-[11px] font-semibold uppercase tracking-wider opacity-80">
            Loyalty Points
          </p>
          <p className="relative mt-1 text-3xl font-bold">1,250</p>
          <p className="relative mb-4 text-xs opacity-80">= EGP 125 in rewards</p>

          <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/20">
            <div className="h-full w-[62%] rounded-full bg-white" />
          </div>
          <p className="relative mt-2 text-[11px] opacity-80">750 pts until Gold tier</p>
        </section>
      </div>

      {/* ── Recommended for You ── */}
      <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface-bg)] p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[var(--primary-text)]">Recommended for You</h2>
          <a href="#" className="flex items-center gap-1 text-xs font-semibold text-[#c53938] hover:underline">
            Browse all
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
            </svg>
          </a>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {recommendedProducts.map((p) => (
            <a key={p.id} href="#" className="group flex flex-col">
              <div className="mb-2 aspect-square w-full overflow-hidden rounded-xl bg-[var(--surface-soft)]">
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <p className="truncate text-sm font-medium text-[var(--primary-text)] group-hover:text-[#c53938]">
                {p.name}
              </p>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-[var(--primary-text)]">{p.price}</span>
                <span className="text-xs text-[var(--secondary-text)] line-through">{p.originalPrice}</span>
              </div>
              <div className="mt-0.5 flex items-center gap-1">
                <StarIcon />
                <span className="text-xs text-[var(--secondary-text)]">{p.rating}</span>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}