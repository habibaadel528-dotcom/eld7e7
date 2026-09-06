import { useMemo, useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { X, Mail, Phone, Calendar, UserPlus, Search, Download, Users } from 'lucide-react';
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

/* ── Add Customer Modal ── */
function AddCustomerModal({ onClose, onCreated, lang }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');
  const [email, setEmail]         = useState('');
  const [phone, setPhone]         = useState('');
  const [password, setPassword]   = useState('');
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setError(lang === 'ar' ? 'يرجى إدخال الاسم الأول والأخير والبريد الإلكتروني.' : 'Please fill in first name, last name, and email.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await adminApi.createCustomer({
        firstName: firstName.trim(),
        lastName:  lastName.trim(),
        email:     email.trim(),
        phone:     phone.trim(),
        password:  password.trim() || 'Customer@123456',
      });

      const newCust = res?.customer || {
        id: `cust-${Date.now()}`,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        name: `${firstName.trim()} ${lastName.trim()}`,
        email: email.trim(),
        phone: phone.trim() || 'N/A',
        orders: 0,
        spent: 0,
        status: lang === 'ar' ? 'نشط' : 'Active',
        rawIsActive: true,
        joined: new Date().toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        color: 'bg-emerald-100 text-emerald-600',
      };

      toast.success(lang === 'ar' ? 'تمت إضافة العميل بنجاح في قاعدة البيانات!' : 'Customer added to database successfully!');
      onCreated(newCust);
      onClose();
    } catch (err) {
      setError(err.message || (lang === 'ar' ? 'فشل إضافة العميل.' : 'Failed to add customer.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-md rounded-2xl border border-[var(--border-color)] bg-[var(--surface-bg)] p-6 shadow-2xl text-start">
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)]">
          <h2 className="text-base font-bold text-[var(--primary-text)] flex items-center gap-2">
            <UserPlus size={18} className="text-[#c53938]" />
            {lang === 'ar' ? 'إضافة عميل جديد' : 'Add New Customer'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--secondary-text)] hover:bg-[var(--surface-soft)] cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          {error && (
            <p className="rounded-lg bg-[#c53938]/10 px-3 py-2 text-xs font-medium text-[#c53938]">{error}</p>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-[var(--primary-text)]">
                {lang === 'ar' ? 'الاسم الأول' : 'First Name'} <span className="text-[#c53938]">*</span>
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder={lang === 'ar' ? 'مثال: أحمد' : 'e.g. Ahmed'}
                className="h-10 w-full rounded-xl border border-[var(--border-color)] bg-[var(--surface-soft)] px-3 text-xs text-[var(--primary-text)] outline-none focus:border-[#c53938]"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[var(--primary-text)]">
                {lang === 'ar' ? 'الاسم الأخير' : 'Last Name'} <span className="text-[#c53938]">*</span>
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder={lang === 'ar' ? 'مثال: علي' : 'e.g. Ali'}
                className="h-10 w-full rounded-xl border border-[var(--border-color)] bg-[var(--surface-soft)] px-3 text-xs text-[var(--primary-text)] outline-none focus:border-[#c53938]"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-[var(--primary-text)]">
              {lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'} <span className="text-[#c53938]">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="customer@example.com"
              className="h-10 w-full rounded-xl border border-[var(--border-color)] bg-[var(--surface-soft)] px-3 text-xs text-[var(--primary-text)] outline-none focus:border-[#c53938]"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-[var(--primary-text)]">
              {lang === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+20 100 000 0000"
              className="h-10 w-full rounded-xl border border-[var(--border-color)] bg-[var(--surface-soft)] px-3 text-xs text-[var(--primary-text)] outline-none focus:border-[#c53938]"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-[var(--primary-text)]">
              {lang === 'ar' ? 'كلمة المرور (اختياري)' : 'Password (optional)'}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="•••••••• (Default: Customer@123456)"
              className="h-10 w-full rounded-xl border border-[var(--border-color)] bg-[var(--surface-soft)] px-3 text-xs text-[var(--primary-text)] outline-none focus:border-[#c53938]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#c53938] text-sm font-bold text-white transition hover:bg-[#b72f30] disabled:opacity-50 cursor-pointer shadow-md"
          >
            {loading ? (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"/>
              </svg>
            ) : (
              <>{lang === 'ar' ? 'حفظ العميل في قاعدة البيانات' : 'Save Customer to Database'}</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ── Customer Details Modal ── */
function CustomerDetailsModal({ customer, customerId, onClose, lang }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!customerId) return;
    setLoading(true);
    adminApi.getCustomerById(customerId)
      .then((res) => {
        if (res.success && res.customer) {
          setData(res.customer);
        } else if (customer) {
          setData(customer);
        }
      })
      .catch(() => {
        if (customer) {
          setData(customer);
        } else {
          toast.error(lang === 'ar' ? 'تعذر جلب تفاصيل العميل' : 'Failed to load customer details');
        }
      })
      .finally(() => setLoading(false));
  }, [customerId, customer, lang]);

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
                {initials(data.name || `${data.firstName || ''} ${data.lastName || ''}`)}
              </span>
              <div>
                <h2 className="text-xl font-bold text-[var(--primary-text)]">
                  {data.name || `${data.firstName || ''} ${data.lastName || ''}`}
                </h2>
                <p className="text-xs text-[var(--secondary-text)]">{data.email}</p>
              </div>
            </div>

            {/* Quick stats badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl border border-[var(--border-color)] bg-[var(--surface-soft)] p-3">
                <p className="text-[11px] text-[var(--secondary-text)]">{lang === 'ar' ? 'إجمالي الطلبات' : 'Total Orders'}</p>
                <p className="text-lg font-bold text-[var(--primary-text)]">{data.ordersCount ?? (Array.isArray(data.orders) ? data.orders.length : (data.orders || 0))}</p>
              </div>
              <div className="rounded-xl border border-[var(--border-color)] bg-[var(--surface-soft)] p-3">
                <p className="text-[11px] text-[var(--secondary-text)]">{lang === 'ar' ? 'إجمالي الإنفاق' : 'Total Spent'}</p>
                <p className="text-lg font-bold text-[#c53938]">{formatEGP(data.totalSpent ?? data.spent ?? 0)}</p>
              </div>
              <div className="rounded-xl border border-[var(--border-color)] bg-[var(--surface-soft)] p-3">
                <p className="text-[11px] text-[var(--secondary-text)]">{lang === 'ar' ? 'نقاط الولاء' : 'Loyalty Points'}</p>
                <p className="text-lg font-bold text-amber-600">{data.loyaltyPoints || 0}</p>
              </div>
              <div className="rounded-xl border border-[var(--border-color)] bg-[var(--surface-soft)] p-3">
                <p className="text-[11px] text-[var(--secondary-text)]">{lang === 'ar' ? 'حالة الحساب' : 'Status'}</p>
                <p className={`text-xs font-bold mt-1 ${data.isActive !== false && data.rawIsActive !== false ? 'text-emerald-600' : 'text-slate-500'}`}>
                  {data.isActive !== false && data.rawIsActive !== false ? (lang === 'ar' ? 'نشط' : 'Active') : (lang === 'ar' ? 'معطل' : 'Inactive')}
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
                  {data.joined || (data.createdAt ? new Date(data.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { dateStyle: 'medium' }) : 'N/A')}
                </span>
              </div>
            </div>

            {/* Orders list */}
            <div>
              <h3 className="text-sm font-bold text-[var(--primary-text)] mb-3">
                {lang === 'ar' ? 'سجل طلبات العميل' : 'Customer Orders'} ({Array.isArray(data.orders) ? data.orders.length : (data.ordersCount || 0)})
              </h3>
              {!data.orders || (Array.isArray(data.orders) && data.orders.length === 0) ? (
                <p className="text-xs text-[var(--secondary-text)] py-4 text-center">
                  {lang === 'ar' ? 'لا توجد طلبات لهذا العميل بعد.' : 'No orders recorded for this customer yet.'}
                </p>
              ) : Array.isArray(data.orders) ? (
                <div className="divide-y divide-[var(--border-color)] max-h-52 overflow-y-auto rounded-xl border border-[var(--border-color)]">
                  {data.orders.map((ord) => (
                    <div key={ord._id || ord.id} className="flex items-center justify-between p-3 text-xs bg-[var(--surface-bg)] hover:bg-[var(--surface-soft)] transition">
                      <div>
                        <p className="font-bold text-[var(--primary-text)]">#{ord.orderNumber || ord._id?.slice(-6) || 'ELD-ORD'}</p>
                        <p className="text-[10px] text-[var(--secondary-text)]">
                          {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'} · {ord.items?.length || 1} {lang === 'ar' ? 'منتجات' : 'items'}
                        </p>
                      </div>
                      <div className="text-end">
                        <p className="font-bold text-[#c53938]">{formatEGP(ord.totalAmount || ord.total || 0)}</p>
                        <span className="text-[10px] uppercase font-semibold text-slate-500">
                          {ord.status || 'Completed'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
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
  const [selectedCustomerObj, setSelectedCustomerObj] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const { lang, t } = useLanguage();
  const tr = t('admin').customers;

  const COLORS = [
    'bg-rose-100 text-rose-600',
    'bg-amber-100 text-amber-600',
    'bg-emerald-100 text-emerald-600',
    'bg-sky-100 text-sky-600',
    'bg-violet-100 text-violet-600',
  ];

  const mapCustomer = (c, i) => ({
    id: c._id || c.id || `cust-${i}`,
    name: `${c.firstName || ''} ${c.lastName || ''}`.trim() || c.name || 'Customer',
    firstName: c.firstName,
    lastName: c.lastName,
    email: c.email || '',
    phone: c.phone || 'N/A',
    orders: c.ordersCount ?? 0,
    spent: c.totalSpent ?? 0,
    status: c.isActive !== false ? (lang === 'ar' ? 'نشط' : 'Active') : (lang === 'ar' ? 'معطل' : 'Inactive'),
    rawIsActive: c.isActive !== false,
    loyaltyPoints: c.loyaltyPoints || 0,
    joined: c.createdAt
      ? new Date(c.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : 'N/A',
    color: COLORS[i % 5],
  });

  const fetchCustomers = useCallback(() => {
    setLoading(true);
    setApiError(null);

    // Fetch both endpoints in parallel
    Promise.allSettled([
      adminApi.getCustomers({ limit: 100 }),
      adminApi.getOrders({ limit: 200 }),
    ]).then(([custResult, ordResult]) => {
      const customerMap = new Map();

      // 1. Add from /customers endpoint (most complete user data)
      if (custResult.status === 'fulfilled' && custResult.value?.customers?.length > 0) {
        custResult.value.customers.forEach((c, i) => {
          const key = c._id || c.email;
          if (key) customerMap.set(key, mapCustomer(c, i));
        });
      }

      // 2. Derive customers from /orders — catches anyone who ordered
      if (ordResult.status === 'fulfilled' && ordResult.value?.orders?.length > 0) {
        const ordersByCustomer = {};
        ordResult.value.orders.forEach((ord) => {
          const custId = ord.user?._id || ord.user || ord.customer?._id || ord.customer;
          const custEmail = ord.customer?.email || ord.user?.email || ord.customerEmail;
          const custName = ord.customer?.name || `${ord.customer?.firstName || ''} ${ord.customer?.lastName || ''}`.trim() || ord.customerName;
          const key = custId || custEmail;
          if (!key) return;

          if (!ordersByCustomer[key]) {
            ordersByCustomer[key] = {
              _id: custId,
              email: custEmail,
              name: custName,
              firstName: ord.customer?.firstName || ord.user?.firstName || '',
              lastName: ord.customer?.lastName || ord.user?.lastName || '',
              phone: ord.customer?.phone || ord.user?.phone || 'N/A',
              isActive: true,
              createdAt: ord.createdAt,
              ordersCount: 0,
              totalSpent: 0,
            };
          }
          ordersByCustomer[key].ordersCount += 1;
          if (ord.status !== 'cancelled') {
            ordersByCustomer[key].totalSpent += ord.totalAmount || 0;
          }
          // Use earliest order date as joined date
          if (ord.createdAt && new Date(ord.createdAt) < new Date(ordersByCustomer[key].createdAt)) {
            ordersByCustomer[key].createdAt = ord.createdAt;
          }
        });

        // Merge order-derived customers into map (only add new ones, don't overwrite existing)
        const existingCount = customerMap.size;
        Object.values(ordersByCustomer).forEach((c, i) => {
          const key = c._id || c.email;
          if (key && !customerMap.has(key)) {
            customerMap.set(key, mapCustomer(c, existingCount + i));
          }
        });
      }

      if (customerMap.size > 0) {
        // Sort by joined date descending (newest first)
        const sorted = Array.from(customerMap.values()).sort((a, b) => {
          if (a.joined === 'N/A') return 1;
          if (b.joined === 'N/A') return -1;
          return new Date(b.joined) - new Date(a.joined);
        });
        setCustomers(sorted);
        setApiError(null);
      } else {
        // Both failed or truly empty
        const err = custResult.reason || ordResult.reason;
        if (err) {
          setApiError(err.message || 'Failed to load customers');
        }
        setCustomers([]);
      }

      setLoading(false);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleCustomerCreated = () => {
    fetchCustomers();
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.phone && c.phone.includes(q))
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
              status: nextActive ? (lang === 'ar' ? 'نشط' : 'Active') : (lang === 'ar' ? 'معطل' : 'Inactive'),
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
      toast.error(err.message || 'Failed to update customer status');
      fetchCustomers();
    }
  };

  const handleExportCSV = () => {
    if (customers.length === 0) {
      toast.error(lang === 'ar' ? 'لا يوجد عملاء لتصديرهم' : 'No customers to export');
      return;
    }
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Orders Count', 'Total Spent', 'Status', 'Joined Date'];
    const rows = customers.map((c) => [
      c.id,
      `"${c.name}"`,
      c.email,
      `"${c.phone}"`,
      c.orders,
      c.spent,
      c.status,
      `"${c.joined}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `real_customers_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(lang === 'ar' ? 'تم تصدير بيانات العملاء كملف CSV' : 'Customers exported to CSV successfully');
  };

  return (
    <div className="flex flex-col gap-5 text-start">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary-text)]">{tr.title}</h1>
          <p className="text-sm text-[var(--secondary-text)]">
            {customers.length} {lang === 'ar' ? 'عملاء مسجلين في قاعدة البيانات' : 'customers in database'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-lg bg-[#c53938] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#b72f30] cursor-pointer shadow-sm"
          >
            <UserPlus size={16} />
            {lang === 'ar' ? 'إضافة عميل' : 'Add Customer'}
          </button>
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-2 rounded-lg border border-[var(--border-color)] bg-[var(--surface-bg)] px-3.5 py-2.5 text-sm font-semibold text-[var(--primary-text)] transition hover:bg-[var(--surface-soft)] cursor-pointer"
          >
            <Download size={16} />
            {lang === 'ar' ? 'تصدير CSV' : 'Export CSV'}
          </button>
        </div>
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
        <Search className="pointer-events-none absolute ltr:left-3.5 rtl:right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--secondary-text)]" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={lang === 'ar' ? 'ابحث بالاسم أو البريد الإلكتروني أو رقم الهاتف...' : tr.searchPlaceholder}
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
                <td colSpan="6" className="px-5 py-10 text-center text-sm text-[var(--secondary-text)]">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <svg className="h-6 w-6 animate-spin text-[#c53938]" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"/>
                    </svg>
                    <span className="text-xs font-semibold">{lang === 'ar' ? 'جارٍ تحميل العملاء من قاعدة البيانات…' : 'Loading customers from database…'}</span>
                  </div>
                </td>
              </tr>
            ) : apiError ? (
              <tr>
                <td colSpan="6" className="px-5 py-12 text-center text-sm">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#c53938]/10 text-[#c53938]">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" /></svg>
                    </div>
                    <div>
                      <p className="font-bold text-[var(--primary-text)]">
                        {lang === 'ar' ? 'تعذر تحميل العملاء' : 'Failed to load customers'}
                      </p>
                      <p className="text-xs text-[var(--secondary-text)] mt-1">{apiError}</p>
                      <button
                        type="button"
                        onClick={fetchCustomers}
                        className="mt-3 rounded-lg bg-[#c53938] px-4 py-2 text-xs font-semibold text-white hover:bg-[#b72f30] cursor-pointer"
                      >
                        {lang === 'ar' ? 'إعادة المحاولة' : 'Retry'}
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-5 py-12 text-center text-sm text-[var(--secondary-text)]">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface-soft)] text-[var(--secondary-text)]">
                      <Users size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-[var(--primary-text)]">
                        {query
                          ? (lang === 'ar' ? 'لا نتائج تطابق بحثك' : 'No results match your search')
                          : (lang === 'ar' ? 'لا يوجد عملاء مسجلين بعد' : 'No registered customers yet')}
                      </p>
                      <p className="text-xs text-[var(--secondary-text)] mt-1">
                        {query
                          ? (lang === 'ar' ? 'جرب بحثاً مختلفاً' : 'Try a different search term')
                          : (lang === 'ar' ? 'بمجرد تسجيل أي عميل في الموقع سيظهر هنا تلقائياً.' : 'Once any customer creates an account on the website, they will appear here automatically.')}
                      </p>
                    </div>
                  </div>
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
                      onClick={() => {
                        setSelectedCustomerId(c.id);
                        setSelectedCustomerObj(c);
                      }}
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

      {/* ── Add Customer Modal ── */}
      {showAddModal && (
        <AddCustomerModal
          onClose={() => setShowAddModal(false)}
          onCreated={handleCustomerCreated}
          lang={lang}
        />
      )}

      {/* ── Customer Details Modal ── */}
      {selectedCustomerId && (
        <CustomerDetailsModal
          customer={selectedCustomerObj}
          customerId={selectedCustomerId}
          onClose={() => {
            setSelectedCustomerId(null);
            setSelectedCustomerObj(null);
          }}
          lang={lang}
        />
      )}
    </div>
  );
}