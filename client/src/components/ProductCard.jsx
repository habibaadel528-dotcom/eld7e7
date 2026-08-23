import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';

const FALLBACK_IMG = 'https://placehold.co/200x200/f5f5f5/9ca3af?text=No+Image';

export default function ProductCard({ product, onAddToCart }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const productId = product._id || product.id;
  const isSaved = isInWishlist(productId);
  const imageSrc =
    product.image ||
    (Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : null) ||
    FALLBACK_IMG;

  return (
    <article className="group relative flex min-h-[401px] flex-col overflow-hidden rounded-[15px] border border-[var(--border-color)] bg-[var(--surface-bg)] p-4 transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_35px_rgba(0,0,0,0.12)]">
      {/* Image container & Wishlist Heart button */}
      <div className="relative flex min-h-[205px] items-center justify-center overflow-hidden rounded-[15px] bg-[var(--page-bg)]">
        <Link
          to={`/products/${product.slug}`}
          className="flex h-full w-full items-center justify-center"
          aria-label={`View ${product.name}`}
        >
          <img
            src={imageSrc}
            alt={`${product.name} cover`}
            loading="lazy"
            decoding="async"
            className="h-[182px] w-auto object-contain transition duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Wishlist Heart Icon */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          aria-label={isSaved ? "Remove from Wishlist" : "Add to Wishlist"}
          title={isSaved ? "Remove from Wishlist" : "Add to Wishlist"}
          className="absolute right-2.5 top-2.5 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition hover:scale-110 active:scale-95"
        >
          <Heart
            size={16}
            className={isSaved ? "fill-[#c53938] text-[#c53938]" : "text-gray-500 hover:text-[#c53938]"}
          />
        </button>
      </div>

      <div className="mt-4 flex flex-1 flex-col">
        <p className="m-0 text-xs leading-5 text-[var(--muted-text)]">
          {product.category}
        </p>

        <Link
          to={`/products/${product.slug}`}
          className="mt-1 line-clamp-2 min-h-[40px] text-[15px] leading-5 text-[var(--primary-text)] transition hover:text-[#c94545]"
        >
          {product.name}
        </Link>

        <div
          className="mb-2 flex items-center gap-2"
          aria-label={`${product.rating} out of 5 stars`}
        >
          <span className="text-sm tracking-[2px] text-[#f4b740]">
            ★★★★★
          </span>

          <span className="text-[11px] text-[var(--muted-text)]">
            ({product.rating})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="mb-2 text-lg font-bold text-[#359a03]">
            EGP {Number(product.price || 0).toFixed(2)}
          </span>

          {(product.oldPrice || product.originalPrice) && (
            <span className="text-[11px] text-[var(--muted-text)] line-through">
              EGP {Number(product.oldPrice || product.originalPrice).toFixed(2)}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => onAddToCart && onAddToCart(product)}
          className="mt-auto flex h-[34px] w-full items-center justify-center gap-2 rounded-full bg-[#c94545] px-5 text-sm font-medium text-white transition hover:bg-[#ef5350] active:scale-[0.98]"
        >
          <span aria-hidden="true">🛒</span>
          <span>Add</span>
          <span aria-hidden="true">+</span>
        </button>
      </div>
    </article>
  );
}