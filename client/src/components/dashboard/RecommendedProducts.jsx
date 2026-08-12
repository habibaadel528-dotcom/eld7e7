import ProductCard from "./ProductCard";

export default function RecommendedProducts() {
  return (
    <section className="rounded-[28px] border border-[var(--border-color)] bg-[var(--surface-bg)] p-7 shadow-sm">

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-[24px] font-bold text-[var(--primary-text)]">
            Recommended For You
          </h2>
          <p className="mt-1 text-sm text-[var(--secondary-text)]">
            Products based on your shopping history.
          </p>
        </div>

        <button className="rounded-full border border-[var(--border-color)] px-5 py-2 text-sm font-medium text-[var(--secondary-text)] transition hover:border-[#c53938] hover:text-[#c53938]">
          View All
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <ProductCard image="product-airpods.png" title="Apple AirPods Pro"    category="Electronics" price="$249" oldPrice="$299" rating="4.9" />
        <ProductCard image="product-s24.png"      title="Samsung Galaxy S24"  category="Mobile"      price="$999" oldPrice="$1099" rating="4.8" />
        <ProductCard image="product-jeans.png"    title="Levi's Denim Jeans"  category="Fashion"     price="$89"  oldPrice="$120" rating="4.7" />
        <ProductCard image="product-coffee.png"   title="Nescafé Gold"        category="Groceries"   price="$12"  oldPrice="$18"  rating="4.9" />
      </div>

    </section>
  );
}