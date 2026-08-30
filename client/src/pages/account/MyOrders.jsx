import { useMemo, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import { Filter, Search, ChevronDown, X, Package, Clock, CheckCircle2, Truck, AlertCircle, ShoppingBag } from 'lucide-react';
import { orderApi } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

import orderHeadphones from '../../assets/images/dashboard/order-headphones.png';

function StatusPill({ tone, children }) {
  const styles = {
    shipped:    'bg-[#fff3e6] text-[#d97706] [html[data-theme="dark"]_&]:bg-[#d97706]/20',
    processing: 'bg-[#eef5ff] text-[#2563eb] [html[data-theme="dark"]_&]:bg-[#2563eb]/20',
    delivered:  'bg-[#ecfdf5] text-[#059669] [html[data-theme="dark"]_&]:bg-[#059669]/20',
    cancelled:  'bg-[#fff0f0] text-[#dc2626] [html[data-theme="dark"]_&]:bg-[#dc2626]/20',
    returned:   'bg-[#f3f4f6] text-[#6b7280] [html[data-theme="dark"]_&]:bg-[#6b7280]/20',
  };

  const defaultTone = styles[tone] || styles.processing;

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${defaultTone}`}>
      {children}
    </span>
  );
}

/* ── Order Details Modal ── */
function OrderDetailsModal({ order, onClose, onCancelClick, tr }) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-2xl border border-[var(--border-color)] bg-[var(--surface-bg)] p-6 shadow-xl text-[var(--primary-text)] max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface-soft)] text-[var(--secondary-text)] transition hover:text-[var(--primary-text)]"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 pb-4 border-b border-[var(--border-color)]">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-[#c83738]">
            <Package size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold">Order #{order.orderNumber || order._id?.slice(-6)}</h3>
            <p className="text-xs text-[var(--secondary-text)]">
              {tr.placedOn} {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <div className="ml-auto">
            <StatusPill tone={order.status}>{order.status?.toUpperCase()}</StatusPill>
          </div>
        </div>

        {/* Items list */}
        <div className="my-4 space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--secondary-text)]">{tr.orderItems}</h4>
          <div className="divide-y divide-[var(--border-color)] rounded-xl border border-[var(--border-color)] bg-[var(--surface-soft)] p-3">
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image || orderHeadphones}
                    alt={item.name}
                    className="h-10 w-10 rounded-lg object-cover bg-white"
                  />
                  <div>
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-[var(--secondary-text)]">{tr.qty}: {item.quantity} × EGP {item.price?.toLocaleString()}</p>
                  </div>
                </div>
                <p className="text-sm font-bold">EGP {(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping address & Payment info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4 p-3 rounded-xl bg-[var(--surface-soft)] border border-[var(--border-color)] text-xs">
          <div>
            <span className="font-semibold text-[var(--secondary-text)] block mb-1">{tr.shippingAddress}</span>
            <p className="font-medium text-[var(--primary-text)]">{order.shippingAddress?.recipientName}</p>
            <p className="text-[var(--secondary-text)]">{order.shippingAddress?.street}, {order.shippingAddress?.city}</p>
            <p className="text-[var(--secondary-text)]">{tr.phone}: {order.shippingAddress?.phone}</p>
          </div>
          <div>
            <span className="font-semibold text-[var(--secondary-text)] block mb-1">{tr.paymentMethod}</span>
            <p className="font-medium text-[var(--primary-text)] capitalize">{order.paymentMethod?.replace(/_/g, ' ') || 'Cash on Delivery'}</p>
            <span className="font-semibold text-[var(--secondary-text)] block mt-2 mb-0.5">{tr.totalAmount}</span>
            <p className="text-base font-bold text-[#c83738]">EGP {order.totalAmount?.toLocaleString()}</p>
          </div>
        </div>

        {/* Modal actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
          {order.status === 'processing' && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onCancelClick(order);
              }}
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
            >
              {tr.cancelOrder}
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-[#c83738] px-5 py-2 text-xs font-semibold text-white transition hover:bg-[#b72f30]"
          >
            {tr.close}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Cancel Order Modal ── */
function CancelConfirmModal({ order, onClose, onConfirm, isSubmitting, tr }) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-sm rounded-2xl border border-[var(--border-color)] bg-[var(--surface-bg)] p-6 shadow-xl text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
          <AlertCircle size={24} />
        </div>
        <h3 className="text-base font-bold text-[var(--primary-text)]">
          {tr.cancelTitle(order.orderNumber || order._id?.slice(-6))}
        </h3>
        <p className="mt-2 text-xs text-[var(--secondary-text)]">
          {tr.cancelWarning}
        </p>

        <div className="mt-5 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-xl border border-[var(--border-color)] px-4 py-2 text-xs font-semibold text-[var(--secondary-text)] transition hover:bg-[var(--surface-soft)]"
          >
            {tr.keepOrder}
          </button>
          <button
            type="button"
            onClick={() => onConfirm(order._id)}
            disabled={isSubmitting}
            className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            {isSubmitting ? tr.cancelling : tr.yesCancelOrder}
          </button>
        </div>
      </div>
    </div>
  );
}

function OrderCard({ order, onViewDetails, onCancelClick, tr }) {
  const isProcessing = order.status === 'processing';
  const itemImage = order.items?.[0]?.image || orderHeadphones;

  return (
    <article className="rounded-[15px] border border-[var(--border-color)] bg-[var(--surface-bg)] p-4 sm:px-5 sm:py-4 shadow-sm transition hover:border-[#c83738]/40">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-1.5 shrink-0">
            <img src={itemImage} alt="" className="h-11 w-11 rounded-[15px] border-2 border-[var(--surface-bg)] object-cover bg-white" />
            {order.items?.length > 1 && (
              <div className="flex h-11 w-11 items-center justify-center rounded-[15px] border-2 border-[var(--surface-bg)] bg-[var(--surface-soft)] text-xs font-bold text-[var(--secondary-text)]">
                +{order.items.length - 1}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1 sm:hidden">
            <div className="flex flex-wrap items-center gap-2">
              <p className="m-0 text-[13px] font-semibold text-[var(--primary-text)]">
                #{order.orderNumber || order._id?.slice(-6)}
              </p>
              <StatusPill tone={order.status}>{order.status?.toUpperCase()}</StatusPill>
            </div>
            <p className="mt-0.5 text-[11px] text-[var(--secondary-text)]">
              {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · EGP {order.totalAmount?.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="hidden min-w-0 flex-1 sm:block">
          <div className="flex flex-wrap items-center gap-2">
            <p className="m-0 text-[13px] font-semibold text-[var(--primary-text)]">
              #{order.orderNumber || order._id?.slice(-6)}
            </p>
            <StatusPill tone={order.status}>{order.status?.toUpperCase()}</StatusPill>
          </div>

          <p className="mt-1 text-[11px] text-[var(--secondary-text)]">
            {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · {order.items?.length || 1} item{(order.items?.length || 1) > 1 ? 's' : ''}
          </p>

          <p className="mt-0.5 text-[11px] text-[var(--secondary-text)]">
            {order.items?.[0]?.name} {order.items?.length > 1 ? `+ ${order.items.length - 1} more` : ''}
          </p>
        </div>

        <div className="flex items-center justify-between sm:flex-col sm:items-end sm:justify-center">
          <p className="hidden sm:block m-0 text-[15px] font-bold text-[var(--primary-text)]">
            EGP {order.totalAmount?.toLocaleString()}
          </p>
          <p className="sm:hidden text-xs font-semibold text-[#c83738]">
            EGP {order.totalAmount?.toLocaleString()}
          </p>

          <div className="flex items-center gap-2">
            {isProcessing && (
              <button
                type="button"
                onClick={() => onCancelClick(order)}
                className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-[11px] font-medium text-red-600 transition hover:bg-red-100"
              >
                {tr.cancel}
              </button>
            )}

            <button
              type="button"
              onClick={() => onViewDetails(order)}
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-color)] bg-[var(--surface-bg)] px-3 py-1.5 text-[11px] font-medium text-[var(--secondary-text)] transition hover:border-[#c83738] hover:text-[#c83738]"
            >
              {tr.details}
            </button>

            <button
              type="button"
              onClick={() => onViewDetails(order)}
              aria-label="Expand order details"
              className="ml-1 text-[var(--secondary-text)] hover:text-[#c83738]"
            >
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
  const [rawOrders, setRawOrders] = useState([]);
  const [statusCounts, setStatusCounts] = useState({
    all: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0, returned: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelModalOrder, setCancelModalOrder] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const { t } = useLanguage();
  const tr = t('myOrders');

  const ORDER_STATUS_CONFIG = [
    { key: 'all',        label: tr.tabs.all },
    { key: 'processing', label: tr.tabs.processing },
    { key: 'shipped',    label: tr.tabs.shipped },
    { key: 'delivered',  label: tr.tabs.delivered },
    { key: 'cancelled',  label: tr.tabs.cancelled },
    { key: 'returned',   label: tr.tabs.returned },
  ];

  const fetchOrders = () => {
    setLoading(true);
    orderApi.getMyOrders()
      .then((data) => {
        if (data.orders) {
          setRawOrders(data.orders);
        }
        if (data.statusCounts) {
          setStatusCounts(data.statusCounts);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelConfirm = async (orderId) => {
    setIsCancelling(true);
    try {
      await orderApi.cancelOrder(orderId);
      setCancelModalOrder(null);
      fetchOrders();
      toast.success('Order cancelled successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to cancel order.');
    } finally {
      setIsCancelling(false);
    }
  };

  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase();

    return rawOrders.filter((order) => {
      const matchesTab = activeTab === 'all' ? true : order.status === activeTab;

      const orderNumStr = (order.orderNumber || order._id || '').toLowerCase();
      const itemNames = order.items?.map((i) => i.name.toLowerCase()).join(' ') || '';

      const matchesSearch =
        !q ||
        orderNumStr.includes(q) ||
        itemNames.includes(q) ||
        order.status.toLowerCase().includes(q);

      return matchesTab && matchesSearch;
    });
  }, [search, activeTab, rawOrders]);

  return (
    <>
      <Helmet>
        <title>My Orders | El-D7E7</title>
        <meta name="description" content="Track and manage all your orders in your El-D7E7 account." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-[19px] font-semibold leading-[26px] text-[var(--primary-text)]">
              {tr.title}
            </h1>
            <p className="mt-1 text-[13px] text-[var(--secondary-text)]">
              {tr.totalOrders(statusCounts.all)}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <label className="relative w-full sm:w-auto">
              <span className="sr-only">{tr.searchPlaceholder}</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--secondary-text)]" size={18} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={tr.searchPlaceholder}
                className="h-[41px] w-full sm:w-[320px] rounded-full border border-[var(--border-color)] bg-[var(--surface-bg)] pl-10 pr-4 text-[13px] text-[var(--primary-text)] outline-none placeholder:text-[var(--secondary-text)] focus:border-[#c83738]"
              />
            </label>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex overflow-x-auto gap-2 rounded-[15px] border border-[var(--border-color)] bg-[var(--surface-bg)] p-2 max-w-full scrollbar-none">
          {ORDER_STATUS_CONFIG.map((tab) => {
            const active = tab.key === activeTab;
            const count = statusCounts[tab.key] || 0;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={[
                  'inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium transition shrink-0',
                  active
                    ? 'bg-[#c83738] text-white'
                    : 'text-[var(--secondary-text)] hover:bg-[var(--surface-soft)]',
                ].join(' ')}
              >
                <span>{tab.label}</span>
                <span className={active ? 'rounded-full bg-white/25 px-1.5 py-0.5 text-[10px] font-bold' : 'rounded-full bg-[var(--surface-soft)] px-1.5 py-0.5 text-[10px] font-bold'}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Order Cards / Empty State */}
        {loading ? (
          <div className="py-16 text-center text-sm text-[var(--secondary-text)]">
            {tr.loadingOrders}
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="space-y-3">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                onViewDetails={setSelectedOrder}
                onCancelClick={setCancelModalOrder}
                tr={tr}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface-bg)] p-12 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--surface-soft)] text-[var(--secondary-text)]">
              <ShoppingBag size={28} />
            </div>
            <h3 className="text-base font-bold text-[var(--primary-text)]">{tr.noOrdersFound}</h3>
            <p className="mt-1 text-xs text-[var(--secondary-text)] max-w-sm mx-auto">
              {search
                ? tr.noOrdersSearch(search)
                : activeTab !== 'all'
                ? tr.noOrdersStatus(activeTab)
                : tr.noOrdersEmpty}
            </p>
            <a
              href="/stationery"
              className="mt-5 inline-flex items-center rounded-xl bg-[#c83738] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#b72f30]"
            >
              {tr.startShopping}
            </a>
          </div>
        )}
      </div>

      {/* Modals */}
      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onCancelClick={setCancelModalOrder}
        tr={tr}
      />

      <CancelConfirmModal
        order={cancelModalOrder}
        onClose={() => setCancelModalOrder(null)}
        onConfirm={handleCancelConfirm}
        isSubmitting={isCancelling}
        tr={tr}
      />
    </>
  );
}