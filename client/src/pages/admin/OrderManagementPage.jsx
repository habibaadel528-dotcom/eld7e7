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
  { id: 'ELD-7291', customer: 'Eman Mohamed',   email: 'eman.m@gmail.com',    date: 'Jul 28, 2026', items: 3, total: 8499,  payment: 'Cash',          paymentStatus: 'paid',    status: 'Shipped'    },
  { id: 'ELD-7204', customer: 'Ahmed Sayed',     email: 'ahmed.s@outlook.com', date: 'Jul 22, 2026', items: 1, total: 39999, payment: 'InstaPay',       paymentStatus: 'pending', status: 'Processing' },
  { id: 'ELD-7144', customer: 'Mariam Khalil',   email: 'mariam.k@gmail.com',  date: 'Jul 18, 2026', items: 1, total: 28999, payment: 'Vodafone Cash',  paymentStatus: 'pending', status: 'Processing' },
  { id: 'ELD-7091', customer: 'Youssef Hassan',  email: 'youssef.h@gmail.com', date: 'Jul 15, 2026', items: 4, total: 12340, payment: 'Cash',          paymentStatus: 'paid',    status: 'Delivered'  },
  { id: 'ELD-6988', customer: 'Nour El-Din',     email: 'nour.e@gmail.com',    date: 'Jul 5, 2026',  items: 2, total: 5899,  payment: 'Cash',          paymentStatus: 'paid',    status: 'Delivered'  },
  { id: 'ELD-6899', customer: 'Sara Mostafa',    email: 'sara.m@yahoo.com',    date: 'Jun 28, 2026', items: 1, total: 3299,  payment: 'InstaPay',       paymentStatus: 'rejected',status: 'Processing' },
  { id: 'ELD-6712', customer: 'Omar Fathy',      email: 'omar.f@gmail.com',    date: 'Jun 20, 2026', items: 1, total: 3299,  payment: 'Vodafone Cash',  paymentStatus: 'pending', status: 'Processing' },
  { id: 'ELD-6530', customer: 'Dina Ramzy',      email: 'dina.r@gmail.com',    date: 'Jun 8, 2026',  items: 1, total: 24999, payment: 'Cash',          paymentStatus: 'pending', status: 'Returned'   },
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
  const [action, setAction]                   = useState('reject');
  const [loading, setLoading]                 = useState(false);
  const [error, setError]                     = useState('');
  const [proofError, setProofError]           = useState(false);

  const hasProof = Boolean(order.paymentProof);
  const proofUrl = order.rawId && hasProof ? adminApi.getPaymentProofUrl(order.rawId) : null;

  const quickReasons = lang === 'ar' ? [
    'لم يتم إرسال إثبات الدفع / سكرين شوت',
    'المبلغ المحول غير مطابق لقيمة الطلب',
    'لم يتم استلام أي تحويل على المحفظة / الحساب',
    'صورة الإيصال غير واضحة أو غير مقروءة',
    'التحويل تم إلى حساب / رقم خاطئ',
  ] : [
    'No payment screenshot / proof attached',
    'Transferred amount does not match order total',
    'Payment not received in wallet / bank account',
    'Screenshot is blurry or unreadable',
    'Transferred to wrong account or number',
  ];

  const handleVerify = async () => {
    if (!action) return;
    const finalReason = action === 'reject' 
      ? (rejectionReason.trim() || (lang === 'ar' ? 'لم يتم إرسال إثبات الدفع أو الإيصال غير صالح' : 'Payment proof missing or invalid'))
      : undefined;

    setLoading(true);
    setError('');
    try {
      if (order.rawId) {
        await adminApi.verifyPayment(order.rawId, {
          action,
          rejectionReason: finalReason,
        });
      }
      toast.success(
        action === 'approve'
          ? (lang === 'ar' ? 'تمت الموافقة على الدفع بنجاح!' : 'Payment approved successfully!')
          : (lang === 'ar' ? 'تم رفض الدفع وتحديث حالة الطلب.' : 'Payment rejected successfully.')
      );
      onVerified(order.id, action, finalReason);
      onClose();
    } catch (err) {
      setError(err.message || (lang === 'ar' ? 'فشل التحقق من الدفع.' : 'Failed to process payment verification.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--surface-bg)] shadow-2xl text-start">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-color)] px-6 py-4">
          <div>
            <h2 className="text-base font-bold text-[var(--primary-text)]">
              {lang === 'ar' ? 'التحقق من إثبات الدفع (Vodafone Cash / InstaPay)' : 'Review Payment Proof'}
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
          <div className="flex items-center justify-between rounded-xl bg-[var(--surface-soft)] p-3.5 text-xs border border-[var(--border-color)]">
            <div>
              <span className="text-[var(--secondary-text)]">{lang === 'ar' ? 'المبلغ المطلوب:' : 'Amount:'} </span>
              <span className="font-bold text-[var(--primary-text)] text-sm">{formatEGP(order.total)}</span>
            </div>
            <div>
              <span className="text-[var(--secondary-text)]">{lang === 'ar' ? 'الطريقة:' : 'Method:'} </span>
              <span className="font-bold text-[#c53938]">{order.payment}</span>
            </div>
          </div>

          {/* Proof Screenshot Section */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold text-[var(--primary-text)]">
                {lang === 'ar' ? 'صورة إيصال التحويل / السكرين شوت:' : 'Transfer Receipt / Screenshot:'}
              </p>
              {!hasProof && (
                <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-[10px] font-bold text-[#c53938]">
                  {lang === 'ar' ? '⚠️ العميل لم يرفع سكرين شوت' : '⚠️ No screenshot uploaded'}
                </span>
              )}
            </div>

            {hasProof && proofUrl && !proofError ? (
              <div className="relative overflow-hidden rounded-xl border border-[var(--border-color)] bg-black/5">
                <AuthenticatedImage
                  src={proofUrl}
                  alt="Payment Proof"
                  className="max-h-64 w-full object-contain"
                  onError={() => setProofError(true)}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-red-200 bg-red-50/40 p-6 text-center text-xs text-[var(--secondary-text)]">
                <svg className="mb-2 h-8 w-8 text-[#c53938]/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="font-semibold text-[var(--primary-text)]">
                  {lang === 'ar' ? 'لا يوجد ملف إثبات دفع مرفق من العميل' : 'No proof screenshot uploaded by customer'}
                </p>
                <p className="mt-1 text-[11px] text-[var(--secondary-text)]">
                  {lang === 'ar' ? 'يمكنك رفض الطلب مباشرة وتحديد سبب الرفض ليتم إشعار العميل فوراً.' : 'You can reject the payment directly and provide a reason to notify the client.'}
                </p>
              </div>
            )}
          </div>

          {/* Actions: Reject / Approve toggle */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={() => { setAction('reject'); setError(''); }}
              className={`rounded-xl border-2 px-4 py-3 text-sm font-bold transition cursor-pointer flex items-center justify-center gap-2 ${
                action === 'reject'
                  ? 'border-[#c53938] bg-[#c53938]/10 text-[#c53938]'
                  : 'border-[var(--border-color)] text-[var(--secondary-text)] hover:border-[#c53938]/40'
              }`}
            >
              ✕ {lang === 'ar' ? 'رفض الدفع (Reject)' : 'Reject Payment'}
            </button>
            <button
              type="button"
              onClick={() => { setAction('approve'); setError(''); }}
              className={`rounded-xl border-2 px-4 py-3 text-sm font-bold transition cursor-pointer flex items-center justify-center gap-2 ${
                action === 'approve'
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600'
                  : 'border-[var(--border-color)] text-[var(--secondary-text)] hover:border-emerald-400'
              }`}
            >
              ✓ {lang === 'ar' ? 'قبول وتأكيد الدفع' : 'Approve Payment'}
            </button>
          </div>

          {/* Rejection reason & quick chips */}
          {action === 'reject' && (
            <div className="space-y-2.5">
              <label className="block text-xs font-semibold text-[var(--primary-text)]">
                {lang === 'ar' ? 'سبب الرفض / ملاحظات (Rejection Notes):' : 'Rejection Reason / Notes:'}
              </label>

              {/* Quick Preset Chips */}
              <div className="flex flex-wrap gap-1.5">
                {quickReasons.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setRejectionReason(chip)}
                    className={`rounded-lg border px-2.5 py-1 text-[11px] font-medium transition cursor-pointer text-start ${
                      rejectionReason === chip
                        ? 'border-[#c53938] bg-[#c53938] text-white'
                        : 'border-[var(--border-color)] bg-[var(--surface-soft)] text-[var(--secondary-text)] hover:border-[#c53938]/40 hover:text-[var(--primary-text)]'
                    }`}
                  >
                    {chip}
                  </button>
                ))}
              </div>

              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder={lang === 'ar' ? 'اكتب ملاحظات الرفض أو اختر من الأسباب السريعة بالأعلى...' : 'Type rejection notes or select a preset reason above…'}
                rows={3}
                className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--surface-soft)] px-3.5 py-2.5 text-xs text-[var(--primary-text)] outline-none resize-none focus:border-[#c53938] placeholder:text-[var(--muted-text)]"
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
            className={`flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer shadow-md ${
              action === 'reject' ? 'bg-[#c53938] hover:bg-[#b72f30]' : 'bg-emerald-600 hover:bg-emerald-500'
            }`}
          >
            {loading ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"/>
                </svg>
                {lang === 'ar' ? 'جارٍ الحفظ…' : 'Saving…'}
              </>
            ) : action === 'reject' ? (
              <>✕ {lang === 'ar' ? 'تأكيد الرفض فوراً (Done)' : 'Confirm Rejection (Done)'}</>
            ) : (
              <>✓ {lang === 'ar' ? 'تأكيد الموافقة (Done)' : 'Confirm Approval (Done)'}</>
            )}
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
          const mapped = data.orders.map((o) => {
            const isShipped = o.status?.toLowerCase() === 'shipped' || o.status?.toLowerCase() === 'delivered';
            const calculatedPaymentStatus = isShipped
              ? 'paid'
              : (o.paymentStatus === 'rejected' ? 'rejected' : 'pending');

            return {
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
              paymentStatus: calculatedPaymentStatus,
              paymentProof:  o.paymentProof || '',
              paymentRejectionReason: o.paymentRejectionReason || '',
              status:        o.status ? (o.status.charAt(0).toUpperCase() + o.status.slice(1)) : 'Processing',
            };
          });
          setOrders(mapped);
        }
      })
      .catch(() => {});
  }, [lang]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const updateStatus = async (id, status) => {
    const target = orders.find((o) => o.id === id);
    const statusLower = status.toLowerCase();
    const isShippedOrDelivered = statusLower === 'shipped' || statusLower === 'delivered';
    const nextPaymentStatus = isShippedOrDelivered
      ? 'paid'
      : (target?.paymentStatus === 'rejected' ? 'rejected' : 'pending');

    // Optimistic UI update
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status, paymentStatus: nextPaymentStatus } : o))
    );

    if (target?.rawId) {
      try {
        const res = await adminApi.updateOrderStatus(target.rawId, statusLower);
        if (res?.order) {
          setOrders((prev) =>
            prev.map((o) => (o.id === id ? {
              ...o,
              status: res.order.status ? (res.order.status.charAt(0).toUpperCase() + res.order.status.slice(1)) : status,
              paymentStatus: res.order.paymentStatus || nextPaymentStatus,
            } : o))
          );
          if (isShippedOrDelivered) {
            toast.success(lang === 'ar' ? 'تم تحديث الطلب إلى شحن/توصيل وحالة الدفع إلى مدفوع (Paid)' : 'Order status updated & payment marked as Paid');
          } else {
            toast.success(lang === 'ar' ? 'تم تحديث حالة الطلب وحالة الدفع إلى معلق (Pending)' : 'Order status updated & payment set to Pending');
          }
        }
      } catch (err) {
        toast.error(err.message || (lang === 'ar' ? 'فشل تحديث حالة الطلب' : 'Failed to update order status'));
        fetchOrders();
      }
    }
  };

  const handleVerified = (orderId, action, rejectionReason) => {
    setOrders((prev) => prev.map((o) => {
      if (o.id !== orderId) return o;
      return {
        ...o,
        paymentStatus: action === 'approve' ? 'paid' : 'rejected',
        paymentRejectionReason: action === 'reject' ? (rejectionReason || o.paymentRejectionReason) : '',
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
              <span className="mx-2 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700">
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
              const isManualPayment = o.rawPaymentMethod === 'instapay' || o.rawPaymentMethod === 'vodafone_cash' || o.payment === 'InstaPay' || o.payment === 'Vodafone Cash';
              const canReviewPayment = o.rawId && (isManualPayment || o.paymentProof || o.paymentStatus === 'pending_verification' || o.paymentStatus === 'rejected');

              return (
                <tr key={o.id} className={`transition hover:bg-[var(--surface-soft)] ${o.paymentStatus === 'pending_verification' ? 'bg-amber-50/30' : ''}`}>
                  <td className="px-5 py-3 font-semibold text-[#c53938]">#{o.id}</td>
                  <td className="px-5 py-3">
                    <p className="font-medium text-[var(--primary-text)]">{o.customer}</p>
                    <p className="text-xs text-[var(--secondary-text)]">{o.email}</p>
                  </td>
                  <td className="px-5 py-3 text-[var(--secondary-text)]">{o.date}</td>
                  <td className="px-5 py-3 text-[var(--primary-text)]">{o.items}</td>
                  <td className="px-5 py-3 font-semibold text-[var(--primary-text)]">{formatEGP(o.total)}</td>
                  <td className="px-5 py-3">
                    <span className="font-medium text-[var(--primary-text)]">{o.payment}</span>
                    {isManualPayment && !o.paymentProof && (
                      <span className="block text-[10px] text-amber-600 font-medium">
                        {lang === 'ar' ? 'بدون إيصال' : 'No receipt'}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex flex-col items-start gap-1">
                      <span className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-bold ${ps.className}`}>
                        {ps.label}
                      </span>
                      {o.paymentStatus === 'rejected' && o.paymentRejectionReason && (
                        <span className="text-[10px] text-[#c53938] line-clamp-1 max-w-[140px]" title={o.paymentRejectionReason}>
                          {o.paymentRejectionReason}
                        </span>
                      )}
                    </div>
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
                      {canReviewPayment && (
                        <button
                          type="button"
                          title="Review / Verify Payment"
                          onClick={() => setReviewingOrder(o)}
                          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                            o.paymentStatus === 'pending_verification'
                              ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                              : o.paymentStatus === 'rejected'
                              ? 'bg-red-50 text-[#c53938] hover:bg-red-100'
                              : 'bg-[var(--surface-soft)] text-[var(--secondary-text)] hover:text-[var(--primary-text)]'
                          }`}
                        >
                          {o.paymentStatus === 'pending_verification' ? '🔍 ' : '⚡ '}
                          {lang === 'ar' ? 'فحص / رفض' : 'Review / Reject'}
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