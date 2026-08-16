import { useEffect, useMemo, useState } from 'react';
import {
  getProducts,
  createProductRequest,
  updateProductRequest,
  deleteProductRequest,
  uploadImageRequest,
} from '../../services/api';

const filterTabs = ['All', 'Active', 'Low Stock', 'Out of Stock'];
const LOW_STOCK_THRESHOLD = 10;
const CATEGORY_OPTIONS = ['Stationery', 'Cultural Books', 'Handcraft Supplies', 'School Books'];

const emptyForm = {
  name: '',
  category: CATEGORY_OPTIONS[0],
  subCategory: '',
  image: '',
  price: '',
  oldPrice: '',
  stock: '',
  color: '',
};

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
  return `EGP ${Number(n).toLocaleString('en-US')}`;
}

function slugify(text) {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default function ProductManagementPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  async function fetchAllProducts() {
    setIsLoading(true);
    setLoadError('');

    try {
      const { data } = await getProducts({ limit: 100 });
      setProducts(data);
    } catch (error) {
      setLoadError(error.message || 'تعذر تحميل المنتجات');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchAllProducts();
  }, []);

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

  const openAddModal = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      category: product.category,
      subCategory: product.subCategory || '',
      image: product.image,
      price: product.price,
      oldPrice: product.oldPrice ?? '',
      stock: product.stock,
      color: product.color || '',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleFormChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormError('');
    setIsUploading(true);

    try {
      const { data } = await uploadImageRequest(file);
      setForm((prev) => ({ ...prev, image: data.url }));
    } catch (error) {
      setFormError(error.message || 'تعذر رفع الصورة');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!form.name.trim() || !form.image.trim() || !form.price || form.stock === '') {
      setFormError('الاسم والصورة والسعر والكمية حقول مطلوبة');
      return;
    }

    const payload = {
      name: form.name.trim(),
      category: form.category,
      subCategory: form.subCategory.trim(),
      image: form.image.trim(),
      color: form.color.trim(),
      price: Number(form.price),
      oldPrice: form.oldPrice === '' ? undefined : Number(form.oldPrice),
      stock: Number(form.stock),
    };

    if (!editingProduct) {
      payload.slug = slugify(form.name);
    }

    setIsSaving(true);

    try {
      if (editingProduct) {
        await updateProductRequest(editingProduct._id, payload);
      } else {
        await createProductRequest(payload);
      }

      closeModal();
      await fetchAllProducts();
    } catch (error) {
      setFormError(error.message || 'حصل خطأ أثناء الحفظ');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (product) => {
    const confirmed = window.confirm(`متأكدة إنك عايزة تحذفي "${product.name}"؟`);
    if (!confirmed) return;

    try {
      await deleteProductRequest(product._id);
      setProducts((prev) => prev.filter((p) => p._id !== product._id));
    } catch (error) {
      window.alert(error.message || 'تعذر حذف المنتج');
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary-text)]">Product Management</h1>
          <p className="text-sm text-[var(--secondary-text)]">{products.length} products listed</p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-lg bg-[#c53938] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" d="M12 5v14M5 12h14" />
          </svg>
          Add Product
        </button>
      </div>

      {/* ── Search + filters ── */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[240px] flex-1">
          <svg className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--secondary-text)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path strokeLinecap="round" d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="h-11 w-full rounded-full border border-[var(--border-color)] bg-[var(--surface-bg)] pl-10 pr-4 text-sm text-[var(--primary-text)] placeholder-[var(--secondary-text)] focus:border-[#c53938] focus:outline-none focus:ring-2 focus:ring-[#c53938]/20"
          />
        </div>

        <div className="flex items-center gap-1 rounded-full border border-[var(--border-color)] bg-[var(--surface-bg)] p-1">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveFilter(tab)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                activeFilter === tab
                  ? 'bg-[#c53938] text-white'
                  : 'text-[var(--secondary-text)] hover:text-[var(--primary-text)]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto rounded-2xl border border-[var(--border-color)] bg-[var(--surface-bg)]">
        {isLoading ? (
          <p className="px-5 py-10 text-center text-sm text-[var(--secondary-text)]">Loading products…</p>
        ) : loadError ? (
          <p className="px-5 py-10 text-center text-sm text-[#c53938]">{loadError}</p>
        ) : (
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border-color)] text-[11px] uppercase tracking-wide text-[var(--secondary-text)]">
                <th className="px-5 py-3 font-medium">Product</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Price</th>
                <th className="px-5 py-3 font-medium">Stock</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {filtered.map((p) => {
                const status = getStatus(p.stock);
                return (
                  <tr key={p._id} className="transition hover:bg-[var(--surface-soft)]">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-10 w-10 shrink-0 rounded-lg object-cover"
                        />
                        <p className="font-medium text-[var(--primary-text)]">{p.name}</p>
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
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyles[status]}`}>
                        {status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(p)}
                          title="Edit product"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--secondary-text)] transition hover:bg-[var(--surface-soft)] hover:text-[var(--primary-text)]"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.06 2.06 0 1 1 2.912 2.912L7.5 19.673l-4 1 1-4L16.862 4.487Z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(p)}
                          title="Delete product"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--secondary-text)] transition hover:bg-[#c53938]/10 hover:text-[#c53938]"
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
        )}
      </div>

      {/* ── Add / Edit modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-[var(--surface-bg)] p-6 shadow-xl">
            <h2 className="mb-4 text-lg font-bold text-[var(--primary-text)]">
              {editingProduct ? 'Edit Product' : 'Add Product'}
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <label className="text-sm text-[var(--secondary-text)]">
                Name
                <input
                  type="text"
                  value={form.name}
                  onChange={handleFormChange('name')}
                  className="mt-1 h-10 w-full rounded-lg border border-[var(--border-color)] bg-[var(--page-bg)] px-3 text-sm text-[var(--primary-text)] focus:border-[#c53938] focus:outline-none"
                />
              </label>

              <label className="text-sm text-[var(--secondary-text)]">
                Category
                <select
                  value={form.category}
                  onChange={handleFormChange('category')}
                  className="mt-1 h-10 w-full rounded-lg border border-[var(--border-color)] bg-[var(--page-bg)] px-3 text-sm text-[var(--primary-text)] focus:border-[#c53938] focus:outline-none"
                >
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </label>

              <label className="text-sm text-[var(--secondary-text)]">
                Sub-category (optional, e.g. Pens, Erasers)
                <input
                  type="text"
                  value={form.subCategory}
                  onChange={handleFormChange('subCategory')}
                  className="mt-1 h-10 w-full rounded-lg border border-[var(--border-color)] bg-[var(--page-bg)] px-3 text-sm text-[var(--primary-text)] focus:border-[#c53938] focus:outline-none"
                />
              </label>

              <label className="text-sm text-[var(--secondary-text)]">
                Product Image
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp, image/gif"
                  onChange={handleImageUpload}
                  className="mt-1 block w-full text-sm text-[var(--primary-text)] file:mr-3 file:rounded-lg file:border-0 file:bg-[#c53938] file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:opacity-90"
                />

                {isUploading && (
                  <p className="mt-1 text-xs text-[var(--secondary-text)]">جاري رفع الصورة…</p>
                )}

                {form.image && !isUploading && (
                  <img
                    src={form.image}
                    alt="Preview"
                    className="mt-2 h-20 w-20 rounded-lg object-cover"
                  />
                )}
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="text-sm text-[var(--secondary-text)]">
                  Price
                  <input
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={handleFormChange('price')}
                    className="mt-1 h-10 w-full rounded-lg border border-[var(--border-color)] bg-[var(--page-bg)] px-3 text-sm text-[var(--primary-text)] focus:border-[#c53938] focus:outline-none"
                  />
                </label>

                <label className="text-sm text-[var(--secondary-text)]">
                  Old Price (optional)
                  <input
                    type="number"
                    step="0.01"
                    value={form.oldPrice}
                    onChange={handleFormChange('oldPrice')}
                    className="mt-1 h-10 w-full rounded-lg border border-[var(--border-color)] bg-[var(--page-bg)] px-3 text-sm text-[var(--primary-text)] focus:border-[#c53938] focus:outline-none"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="text-sm text-[var(--secondary-text)]">
                  Stock
                  <input
                    type="number"
                    value={form.stock}
                    onChange={handleFormChange('stock')}
                    className="mt-1 h-10 w-full rounded-lg border border-[var(--border-color)] bg-[var(--page-bg)] px-3 text-sm text-[var(--primary-text)] focus:border-[#c53938] focus:outline-none"
                  />
                </label>

                <label className="text-sm text-[var(--secondary-text)]">
                  Color (optional)
                  <input
                    type="text"
                    value={form.color}
                    onChange={handleFormChange('color')}
                    className="mt-1 h-10 w-full rounded-lg border border-[var(--border-color)] bg-[var(--page-bg)] px-3 text-sm text-[var(--primary-text)] focus:border-[#c53938] focus:outline-none"
                  />
                </label>
              </div>

              {formError && <p className="text-sm text-[#c53938]">{formError}</p>}

              <div className="mt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border border-[var(--border-color)] px-4 py-2 text-sm font-medium text-[var(--secondary-text)] hover:bg-[var(--surface-soft)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isUploading}
                  className="rounded-lg bg-[#c53938] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
                >
                  {isSaving ? 'Saving…' : editingProduct ? 'Save Changes' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
