import { Heart, ShoppingCart, Star } from 'lucide-react';

export default function WishlistCard({ product }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#ECECEC] bg-white shadow-sm">
      {/* IMAGE */}
      <div className="relative h-[190px] overflow-hidden bg-[#F7F7F7]">
        <img
          src={product.image}
          alt={product.title}
          className="h-full w-full object-cover"
        />

        {/* Discount badge */}
        <span className="absolute left-3 top-3 rounded-full bg-[#C53938] px-2 py-1 text-[11px] font-semibold text-white">
          -{product.discount}%
        </span>

        {/* Out of stock overlay */}
        {!product.inStock && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2B2B2B] px-4 py-2 text-xs font-medium text-white">
            Out of Stock
          </div>
        )}

        {/* Heart */}
        <div className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md">
          <Heart size={18} fill="#C53938" color="#C53938" />
        </div>
      </div>

      {/* BODY */}
      <div className="p-4">
        <p className="text-[10px] uppercase tracking-[2px] text-[#9B9B9B]">
          {product.category}
        </p>

        <h3 className="mt-1 line-clamp-2 text-[15px] font-semibold text-[#2B2B2B]">
          {product.title}
        </h3>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={12}
              fill={star <= product.rating ? '#FDBA12' : 'transparent'}
              color="#FDBA12"
            />
          ))}

          <span className="ml-1 text-xs text-[#777]">
            ({product.reviews.toLocaleString()})
          </span>
        </div>

        {/* Price */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-[20px] font-bold text-[#222]">
            EGP {product.price.toLocaleString()}
          </span>

          <span className="text-xs text-[#A8A8A8] line-through">
            EGP {product.oldPrice.toLocaleString()}
          </span>
        </div>

        {/* Stock */}
        <p
          className={`mt-2 text-xs ${
            product.inStock ? 'text-[#1FA855]' : 'text-[#C53938]'
          }`}
        >
          {product.inStock ? 'In Stock' : 'Out of Stock'}
        </p>

        {/* Add to Cart (visual only) */}
        <button
          disabled={!product.inStock}
          className={`mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-medium ${
            product.inStock
              ? 'bg-[#C53938] text-white'
              : 'cursor-not-allowed bg-[#F1F1F1] text-[#B0B0B0]'
          }`}
        >
          <ShoppingCart size={18} />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
