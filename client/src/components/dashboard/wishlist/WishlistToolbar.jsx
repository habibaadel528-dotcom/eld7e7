import { Search, ShoppingCart, ArrowUpDown } from 'lucide-react';

export default function WishlistToolbar({
  totalItems,
  onAddAllToCart,
  search,
  onSearchChange,
  sortBy,
  onSortChange,
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
      {/* Title & Count */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--primary-text)]">My Wishlist</h1>
        <p className="text-xs text-[var(--secondary-text)] mt-1">
          {totalItems} {totalItems === 1 ? 'saved item' : 'saved items'}
        </p>
      </div>

      {/* Actions / Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 sm:w-64 sm:flex-initial">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--secondary-text)]" size={16} />
          <input
            type="text"
            value={search || ''}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            placeholder="Search wishlist..."
            className="h-10 w-full rounded-xl border border-[var(--border-color)] bg-[var(--surface-bg)] pl-9 pr-3 text-xs text-[var(--primary-text)] outline-none focus:border-[#C53938]"
          />
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            value={sortBy || 'newest'}
            onChange={(e) => onSortChange && onSortChange(e.target.value)}
            className="h-10 rounded-xl border border-[var(--border-color)] bg-[var(--surface-bg)] px-3 text-xs font-medium text-[var(--primary-text)] outline-none focus:border-[#C53938]"
          >
            <option value="newest">Sort: Latest Added</option>
            <option value="price-low">Sort: Price Low to High</option>
            <option value="price-high">Sort: Price High to Low</option>
            <option value="name">Sort: Name A-Z</option>
          </select>
        </div>

        {/* Add All to Cart */}
        {totalItems > 0 && (
          <button
            type="button"
            onClick={onAddAllToCart}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#C53938] px-4 text-xs font-semibold text-white transition hover:bg-[#a82d2c]"
          >
            <ShoppingCart size={16} />
            <span>Add All to Cart</span>
          </button>
        )}
      </div>
    </div>
  );
}
