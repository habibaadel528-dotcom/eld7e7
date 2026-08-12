import { Link } from 'react-router-dom';

export default function ProductCard({ product, onAddToCart }) {
  return (
    <article className="group flex min-h-[401px] flex-col overflow-hidden rounded-[15px] border border-[var(--border-color)] bg-[var(--surface-bg)] p-4 transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_35px_rgba(0,0,0,0.12)]">
      <Link
        to={`/products/${product.slug}`}
        className="flex min-h-[205px] items-center justify-center overflow-hidden rounded-[15px] bg-[var(--page-bg)]"
        aria-label={`View ${product.name}`}
      >
        <img
          src={product.image}
          alt={`${product.name} book cover`}
          loading="lazy"
          decoding="async"
          className="h-[182px] w-auto object-contain transition duration-300 group-hover:scale-105"
        />
      </Link>

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

        <div className=" flex items-center gap-2">
          <span className="mb-2 text-lg font-bold text-[#359a03]">
            EGP {product.price.toFixed(2)}
          </span>

          <span className="text-[11px] text-[var(--muted-text)] line-through">
            EGP {product.oldPrice.toFixed(2)}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onAddToCart(product)}
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