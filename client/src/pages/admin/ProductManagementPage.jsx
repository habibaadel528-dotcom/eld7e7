import { useMemo, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { adminApi } from '../../services/api';

const filterTabs = ['All', 'Active', 'Low Stock', 'Out of Stock'];
const LOW_STOCK_THRESHOLD = 10;

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

  /* Modal state (for both Add and Edit) */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRawId, setEditingRawId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');

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
    setFormData({
      name: p.name || '',
      description: p.description || '',
      price: p.price || '',
      originalPrice: p.originalPrice || '',
      category: p.category || 'stationery',
      subcategory: p.subcategory || '',
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
      toast.success(`"${target?.name || 'Product'}" deleted successfully`);
    } catch (err) {
      toast.error(err.message || 'Failed to delete product.');
    }
  };

  /* Photo File Upload Handler — uploads to server, stores the returned URL */
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setModalError('Only JPG, PNG, or WEBP images are accepted.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setModalError('Image must be less than 5MB.');
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
      toast.success('Image uploaded successfully');
    } catch (err) {
      setModalError(err.message || 'Failed to upload image.');
      toast.error(err.message || 'Failed to upload image.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      setModalError('Product name and price are required.');
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
      subcategory: formData.subcategory || undefined,
      stock: Number(formData.stock) || 0,
      images: formData.image ? [formData.image] : [],
    };

    try {
      if (editingRawId && typeof editingRawId === 'string' && editingRawId.length > 10) {
        await adminApi.updateProduct(editingRawId, payload);
        toast.success(`"${formData.name}" updated successfully`);
      } else {
        await adminApi.createProduct(payload);
        toast.success(`"${formData.name}" added successfully`);
      }

      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      setModalError(err.message || 'Failed to save product.');
      toast.error(err.message || 'Failed to save product.');
    } finally {
      setIsSubmitting(false);
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
          onClick={handleOpenAdd}
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
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border-color)] text-[11px] uppercase tracking-wide text-[var(--secondary-text)]">
              <th className="px-5 py-3 font-medium">Product</th>
              <th className="px-5 py-3 font-medium">Category</th>
              <th className="px-5 py-3 font-medium">Price</th>
              <th className="px-5 py-3 font-medium">Stock</th>
              <th className="px-5 py-3 font-medium">Sold</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-color)]">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-5 py-16 text-center text-sm text-[var(--muted-text)]">
                  <span className="animate-pulse">Loading products…</span>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-16 text-center">
                  <p className="text-sm font-medium text-[var(--primary-text)]">No products found</p>
                  <p className="mt-1 text-xs text-[var(--muted-text)]">Add your first product using the button above.</p>
                </td>
              </tr>
            ) : filtered.map((p) => {
              const status = getStatus(p.stock);
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
                  <td className="px-5 py-3 text-[var(--secondary-text)]">{p.sold}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyles[status]}`}>
                      {status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(p)}
                        title="Edit product"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--secondary-text)] transition hover:bg-[var(--surface-soft)] hover:text-[var(--primary-text)]"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.06 2.06 0 1 1 2.912 2.912L7.5 19.673l-4 1 1-4L16.862 4.487Z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id)}
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
      </div>

      {/* ── Add / Edit Product Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-[var(--border-color)] bg-[var(--surface-bg)] p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
              <h2 className="text-lg font-bold text-[var(--primary-text)]">
                {editingRawId ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-[var(--secondary-text)] hover:text-[var(--primary-text)] text-lg font-bold"
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
                <label className="block text-xs font-medium text-[var(--secondary-text)] mb-1">Product Photo</label>
                <div className="flex items-center gap-4">
                  {formData.image ? (
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="h-16 w-16 rounded-xl object-cover border border-[var(--border-color)]"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-dashed border-[var(--border-color)] bg-[var(--surface-soft)] text-xs text-[var(--secondary-text)]">
                      No Photo
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="block w-full text-xs text-[var(--secondary-text)] file:mr-3 file:rounded-xl file:border-0 file:bg-[#c53938]/10 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-[#c53938] hover:file:bg-[#c53938]/20 cursor-pointer"
                    />
                    <p className="mt-1 text-[11px] text-[var(--secondary-text)]">PNG, JPG or WebP supported</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--secondary-text)]">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Spiral Notebook A4"
                  className="mt-1 h-10 w-full rounded-xl border border-[var(--border-color)] bg-[var(--surface-soft)] px-3 text-sm text-[var(--primary-text)] outline-none focus:border-[#c53938]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[var(--secondary-text)]">Price (EGP) *</label>
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
                  <label className="block text-xs font-medium text-[var(--secondary-text)]">Original Price (EGP)</label>
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
                  <label className="block text-xs font-medium text-[var(--secondary-text)]">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value, subcategory: '' })}
                    className="mt-1 h-10 w-full rounded-xl border border-[var(--border-color)] bg-[var(--surface-soft)] px-3 text-sm text-[var(--primary-text)] outline-none focus:border-[#c53938]"
                  >
                    <option value="stationery">Stationery</option>
                    <option value="cultural-books">Cultural Books</option>
                    <option value="school-books">School Books</option>
                    <option value="handcraft">Handcraft Supplies</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--secondary-text)]">Stock *</label>
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

              {/* Subcategory — shown only for Stationery */}
              {formData.category === 'stationery' && (
                <div>
                  <label className="block text-xs font-medium text-[var(--secondary-text)]">
                    Stationery Subcategory
                    <span className="ml-1 text-[var(--muted-text)]">(optional — used for filters)</span>
                  </label>
                  <select
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    className="mt-1 h-10 w-full rounded-xl border border-[var(--border-color)] bg-[var(--surface-soft)] px-3 text-sm text-[var(--primary-text)] outline-none focus:border-[#c53938]"
                  >
                    <option value="">— No Subcategory —</option>
                    <option value="Pens & Pencils">Pens &amp; Pencils</option>
                    <option value="Notebooks & Paper">Notebooks &amp; Paper</option>
                    <option value="Art Supplies">Art Supplies</option>
                    <option value="Markers & Highlighters">Markers &amp; Highlighters</option>
                    <option value="Folders & Binders">Folders &amp; Binders</option>
                    <option value="Scissors & Cutting">Scissors &amp; Cutting</option>
                    <option value="Glue & Adhesives">Glue &amp; Adhesives</option>
                    <option value="Rulers & Geometry">Rulers &amp; Geometry</option>
                    <option value="Stamps & Ink">Stamps &amp; Ink</option>
                    <option value="Bags & Cases">Bags &amp; Cases</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-[var(--secondary-text)]">Description</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Short description..."
                  className="mt-1 w-full rounded-xl border border-[var(--border-color)] bg-[var(--surface-soft)] p-3 text-sm text-[var(--primary-text)] outline-none focus:border-[#c53938]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-[var(--border-color)] px-4 py-2 text-xs font-semibold text-[var(--secondary-text)] hover:bg-[var(--surface-soft)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-[#c53938] px-5 py-2 text-xs font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : editingRawId ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}