import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import Header from '../sections/Header';
import Navigation from '../sections/Navigation';
import Footer from '../sections/Footer';

import StationeryFilters from '../components/StationeryFilters';
import StationeryProductCard from '../components/StationeryProductCard';

import { useCart } from '../context/CartContext';
import { productApi } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

import bannerImage from '../assets/images/stationery-banner.png';

const PRODUCTS_PER_PAGE = 12;

export default function Stationery() {
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const tr = t('products');
  const [productsList, setProductsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    productApi.getProducts({ category: 'stationery' })
      .then((data) => {
        setProductsList((data.products || []).map(p => ({
          ...p,
          id: p.id || p._id,
          status: p.stock > 0 ? 'in' : 'out',
          rating: p.rating || 4.5,
        })));
      })
      .catch(() => setProductsList([]))
      .finally(() => setIsLoading(false));
  }, []);

  // ── Derived values from real products ──
  const maxProductPrice = useMemo(() => {
    if (productsList.length === 0) return 3500;
    return Math.ceil(Math.max(...productsList.map(p => p.price || 0)) / 100) * 100 || 3500;
  }, [productsList]);

  // dynamic categories from real products
  const dynamicCategories = useMemo(() => {
    const map = {};
    productsList.forEach(p => {
      const cat = p.subcategory || p.subCategory || '';
      if (cat) map[cat] = (map[cat] || 0) + 1;
    });
    return Object.entries(map).map(([name, count]) => ({ name, count }));
  }, [productsList]);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedAvailability, setSelectedAvailability] = useState([]);
  const [maxPrice, setMaxPrice] = useState(3500);

  // reset maxPrice when products load
  useEffect(() => {
    setMaxPrice(maxProductPrice);
  }, [maxProductPrice]);

  const filteredProducts = useMemo(() => {
    return productsList.filter((product) => {
      const matchesCategory =
        !selectedCategory ||
        (product.subcategory || product.subCategory || '') === selectedCategory;

      const matchesAvailability =
        selectedAvailability.length === 0 ||
        selectedAvailability.includes(product.status);

      const matchesPrice = (product.price || 0) <= maxPrice;

      return matchesCategory && matchesAvailability && matchesPrice;
    });
  }, [productsList, maxPrice, selectedAvailability, selectedCategory]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE),
  );

  const visibleProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;

    return filteredProducts.slice(
      startIndex,
      startIndex + PRODUCTS_PER_PAGE,
    );
  }, [currentPage, filteredProducts]);

  useEffect(() => {
    setCurrentPage(1);
  }, [maxPrice, selectedAvailability, selectedCategory]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const toggleArrayValue = (value, setter) => {
    setter((currentValues) =>
      currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value],
    );
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedAvailability([]);
    setMaxPrice(maxProductPrice);
  };

  const goToPage = (pageNumber) => {
    const safePage = Math.min(
      Math.max(pageNumber, 1),
      totalPages,
    );

    setCurrentPage(safePage);

    requestAnimationFrame(() => {
      document.getElementById('stationery-products')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  };

  const firstVisibleItem =
    filteredProducts.length === 0
      ? 0
      : (currentPage - 1) * PRODUCTS_PER_PAGE + 1;

  const lastVisibleItem = Math.min(
    currentPage * PRODUCTS_PER_PAGE,
    filteredProducts.length,
  );

  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--primary-text)]">
      <Helmet>
        <title>Stationery Supplies | El-D7E7</title>

        <meta
          name="description"
          content="Shop pens, pencils, erasers, files, papers and premium stationery supplies from El-D7E7."
        />

        <meta
          name="robots"
          content="index, follow, max-image-preview:large"
        />

        <meta
          property="og:title"
          content="Stationery Supplies | El-D7E7"
        />

        <meta
          property="og:description"
          content="Find premium stationery products with easy category, availability and price filters."
        />

        <meta property="og:type" content="website" />

        <meta
          property="og:image"
          content="/images/stationery/stationery-banner.png"
        />

        <meta name="twitter:card" content="summary_large_image" />

        <link
          rel="canonical"
          href="https://el-d7e7.com/stationery"
        />
      </Helmet>

      <Header />

      <Navigation />

      <main>
        <section
          aria-labelledby="stationery-heading"
          className="px-5 pt-10 sm:px-8 lg:px-20"
        >
          <div className="mx-auto max-w-[1276px]">
            <div className="relative min-h-[320px] overflow-hidden rounded-[32px] lg:min-h-[392px]">
              <img
                src={bannerImage}
                alt="Stationery products including notebooks, pens and art supplies"
                fetchPriority="high"
                decoding="async"
                width="1276"
                height="392"
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-white/80 dark:bg-black/60" />

              <div className="relative z-10 flex min-h-[320px] max-w-[650px] flex-col justify-center px-7 py-12 sm:px-14 lg:min-h-[392px]">
                <h1
                  id="stationery-heading"
                  className="m-0 text-[36px] font-medium leading-tight tracking-[-0.96px] text-[#c94545] sm:text-[48px]"
                >
                  Stationery
                </h1>

                <p className="mt-6 max-w-[540px] text-base leading-7 text-[#505050] dark:text-[#d1d5dc] sm:text-[18px]">
                  {tr.stationeryDesc}
                </p>

                <a
                  href="#stationery-products"
                  className="mt-8 inline-flex h-[60px] w-[250px] items-center justify-center rounded-full bg-[#c94545] text-xl font-medium text-white transition hover:bg-[#ef5350]"
                >
                  {tr.shopNow}
                </a>
              </div>
            </div>
          </div>
        </section>

        <section
          id="stationery-products"
          className="scroll-mt-8 px-5 py-14 sm:px-8 lg:px-20"
          aria-labelledby="stationery-products-heading"
        >
          <div className="mx-auto max-w-[1276px]">
            <h2
              id="stationery-products-heading"
              className="sr-only"
            >
              Stationery products
            </h2>

            <p className="mb-10 text-center text-[var(--secondary-text)]">
              {filteredProducts.length > 0
                ? tr.showing(firstVisibleItem, lastVisibleItem, filteredProducts.length, 'Stationery')
                : tr.noProductsFound}
            </p>

            <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
              <StationeryFilters
                categories={dynamicCategories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                selectedAvailability={selectedAvailability}
                onAvailabilityChange={(av) => toggleArrayValue(av, setSelectedAvailability)}
                maxPrice={maxPrice}
                maxProductPrice={maxProductPrice}
                onMaxPriceChange={setMaxPrice}
                onClearFilters={clearFilters}
              />

              <div>
                {isLoading ? (
                  <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--surface-bg)] px-6 py-20 text-center">
                    <p className="animate-pulse text-base text-[var(--muted-text)]">{tr.loading}</p>
                  </div>
                ) : visibleProducts.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                    {visibleProducts.map((product) => (
                      <StationeryProductCard
                        key={product.id || product._id}
                        product={product}
                        onAddToCart={handleAddToCart}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--surface-bg)] px-6 py-16 text-center">
                    <p className="m-0 text-lg font-medium">
                      {productsList.length === 0 ? tr.noProductsAvailable : tr.noProductsFilters}
                    </p>
                    {productsList.length > 0 && (
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="mt-6 rounded-full bg-[#c53938] px-6 py-3 text-sm font-medium text-white"
                      >
                        {tr.resetFilters}
                      </button>
                    )}
                  </div>
                )}

                {totalPages > 1 && (
                  <nav
                    aria-label="Stationery pagination"
                    className="mt-14 flex flex-wrap items-center justify-center gap-2"
                  >
                    <button
                      type="button"
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      aria-label="Previous page"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-soft)] text-[var(--secondary-text)] disabled:opacity-40"
                    >
                      ←
                    </button>

                    {Array.from(
                      { length: totalPages },
                      (_, index) => {
                        const pageNumber = index + 1;
                        const isActive =
                          currentPage === pageNumber;

                        return (
                          <button
                            key={pageNumber}
                            type="button"
                            onClick={() => goToPage(pageNumber)}
                            aria-current={
                              isActive ? 'page' : undefined
                            }
                            aria-label={`Go to page ${pageNumber}`}
                            className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${
                              isActive
                                ? 'bg-[#c53938] text-white'
                                : 'bg-[var(--surface-soft)] text-[var(--secondary-text)]'
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      },
                    )}

                    <button
                      type="button"
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      aria-label="Next page"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-soft)] text-[var(--secondary-text)] disabled:opacity-40"
                    >
                      →
                    </button>
                  </nav>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}