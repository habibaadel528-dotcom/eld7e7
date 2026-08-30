import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import { X, Plus, Edit2, Trash2, MapPin, Check, Home, Briefcase } from 'lucide-react';
import { userApi } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

/* Icon colours cycling by index */
const ICON_STYLES = [
  { icon: 'home',  iconBg: 'bg-indigo-100 text-indigo-500' },
  { icon: 'work',  iconBg: 'bg-amber-100 text-amber-500' },
  { icon: 'pin',   iconBg: 'bg-emerald-100 text-emerald-500' },
];

function mapAddress(a, i) {
  const labelLower = (a.label || '').toLowerCase();
  const iconType = labelLower.includes('work') || labelLower.includes('office')
    ? 'work'
    : labelLower.includes('home')
    ? 'home'
    : ICON_STYLES[i % ICON_STYLES.length].icon;

  const style = ICON_STYLES[i % ICON_STYLES.length];

  return {
    id: a._id,
    label: a.label || 'Address',
    person: a.recipientName,
    street: a.street,
    city: a.city,
    phone: a.phone,
    isDefault: a.isDefault,
    icon: iconType,
    iconBg: style.iconBg,
  };
}

/* ── Small icon set ── */
function AddressIcon({ type }) {
  if (type === 'home') return <Home size={18} />;
  if (type === 'work') return <Briefcase size={18} />;
  return <MapPin size={18} />;
}

/* ── Address Form Modal (Add & Edit) ── */
function AddressModal({ address, isOpen, onClose, onSave, isSubmitting, tr, lang }) {
  const [formData, setFormData] = useState({
    label: 'Home',
    recipientName: '',
    street: '',
    city: '',
    phone: '',
    isDefault: false,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (address) {
      setFormData({
        label: address.label || 'Home',
        recipientName: address.person || address.recipientName || '',
        street: address.street || '',
        city: address.city || '',
        phone: address.phone || '',
        isDefault: !!address.isDefault,
      });
    } else {
      setFormData({
        label: 'Home',
        recipientName: '',
        street: '',
        city: '',
        phone: '',
        isDefault: false,
      });
    }
    setErrors({});
  }, [address, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.recipientName.trim()) errs.recipientName = lang === 'ar' ? 'اسم المستلم مطلوب' : 'Recipient Name is required';
    if (!formData.street.trim()) errs.street = lang === 'ar' ? 'العنوان مطلوب' : 'Street Address is required';
    if (!formData.city.trim()) errs.city = lang === 'ar' ? 'المدينة مطلوبة' : 'City is required';
    if (!formData.phone.trim()) errs.phone = lang === 'ar' ? 'رقم الهاتف مطلوب' : 'Phone Number is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(formData);
  };

  const labelOptions = [
    { value: 'Home', label: tr.home },
    { value: 'Work', label: tr.work },
    { value: 'Other', label: tr.other },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md rounded-2xl border border-[var(--border-color)] bg-[var(--surface-bg)] p-6 shadow-xl text-[var(--primary-text)] text-start">
        <button
          type="button"
          onClick={onClose}
          className="absolute ltr:right-4 rtl:left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface-soft)] text-[var(--secondary-text)] transition hover:text-[var(--primary-text)]"
        >
          <X size={18} />
        </button>

        <h3 className="text-lg font-bold">
          {address ? tr.editAddress : tr.addNew}
        </h3>
        <p className="text-xs text-[var(--secondary-text)] mt-1">
          {address ? tr.addressDetails : tr.newAddressDetails}
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          {/* Label selector */}
          <div>
            <label className="block font-semibold text-[var(--secondary-text)] mb-1">{tr.label}</label>
            <div className="flex gap-2">
              {labelOptions.map((l) => (
                <button
                  key={l.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, label: l.value })}
                  className={`rounded-xl px-4 py-2 text-xs font-medium border transition cursor-pointer ${
                    formData.label === l.value
                      ? 'border-[#c53938] bg-[#c53938] text-white'
                      : 'border-[var(--border-color)] bg-[var(--surface-soft)] text-[var(--secondary-text)]'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Recipient Name */}
          <div>
            <label className="block font-semibold text-[var(--secondary-text)] mb-1">{tr.recipientName}</label>
            <input
              type="text"
              value={formData.recipientName}
              onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
              placeholder={lang === 'ar' ? 'مثال: روان أحمد' : 'e.g. Rawan Ahmed'}
              className="h-10 w-full rounded-xl border border-[var(--border-color)] bg-[var(--surface-soft)] px-3 text-xs text-[var(--primary-text)] outline-none focus:border-[#c53938]"
            />
            {errors.recipientName && <p className="mt-1 text-[11px] text-red-500">{errors.recipientName}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block font-semibold text-[var(--secondary-text)] mb-1">{tr.phone}</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder={lang === 'ar' ? 'مثال: 01012345678' : 'e.g. 01012345678'}
              className="h-10 w-full rounded-xl border border-[var(--border-color)] bg-[var(--surface-soft)] px-3 text-xs text-[var(--primary-text)] outline-none focus:border-[#c53938]"
            />
            {errors.phone && <p className="mt-1 text-[11px] text-red-500">{errors.phone}</p>}
          </div>

          {/* Street */}
          <div>
            <label className="block font-semibold text-[var(--secondary-text)] mb-1">{tr.street}</label>
            <input
              type="text"
              value={formData.street}
              onChange={(e) => setFormData({ ...formData, street: e.target.value })}
              placeholder={lang === 'ar' ? 'مثال: شارع التحرير، عمارة ٤، شقة ب' : 'e.g. 123 El-Tahrir Street, Apt 4B'}
              className="h-10 w-full rounded-xl border border-[var(--border-color)] bg-[var(--surface-soft)] px-3 text-xs text-[var(--primary-text)] outline-none focus:border-[#c53938]"
            />
            {errors.street && <p className="mt-1 text-[11px] text-red-500">{errors.street}</p>}
          </div>

          {/* City */}
          <div>
            <label className="block font-semibold text-[var(--secondary-text)] mb-1">{tr.city}</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder={lang === 'ar' ? 'مثال: القاهرة' : 'e.g. Cairo'}
              className="h-10 w-full rounded-xl border border-[var(--border-color)] bg-[var(--surface-soft)] px-3 text-xs text-[var(--primary-text)] outline-none focus:border-[#c53938]"
            />
            {errors.city && <p className="mt-1 text-[11px] text-red-500">{errors.city}</p>}
          </div>

          {/* Default Checkbox */}
          <label className="flex items-center gap-2 pt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isDefault}
              onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-[#c53938] focus:ring-[#c53938]"
            />
            <span className="text-xs font-medium text-[var(--primary-text)]">{tr.setDefault}</span>
          </label>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border-color)]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[var(--border-color)] px-4 py-2 text-xs font-semibold text-[var(--secondary-text)] transition hover:bg-[var(--surface-soft)] cursor-pointer"
            >
              {tr.cancel}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-[#c53938] px-5 py-2 text-xs font-semibold text-white transition hover:bg-[#a82d2c] disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? tr.saving : tr.saveAddress}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AddressCard({ address, onSetDefault, onEdit, onDelete, tr, lang }) {
  const displayLabel = address.label === 'Home' ? tr.home : address.label === 'Work' ? tr.work : address.label;

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-[var(--border-color)] bg-[var(--surface-bg)] p-5 shadow-sm transition hover:shadow-md text-start">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${address.iconBg}`}>
              <AddressIcon type={address.icon} />
            </span>
            <div>
              <p className="text-sm font-semibold text-[var(--primary-text)]">{displayLabel}</p>
              <p className="text-xs text-[var(--secondary-text)]">{address.person}</p>
            </div>
          </div>

          {address.isDefault && (
            <span className="flex items-center gap-1 rounded-full bg-[#c53938] px-3 py-1 text-[11px] font-semibold text-white">
              <Check size={12} />
              {tr.defaultBadge}
            </span>
          )}
        </div>

        {/* Address lines */}
        <div className="mt-4 space-y-0.5 text-sm text-[var(--primary-text)]">
          <p>{address.street}</p>
          <p className="text-xs text-[var(--secondary-text)]">{address.city}</p>
        </div>

        <p className="mt-2 flex items-center gap-1.5 text-xs text-[var(--secondary-text)]">
          <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 0 1 2-2h2.28a1 1 0 0 1 .97.76l1 4a1 1 0 0 1-.29 1L7.4 10.3a12 12 0 0 0 6.3 6.3l1.54-1.56a1 1 0 0 1 1-.29l4 1a1 1 0 0 1 .76.97V19a2 2 0 0 1-2 2h-1C10.6 21 3 13.4 3 4V5Z" />
          </svg>
          <span dir="ltr">{address.phone}</span>
        </p>
      </div>

      {/* Footer actions */}
      <div className="mt-5 flex items-center justify-between border-t border-[var(--border-color)] pt-3 text-xs font-medium">
        {!address.isDefault ? (
          <button
            type="button"
            onClick={() => onSetDefault(address.id)}
            className="text-[#c53938] hover:underline cursor-pointer"
          >
            {tr.makeDefault}
          </button>
        ) : (
          <span />
        )}

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => onEdit(address)}
            className="flex items-center gap-1 text-[var(--secondary-text)] hover:text-[var(--primary-text)] cursor-pointer"
          >
            <Edit2 size={14} />
            {tr.edit}
          </button>

          {!address.isDefault && (
            <button
              type="button"
              onClick={() => onDelete(address.id)}
              className="flex items-center gap-1 text-[var(--secondary-text)] hover:text-[#c53938] cursor-pointer"
            >
              <Trash2 size={14} />
              {tr.delete}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function AddNewAddressCard({ onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[180px] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[var(--border-color)] text-[var(--secondary-text)] transition hover:border-[#c53938]/50 hover:text-[#c53938] cursor-pointer"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--surface-soft)]">
        <Plus size={18} />
      </span>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

export default function AddressPage() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { lang, t } = useLanguage();
  const tr = t('addresses');

  const refresh = () => {
    setLoading(true);
    userApi.getAddresses()
      .then((data) => {
        if (data.addresses) {
          setAddresses(data.addresses.map(mapAddress));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { refresh(); }, []);

  const handleOpenAdd = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (addr) => {
    setEditingAddress(addr);
    setIsModalOpen(true);
  };

  const handleSaveAddress = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingAddress) {
        await userApi.updateAddress(editingAddress.id, formData);
        toast.success(lang === 'ar' ? 'تم تحديث العنوان بنجاح' : 'Address updated successfully');
      } else {
        await userApi.addAddress(formData);
        toast.success(lang === 'ar' ? 'تمت إضافة العنوان بنجاح' : 'Address added successfully');
      }
      setIsModalOpen(false);
      refresh();
    } catch (err) {
      toast.error(err.message || (lang === 'ar' ? 'فشل حفظ العنوان.' : 'Failed to save address.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await userApi.updateAddress(id, { isDefault: true });
      toast.success(lang === 'ar' ? 'تم تحديث العنوان الافتراضي' : 'Default address updated');
      refresh();
    } catch {
      toast.error(lang === 'ar' ? 'فشل تحديث العنوان الافتراضي.' : 'Failed to update default address.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await userApi.deleteAddress(id);
      toast.success(lang === 'ar' ? 'تم حذف العنوان' : 'Address deleted');
      refresh();
    } catch {
      toast.error(lang === 'ar' ? 'فشل حذف العنوان.' : 'Failed to delete address.');
    }
  };

  return (
    <>
      <Helmet>
        <title>{tr.title} | El-D7E7</title>
        <meta name="description" content="Manage your saved shipping and billing addresses." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="flex flex-col gap-1">
        {/* ── Page header ── */}
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3 text-start">
          <div>
            <h1 className="text-2xl font-bold text-[var(--primary-text)]">{tr.title}</h1>
            <p className="text-sm text-[var(--secondary-text)]">
              {tr.savedAddresses(addresses.length)}
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 rounded-full bg-[#c53938] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 cursor-pointer"
          >
            <Plus size={16} />
            {tr.addNew}
          </button>
        </div>

        {/* ── Address grid ── */}
        {loading ? (
          <div className="py-16 text-center text-sm text-[var(--secondary-text)]">
            {tr.loading}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {addresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                onSetDefault={handleSetDefault}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
                tr={tr}
                lang={lang}
              />
            ))}

            <AddNewAddressCard onClick={handleOpenAdd} label={tr.addNew} />
          </div>
        )}

        {/* Add/Edit Modal */}
        <AddressModal
          address={editingAddress}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveAddress}
          isSubmitting={isSubmitting}
          tr={tr}
          lang={lang}
        />
      </div>
    </>
  );
}