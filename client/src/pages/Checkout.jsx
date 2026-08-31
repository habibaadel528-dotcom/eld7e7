import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { orderApi, shippingZoneApi, userApi } from '../services/api';
import { useCart } from '../context/CartContext';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { Truck, Upload, Check, Copy, CheckCheck, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';

import chevronRightIcon from '../assets/icons/cart/chevron-right.svg';

/* ── Payment account details ── */
const INSTAPAY_ACCOUNT   = '01111291542';
const VODAFONE_CASH_NUM  = '012266251423';

const MANUAL_METHODS = ['instapay', 'vodafone_cash'];
const MAX_FILE_SIZE  = 5 * 1024 * 1024; // 5MB

function FormField({ label, ...inputProps }) {
  return (
    <label className="block w-full min-w-0">
      <span className="mb-2 block text-sm font-bold text-black dark:text-gray-200">
        {label}
      </span>
      <input
        {...inputProps}
        className="h-12 w-full min-w-0 rounded-xl border border-[var(--border-color)] bg-[var(--surface-soft)] px-4 text-sm font-medium text-black dark:text-white outline-none transition placeholder:text-[var(--muted-text)] focus:border-[#c53938]"
      />
    </label>
  );
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Copy"
      className="flex items-center gap-1.5 rounded-lg border border-gray-300 dark:border-white/10 bg-gray-100 dark:bg-white/10 px-3 py-1.5 text-xs font-bold text-black dark:text-white transition hover:bg-[#c53938] hover:border-[#c53938] hover:!text-white cursor-pointer shadow-2xs"
    >
      {copied ? <CheckCheck size={13} /> : <Copy size={13} />}
      {copied ? '✓' : 'Copy'}
    </button>
  );
}

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, subtotal, clearCart } = useCart();
  const fileInputRef = useRef(null);
  const { t } = useLanguage();
  const tr = t('checkout');
  const trSidebar = t('sidebar');

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const paymentMethods = [
    {
      id: 'cod',
      label: 'Cash on Delivery',
      description: tr?.deliveryInstructions || 'Delivery instructions',
      icon: Truck,
    },
    {
      id: 'instapay',
      label: 'InstaPay',
      description: 'Transfer via InstaPay then upload proof',
      icon: ({ size = 20 }) => (
        <svg viewBox="0 0 40 40" fill="none" width={size} height={size}>
          <rect width="40" height="40" rx="10" fill="#5C2D91"/>
          <path d="M10 28L20 12L30 28H22L20 24L18 28H10Z" fill="white"/>
        </svg>
      ),
    },
    {
      id: 'vodafone_cash',
      label: 'Vodafone Cash',
      description: 'Transfer via Vodafone Cash then upload proof',
      icon: ({ size = 20 }) => (
        <svg viewBox="0 0 40 40" fill="none" width={size} height={size}>
          <rect width="40" height="40" rx="10" fill="#E60000"/>
          <circle cx="20" cy="20" r="9" stroke="white" strokeWidth="2.5" fill="none"/>
          <path d="M20 14v6l4 2" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      ),
    },
  ];

  const [selectedPayment, setSelectedPayment] = useState('cod');
  const [formData, setFormData] = useState({
    fullName: '', phone: '', address: '', city: '', notes: '',
  });
  const [errors, setErrors]           = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError]   = useState('');

  /* ── Payment proof state ── */
  const [placedOrder, setPlacedOrder]         = useState(null);
  const [proofFile, setProofFile]             = useState(null);
  const [proofPreview, setProofPreview]       = useState('');
  const [proofError, setProofError]           = useState('');
  const [isUploadingProof, setIsUploadingProof] = useState(false);
  const [proofSubmitted, setProofSubmitted]   = useState(false);

  /* ── Shipping zones ── */
  const [shippingZones, setShippingZones] = useState([]);
  const [deliveryFee, setDeliveryFee]     = useState(35);

  useEffect(() => {
    shippingZoneApi.getZones()
      .then((data) => { if (data?.zones?.length) setShippingZones(data.zones); })
      .catch(() => {});

    userApi.getAddresses()
      .then((data) => {
        if (data?.addresses?.length) {
          const def = data.addresses.find((a) => a.isDefault) || data.addresses[0];
          setFormData((prev) => ({
            ...prev,
            fullName: prev.fullName || def.recipientName || '',
            phone:    prev.phone    || def.phone         || '',
            address:  prev.address  || def.street        || '',
            city:     prev.city     || def.city          || '',
          }));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!shippingZones.length) { setDeliveryFee(35); return; }
    if (!formData.city?.trim()) { setDeliveryFee(shippingZones[0]?.price ?? 35); return; }
    const c = formData.city.toLowerCase().trim();
    const matched = shippingZones.find((z) => {
      const zn = (z.name || '').toLowerCase();
      return zn.includes(c) || c.includes(zn.split(' ')[0]);
    });
    setDeliveryFee(matched?.price ?? shippingZones[0]?.price ?? 35);
  }, [formData.city, shippingZones]);

  const total = (subtotal || 0) + deliveryFee;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.fullName?.trim()) errs.fullName = tr?.requiredFields || 'Please fill in all required fields.';
    if (!formData.phone?.trim())    errs.phone    = tr?.requiredFields || 'Please fill in all required fields.';
    if (!formData.address?.trim())  errs.address  = tr?.requiredFields || 'Please fill in all required fields.';
    if (!formData.city?.trim())     errs.city     = tr?.requiredFields || 'Please fill in all required fields.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /* ── Step 1: Place order ── */
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!cartItems.length || !validate()) return;

    setIsSubmitting(true);
    setSubmitError('');
    try {
      const data = await orderApi.createOrder({
        items: cartItems.map((item) => ({
          product:  item.id || item._id,
          name:     item.name,
          price:    item.price,
          quantity: item.quantity,
          image:    item.image || '',
        })),
        shippingAddress: {
          recipientName: formData.fullName.trim(),
          street:        formData.address.trim(),
          city:          formData.city.trim(),
          phone:         formData.phone.trim(),
        },
        paymentMethod: selectedPayment === 'cod' ? 'cash_on_delivery' : selectedPayment,
        totalAmount:   total,
      });

      clearCart();

      if (MANUAL_METHODS.includes(selectedPayment)) {
        setPlacedOrder(data.order || data);
        toast.success('Order placed! Please upload your payment proof.');
      } else {
        toast.success('Order placed successfully!');
        const orderNum = data.order?.orderNumber || data.orderNumber || `D7E7-${Math.floor(100000 + Math.random() * 900000)}`;
        navigate('/order-success', {
          state: { orderNumber: orderNum, total, fullName: formData.fullName },
        });
      }
    } catch (err) {
      setSubmitError(err.message || 'Could not place order. Please try again.');
      toast.error(err.message || 'Could not place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── Proof file picker ── */
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setProofError('Only JPG, JPEG, and PNG images are accepted.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setProofError('File size must be less than 5MB.');
      return;
    }

    setProofError('');
    setProofFile(file);
    setProofPreview(URL.createObjectURL(file));
  };

  const handleRemoveFile = () => {
    setProofFile(null);
    setProofPreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  /* ── Step 2: Submit proof ── */
  const handleSubmitProof = async (e) => {
    e.preventDefault();
    if (!proofFile) { setProofError('Please upload a payment screenshot.'); return; }
    const orderId = placedOrder?._id || placedOrder?.id;
    if (!orderId) return;

    setIsUploadingProof(true);
    setProofError('');
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('proof', proofFile);
      await orderApi.submitPaymentProof(orderId, formDataUpload);
      setProofSubmitted(true);
      toast.success('Payment proof submitted successfully!');
    } catch (err) {
      setProofError(err.message || 'Upload failed. Please try again.');
      toast.error(err.message || 'Upload failed. Please try again.');
    } finally {
      setIsUploadingProof(false);
    }
  };

  const isManual = MANUAL_METHODS.includes(selectedPayment);
  const paymentAccount = selectedPayment === 'instapay' ? INSTAPAY_ACCOUNT : VODAFONE_CASH_NUM;
  const paymentLabel   = selectedPayment === 'instapay' ? 'InstaPay Address' : 'Vodafone Cash Number';
  const paymentName    = selectedPayment === 'instapay' ? 'InstaPay' : 'Vodafone Cash';

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[var(--page-bg)] text-[var(--primary-text)]">
      <Helmet>
        <title>{placedOrder ? (tr?.uploadTitle || 'Upload Payment Screenshot') : (tr?.title || 'Checkout')} | El-D7E7</title>
        <meta name="description" content="Confirm your delivery details and payment method to place your order." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <DashboardHeader onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

      <div className="mx-auto w-full max-w-[1440px] px-3 sm:px-6 lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8 lg:px-8">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block h-full">
          <DashboardSidebar />
        </div>

        {/* Mobile Slide-Over Sidebar Drawer */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="fixed inset-y-0 ltr:left-0 rtl:right-0 z-50 w-[290px] max-w-[85vw] bg-[var(--surface-bg)] p-4 shadow-2xl ltr:border-r rtl:border-l border-[var(--border-color)] overflow-y-auto animate-in ltr:slide-in-from-left rtl:slide-in-from-right duration-300">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)] mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--secondary-text)]">
                  {trSidebar?.accountMenu || 'Account Menu'}
                </span>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-lg p-1.5 text-[var(--secondary-text)] hover:bg-[var(--surface-soft)] hover:text-[var(--primary-text)] transition cursor-pointer"
                  aria-label="Close mobile menu"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <DashboardSidebar
                isCollapsed={false}
                onToggleCollapse={() => setIsMobileMenuOpen(false)}
                onNavClick={() => setIsMobileMenuOpen(false)}
                isMobile
              />
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1">
          {placedOrder ? (
            /* ── Upload proof state (after order placed) ── */
            proofSubmitted ? (
              <div className="flex flex-col items-center justify-center rounded-[20px] border border-[var(--border-color)] bg-[var(--surface-bg)] p-8 sm:p-12 text-center">
                <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
                  <Check size={40} className="text-emerald-600" />
                </div>
                <h1 className="mb-3 text-2xl font-bold text-[var(--primary-text)]">{tr?.proofSubmittedTitle || 'Payment Proof Submitted!'}</h1>
                <p className="mb-2 text-sm font-semibold text-[var(--secondary-text)]">Order #{placedOrder.orderNumber}</p>
                <p className="mb-8 max-w-md text-sm text-[var(--muted-text)] leading-relaxed">
                  {tr?.proofSubmittedText || "Your payment proof has been submitted. Your order is under review. We'll notify you once payment is verified."}
                </p>
                <Link
                  to="/account/orders"
                  className="rounded-full bg-[#c53938] px-8 py-3 text-sm font-bold text-white transition hover:bg-[#ef5350]"
                >
                  {tr?.viewMyOrders || 'View My Orders'}
                </Link>
              </div>
            ) : (
              <div className="max-w-xl space-y-6">
                <div className="rounded-[20px] border border-emerald-200 bg-emerald-50 p-5">
                  <p className="text-sm font-semibold text-emerald-700">
                    ✅ Order #{placedOrder.orderNumber} placed successfully!
                  </p>
                  <p className="mt-1 text-xs text-emerald-600">
                    Now complete your payment and upload the screenshot below.
                  </p>
                </div>

                <section className="rounded-[20px] border border-[var(--border-color)] bg-[var(--surface-bg)] p-6">
                  <h2 className="mb-4 text-lg font-bold text-[var(--primary-text)]">
                    {paymentName} {tr?.paymentInstructions || 'Payment Instructions'}
                  </h2>

                  <div className="space-y-4">
                    <div className="rounded-xl border border-[var(--border-color)] bg-[var(--surface-soft)] p-4">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--muted-text)]">
                        {paymentLabel}
                      </p>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-lg font-bold text-[var(--primary-text)] tracking-wider">
                          {paymentAccount}
                        </span>
                        <CopyButton text={paymentAccount} />
                      </div>
                    </div>

                    <div className="rounded-xl border border-[#c53938]/20 bg-[#c53938]/5 p-4">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#c53938]/70">
                        {tr?.amountToTransfer || 'Amount to Transfer'}
                      </p>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xl font-bold text-[#c53938]">
                          EGP {placedOrder.totalAmount?.toFixed(2)}
                        </span>
                        <CopyButton text={String(placedOrder.totalAmount)} />
                      </div>
                    </div>
                  </div>
                </section>

                <section className="rounded-[20px] border border-[var(--border-color)] bg-[var(--surface-bg)] p-6">
                  <h2 className="mb-1 text-lg font-bold text-[var(--primary-text)]">
                    {tr?.uploadTitle || 'Upload Payment Screenshot'}
                  </h2>
                  <p className="mb-5 text-xs text-[var(--muted-text)]">
                    {tr?.uploadFormats || 'Accepted formats: JPG, JPEG, PNG — Max size: 5MB'}
                  </p>

                  {!proofPreview ? (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-[var(--border-color)] bg-[var(--surface-soft)] py-10 transition hover:border-[#c53938] hover:bg-[#c53938]/5 cursor-pointer"
                    >
                      <Upload size={28} className="text-[var(--muted-text)]" />
                      <span className="text-sm font-medium text-[var(--secondary-text)]">
                        {tr?.uploadClick || 'Click to upload screenshot'}
                      </span>
                      <span className="text-xs text-[var(--muted-text)]">JPG, JPEG, PNG up to 5MB</span>
                    </button>
                  ) : (
                    <div className="relative overflow-hidden rounded-xl border border-[var(--border-color)]">
                      <img src={proofPreview} alt="Payment proof preview" className="w-full object-contain max-h-72" />
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80 cursor-pointer"
                        title="Remove"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  {proofError && (
                    <p className="mt-3 text-xs text-[#c53938] font-medium">{proofError}</p>
                  )}

                  <button
                    type="button"
                    onClick={handleSubmitProof}
                    disabled={isUploadingProof || !proofFile}
                    className="mt-5 flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-[#c53938] text-sm font-bold text-white transition hover:bg-[#ef5350] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                  >
                    {isUploadingProof ? (
                      <>
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"/>
                        </svg>
                        {tr?.uploading || 'Uploading…'}
                      </>
                    ) : (
                      <>
                        <Upload size={16} />
                        {tr?.submitProof || 'Submit Payment Proof'}
                      </>
                    )}
                  </button>
                </section>
              </div>
            )
          ) : (
            /* ── Normal checkout form ── */
            <>
              <nav aria-label="Breadcrumb" className="flex items-center gap-3 text-base">
                <Link to="/" className="text-[var(--secondary-text)] transition hover:text-[#c53938]">{tr?.home || 'Home'}</Link>
                <img src={chevronRightIcon} alt="" width="16" height="16" className="h-4 w-4 object-contain rtl:rotate-180" />
                <Link to="/cart" className="text-[var(--secondary-text)] transition hover:text-[#c53938]">{tr?.cart || 'Cart'}</Link>
                <img src={chevronRightIcon} alt="" width="16" height="16" className="h-4 w-4 object-contain rtl:rotate-180" />
                <span aria-current="page">{tr?.title || 'Checkout'}</span>
              </nav>

              <h1 className="mb-0 mt-4 text-[32px] sm:text-[40px] font-bold leading-tight text-[var(--primary-text)]">
                {tr?.title || 'Checkout'}
              </h1>

              <form onSubmit={handlePlaceOrder} className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_380px] w-full min-w-0 max-w-full">
                {/* Left column */}
                <div className="space-y-5 w-full min-w-0">
                  {/* Delivery address */}
                  <section className="rounded-2xl sm:rounded-[20px] border border-[var(--border-color)] bg-[var(--surface-bg)] p-4 sm:p-6 w-full min-w-0 max-w-full">
                    <h2 className="m-0 text-lg sm:text-xl font-black text-black dark:text-white">{tr?.deliveryAddress || 'Delivery Address'}</h2>

                    <div className="mt-4 grid gap-3.5 sm:gap-4 grid-cols-1 sm:grid-cols-2 w-full min-w-0">
                      <FormField label={tr?.fullName || 'Full Name'} name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Eman Mohamed" autoComplete="name" />
                      <FormField label={tr?.phoneNumber || 'Phone Number'} name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="01xxxxxxxxx" autoComplete="tel" />

                      <div className="sm:col-span-2 min-w-0">
                        <FormField label={tr?.streetAddress || 'Street Address'} name="address" value={formData.address} onChange={handleChange} placeholder="Street name, building, floor, apartment" autoComplete="street-address" />
                      </div>

                      <div className="min-w-0">
                        <label className="mb-1.5 block text-xs sm:text-sm font-bold text-black dark:text-gray-200">
                          {tr?.cityZone || 'City / Delivery Zone'}
                        </label>
                        {shippingZones.length > 0 ? (
                          <select
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="h-12 w-full min-w-0 rounded-xl border border-[var(--border-color)] bg-[var(--surface-soft)] px-3 text-xs sm:text-sm font-medium text-black dark:text-white focus:border-[#c53938] focus:outline-none cursor-pointer"
                          >
                            <option value="">{tr?.selectCity || '-- Select your area / city --'}</option>
                            {shippingZones.map((z) => (
                              <option key={z._id || z.id} value={z.name}>
                                {z.name} — EGP {z.price} ({z.eta})
                              </option>
                            ))}
                          </select>
                        ) : (
                          <FormField label="City" name="city" value={formData.city} onChange={handleChange} placeholder="Cairo" autoComplete="address-level2" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <FormField label={tr?.notes || 'Notes (optional)'} name="notes" value={formData.notes} onChange={handleChange} placeholder={tr?.deliveryInstructions || 'Delivery instructions'} />
                      </div>
                    </div>

                    {(errors.fullName || errors.phone || errors.address || errors.city) && (
                      <p className="mt-3 text-xs text-[#c53938] font-bold">{tr?.requiredFields || 'Please fill in all required fields.'}</p>
                    )}
                  </section>

                  {/* Payment method */}
                  <section className="rounded-2xl sm:rounded-[20px] border border-[var(--border-color)] bg-[var(--surface-bg)] p-4 sm:p-6 w-full min-w-0 max-w-full">
                    <h2 className="m-0 text-lg sm:text-xl font-black text-black dark:text-white">{tr?.paymentMethod || 'Payment Method'}</h2>

                    <div className="mt-4 space-y-2.5 w-full min-w-0">
                      {paymentMethods.map((method) => {
                        const Icon = method.icon;
                        const isSelected = selectedPayment === method.id;

                        return (
                          <button
                            key={method.id}
                            type="button"
                            onClick={() => setSelectedPayment(method.id)}
                            className={`flex w-full min-w-0 items-center gap-2.5 sm:gap-4 rounded-xl border p-3 sm:p-4 text-left rtl:text-right transition cursor-pointer ${
                              isSelected
                                ? 'border-[#c53938] bg-[#c53938]/5'
                                : 'border-[var(--border-color)] hover:border-[#c53938]/50'
                            }`}
                          >
                            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                              isSelected ? 'bg-[#c53938] text-white' : 'bg-[var(--surface-soft)] text-[var(--secondary-text)]'
                            }`}>
                              <Icon size={18} />
                            </span>

                            <span className="min-w-0 flex-1">
                              <span className="block text-xs sm:text-sm font-bold text-black dark:text-white truncate">{method.label}</span>
                              <span className="block text-[11px] text-[var(--secondary-text)] truncate">{method.description}</span>
                            </span>

                            <span className={`flex h-4.5 w-4.5 sm:h-5 sm:w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                              isSelected ? 'border-[#c53938] bg-[#c53938]' : 'border-[var(--border-color)]'
                            }`}>
                              {isSelected && <Check size={10} color="#fff" />}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {isManual && (
                      <div className="mt-3.5 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5">
                        <p className="text-xs font-medium text-amber-800 leading-relaxed m-0">
                          📋 After placing your order, you'll be asked to transfer <strong>EGP {total.toFixed(2)}</strong> to our {paymentName} account and upload a screenshot as payment proof.
                        </p>
                      </div>
                    )}
                  </section>

                  {/* Order items recap */}
                  <section className="rounded-2xl sm:rounded-[20px] border border-[var(--border-color)] bg-[var(--surface-bg)] p-4 sm:p-6 w-full min-w-0 max-w-full">
                    <h2 className="m-0 text-lg sm:text-xl font-black text-black dark:text-white">{tr?.orderItems || 'Order Items'} ({cartItems.length})</h2>

                    <div className="mt-4 divide-y divide-[var(--border-color)] w-full min-w-0">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between gap-3 py-2.5 sm:py-3 first:pt-0 last:pb-0 min-w-0">
                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[var(--surface-soft)] border border-[var(--border-color)]">
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-xs font-bold text-[var(--muted-text)]">📦</div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="m-0 truncate text-xs sm:text-sm font-bold text-black dark:text-white">{item.name}</p>
                            <p className="m-0 text-xs text-[var(--secondary-text)]">{tr?.qty || 'Qty'}: {item.quantity}</p>
                          </div>
                          <p className="m-0 shrink-0 text-xs sm:text-sm font-bold text-black dark:text-white whitespace-nowrap">
                            EGP {(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}

                      {cartItems.length === 0 && (
                        <p className="py-4 text-sm text-[var(--muted-text)]">{tr?.emptyCart || 'Your cart is empty.'}</p>
                      )}
                    </div>
                  </section>
                </div>

                {/* Right column — summary */}
                <aside className="h-fit rounded-2xl sm:rounded-[20px] border border-[var(--border-color)] bg-[var(--surface-bg)] p-4 sm:p-6 lg:sticky lg:top-8 w-full min-w-0 max-w-full">
                  <h2 className="m-0 text-lg sm:text-xl font-black text-black dark:text-white">{tr?.orderSummary || 'Order Summary'}</h2>

                  <dl className="mt-4 space-y-3.5">
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-xs sm:text-sm text-[var(--secondary-text)]">{tr?.subtotal || 'Subtotal'}</dt>
                      <dd className="m-0 text-xs sm:text-sm text-black dark:text-white font-bold">EGP {(subtotal || 0).toFixed(2)}</dd>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-xs sm:text-sm text-[var(--secondary-text)] truncate">{tr?.deliveryFee || 'Delivery Fee'} ({formData.city || 'Standard'})</dt>
                      <dd className="m-0 text-xs sm:text-sm font-bold text-black dark:text-white whitespace-nowrap">EGP {deliveryFee.toFixed(2)}</dd>
                    </div>

                    <div className="h-px bg-[var(--border-color)]" />

                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-sm sm:text-base font-black text-black dark:text-white">{tr?.total || 'Total'}</dt>
                      <dd className="m-0 text-lg sm:text-xl font-black text-[#c53938]">EGP {total.toFixed(2)}</dd>
                    </div>
                  </dl>

                  {submitError && (
                    <p className="mt-3.5 rounded-lg bg-[#c53938]/10 px-3 py-2 text-xs text-[#c53938] font-bold">{submitError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={cartItems.length === 0 || isSubmitting}
                    className="mt-5 flex h-[50px] sm:h-[54px] w-full items-center justify-center gap-2 rounded-full bg-[#c94545] text-sm sm:text-base font-bold text-white transition hover:bg-[#ef5350] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer shadow-md"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"/>
                        </svg>
                        {tr?.placingOrder || 'Placing Order…'}
                      </>
                    ) : isManual ? (tr?.placeOrderPay || 'Place Order & Pay') : (tr?.placeOrder || 'Place Order')}
                  </button>

                  <Link
                    to="/cart"
                    className="btn-outline-custom mt-2.5 flex h-10 w-full items-center justify-center rounded-full text-xs font-bold cursor-pointer"
                  >
                    {tr?.backToCart || 'Back to Cart'}
                  </Link>
                </aside>
              </form>
            </>
          )}
        </main>
      </div>
    </div>
  );
}