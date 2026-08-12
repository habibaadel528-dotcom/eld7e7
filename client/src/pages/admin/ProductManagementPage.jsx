import { useMemo, useState } from 'react';

/* ── Product images ── */
/* ── Product images ── */
import sonyImg from '../../assets/images/admin/Image (Sony WH-1000XM5).svg';
import nikeImg from '../../assets/images/admin/Image (Nike Air Max 270).svg';
import macbookImg from '../../assets/images/admin/order-laptop.png';
import fossilImg from '../../assets/images/admin/Image (Fossil Gen 6 Watch).svg';
import iphoneImg from '../../assets/images/admin/order-phone.png';
import coachImg from '../../assets/images/admin/order-bag.png';
import rayBanImg from '../../assets/images/admin/order-sunglasses.png';
import nespressoImg from '../../assets/images/admin/order-coffee.png';
/* ── Mock data — replace with real API data later. ── */
const initialProducts = [
  { id: 1, name: 'Sony WH-1000XM5', category: 'Electronics', price: 4299, stock: 34, sold: 128, image: sonyImg },
  { id: 2, name: 'Nike Air Max 270', category: 'Fashion', price: 2199, stock: 0, sold: 214, image: nikeImg },
  { id: 3, name: 'MacBook Air M3', category: 'Electronics', price: 28999, stock: 12, sold: 89, image: macbookImg },
  { id: 4, name: 'Fossil Gen 6 Watch', category: 'Accessories', price: 5499, stock: 5, sold: 67, image: fossilImg },
  { id: 5, name: 'iPhone 15 Pro Max', category: 'Electronics', price: 39999, stock: 28, sold: 312, image: iphoneImg },
  { id: 6, name: 'Coach Leather Bag', category: 'Fashion', price: 3899, stock: 18, sold: 45, image: coachImg },
  { id: 7, name: 'Ray-Ban Aviator', category: 'Accessories', price: 1799, stock: 0, sold: 98, image: rayBanImg },
  { id: 8, name: 'Nespresso Vertuo', category: 'Home', price: 3299, stock: 9, sold: 32, image: nespressoImg },
];

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
  return `EGP ${n.toLocaleString('en-US')}`;
}

export default function ProductManagementPage() {
  const [products, setProducts] = useState(initialProducts);
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

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

  const handleDelete = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
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
            {filtered.map((p) => {
              const status = getStatus(p.stock);
              return (
                <tr key={p.id} className="transition hover:bg-[var(--surface-soft)]">
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
    </div>
  );
}