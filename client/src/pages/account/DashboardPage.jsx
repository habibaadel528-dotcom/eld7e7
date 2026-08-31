import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi, orderApi, userApi, productApi } from '../../services/api';
import { getStoredUser } from '../../utils/auth';
import { useLanguage } from '../../context/LanguageContext';
import { formatUserName } from '../../utils/arabicNames';

import productAirpods from '../../assets/images/dashboard/product-airpods.png';
import productS24 from '../../assets/images/dashboard/product-s24.png';
import productJeans from '../../assets/images/dashboard/product-jeans.png';
import productCoffee from '../../assets/images/dashboard/product-coffee.png';

import orderHeadphones from '../../assets/images/dashboard/order-headphones.png';

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
  const [user, setUser] = useState(getStoredUser());
  const [recentOrders, setRecentOrders] = useState([]);
  const [orderCount, setOrderCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [productsList, setProductsList] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const { lang, t } = useLanguage();
  const tr = t('dashboard');
  const formattedUser = formatUserName(user, lang);
  const userFirstName = formattedUser.firstName;

  useEffect(() => {
    // Fetch logged in user profile
    authApi.me()
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          setWishlistCount(data.user.wishlist?.length || 0);
        }
      })
      .catch(() => {});

    // Fetch user wishlist count if available
    userApi.getWishlist()
      .then((data) => {
        if (data.wishlist) setWishlistCount(data.wishlist.length);
      })
      .catch(() => {});

    // Fetch recent 3 orders
    orderApi.getMyOrders({ limit: 3 })
      .then((data) => {
        if (data.orders && data.orders.length > 0) {
          const mapped = data.orders.map((o) => ({
            id: o.orderNumber || `#${o._id.slice(-6)}`,
            rawId: o._id,
            status: o.status.charAt(0).toUpperCase() + o.status.slice(1),
            statusColor:
              o.status === 'delivered'
                ? 'bg-emerald-100 text-emerald-600'
                : o.status === 'cancelled'
                ? 'bg-red-100 text-red-600'
                : 'bg-amber-100 text-amber-600',
            date: new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            items: `${o.items?.length || 1} item${(o.items?.length || 1) > 1 ? 's' : ''}`,
            amount: `EGP ${o.totalAmount?.toLocaleString()}`,
            action: 'Details',
            thumbs: o.items?.map((item) => item.image).filter(Boolean).length > 0
              ? o.items.map((item) => item.image).filter(Boolean)
              : [orderHeadphones],
          }));
          setRecentOrders(mapped);
        } else {
          setRecentOrders([]);
        }
        setOrderCount(data.pagination?.total || 0);
      })
      .catch(() => {})
      .finally(() => setLoadingOrders(false));

    // Fetch recommended products from DB
    productApi.getProducts({ limit: 4 })
      .then((data) => {
        if (data.products && data.products.length > 0) {
          const mappedProds = data.products.map((p) => ({
            id: p._id,
            name: p.name,
            price: `EGP ${p.price?.toLocaleString()}`,
            originalPrice: p.compareAtPrice ? `EGP ${p.compareAtPrice?.toLocaleString()}` : null,
            rating: p.rating || '4.8',
            image: p.image || p.images?.[0] || productAirpods,
          }));
          setProductsList(mappedProds);
        }
      })
      .catch(() => {});
  }, []);

  const displayProducts = productsList.length > 0 ? productsList : recommendedProducts;
  const loyaltyPts = user?.loyaltyPoints || 0;
  const walletBal = user?.walletBalance || 0;

  const dynamicStats = [
    {
      id: 'orders',
      to: '/account/orders',
      icon: 'bag',
      iconBg: 'bg-indigo-100 text-indigo-500',
      value: orderCount.toString(),
      label: tr?.totalOrders || 'Total Orders',
      note: orderCount > 0 ? (tr?.activeCustomer || 'Active customer') : (tr?.noOrdersYet || 'No orders yet'),
      noteColor: 'text-indigo-500',
    },
    {
      id: 'wishlist',
      to: '/account/wishlist',
      icon: 'heart',
      iconBg: 'bg-rose-100 text-rose-500',
      value: wishlistCount.toString(),
      label: tr?.wishlistItems || 'Wishlist Items',
      note: wishlistCount > 0 ? (typeof tr?.saved === 'function' ? tr.saved(wishlistCount) : `${wishlistCount} saved`) : (tr?.saveItems || 'Save items'),
      noteColor: 'text-[#c53938]',
    },
    {
      id: 'loyalty',
      to: '/account/dashboard',
      icon: 'check',
      iconBg: 'bg-amber-100 text-amber-500',
      value: loyaltyPts.toLocaleString(),
      label: tr?.loyaltyPoints || 'Loyalty Points',
      note: typeof tr?.inRewards === 'function' ? tr.inRewards(Math.floor(loyaltyPts / 10).toLocaleString()) : `= EGP ${Math.floor(loyaltyPts / 10)} in rewards`,
      noteColor: 'text-amber-500',
    },
    {
      id: 'wallet',
      to: '/account/payments',
      icon: 'wallet',
      iconBg: 'bg-emerald-100 text-emerald-500',
      value: `EGP ${walletBal.toLocaleString()}`,
      label: tr?.walletBalance || 'Wallet Balance',
      note: tr?.readyToUse || 'Ready to use',
      noteColor: 'text-emerald-500',
    },
  ];

  const today = useMemo(
    () =>
      new Date().toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
    [lang]
  );
  const [weekday, ...rest] = today.split(lang === 'ar' ? '، ' : ', ');
  const restDate = rest.join(lang === 'ar' ? '، ' : ', ') || today;

  return (
    <div className="flex flex-col gap-5">
      {/* ── Greeting header ── */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-[var(--primary-text)]">
            {typeof tr?.greeting === 'function' ? tr.greeting(userFirstName) : `Good morning, ${userFirstName}!`} <span>👋</span>
          </h1>
          <p className="text-sm text-[var(--secondary-text)]">
            {tr?.greetingSubtitle || "Here's what's happening with your account today."}
          </p>
        </div>
        <div className="text-start ltr:text-right rtl:text-left">
          <p className="text-xs text-[var(--secondary-text)]">{weekday}</p>
          <p className="text-sm font-semibold text-[var(--primary-text)]">{restDate}</p>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {dynamicStats.map((s) => (
          <Link
            key={s.id}
            to={s.to}
            className="group relative rounded-2xl border border-[var(--border-color)] bg-[var(--surface-bg)] p-4 transition duration-200 hover:border-[#c53938]/40 hover:shadow-md cursor-pointer block"
          >
            <div className="mb-4 flex items-start justify-between">
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.iconBg}`}>
                <StatIcon type={s.icon} />
              </span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 group-hover:scale-110 transition-transform">
                <ArrowUpRight />
              </span>
            </div>
            <p className="text-2xl font-bold text-[var(--primary-text)]">{s.value}</p>
            <p className="text-xs text-[var(--secondary-text)]">{s.label}</p>
            <p className={`mt-1 text-xs font-medium ${s.noteColor}`}>{s.note}</p>
          </Link>
        ))}
      </div>

      {/* ── Recent Orders + Loyalty ── */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Recent Orders */}
        <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface-bg)] p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[var(--primary-text)]">{tr?.recentOrders || 'Recent Orders'}</h2>
            <Link to="/account/orders" className="flex items-center gap-1 text-xs font-semibold text-[#c53938] hover:underline">
              {tr?.viewAll || 'View all'}
              <svg className="h-3 w-3 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
              </svg>
            </Link>
          </div>

          {loadingOrders ? (
            <div className="py-8 text-center text-xs text-[var(--secondary-text)]">
              {tr?.loadingOrders || 'Loading recent orders...'}
            </div>
          ) : recentOrders.length > 0 ? (
            <ul className="flex flex-col divide-y divide-[var(--border-color)]">
              {recentOrders.map((o) => (
                <li key={o.id} className="flex items-center gap-3 py-3">
                  <div className="flex -space-x-2">
                    {o.thumbs.slice(0, 3).map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt=""
                        className="h-9 w-9 rounded-full border-2 border-[var(--surface-bg)] object-cover bg-white"
                      />
                    ))}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold text-[var(--primary-text)]">{o.id}</p>
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
                    <Link to="/account/orders" className="text-[11px] font-medium text-[#c53938] hover:underline">
                      {o.action}
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-10 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface-soft)] text-[var(--secondary-text)]">
                <StatIcon type="bag" />
              </div>
              <p className="text-sm font-semibold text-[var(--primary-text)]">{tr?.noOrdersTitle || 'No orders yet'}</p>
              <p className="mt-1 text-xs text-[var(--secondary-text)]">{tr?.noOrdersSubtitle || 'When you place orders, they will show up here.'}</p>
              <Link
                to="/stationery"
                className="mt-4 inline-flex items-center rounded-xl bg-[#c53938] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#a82d2c]"
              >
                {tr?.browseProducts || 'Browse Products'}
              </Link>
            </div>
          )}
        </section>

        {/* Loyalty card */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#c53938] to-[#8f2524] p-5 text-white">
          <span className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10" />
          <span className="pointer-events-none absolute -bottom-12 -right-4 h-28 w-28 rounded-full bg-white/5" />

          <p className="relative text-[11px] font-semibold uppercase tracking-wider opacity-80">
            {tr?.loyaltyPointsCard || 'Loyalty Points'}
          </p>
          <p className="relative mt-1 text-3xl font-bold">{loyaltyPts.toLocaleString()}</p>
          <p className="relative mb-4 text-xs opacity-80">
            {typeof tr?.inRewards === 'function' ? tr.inRewards(Math.floor(loyaltyPts / 10).toLocaleString()) : `= EGP ${Math.floor(loyaltyPts / 10)} in rewards`}
          </p>

          <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-white transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(15, (loyaltyPts / 1000) * 100))}%` }}
            />
          </div>
          <p className="relative mt-2 text-[11px] opacity-80">
            {loyaltyPts >= 1000 ? (tr?.goldMember || 'Gold Member') : (typeof tr?.untilGold === 'function' ? tr.untilGold(1000 - loyaltyPts) : `${1000 - loyaltyPts} pts until Gold tier`)}
          </p>
        </section>
      </div>

      {/* ── Recommended for You ── */}
      <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface-bg)] p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[var(--primary-text)]">{tr?.recommendedForYou || 'Recommended for You'}</h2>
          <Link to="/stationery" className="flex items-center gap-1 text-xs font-semibold text-[#c53938] hover:underline">
            {tr?.browseAll || 'Browse all'}
            <svg className="h-3 w-3 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {displayProducts.map((p) => (
            <Link key={p.id} to="/stationery" className="group flex flex-col">
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
                {p.originalPrice && (
                  <span className="text-xs text-[var(--secondary-text)] line-through">{p.originalPrice}</span>
                )}
              </div>
              <div className="mt-0.5 flex items-center gap-1">
                <StarIcon />
                <span className="text-xs text-[var(--secondary-text)]">{p.rating}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}