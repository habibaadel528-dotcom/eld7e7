import { Heart, ShoppingBag } from 'lucide-react';
import WishlistCard from './WishlistCard';

export default function WishlistGrid({ products = [], loading = false, onRemove, onAddToCart }) {
  if (loading) {
    return (
      <div className="py-16 text-center text-sm text-[var(--secondary-text)]">
        Loading your wishlist...
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface-bg)] p-12 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--surface-soft)] text-[var(--secondary-text)]">
          <Heart size={28} className="text-[#C53938]" />
        </div>
        <h3 className="text-base font-bold text-[var(--primary-text)]">Your wishlist is empty</h3>
        <p className="mt-1 text-xs text-[var(--secondary-text)] max-w-sm mx-auto">
          Save your favorite products to your wishlist so you can find them easily whenever you're ready to shop!
        </p>
        <a
          href="/stationery"
          className="mt-5 inline-flex items-center rounded-xl bg-[#C53938] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#a82d2c]"
        >
          Explore Products
        </a>
      </div>
    );
  }

  return (
    <section>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <WishlistCard
            key={product._id || product.id}
            product={product}
            onRemove={onRemove}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </section>
  );
}
