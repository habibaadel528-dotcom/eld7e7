import { ChevronLeft, ChevronRight } from 'lucide-react';

import WishlistCard from './WishlistCard';
import { wishlistProducts } from '../../../data/wishlistProducts';

export default function WishlistGrid() {
  return (
    <section>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {wishlistProducts.map((product) => (
          <WishlistCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination (visual only) */}
      <div className="mt-8 flex items-center justify-center gap-2">
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50"
        >
          <ChevronLeft size={16} />
        </button>

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C53938] text-sm font-medium text-white"
        >
          1
        </button>

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          2
        </button>

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          3
        </button>

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </section>
  );
}
