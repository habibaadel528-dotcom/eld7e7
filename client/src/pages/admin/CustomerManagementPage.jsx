import { useMemo, useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { X, Mail, Phone, Calendar } from 'lucide-react';
import { adminApi } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

function initials(name) {
  if (!name) return 'U';
  return name
    .split(' ')
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function formatEGP(n) {
  return `EGP ${Number(n || 0).toLocaleString('en-US')}`;
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

/* ── Customer Details Modal ── */
function CustomerDetailsModal({ customerId, onClose, lang }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!customerId) return;
    setLoading(true);
    adminApi.getCustomerById(customerId)
      .then((res) => {
        if (res.success && res.customer) {
          setData(res.customer);
        }
      })
      .catch(() => {
        toast.error(lang === 'ar' ? 'تعذر جلب تفاصيل العميل' : 'Failed to load customer details');
      })
      .finally(() => setLoading(false));
  }, [customerId, lang]);

  if (!customerId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[var(--border-color)] bg-[var(--surface-bg)] p-6 shadow-2xl text-start">
        <button
          type="button"
          onClick={onClose}
          className="absolute ltr:right-4 rtl:left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface-soft)] text-[var(--secondary-text)] hover:text-[var(--primary-text)] cursor-pointer"
        >
          <X size={16} />
        </button>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <svg className="h-6 w-6 animate-spin text-[#c53938]" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"/>
            </svg>
            <p className="text-xs text-[var(--secondary-text)]">
              {lang === 'ar' ? 'جارٍ تحميل بيانات العميل…' : 'Loading customer details…'}
            </p>
          </div>
        ) : data ? (
          <div className="space-y-6">
            {/* Header info */}
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#c53938]/10 text-lg font-bold text-[#c53938]">
                {initials(`${data.firstName} ${data.lastName}`)}
              </span>
              <div>
                <h2 className="text-xl font-bold text-[var(--primary-text)]">
                  {data.firstName} {data.lastName}
                </h2>
                <p className="text-xs text-[var(--secondary-text)]">{data.email}</p>
              </div>
            </div>

            {/* Quick stats badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl border border-[var(--border-color)] bg-[var(--surface-soft)] p-3">
                <p className="text-[11px] text-[var(--secondary-text)]">{lang === 'ar' ? 'إجمالي الطلبات' : 'Total Orders'}</p>
                <p className="text-lg font-bold text-[var(--primary-text)]">{data.ordersCount || 0}</p>
              </div>
              <div className="rounded-xl border border-[var(--border-color)] bg-[var(--surface-soft)] p-3">
                <p className="text-[11px] text-[var(--secondary-text)]">{lang === 'ar' ? 'إجمالي الإنفاق' : 'Total Spent'}</p>
                <p className="text-lg font-bold text-[#c53938]">{formatEGP(data.totalSpent || 0)}</p>
              </div>
              <div className="rounded-xl border border-[var(--border-color)] bg-[var(--surface-soft)] p-3">
                <p className="text-[11px] text-[var(--secondary-text)]">{lang === 'ar' ? 'نقاط الولاء' : 'Loyalty Points'}</p>
                <p className="text-lg font-bold text-amber-600">{data.loyaltyPoints || 0}</p>
              </div>
              <div className="rounded-xl border border-[var(--border-color)] bg-[var(--surface-soft)] p-3">
                <p className="text-[11px] text-[var(--secondary-text)]">{lang === 'ar' ? 'حالة الحساب' : 'Status'}</p>
                <p className={`text-xs font-bold mt-1 ${data.isActive !== false ? 'text-emerald-600' : 'text-slate-500'}`}>
                  {data.isActive !== false ? (lang === 'ar' ? 'نشط' : 'Active') : (lang === 'ar' ? 'معطل' : 'Inactive')}
                </p>
              </div>
            </div>

            {/* Contact details */}
            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--surface-soft)] p-4 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-[var(--primary-text)]">
                <Mail size={14} className="text-[var(--secondary-text)]" />
                <span>{data.email}</span>
              </div>
              {data.phone && (
                <div className="flex items-center gap-2 text-[var(--primary-text)]">
                  <Phone size={14} className="text-[var(--secondary-text)]" />
                  <span>{data.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-[var(--secondary-text)]">
                <Calendar size={14} />
                <span>
                  {lang === 'ar' ? 'تاريخ الانضمام: ' : 'Joined: '}
                  {new Date(data.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { dateStyle: 'medium' })}
                </span>
              </div>
            </div>

            {/* Orders list */}
            <div>
              <h3 className="text-sm font-bold text-[var(--primary-text)] mb-3">
                {lang === 'ar' ? 'سجل طلبات العميل' : 'Customer Orders'} ({data.orders?.length || 0})
              </h3>
              {!data.orders || data.orders.length === 0 ? (
                <p className="text-xs text-[var(--secondary-text)] py-4 text-center">
                  {lang === 'ar' ? 'لا توجد طلبات لهذا العميل بعد.' : 'No orders placed by this customer yet.'}
                </p>
              ) : (
                <div className="divide-y divide-[var(--border-color)] max-h-52 overflow-y-auto rounded-xl border border-[var(--border-color)]">
                  {data.orders.map((ord) => (
                    <div key={ord._id} className="flex items-center justify-between p-3 text-xs bg-[var(--surface-bg)] hover:bg-[var(--surface-soft)] transition">
                      <div>
                        <p className="font-bold text-[var(--primary-text)]">#{ord.orderNumber || ord._id.slice(-6)}</p>
                        <p className="text-[10px] text-[var(--secondary-text)]">
                          {new Date(ord.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · {ord.items?.length || 1} {lang === 'ar' ? 'منتجات' : 'items'}
                        </p>
                      </div>
                      <div className="text-end">
                        <p className="font-bold text-[#c53938]">{formatEGP(ord.totalAmount)}</p>
                        <span className="text-[10px] uppercase font-semibold text-slate-500">
                          {ord.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function CustomerManagementPage() {
  const [customers, setCustomers] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [loading, setLoading] = useState(true);
  const { lang, t } = useLanguage();
  const tr = t('admin').customers;

  const fetchCustomers = useCallback(() => {
    setLoading(true);
    adminApi.getCustomers()
      .then((data) => {
        if (data.customers && data.customers.length > 0) {
          const mapped = data.customers.map((c, i) => ({
            id: c._id,
            name: `${c.firstName || ''} ${c.lastName || ''}`.trim() || 'Customer',
            email: c.email,
            phone: c.phone || 'N/A',
            orders: c.ordersCount ?? 0,
            spent: c.totalSpent ?? 0,
            status: c.isActive !== false ? tr.active : tr.inactive,
            rawIsActive: c.isActive !== false,
            joined: new Date(c.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            color: [
              'bg-rose-100 text-rose-600',
              'bg-amber-100 text-amber-600',
              'bg-emerald-100 text-emerald-600',
              'bg-sky-100 text-sky-600',
              'bg-violet-100 text-violet-600',
            ][i % 5],
          }));
          setCustomers(mapped);
        } else {
          setCustomers([]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [tr.active, tr.inactive, lang]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
    );
  }, [customers, query]);

  const stats = useMemo(() => {
    const total = customers.length;
    const active = customers.filter((c) => c.rawIsActive).length;
    const inactive = total - active;
    const totalOrdersCount = customers.reduce((s, c) => s + (Number(c.orders) || 0), 0);
    const avgOrders = total > 0 ? Math.round(totalOrdersCount / total) : 0;
    return { total, active, inactive, avgOrders };
  }, [customers]);

  const toggleStatus = async (id) => {
    const target = customers.find((c) => c.id === id);
    if (!target) return;
    const nextActive = !target.rawIsActive;

    // Optimistic UI update
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              rawIsActive: nextActive,
              status: nextActive ? tr.active : tr.inactive,
            }
          : c
      )
    );

    try {
      await adminApi.updateCustomer(id, { isActive: nextActive });
      toast.success(
        lang === 'ar'
          ? (nextActive ? 'تم تفعيل حساب العميل' : 'تم تعطيل حساب العميل')
          : (nextActive ? 'Customer account activated' : 'Customer account deactivated')
      );
    } catch (err) {
      // Rollback
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                rawIsActive: !nextActive,
                status: !nextActive ? tr.active : tr.inactive,
              }
            : c
        )
      );
      toast.error(err.message || 'Failed to update customer status');
    }
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
            {loading ? (
              <tr>
                <td colSpan="6" className="px-5 py-8 text-center text-sm text-[var(--secondary-text)]">
                  <div className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4 animate-spin text-[#c53938]" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"/>
                    </svg>
                    <span>{lang === 'ar' ? 'جارٍ تحميل العملاء…' : 'Loading customers…'}</span>
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
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
                <td className="px-5 py-3 font-bold text-[var(--primary-text)]">{c.orders}</td>
                <td className="px-5 py-3 font-bold text-[#c53938]">{formatEGP(c.spent)}</td>
                <td className="px-5 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      c.rawIsActive
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
                    <button
                      type="button"
                      onClick={() => setSelectedCustomerId(c.id)}
                      title={lang === 'ar' ? 'عرض تفاصيل العميل والطلبات' : 'View customer & order history'}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--secondary-text)] transition hover:bg-[var(--surface-soft)] hover:text-[var(--primary-text)] cursor-pointer"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleStatus(c.id)}
                      title={c.rawIsActive ? 'Deactivate customer' : 'Activate customer'}
                      className={`flex h-8 w-8 items-center justify-center rounded-lg transition hover:bg-[var(--surface-soft)] cursor-pointer ${
                        c.rawIsActive ? 'text-emerald-500' : 'text-[var(--secondary-text)]'
                      }`}
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="7" width="20" height="10" rx="5" />
                        <circle cx={c.rawIsActive ? '17' : '7'} cy="12" r="3" fill="currentColor" stroke="none" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Customer Details Modal ── */}
      {selectedCustomerId && (
        <CustomerDetailsModal
          customerId={selectedCustomerId}
          onClose={() => setSelectedCustomerId(null)}
          lang={lang}
        />
      )}
    </div>
  );
}