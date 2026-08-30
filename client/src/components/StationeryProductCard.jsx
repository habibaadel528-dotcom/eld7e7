import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useLanguage } from '../context/LanguageContext';

const FALLBACK_IMG = 'https://placehold.co/200x200/f5f5f5/9ca3af?text=No+Image';

export default function StationeryProductCard({
  product,
  onAddToCart,
}) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { t } = useLanguage();
  const tr = t('products');

  const statusConfig = {
    in:   { label: tr.inStock,    className: 'bg-[#82c988]' },
    out:  { label: tr.outOfStock, className: 'bg-[#c53938]' },
    soon: { label: 'Soon',        className: 'bg-[#ffc62a]' },
  };

  const status = statusConfig[product.status] ?? statusConfig.in;
  const canAddToCart = product.status === 'in';
  const productId = product._id || product.id;
  const isSaved = isInWishlist(productId);
  const imageSrc =
    product.image ||
    (Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : null) ||
    FALLBACK_IMG;

  return (
    <article className="group relative flex min-h-[401px] flex-col overflow-hidden rounded-[15px] border border-[var(--border-color)] bg-[var(--surface-bg)] p-4 transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_35px_rgba(0,0,0,0.12)]">
      <span
        className={`absolute left-0 top-0 z-10 rounded-br-[28px] px-3 py-2 text-xs font-medium text-white ${status.className}`}
      >
        {status.label}
      </span>

      <div className="relative flex h-[205px] items-center justify-center overflow-hidden rounded-[15px] bg-[var(--page-bg)]">
        <Link
          to={`/products/${product.slug}`}
          aria-label={`View ${product.name}`}
          className="flex h-full w-full items-center justify-center"
        >
          <img
            src={imageSrc}
            alt={`${product.name} product`}
            loading="lazy"
            decoding="async"
            width="130"
            height="182"
            className="h-[182px] w-[130px] object-contain transition duration-300 group-hover:scale-105"
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
          className="mt-1 min-h-[40px] text-[15px] leading-5 text-[var(--primary-text)] transition hover:text-[#c94545]"
        >
          {product.name}
        </Link>

        <div className="mb-2 flex items-center gap-2">
          <span
            aria-label={`${product.rating || 5} out of 5 stars`}
            className="text-sm tracking-[2px] text-[#f4b740]"
          >
            ★★★★★
          </span>

          <span className="text-[11px] text-[var(--muted-text)]">
            ({Number(product.rating || 5).toFixed(1)})
          </span>
        </div>

        <div className="mb-2 flex items-center gap-2">
          <span className="text-lg font-bold text-[#c53938]">
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
          disabled={!canAddToCart}
          onClick={() => canAddToCart && onAddToCart && onAddToCart(product)}
          className="mt-auto flex h-[34px] w-full items-center justify-center gap-2 rounded-full bg-[#c94545] px-5 text-sm font-medium text-white transition hover:bg-[#ef5350] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span aria-hidden="true">🛒</span>

          <span>
            {canAddToCart ? `+ ${tr.addToCart || 'Add'}` : product.status === 'soon' ? 'Coming Soon' : tr.outOfStock}
          </span>
        </button>
      </div>
    </article>
  );
}