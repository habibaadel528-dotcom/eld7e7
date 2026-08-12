import { Link } from 'react-router-dom';

const statusConfig = {
  in: {
    label: 'In',
    className: 'bg-[#82c988]',
  },
  out: {
    label: 'Out',
    className: 'bg-[#c53938]',
  },
  soon: {
    label: 'Soon',
    className: 'bg-[#ffc62a]',
  },
};

export default function StationeryProductCard({
  product,
  onAddToCart,
}) {
  const status = statusConfig[product.status] ?? statusConfig.in;
  const canAddToCart = product.status === 'in';

  return (
    <article className="group relative flex min-h-[401px] flex-col overflow-hidden rounded-[15px] border border-[var(--border-color)] bg-[var(--surface-bg)] p-4 transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_35px_rgba(0,0,0,0.12)]">
      <span
        className={`absolute left-0 top-0 z-10 rounded-br-[28px] px-3 py-2 text-xs font-medium text-white ${status.className}`}
      >
        {status.label}
      </span>

      <Link
        to={`/products/${product.slug}`}
        aria-label={`View ${product.name}`}
        className="flex h-[205px] items-center justify-center overflow-hidden rounded-[15px] bg-[var(--page-bg)]"
      >
        <img
          src={product.image}
          alt={`${product.name} stationery product`}
          loading="lazy"
          decoding="async"
          width="130"
          height="182"
          className="h-[182px] w-[130px] object-contain transition duration-300 group-hover:scale-105"
        />
      </Link>

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
            aria-label={`${product.rating} out of 5 stars`}
            className="text-sm tracking-[2px] text-[#f4b740]"
          >
            ★★★★★
          </span>

          <span className="text-[11px] text-[var(--muted-text)]">
            ({product.rating.toFixed(1)})
          </span>
        </div>

        <div className="mb-2 flex items-center gap-2">
          <span className="text-lg font-bold text-[#c53938]">
            EGP {product.price.toFixed(2)}
          </span>

          <span className="text-[11px] text-[var(--muted-text)] line-through">
            EGP {product.oldPrice.toFixed(2)}
          </span>
        </div>

        <button
          type="button"
          disabled={!canAddToCart}
          onClick={() => canAddToCart && onAddToCart(product)}
          className="mt-auto flex h-[34px] w-full items-center justify-center gap-2 rounded-full bg-[#c94545] px-5 text-sm font-medium text-white transition hover:bg-[#ef5350] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span aria-hidden="true">🛒</span>

          <span>
            {canAddToCart ? 'Add' : product.status === 'soon' ? 'Coming Soon' : 'Unavailable'}
          </span>

          {canAddToCart && <span aria-hidden="true">+</span>}
        </button>
      </div>
    </article>
  );
}