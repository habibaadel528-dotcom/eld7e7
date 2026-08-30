import { useMemo, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { adminApi } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

const LOW_STOCK_THRESHOLD = 10;

const DEFAULT_STATIONERY_SUBCATEGORIES = [
  { value: 'Pens & Pencils', labelEn: 'Pens & Pencils', labelAr: 'أقلام ورصاص' },
  { value: 'Notebooks & Paper', labelEn: 'Notebooks & Paper', labelAr: 'كشاكيل وورق' },
  { value: 'Art Supplies', labelEn: 'Art Supplies', labelAr: 'أدوات رسم وفنون' },
  { value: 'Markers & Highlighters', labelEn: 'Markers & Highlighters', labelAr: 'أقلام تحديد وتظليل' },
  { value: 'Folders & Binders', labelEn: 'Folders & Binders', labelAr: 'ملفات ودوسيهات' },
  { value: 'Scissors & Cutting', labelEn: 'Scissors & Cutting', labelAr: 'مقصات وأدوات قطع' },
  { value: 'Glue & Adhesives', labelEn: 'Glue & Adhesives', labelAr: 'لاصق وصمغ' },
  { value: 'Rulers & Geometry', labelEn: 'Rulers & Geometry', labelAr: 'مساطر وأدوات هندسية' },
  { value: 'Stamps & Ink', labelEn: 'Stamps & Ink', labelAr: 'أختام وحبر' },
  { value: 'Bags & Cases', labelEn: 'Bags & Cases', labelAr: 'شنط ومقالم' },
  { value: 'Other', labelEn: 'Other', labelAr: 'أخرى' },
];

function getStatus(stock) {
  if (stock === 0) return 'Out of Stock';
  if (stock <= LOW_STOCK_THRESHOLD) return 'Low Stock';
  return 'Active';
}

const statusStyles = {
  Active: 'bg-emerald-100 text-emerald-600',
  'Low Stock': 'bg-amber-100 text-amber-600',
  'Out of Stock': 'bg-rose-100 text-rose-600',
};

function formatEGP(n) {
  return `EGP ${(n || 0).toLocaleString('en-US')}`;
}

export default function ProductManagementPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const { lang, t } = useLanguage();
  const tr = t('admin').products;

  const filterTabs = [
    { key: 'All', label: lang === 'ar' ? 'الكل' : 'All' },
    { key: 'Active', label: lang === 'ar' ? 'متاح' : 'Active' },
    { key: 'Low Stock', label: lang === 'ar' ? 'مخزون منخفض' : 'Low Stock' },
    { key: 'Out of Stock', label: lang === 'ar' ? 'غير متاح' : 'Out of Stock' },
  ];

  /* Modal state (for both Add and Edit) */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRawId, setEditingRawId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');
  const [isCustomSubcategory, setIsCustomSubcategory] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: 'stationery',
    stock: '',
    image: '',
  });

  const fetchProducts = () => {
    setIsLoading(true);
    adminApi.getProducts()
      .then((data) => {
        const mapped = (data.products || []).map((p) => ({
          id: p._id,
          rawId: p._id,
          name: p.name,
          description: p.description || '',
          originalPrice: p.originalPrice || '',
          category: p.category,
          subcategory: p.subcategory || '',
          price: p.price,
          stock: p.stock,
          sold: p.reviewCount || 0,
          image: p.images?.[0] || '',
        }));
        setProducts(mapped);
      })
      .catch(() => setProducts([]))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* Extract any custom subcategories previously used by existing products */
  const availableCustomSubcategories = useMemo(() => {
    const customSet = new Set();
    products.forEach((p) => {
      if (
        p.subcategory &&
        !DEFAULT_STATIONERY_SUBCATEGORIES.some(
          (d) => d.value.toLowerCase() === p.subcategory.trim().toLowerCase()
        )
      ) {
        customSet.add(p.subcategory.trim());
      }
    });
    return Array.from(customSet);
  }, [products]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const status = getStatus(p.stock);
      const matchesFilter = activeFilter === 'All' || status === activeFilter;
      const matchesQuery =
        !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [products, query, activeFilter]);

  const handleOpenAdd = () => {
    setEditingRawId(null);
    setIsCustomSubcategory(false);
    setFormData({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      category: 'stationery',
      subcategory: '',
      stock: '',
      image: '',
    });
    setModalError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingRawId(p.rawId || p.id);
    const sub = p.subcategory || '';
    const isCustom =
      Boolean(sub) &&
      !DEFAULT_STATIONERY_SUBCATEGORIES.some(
        (d) => d.value.toLowerCase() === sub.trim().toLowerCase()
      );
    setIsCustomSubcategory(isCustom);
    setFormData({
      name: p.name || '',
      description: p.description || '',
      price: p.price || '',
      originalPrice: p.originalPrice || '',
      category: p.category || 'stationery',
      subcategory: sub,
      stock: p.stock !== undefined ? p.stock : '',
      image: p.image || '',
    });
    setModalError('');
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const target = products.find((p) => p.id === id);
    try {
      if (target?.rawId) {
        await adminApi.deleteProduct(target.rawId);
      }
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success(lang === 'ar' ? `تم حذف "${target?.name || 'المنتج'}" بنجاح` : `"${target?.name || 'Product'}" deleted successfully`);
    } catch (err) {
      toast.error(err.message || (lang === 'ar' ? 'فشل حذف المنتج.' : 'Failed to delete product.'));
    }
  };

  /* Photo File Upload Handler */
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setModalError(lang === 'ar' ? 'يُقبل فقط صور JPG أو PNG أو WEBP.' : 'Only JPG, PNG, or WEBP images are accepted.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setModalError(lang === 'ar' ? 'حجم الصورة يجب ألا يتجاوز 5 ميجابايت.' : 'Image must be less than 5MB.');
      return;
    }

    setModalError('');
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('authToken');
      const fd = new FormData();
      fd.append('image', file);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/upload`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Upload failed.');

      setFormData((prev) => ({ ...prev, image: result.data.url }));
      toast.success(lang === 'ar' ? 'تم رفع الصورة بنجاح' : 'Image uploaded successfully');
    } catch (err) {
      setModalError(err.message || (lang === 'ar' ? 'فشل رفع الصورة.' : 'Failed to upload image.'));
      toast.error(err.message || (lang === 'ar' ? 'فشل رفع الصورة.' : 'Failed to upload image.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      setModalError(lang === 'ar' ? 'اسم المنتج والسعر مطلوبان.' : 'Product name and price are required.');
      return;
    }

    setIsSubmitting(true);
    setModalError('');

    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      category: formData.category,
      subcategory: formData.subcategory ? formData.subcategory.trim() : undefined,
      stock: Number(formData.stock) || 0,
      images: formData.image ? [formData.image] : [],
    };

    try {
      if (editingRawId && typeof editingRawId === 'string' && editingRawId.length > 10) {
        await adminApi.updateProduct(editingRawId, payload);
        toast.success(lang === 'ar' ? `تم تحديث "${formData.name}" بنجاح` : `"${formData.name}" updated successfully`);
      } else {
        await adminApi.createProduct(payload);
        toast.success(lang === 'ar' ? `تمت إضافة "${formData.name}" بنجاح` : `"${formData.name}" added successfully`);
      }

      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      setModalError(err.message || (lang === 'ar' ? 'فشل حفظ المنتج.' : 'Failed to save product.'));
      toast.error(err.message || (lang === 'ar' ? 'فشل حفظ المنتج.' : 'Failed to save product.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 text-start">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary-text)]">{tr.title}</h1>
          <p className="text-sm text-[var(--secondary-text)]">{products.length} {tr.totalProducts.toLowerCase()}</p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="flex items-center gap-2 rounded-lg bg-[#c53938] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 cursor-pointer"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" d="M12 5v14M5 12h14" />
          </svg>
          {tr.addProduct}
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
            className="h-11 w-full rounded-full border border-[var(--border-color)] bg-[var(--surface-bg)] ltr:pl-10 ltr:pr-4 rtl:pr-10 rtl:pl-4 text-sm text-[var(--primary-text)] placeholder-[var(--secondary-text)] focus:border-[#c53938] focus:outline-none focus:ring-2 focus:ring-[#c53938]/20"
          />
        </div>

        <div className="flex items-center gap-1 rounded-full border border-[var(--border-color)] bg-[var(--surface-bg)] p-1">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveFilter(tab.key)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition cursor-pointer ${
                activeFilter === tab.key
                  ? 'bg-[#c53938] text-white'
                  : 'text-[var(--secondary-text)] hover:text-[var(--primary-text)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto rounded-2xl border border-[var(--border-color)] bg-[var(--surface-bg)]">
        <table className="w-full min-w-[820px] text-start text-sm">
          <thead>
            <tr className="border-b border-[var(--border-color)] text-[11px] uppercase tracking-wide text-[var(--secondary-text)]">
              <th className="px-5 py-3 font-medium text-start">{tr.name}</th>
              <th className="px-5 py-3 font-medium text-start">{tr.category}</th>
              <th className="px-5 py-3 font-medium text-start">{tr.price}</th>
              <th className="px-5 py-3 font-medium text-start">{tr.stock}</th>
              <th className="px-5 py-3 font-medium text-start">{lang === 'ar' ? 'المباع' : 'Sold'}</th>
              <th className="px-5 py-3 font-medium text-start">{tr.status}</th>
              <th className="px-5 py-3 text-end font-medium">{tr.action}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-color)]">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-5 py-16 text-center text-sm text-[var(--muted-text)]">
                  <span className="animate-pulse">{lang === 'ar' ? 'جارٍ تحميل المنتجات…' : 'Loading products…'}</span>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-16 text-center">
                  <p className="text-sm font-medium text-[var(--primary-text)]">{tr.noResults}</p>
                  <p className="mt-1 text-xs text-[var(--muted-text)]">{lang === 'ar' ? 'أضف أول منتج باستخدام الزر أعلاه.' : 'Add your first product using the button above.'}</p>
                </td>
              </tr>
            ) : filtered.map((p) => {
              const status = getStatus(p.stock);
              const statusLabel =
                status === 'Active' ? (lang === 'ar' ? 'متاح' : 'Active')
                : status === 'Low Stock' ? (lang === 'ar' ? 'مخزون منخفض' : 'Low Stock')
                : (lang === 'ar' ? 'غير متاح' : 'Out of Stock');

              return (
                <tr key={p.id} className="transition hover:bg-[var(--surface-soft)]">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {p.image ? (
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-10 w-10 shrink-0 rounded-lg object-cover border border-[var(--border-color)]"
                        />
                      ) : (
                        <div className="h-10 w-10 shrink-0 rounded-lg border border-[var(--border-color)] bg-[var(--surface-soft)] flex items-center justify-center text-[var(--muted-text)]">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M6.75 21h10.5a2.25 2.25 0 0 0 2.25-2.25V5.25a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 6.75 21Z" />
                          </svg>
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-[var(--primary-text)]">{p.name}</p>
                        {p.subcategory && (
                          <p className="text-[11px] text-[var(--secondary-text)]">{p.subcategory}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="rounded-full bg-[var(--surface-soft)] px-2.5 py-1 text-xs text-[var(--secondary-text)]">
                      {p.category}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-semibold text-[var(--primary-text)]">{formatEGP(p.price)}</td>
                  <td
                    className={`px-5 py-3 font-medium ${
                      p.stock === 0
                        ? 'text-[#c53938]'
                        : p.stock <= LOW_STOCK_THRESHOLD
                        ? 'text-amber-600'
                        : 'text-[var(--primary-text)]'
                    }`}
                  >
                    {p.stock}
                  </td>
                  <td className="px-5 py-3 text-[var(--secondary-text)]">{p.sold}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyles[status]}`}>
                      {statusLabel}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(p)}
                        title={tr.edit}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--secondary-text)] transition hover:bg-[var(--surface-soft)] hover:text-[var(--primary-text)] cursor-pointer"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.06 2.06 0 1 1 2.912 2.912L7.5 19.673l-4 1 1-4L16.862 4.487Z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id)}
                        title={tr.delete}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--secondary-text)] transition hover:bg-[#c53938]/10 hover:text-[#c53938] cursor-pointer"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M9 7V4h6v3m-8 0 1 13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-13" />
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

      {/* ── Add / Edit Product Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-[var(--border-color)] bg-[var(--surface-bg)] p-6 shadow-xl text-start">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
              <h2 className="text-lg font-bold text-[var(--primary-text)]">
                {editingRawId ? (lang === 'ar' ? 'تعديل المنتج' : 'Edit Product') : (lang === 'ar' ? 'إضافة منتج جديد' : 'Add New Product')}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-[var(--secondary-text)] hover:text-[var(--primary-text)] text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {modalError && (
                <p className="rounded-lg bg-rose-100 p-2.5 text-xs text-rose-600">{modalError}</p>
              )}

              {/* Photo Upload Section */}
              <div>
                <label className="block text-xs font-medium text-[var(--secondary-text)] mb-1">
                  {lang === 'ar' ? 'صورة المنتج' : 'Product Photo'}
                </label>
                <div className="flex items-center gap-4">
                  {formData.image ? (
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="h-16 w-16 rounded-xl object-cover border border-[var(--border-color)]"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-dashed border-[var(--border-color)] bg-[var(--surface-soft)] text-xs text-[var(--secondary-text)]">
                      {lang === 'ar' ? 'لا توجد صورة' : 'No Photo'}
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="block w-full text-xs text-[var(--secondary-text)] file:mx-2 file:rounded-xl file:border-0 file:bg-[#c53938]/10 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-[#c53938] hover:file:bg-[#c53938]/20 cursor-pointer"
                    />
                    <p className="mt-1 text-[11px] text-[var(--secondary-text)]">
                      {lang === 'ar' ? 'يدعم صيغ PNG و JPG و WebP' : 'PNG, JPG or WebP supported'}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--secondary-text)]">
                  {lang === 'ar' ? 'اسم المنتج *' : 'Product Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={lang === 'ar' ? 'مثال: كشكول سلك مقاس A4' : 'e.g. Spiral Notebook A4'}
                  className="mt-1 h-10 w-full rounded-xl border border-[var(--border-color)] bg-[var(--surface-soft)] px-3 text-sm text-[var(--primary-text)] outline-none focus:border-[#c53938]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[var(--secondary-text)]">
                    {lang === 'ar' ? 'السعر (ج.م) *' : 'Price (EGP) *'}
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="85"
                    className="mt-1 h-10 w-full rounded-xl border border-[var(--border-color)] bg-[var(--surface-soft)] px-3 text-sm text-[var(--primary-text)] outline-none focus:border-[#c53938]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--secondary-text)]">
                    {lang === 'ar' ? 'السعر قبل الخصم (ج.م)' : 'Original Price (EGP)'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    placeholder="110"
                    className="mt-1 h-10 w-full rounded-xl border border-[var(--border-color)] bg-[var(--surface-soft)] px-3 text-sm text-[var(--primary-text)] outline-none focus:border-[#c53938]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[var(--secondary-text)]">
                    {lang === 'ar' ? 'الفئة *' : 'Category *'}
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value, subcategory: '' })}
                    className="mt-1 h-10 w-full rounded-xl border border-[var(--border-color)] bg-[var(--surface-soft)] px-3 text-sm text-[var(--primary-text)] outline-none focus:border-[#c53938] cursor-pointer"
                  >
                    <option value="stationery">{lang === 'ar' ? 'الأدوات المكتبية' : 'Stationery'}</option>
                    <option value="cultural-books">{lang === 'ar' ? 'الكتب الثقافية' : 'Cultural Books'}</option>
                    <option value="school-books">{lang === 'ar' ? 'الكتب الخارجية' : 'School Books'}</option>
                    <option value="handcraft">{lang === 'ar' ? 'الأعمال اليدوية' : 'Handcraft Supplies'}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--secondary-text)]">
                    {lang === 'ar' ? 'المخزون *' : 'Stock *'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="50"
                    className="mt-1 h-10 w-full rounded-xl border border-[var(--border-color)] bg-[var(--surface-soft)] px-3 text-sm text-[var(--primary-text)] outline-none focus:border-[#c53938]"
                  />
                </div>
              </div>

              {/* Subcategory — shown for Stationery */}
              {formData.category === 'stationery' && (
                <div className="rounded-xl border border-[var(--border-color)] bg-[var(--surface-soft)]/50 p-3.5 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <label className="block text-xs font-semibold text-[var(--primary-text)]">
                      {lang === 'ar' ? 'التصنيف الفرعي للأدوات' : 'Stationery Subcategory'}
                      <span className="mx-1 text-[11px] font-normal text-[var(--muted-text)]">
                        {lang === 'ar' ? '(يستخدم في فلاتر المتجر)' : '(used for store filters)'}
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomSubcategory((prev) => !prev);
                        if (isCustomSubcategory) {
                          setFormData((prev) => ({ ...prev, subcategory: '' }));
                        }
                      }}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#c53938] hover:underline cursor-pointer"
                    >
                      {isCustomSubcategory
                        ? (lang === 'ar' ? '📋 اختيار من القائمة' : '📋 Choose from list')
                        : (lang === 'ar' ? '➕ كتابة تصنيف جديد' : '➕ Add custom')}
                    </button>
                  </div>

                  {isCustomSubcategory ? (
                    <div className="space-y-1">
                      <input
                        type="text"
                        value={formData.subcategory}
                        onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                        placeholder={
                          lang === 'ar'
                            ? 'اكتب اسم التصنيف الفرعي الجديد (مثال: دفاتر جامعية، حاسبات، برايات...)'
                            : 'Type custom subcategory name (e.g. Sticky Notes, Calculators...)'
                        }
                        autoFocus
                        className="h-10 w-full rounded-xl border border-[#c53938] bg-[var(--surface-bg)] px-3 text-sm text-[var(--primary-text)] outline-none focus:ring-2 focus:ring-[#c53938]/20"
                      />
                      {formData.subcategory ? (
                        <p className="text-[11px] text-emerald-600 font-medium">
                          {lang === 'ar'
                            ? `✓ سيتم إضافة "${formData.subcategory}" تلقائياً إلى تصنيفات المتجر`
                            : `✓ "${formData.subcategory}" will appear in store filters`}
                        </p>
                      ) : (
                        <p className="text-[11px] text-[var(--muted-text)]">
                          {lang === 'ar'
                            ? 'اكتب أي تصنيف فرعي تريده وسيتم ربطه بالمنتج وعرضه في الفلاتر.'
                            : 'Enter any custom subcategory name to organize and filter your products.'}
                        </p>
                      )}
                    </div>
                  ) : (
                    <select
                      value={formData.subcategory}
                      onChange={(e) => {
                        if (e.target.value === '__add_custom__') {
                          setIsCustomSubcategory(true);
                          setFormData({ ...formData, subcategory: '' });
                        } else {
                          setFormData({ ...formData, subcategory: e.target.value });
                        }
                      }}
                      className="h-10 w-full rounded-xl border border-[var(--border-color)] bg-[var(--surface-bg)] px-3 text-sm text-[var(--primary-text)] outline-none focus:border-[#c53938] cursor-pointer"
                    >
                      <option value="">{lang === 'ar' ? '— بدون تصنيف فرعي —' : '— No Subcategory —'}</option>

                      <optgroup label={lang === 'ar' ? 'التصنيفات الأساسية' : 'Standard Subcategories'}>
                        {DEFAULT_STATIONERY_SUBCATEGORIES.map((item) => (
                          <option key={item.value} value={item.value}>
                            {lang === 'ar' ? item.labelAr : item.labelEn}
                          </option>
                        ))}
                      </optgroup>

                      {availableCustomSubcategories.length > 0 && (
                        <optgroup label={lang === 'ar' ? 'التصنيفات المخصصة المضافة' : 'Previously Added Custom Subcategories'}>
                          {availableCustomSubcategories.map((sub) => (
                            <option key={sub} value={sub}>
                              {sub}
                            </option>
                          ))}
                        </optgroup>
                      )}

                      <option value="__add_custom__" className="text-[#c53938] font-bold">
                        {lang === 'ar' ? '➕ + كتابة تصنيف فرعي مخصص جديد...' : '➕ + Write new custom subcategory...'}
                      </option>
                    </select>
                  )}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-[var(--secondary-text)]">
                  {lang === 'ar' ? 'الوصف' : 'Description'}
                </label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={lang === 'ar' ? 'وصف مختصر للمنتج...' : 'Short description...'}
                  className="mt-1 w-full rounded-xl border border-[var(--border-color)] bg-[var(--surface-soft)] p-3 text-sm text-[var(--primary-text)] outline-none focus:border-[#c53938]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-[var(--border-color)] px-4 py-2 text-xs font-semibold text-[var(--secondary-text)] hover:bg-[var(--surface-soft)] cursor-pointer"
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-[#c53938] px-5 py-2 text-xs font-semibold text-white transition hover:opacity-90 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (lang === 'ar' ? 'جارٍ الحفظ...' : 'Saving...') : editingRawId ? (lang === 'ar' ? 'تحديث المنتج' : 'Update Product') : (lang === 'ar' ? 'إنشاء المنتج' : 'Create Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}