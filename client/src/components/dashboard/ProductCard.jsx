import { Heart, Star, ShoppingCart } from "lucide-react";

import airpods from "../../assets/images/dashboard/product-airpods.png";
import phone   from "../../assets/images/dashboard/product-s24.png";
import jeans   from "../../assets/images/dashboard/product-jeans.png";
import coffee  from "../../assets/images/dashboard/product-coffee.png";

const images = {
  "product-airpods.png": airpods,
  "product-s24.png":     phone,
  "product-jeans.png":   jeans,
  "product-coffee.png":  coffee,
};

export default function ProductCard({ image, title, category, price, oldPrice, rating }) {
  return (
    <article className="group overflow-hidden rounded-[22px] border border-[var(--border-color)] bg-[var(--surface-bg)] transition duration-300 hover:-translate-y-2 hover:shadow-xl">

      {/* Image */}
      <div className="relative overflow-hidden bg-[var(--surface-soft)]">
        <img
          src={images[image]}
          alt={title}
          loading="lazy"
          width="250"
          height="220"
          className="h-[210px] w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <button
          type="button"
          aria-label={`Save ${title} to wishlist`}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-bg)] shadow text-[var(--secondary-text)] transition hover:text-[#c53938]"
        >
          <Heart size={18} strokeWidth={2} />
        </button>
      </div>

      {/* Body */}
      <div className="p-5">
        <p className="text-xs uppercase tracking-wider text-[var(--secondary-text)]">
          {category}
        </p>

        <h3 className="mt-2 line-clamp-2 text-[18px] font-semibold text-[var(--primary-text)]">
          {title}
        </h3>

        <div className="mt-4 flex items-center gap-2">
          <Star size={16} fill="#FDBA12" color="#FDBA12" />
          <span className="text-sm font-medium text-[var(--primary-text)]">{rating}</span>
        </div>

        <div className="mt-5 flex items-end justify-between">
          <div>
            <p className="text-[24px] font-bold text-[#c53938]">{price}</p>
            <p className="text-sm text-[var(--secondary-text)] line-through">{oldPrice}</p>
          </div>

          <button
            type="button"
            aria-label={`Add ${title} to cart`}
            className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-[#c53938] text-white transition hover:scale-110 hover:bg-[#ef5350]"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>

    </article>
  );
}