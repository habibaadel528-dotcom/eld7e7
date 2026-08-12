import { Filter, ShoppingCart } from 'lucide-react';

export default function WishlistToolbar({ totalItems }) {
  return (
    <div className="flex items-start justify-between mb-8">
      {/* Left */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>

        <p className="text-gray-500 mt-1">{totalItems} saved items</p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="flex items-center gap-2 px-5 py-3 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition"
        >
          <Filter size={18} />
          <span className="font-medium">Filter</span>
        </button>

        <button
          type="button"
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 transition text-white px-6 py-3 rounded-xl font-medium"
        >
          <ShoppingCart size={18} />
          Add All to Cart
        </button>
      </div>
    </div>
  );
}
