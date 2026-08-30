import { useMemo, useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

/* ── Mock data — fallback if backend empty ── */
const initialCustomers = [
  { id: 1, name: 'Eman Mohamed', email: 'eman.m@gmail.com', orders: 24, spent: 89420, status: 'Active', joined: 'Jan 12, 2025', color: 'bg-rose-100 text-rose-600' },
  { id: 2, name: 'Ahmed Sayed', email: 'ahmed.s@outlook.com', orders: 8, spent: 42100, status: 'Active', joined: 'Mar 5, 2025', color: 'bg-amber-100 text-amber-600' },
  { id: 3, name: 'Mariam Khalil', email: 'mariam.k@gmail.com', orders: 16, spent: 61240, status: 'Active', joined: 'Feb 18, 2025', color: 'bg-emerald-100 text-emerald-600' },
  { id: 4, name: 'Youssef Hassan', email: 'youssef.h@gmail.com', orders: 5, spent: 18990, status: 'Inactive', joined: 'May 2, 2025', color: 'bg-sky-100 text-sky-600' },
  { id: 5, name: 'Nour El-Din', email: 'nour.e@gmail.com', orders: 11, spent: 35670, status: 'Active', joined: 'Apr 14, 2025', color: 'bg-violet-100 text-violet-600' },
  { id: 6, name: 'Sara Mostafa', email: 'sara.m@yahoo.com', orders: 3, spent: 8920, status: 'Active', joined: 'Jun 1, 2025', color: 'bg-pink-100 text-pink-600' },
  { id: 7, name: 'Omar Fathy', email: 'omar.f@gmail.com', orders: 7, spent: 24500, status: 'Inactive', joined: 'Mar 29, 2025', color: 'bg-orange-100 text-orange-600' },
  { id: 8, name: 'Dina Ramzy', email: 'dina.r@gmail.com', orders: 19, spent: 75300, status: 'Active', joined: 'Jan 30, 2025', color: 'bg-teal-100 text-teal-600' },
];

function initials(name) {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function formatEGP(n) {
  return `EGP ${n.toLocaleString('en-US')}`;
}

/* ── Small icon set ── */
function StatIcon({ type }) {
  const paths = {
    users: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1m18 0v-1a4 4 0 0 0-3-3.87M14 3.13a4 4 0 0 1 0 7.75M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
    ),
    userCheck: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 19v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm7-2 2 2 4-4" />
    ),
    userX: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 19v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm8-6 4 4m0-4-4 4" />
    ),
    bag: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1M12 3v8m-3-3 3-3 3 3" />
    ),
  };
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      {paths[type]}
    </svg>
  );
}

function StatCard({ icon, iconBg, value, label }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[var(--border-color)] bg-[var(--surface-bg)] p-4 text-start">
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${iconBg}`}>
        <StatIcon type={icon} />
      </span>
      <div>
        <p className="text-xl font-bold text-[var(--primary-text)] leading-tight">{value}</p>
        <p className="text-xs text-[var(--secondary-text)]">{label}</p>
      </div>
    </div>
  );
}

export default function CustomerManagementPage() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [query, setQuery] = useState('');
  const { lang, t } = useLanguage();
  const tr = t('admin').customers;

  useEffect(() => {
    adminApi.getCustomers()
      .then((data) => {
        if (data.customers && data.customers.length > 0) {
          const mapped = data.customers.map((c, i) => ({
            id: c._id,
            name: `${c.firstName} ${c.lastName}`,
            email: c.email,
            orders: 0,
            spent: 0,
            status: c.isActive ? tr.active : tr.inactive,
            joined: new Date(c.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            color: ['bg-rose-100 text-rose-600', 'bg-amber-100 text-amber-600', 'bg-emerald-100 text-emerald-600'][i % 3],
          }));
          setCustomers(mapped);
        }
      })
      .catch(() => {});
  }, [tr.active, tr.inactive, lang]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
    );
  }, [customers, query]);

  const stats = useMemo(() => {
    const total = customers.length;
    const active = customers.filter((c) => c.status === tr.active).length;
    const inactive = total - active;
    const avgOrders = Math.round(customers.reduce((s, c) => s + c.orders, 0) / total);
    return { total, active, inactive, avgOrders };
  }, [customers, tr.active]);

  const toggleStatus = (id) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: c.status === tr.active ? tr.inactive : tr.active } : c
      )
    );
  };

  return (
    <div className="flex flex-col gap-5 text-start">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary-text)]">{tr.title}</h1>
          <p className="text-sm text-[var(--secondary-text)]">
            {customers.length} {tr.totalCustomers.toLowerCase()}
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg bg-[#c53938] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 cursor-pointer"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15V3m0 12-4-4m4 4 4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
          </svg>
          {lang === 'ar' ? 'تصدير' : 'Export'}
        </button>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon="users"     iconBg="bg-slate-100 text-slate-600"        value={stats.total}    label={tr.totalCustomers} />
        <StatCard icon="userCheck" iconBg="bg-emerald-100 text-emerald-600"    value={stats.active}   label={tr.activeCustomers} />
        <StatCard icon="userX"     iconBg="bg-slate-100 text-slate-500"        value={stats.inactive} label={tr.inactiveCustomers} />
        <StatCard icon="bag"       iconBg="bg-[#c53938]/10 text-[#c53938]"     value={stats.avgOrders} label={tr.avgOrderValue} />
      </div>

      {/* ── Search ── */}
      <div className="relative max-w-md">
        <svg className="pointer-events-none absolute ltr:left-3.5 rtl:right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--secondary-text)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path strokeLinecap="round" d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={tr.searchPlaceholder}
          className="h-11 w-full rounded-xl border border-[var(--border-color)] bg-[var(--surface-bg)] ltr:pl-10 ltr:pr-4 rtl:pr-10 rtl:pl-4 text-sm text-[var(--primary-text)] placeholder-[var(--secondary-text)] focus:border-[#c53938] focus:outline-none focus:ring-2 focus:ring-[#c53938]/20"
        />
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto rounded-2xl border border-[var(--border-color)] bg-[var(--surface-bg)]">
        <table className="w-full min-w-[720px] text-start text-sm">
          <thead>
            <tr className="border-b border-[var(--border-color)] text-[11px] uppercase tracking-wide text-[var(--secondary-text)]">
              <th className="px-5 py-3 font-medium text-start">{tr.name}</th>
              <th className="px-5 py-3 font-medium text-start">{tr.orders}</th>
              <th className="px-5 py-3 font-medium text-start">{tr.spent}</th>
              <th className="px-5 py-3 font-medium text-start">{tr.status}</th>
              <th className="px-5 py-3 font-medium text-start">{tr.joined}</th>
              <th className="px-5 py-3 text-end font-medium">{lang === 'ar' ? 'إجراءات' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-color)]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-5 py-8 text-center text-sm text-[var(--secondary-text)]">
                  {tr.noResults}
                </td>
              </tr>
            ) : filtered.map((c) => (
              <tr key={c.id} className="transition hover:bg-[var(--surface-soft)]">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${c.color}`}>
                      {initials(c.name)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-[var(--primary-text)]">{c.name}</p>
                      <p className="truncate text-xs text-[var(--secondary-text)]">{c.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-[var(--primary-text)]">{c.orders}</td>
                <td className="px-5 py-3 font-semibold text-[var(--primary-text)]">{formatEGP(c.spent)}</td>
                <td className="px-5 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      c.status === tr.active
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-[var(--secondary-text)]">{c.joined}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button type="button" title="View customer" className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--secondary-text)] transition hover:bg-[var(--surface-soft)] hover:text-[var(--primary-text)] cursor-pointer">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleStatus(c.id)}
                      title={c.status === tr.active ? 'Deactivate customer' : 'Activate customer'}
                      className={`flex h-8 w-8 items-center justify-center rounded-lg transition hover:bg-[var(--surface-soft)] cursor-pointer ${
                        c.status === tr.active ? 'text-emerald-500' : 'text-[var(--secondary-text)]'
                      }`}
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="7" width="20" height="10" rx="5" />
                        <circle cx={c.status === tr.active ? '17' : '7'} cy="12" r="3" fill="currentColor" stroke="none" />
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