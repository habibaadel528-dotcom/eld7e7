import { Heart, ShoppingCart, Star } from 'lucide-react';
import productAirpods from '../../../assets/images/dashboard/product-airpods.png';

export default function WishlistCard({ product, onRemove, onAddToCart }) {
  const productId = product._id || product.id;
  const title = product.name || product.title || 'Product';
  const image = product.image || (product.images && product.images[0]) || productAirpods;
  const price = product.price || 0;
  const oldPrice = product.compareAtPrice || product.originalPrice || product.oldPrice;
  const category = product.category || 'General';
  const rating = product.rating || 4.8;
  const reviewsCount = product.reviewsCount || product.reviews || 12;
  const inStock = product.status !== 'out' && product.stock !== 0;

  // Calculate discount percentage if oldPrice > price
  const discountPercent = oldPrice && oldPrice > price
    ? Math.round(((oldPrice - price) / oldPrice) * 100)
    : product.discount || null;

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--surface-bg)] shadow-sm transition hover:shadow-md">
      {/* IMAGE */}
      <div className="relative h-[190px] overflow-hidden bg-[var(--surface-soft)] flex items-center justify-center p-2">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-contain transition duration-300 hover:scale-105"
        />

        {/* Discount badge */}
        {discountPercent && (
          <span className="absolute left-3 top-3 rounded-full bg-[#C53938] px-2 py-1 text-[11px] font-semibold text-white">
            -{discountPercent}%
          </span>
        )}

        {/* Out of stock overlay */}
        {!inStock && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2B2B2B]/90 px-4 py-1.5 text-xs font-medium text-white shadow-md">
            Out of Stock
          </div>
        )}

        {/* Heart / Remove Button */}
        <button
          type="button"
          onClick={() => onRemove && onRemove(productId)}
          title="Remove from Wishlist"
          className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md transition hover:bg-red-50 text-[#C53938]"
        >
          <Heart size={18} fill="#C53938" color="#C53938" />
        </button>
      </div>

      {/* BODY */}
      <div className="p-4">
        <p className="text-[10px] uppercase tracking-[2px] text-[var(--secondary-text)]">
          {category}
        </p>

        <h3 className="mt-1 line-clamp-2 text-[15px] font-semibold text-[var(--primary-text)] min-h-[40px]">
          {title}
        </h3>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={12}
              fill={star <= Math.round(rating) ? '#FDBA12' : 'transparent'}
              color="#FDBA12"
            />
          ))}

          <span className="ml-1 text-xs text-[var(--secondary-text)]">
            ({reviewsCount.toLocaleString()})
          </span>
        </div>

        {/* Price */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-[20px] font-bold text-[var(--primary-text)]">
            EGP {price.toLocaleString()}
          </span>

          {oldPrice && (
            <span className="text-xs text-[var(--secondary-text)] line-through">
              EGP {oldPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Stock */}
        <p
          className={`mt-2 text-xs font-medium ${
            inStock ? 'text-emerald-600' : 'text-[#C53938]'
          }`}
        >
          {inStock ? 'In Stock' : 'Out of Stock'}
        </p>

        {/* Add to Cart */}
        <button
          type="button"
          disabled={!inStock}
          onClick={() => inStock && onAddToCart && onAddToCart(product)}
          className={`mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-medium transition ${
            inStock
              ? 'bg-[#C53938] text-white hover:bg-[#a82d2c]'
              : 'cursor-not-allowed bg-[var(--surface-soft)] text-[var(--secondary-text)]'
          }`}
        >
          <ShoppingCart size={18} />
          <span>{inStock ? 'Add to Cart' : 'Out of Stock'}</span>
        </button>
      </div>
    </div>
  );
}
