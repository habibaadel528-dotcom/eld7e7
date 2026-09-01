import { useMemo, useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { adminApi } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

/* ── AuthenticatedImage: fetches protected images with JWT token ── */
function AuthenticatedImage({ src, alt, className, onError }) {
  const [objectUrl, setObjectUrl] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!src) return;
    let revoked = false;

    const token = localStorage.getItem('authToken');
    fetch(src, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load image');
        return res.blob();
      })
      .then((blob) => {
        if (revoked) return;
        const url = URL.createObjectURL(blob);
        setObjectUrl(url);
      })
      .catch(() => {
        if (!revoked) {
          setFailed(true);
          if (onError) onError();
        }
      });

    return () => {
      revoked = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  if (failed) return null;
  if (!objectUrl) {
    return (
      <div className={`flex items-center justify-center bg-[var(--surface-soft)] ${className || ''}`}>
        <span className="text-xs text-[var(--muted-text)] animate-pulse">Loading image…</span>
      </div>
    );
  }
  return <img src={objectUrl} alt={alt} className={className} />;
}

/* ── Mock data — fallback if backend empty ── */
const initialOrders = [
  { id: 'ELD-7291', customer: 'Eman Mohamed',   email: 'eman.m@gmail.com',    date: 'Jul 28, 2026', items: 3, total: 8499,  payment: 'Cash',          paymentStatus: 'pending',              status: 'Shipped'    },
  { id: 'ELD-7204', customer: 'Ahmed Sayed',     email: 'ahmed.s@outlook.com', date: 'Jul 22, 2026', items: 1, total: 39999, payment: 'InstaPay',       paymentStatus: 'pending_verification', status: 'Processing' },
  { id: 'ELD-7144', customer: 'Mariam Khalil',   email: 'mariam.k@gmail.com',  date: 'Jul 18, 2026', items: 1, total: 28999, payment: 'Vodafone Cash',  paymentStatus: 'paid',                 status: 'Processing' },
  { id: 'ELD-7091', customer: 'Youssef Hassan',  email: 'youssef.h@gmail.com', date: 'Jul 15, 2026', items: 4, total: 12340, payment: 'Cash',          paymentStatus: 'pending',              status: 'Delivered'  },
  { id: 'ELD-6988', customer: 'Nour El-Din',     email: 'nour.e@gmail.com',    date: 'Jul 5, 2026',  items: 2, total: 5899,  payment: 'Cash',          paymentStatus: 'pending',              status: 'Delivered'  },
  { id: 'ELD-6899', customer: 'Sara Mostafa',    email: 'sara.m@yahoo.com',    date: 'Jun 28, 2026', items: 1, total: 3299,  payment: 'InstaPay',       paymentStatus: 'rejected',             status: 'Processing' },
  { id: 'ELD-6712', customer: 'Omar Fathy',      email: 'omar.f@gmail.com',    date: 'Jun 20, 2026', items: 1, total: 3299,  payment: 'Vodafone Cash',  paymentStatus: 'pending_verification', status: 'Processing' },
  { id: 'ELD-6530', customer: 'Dina Ramzy',      email: 'dina.r@gmail.com',    date: 'Jun 8, 2026',  items: 1, total: 24999, payment: 'Cash',          paymentStatus: 'pending',              status: 'Returned'   },
];

const statusStyles = {
  Processing: 'text-sky-600',
  Shipped:    'text-amber-600',
  Delivered:  'text-emerald-600',
  Cancelled:  'text-[#c53938]',
  Returned:   'text-violet-600',
};

function formatEGP(n) { return `EGP ${Number(n || 0).toLocaleString('en-US')}`; }

/* ── Payment Verification Modal ── */
function PaymentVerificationModal({ order, onClose, onVerified, lang }) {
  const [rejectionReason, setRejectionReason] = useState('');
  const [action, setAction]                   = useState('');
  const [loading, setLoading]                 = useState(false);
  const [error, setError]                     = useState('');
  const [proofError, setProofError]           = useState('');

  const proofUrl = order.rawId ? adminApi.getPaymentProofUrl(order.rawId) : null;

  const handleVerify = async () => {
    if (!action) return;
    if (action === 'reject' && !rejectionReason.trim()) {
      setError(lang === 'ar' ? 'يرجى إدخال سبب الرفض.' : 'Please enter a rejection reason.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      if (order.rawId) {
        await adminApi.verifyPayment(order.rawId, {
          action,
          rejectionReason: action === 'reject' ? rejectionReason.trim() : undefined,
        });
      }
      toast.success(action === 'approve' ? (lang === 'ar' ? 'تمت الموافقة على الدفع!' : 'Payment approved!') : (lang === 'ar' ? 'تم رفض الدفع.' : 'Payment rejected.'));
      onVerified(order.id, action);
      onClose();
    } catch (err) {
      setError(err.message || (lang === 'ar' ? 'فشل التحقق من الدفع.' : 'Failed to verify payment.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--surface-bg)] shadow-2xl text-start">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-color)] px-6 py-4">
          <div>
            <h2 className="text-base font-bold text-[var(--primary-text)]">
              {lang === 'ar' ? 'التحقق من إثبات الدفع' : 'Review Payment Proof'}
            </h2>
            <p className="text-xs text-[var(--secondary-text)]">{order.id} · {order.customer}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--secondary-text)] hover:bg-[var(--surface-soft)] hover:text-[var(--primary-text)] cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          {/* Order quick summary */}
          <div className="flex items-center justify-between rounded-xl bg-[var(--surface-soft)] p-3 text-xs">
            <div>
              <span className="text-[var(--secondary-text)]">{lang === 'ar' ? 'المبلغ المطلوب:' : 'Amount:'} </span>
              <span className="font-bold text-[var(--primary-text)]">{formatEGP(order.total)}</span>
            </div>
            <div>
              <span className="text-[var(--secondary-text)]">{lang === 'ar' ? 'الطريقة:' : 'Method:'} </span>
              <span className="font-bold text-[var(--primary-text)]">{order.payment}</span>
            </div>
          </div>

          {/* Proof Screenshot */}
          <div>
            <p className="mb-2 text-xs font-semibold text-[var(--primary-text)]">
              {lang === 'ar' ? 'صورة إيصال التحويل / السكرين شوت:' : 'Transfer Receipt / Screenshot:'}
            </p>
            {proofUrl && !proofError ? (
              <div className="relative overflow-hidden rounded-xl border border-[var(--border-color)] bg-black/5">
                <AuthenticatedImage
                  src={proofUrl}
                  alt="Payment Proof"
                  className="max-h-72 w-full object-contain"
                  onError={() => setProofError(true)}
                />
              </div>
            ) : (
              <div className="flex h-40 flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--border-color)] text-xs text-[var(--secondary-text)]">
                <span>{lang === 'ar' ? 'لا يوجد ملف إثبات دفع مرفق.' : 'No proof file uploaded.'}</span>
              </div>
            )}
          </div>

          {/* Actions: Approve / Reject toggle */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => { setAction('approve'); setError(''); }}
              className={`rounded-xl border-2 px-4 py-3 text-sm font-bold transition cursor-pointer ${
                action === 'approve'
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600'
                  : 'border-[var(--border-color)] text-[var(--secondary-text)] hover:border-emerald-400'
              }`}
            >
              ✓ {lang === 'ar' ? 'قبول وتأكيد الدفع' : 'Approve Payment'}
            </button>
            <button
              type="button"
              onClick={() => { setAction('reject'); setError(''); }}
              className={`rounded-xl border-2 px-4 py-3 text-sm font-bold transition cursor-pointer ${
                action === 'reject'
                  ? 'border-[#c53938] bg-[#c53938]/5 text-[#c53938]'
                  : 'border-[var(--border-color)] text-[var(--secondary-text)] hover:border-[#c53938]/40'
              }`}
            >
              ✕ {lang === 'ar' ? 'رفض الدفع' : 'Reject Payment'}
            </button>
          </div>

          {/* Rejection reason */}
          {action === 'reject' && (
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[var(--primary-text)]">
                {lang === 'ar' ? 'سبب الرفض' : 'Rejection Reason'} <span className="text-[#c53938]">*</span>
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder={lang === 'ar' ? 'مثال: الصورة غير واضحة، المبلغ غير مطابق، لم يتم استلام التحويل...' : 'e.g. Screenshot is blurry, wrong amount transferred, wrong account…'}
                rows={3}
                className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--surface-soft)] px-4 py-3 text-sm text-[var(--primary-text)] outline-none resize-none focus:border-[#c53938] placeholder:text-[var(--muted-text)]"
              />
            </div>
          )}

          {error && (
            <p className="rounded-lg bg-[#c53938]/10 px-3 py-2 text-xs font-medium text-[#c53938]">{error}</p>
          )}

          {/* Confirm button */}
          <button
            type="button"
            onClick={handleVerify}
            disabled={!action || loading}
            className={`flex h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer ${
              action === 'reject' ? 'bg-[#c53938] hover:bg-[#ef5350]' : 'bg-emerald-600 hover:bg-emerald-500'
            }`}
          >
            {loading ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"/>
                </svg>
                {lang === 'ar' ? 'جارٍ المعالجة…' : 'Processing…'}
              </>
            ) : action === 'approve' ? (lang === 'ar' ? 'تأكيد الموافقة' : 'Confirm Approval') : action === 'reject' ? (lang === 'ar' ? 'تأكيد الرفض' : 'Confirm Rejection') : (lang === 'ar' ? 'اختر إجراء أولاً' : 'Select an action first')}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function OrderManagementPage() {
  const [orders, setOrders]           = useState(initialOrders);
  const [query, setQuery]             = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [reviewingOrder, setReviewingOrder] = useState(null);
  const { lang, t } = useLanguage();
  const tr = t('admin').orders;

  const filterTabs = [
    { key: 'All', label: lang === 'ar' ? 'الكل' : 'All' },
    { key: 'Processing', label: tr.processing },
    { key: 'Shipped', label: tr.shipped },
    { key: 'Delivered', label: tr.delivered },
    { key: 'Cancelled', label: lang === 'ar' ? 'ملغي' : 'Cancelled' },
    { key: 'Returned', label: lang === 'ar' ? 'مرتجع' : 'Returned' },
  ];

  const paymentStatusConfig = {
    pending:              { label: lang === 'ar' ? 'قيد الانتظار' : 'Pending', className: 'bg-gray-100 text-gray-600' },
    pending_verification: { label: lang === 'ar' ? 'بانتظار التحقق' : 'Pending Verification', className: 'bg-amber-100 text-amber-700' },
    paid:                 { label: lang === 'ar' ? 'مدفوع' : 'Paid', className: 'bg-emerald-100 text-emerald-700' },
    rejected:             { label: lang === 'ar' ? 'مرفوض' : 'Rejected', className: 'bg-red-100 text-[#c53938]' },
  };

  const fetchOrders = useCallback(() => {
    adminApi.getOrders()
      .then((data) => {
        if (data.orders?.length) {
          const mapped = data.orders.map((o) => ({
            id:            o.orderNumber || `#${o._id.slice(-6)}`,
            rawId:         o._id,
            customer:      o.user ? `${o.user.firstName} ${o.user.lastName}` : o.shippingAddress?.recipientName || 'Guest',
            email:         o.user?.email || 'N/A',
            date:          new Date(o.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            items:         o.items?.length || 1,
            total:         o.totalAmount,
            payment:       o.paymentMethod === 'cash_on_delivery' ? (lang === 'ar' ? 'الدفع عند الاستلام' : 'Cash on Delivery')
                         : o.paymentMethod === 'instapay'         ? 'InstaPay'
                         : o.paymentMethod === 'vodafone_cash'    ? 'Vodafone Cash'
                         : o.paymentMethod,
            rawPaymentMethod: o.paymentMethod,
            paymentStatus: o.paymentStatus || 'pending',
            paymentProof:  o.paymentProof || '',
            status:        o.status.charAt(0).toUpperCase() + o.status.slice(1),
          }));
          setOrders(mapped);
        }
      })
      .catch(() => {});
  }, [lang]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const updateStatus = async (id, status) => {
    const target = orders.find((o) => o.id === id);
    const isCod = target?.rawPaymentMethod === 'cash_on_delivery' || target?.payment === 'Cash on Delivery' || target?.payment === 'الدفع عند الاستلام' || target?.payment === 'Cash';
    const autoPaid = status.toLowerCase() === 'delivered' && isCod;

    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status, ...(autoPaid ? { paymentStatus: 'paid' } : {}) } : o))
    );

    if (target?.rawId) {
      try {
        const res = await adminApi.updateOrderStatus(target.rawId, status.toLowerCase());
        if (res?.order?.paymentStatus) {
          setOrders((prev) =>
            prev.map((o) => (o.id === id ? { ...o, status, paymentStatus: res.order.paymentStatus } : o))
          );
        }
      } catch {
        // keep optimistic update
      }
    }
  };

  const handleVerified = (orderId, action) => {
    setOrders((prev) => prev.map((o) => {
      if (o.id !== orderId) return o;
      return {
        ...o,
        paymentStatus: action === 'approve' ? 'paid' : 'rejected',
        status:        action === 'approve' ? 'Processing' : o.status,
      };
    }));
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      const matchesFilter = activeFilter === 'All' || o.status === activeFilter;
      const matchesQuery  = !q || o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [orders, query, activeFilter]);

  const pendingVerificationCount = orders.filter((o) => o.paymentStatus === 'pending_verification').length;

  return (
    <div className="flex flex-col gap-5 text-start">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary-text)]">{tr.title}</h1>
          <p className="text-sm text-[var(--secondary-text)]">
            {orders.length} {lang === 'ar' ? 'إجمالي الطلبات' : 'total orders'}
            {pendingVerificationCount > 0 && (
              <span className="mx-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">
                {pendingVerificationCount} {lang === 'ar' ? 'طلبات بانتظار مراجعة الدفع' : 'pending payment review'}
              </span>
            )}
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg bg-[#c53938] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 cursor-pointer"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15V3m0 12-4-4m4 4 4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
          </svg>
          {lang === 'ar' ? 'تصدير CSV' : 'Export CSV'}
        </button>
      </div>

      {/* ── Search + filters ── */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[240px] flex-1">
          <svg className="pointer-events-none absolute ltr:left-3.5 rtl:right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--secondary-text)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" /><path strokeLinecap="round" d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={tr.searchPlaceholder}
            className="h-11 w-full rounded-xl border border-[var(--border-color)] bg-[var(--surface-bg)] ltr:pl-10 ltr:pr-4 rtl:pr-10 rtl:pl-4 text-sm text-[var(--primary-text)] placeholder-[var(--secondary-text)] focus:border-[#c53938] focus:outline-none focus:ring-2 focus:ring-[#c53938]/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveFilter(tab.key)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition cursor-pointer ${
                activeFilter === tab.key
                  ? 'bg-[#c53938] text-white'
                  : 'border border-[var(--border-color)] bg-[var(--surface-bg)] text-[var(--secondary-text)] hover:text-[var(--primary-text)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto rounded-2xl border border-[var(--border-color)] bg-[var(--surface-bg)]">
        <table className="w-full min-w-[960px] text-start text-sm">
          <thead>
            <tr className="border-b border-[var(--border-color)] text-[11px] uppercase tracking-wide text-[var(--secondary-text)]">
              <th className="px-5 py-3 font-medium text-start">{tr.orderId}</th>
              <th className="px-5 py-3 font-medium text-start">{tr.customer}</th>
              <th className="px-5 py-3 font-medium text-start">{tr.date}</th>
              <th className="px-5 py-3 font-medium text-start">{lang === 'ar' ? 'العناصر' : 'Items'}</th>
              <th className="px-5 py-3 font-medium text-start">{tr.amount}</th>
              <th className="px-5 py-3 font-medium text-start">{lang === 'ar' ? 'طريقة الدفع' : 'Payment'}</th>
              <th className="px-5 py-3 font-medium text-start">{lang === 'ar' ? 'حالة الدفع' : 'Payment Status'}</th>
              <th className="px-5 py-3 font-medium text-start">{tr.status}</th>
              <th className="px-5 py-3 text-end font-medium">{tr.action}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-color)]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="9" className="px-5 py-8 text-center text-sm text-[var(--secondary-text)]">
                  {tr.noResults}
                </td>
              </tr>
            ) : filtered.map((o) => {
              const ps = paymentStatusConfig[o.paymentStatus] || paymentStatusConfig.pending;
              const needsReview = o.paymentStatus === 'pending_verification' && o.rawId;

              return (
                <tr key={o.id} className={`transition hover:bg-[var(--surface-soft)] ${needsReview ? 'bg-amber-50/30' : ''}`}>
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
                    <span className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-bold ${ps.className}`}>
                      {ps.label}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="relative inline-block">
                      <select
                        value={o.status}
                        onChange={(e) => updateStatus(o.id, e.target.value)}
                        className={`appearance-none rounded-lg border border-[var(--border-color)] bg-transparent py-1.5 ltr:pl-2.5 ltr:pr-7 rtl:pr-2.5 rtl:pl-7 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#c53938]/20 ${statusStyles[o.status]}`}
                      >
                        {Object.keys(statusStyles).map((s) => (
                          <option key={s} value={s} className="text-[var(--primary-text)]">{s}</option>
                        ))}
                      </select>
                      <svg className="pointer-events-none absolute ltr:right-2 rtl:left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
                      </svg>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {needsReview && (
                        <button
                          type="button"
                          title="Review payment proof"
                          onClick={() => setReviewingOrder(o)}
                          className="flex items-center gap-1.5 rounded-lg bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-700 transition hover:bg-amber-200 cursor-pointer"
                        >
                          🔍 {lang === 'ar' ? 'مراجعة' : 'Review'}
                        </button>
                      )}

                      <button
                        type="button"
                        title="View order"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--secondary-text)] transition hover:bg-[var(--surface-soft)] hover:text-[var(--primary-text)] cursor-pointer"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Payment Verification Modal ── */}
      {reviewingOrder && (
        <PaymentVerificationModal
          order={reviewingOrder}
          onClose={() => setReviewingOrder(null)}
          onVerified={handleVerified}
          lang={lang}
        />
      )}
    </div>
  );
}