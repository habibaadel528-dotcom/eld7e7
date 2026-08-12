import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import Header from '../sections/Header';
import Navigation from '../sections/Navigation';
import Footer from '../sections/Footer';
import ProductCard from '../components/ProductCard';

import { culturalBooks } from '../data/products';
import bannerImage from '../assets/images/cultural-books-banner.png';

const PRODUCTS_PER_PAGE = 15;

export default function CulturalBooksClearance() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [cartCount, setCartCount] = useState(0);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return culturalBooks;
    }

    return culturalBooks.filter((product) => {
      const productName = product.name.toLowerCase();
      const productCategory = product.category.toLowerCase();

      return (
        productName.includes(normalizedQuery) ||
        productCategory.includes(normalizedQuery)
      );
    });
  }, [searchQuery]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE),
  );

  const visibleProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;

    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handleAddToCart = () => {
    setCartCount((currentCount) => currentCount + 1);
  };

  const goToPage = (pageNumber) => {
    const safePage = Math.min(Math.max(pageNumber, 1), totalPages);

    setCurrentPage(safePage);

    window.requestAnimationFrame(() => {
      document.getElementById('products')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  };

  const currentPageStart =
    filteredProducts.length === 0
      ? 0
      : (currentPage - 1) * PRODUCTS_PER_PAGE + 1;

  const currentPageEnd = Math.min(
    currentPage * PRODUCTS_PER_PAGE,
    filteredProducts.length,
  );

  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--primary-text)]">
      <Helmet>
        <title>Cultural Books Clearance | El-D7E7</title>

        <meta
          name="description"
          content="Shop discounted cultural books from El-D7E7. Discover selected books at special clearance prices."
        />

        <meta
          name="keywords"
          content="cultural books, clearance books, discounted books, El-D7E7, books Egypt"
        />

        <meta name="robots" content="index, follow" />

        <meta
          property="og:title"
          content="Cultural Books Clearance | El-D7E7"
        />

        <meta
          property="og:description"
          content="Explore selected cultural books at special clearance prices."
        />

        <meta property="og:type" content="website" />

        <meta
          property="og:image"
          content="/src/assets/images/cultural-books-banner.png"
        />

        <meta name="twitter:card" content="summary_large_image" />

        <meta
          name="twitter:title"
          content="Cultural Books Clearance | El-D7E7"
        />

        <meta
          name="twitter:description"
          content="Shop rare cultural books at special discounted prices."
        />

        <link
          rel="canonical"
          href="https://el-d7e7.com/cultural-books-clearance"
        />
      </Helmet>

      <Header cartCount={cartCount} />

      <Navigation />

      <main>
        <section
          aria-labelledby="cultural-books-heading"
          className="px-5 pt-10 sm:px-8 lg:px-20"
        >
          <div className="mx-auto w-full max-w-[1276px]">
            <div className="relative min-h-[310px] overflow-hidden rounded-[24px] sm:min-h-[350px] sm:rounded-[28px] lg:min-h-[392px] lg:rounded-[32px]">
              <img
                src={bannerImage}
                alt="Stacked cultural books displayed for clearance sale"
                fetchPriority="high"
                decoding="async"
                width="1276"
                height="392"
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-white/45 dark:bg-black/45" />

              <div className="relative z-10 flex min-h-[310px] max-w-[650px] flex-col justify-center px-7 py-10 sm:min-h-[350px] sm:px-10 sm:py-12 lg:min-h-[392px] lg:px-14">
                <p className="m-0 text-[28px] font-medium leading-tight tracking-[-0.8px] text-[#c53938] sm:text-[38px] lg:text-[48px] lg:tracking-[-0.96px]">
                  Exclusive
                </p>

                <h1
                  id="cultural-books-heading"
                  className="mt-3 text-[28px] font-medium leading-tight tracking-[-0.8px] text-[#352e2e] dark:text-white sm:text-[38px] lg:text-[48px] lg:tracking-[-0.96px]"
                >
                  Cultural Books Clearance
                </h1>

                <p className="mt-4 max-w-[540px] text-sm leading-6 text-[#505050] dark:text-[#d1d5dc] sm:mt-5 sm:text-base sm:leading-7 lg:text-[18px]">
                  Shop rare cultural books at special discounted prices.
                </p>

                <a
                  href="#products"
                  className="mt-7 inline-flex h-[50px] w-[190px] items-center justify-center rounded-full bg-[#c94545] px-6 text-base font-medium text-white transition duration-200 hover:bg-[#ef5350] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef5350] focus-visible:ring-offset-2 sm:mt-8 sm:h-[56px] sm:w-[220px] sm:text-lg lg:h-[60px] lg:w-[250px] lg:text-xl"
                >
                  Shop Now
                </a>
              </div>
            </div>
          </div>
        </section>

        <section
          id="products"
          aria-labelledby="clearance-products-title"
          className="scroll-mt-8 px-5 py-14 sm:px-8 sm:py-16 lg:px-20"
        >
          <div className="mx-auto w-full max-w-[1276px]">
            <div className="flex flex-col items-center gap-5 sm:gap-6">
              <h2
                id="clearance-products-title"
                className="sr-only"
              >
                Cultural books clearance products
              </h2>

              <p className="m-0 text-center text-sm text-[var(--secondary-text)] sm:text-base lg:text-[18px]">
                {filteredProducts.length > 0 ? (
                  <>
                    Showing {currentPageStart}–{currentPageEnd} out of{' '}
                    {filteredProducts.length} Clearance Books
                  </>
                ) : (
                  'No clearance books found'
                )}
              </p>

              <label className="relative w-full max-w-[445px]">
                <span className="sr-only">
                  Search clearance books
                </span>

                <input
                  type="search"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search books..."
                  autoComplete="off"
                  spellCheck="false"
                  className="h-[50px] w-full rounded-full border border-[var(--border-color)] bg-[var(--surface-bg)] px-5 pr-14 text-sm text-[var(--primary-text)] outline-none transition placeholder:text-[var(--muted-text)] focus:border-[#c94545] focus:ring-2 focus:ring-[#c94545]/20 sm:h-[54px] sm:px-6 sm:pr-14 sm:text-base"
                />

                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-xl text-[var(--muted-text)]"
                >
                  ⌕
                </span>
              </label>
            </div>

            {visibleProducts.length > 0 ? (
              <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-6 xl:grid-cols-5">
                {visibleProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-12 rounded-3xl border border-[var(--border-color)] bg-[var(--surface-bg)] px-6 py-16 text-center">
                <p className="m-0 text-lg font-medium text-[var(--primary-text)]">
                  No books found
                </p>

                <p className="mb-0 mt-2 text-sm text-[var(--secondary-text)]">
                  Try searching with another book name.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setCurrentPage(1);
                  }}
                  className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-[#c94545] px-6 text-sm font-medium text-white transition hover:bg-[#ef5350]"
                >
                  Clear Search
                </button>
              </div>
            )}

            {filteredProducts.length > 0 && totalPages > 1 && (
              <nav
                className="mt-12 flex flex-wrap items-center justify-center gap-2 sm:mt-14"
                aria-label="Products pagination"
              >
                <button
                  type="button"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label="Go to previous page"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-soft)] text-[var(--secondary-text)] transition hover:text-[#c53938] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-[var(--secondary-text)]"
                >
                  ←
                </button>

                {Array.from({ length: totalPages }, (_, index) => {
                  const pageNumber = index + 1;
                  const isActive = currentPage === pageNumber;

                  return (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => goToPage(pageNumber)}
                      aria-label={`Go to page ${pageNumber}`}
                      aria-current={isActive ? 'page' : undefined}
                      className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition ${
                        isActive
                          ? 'bg-[#c53938] text-white'
                          : 'bg-[var(--surface-soft)] text-[var(--secondary-text)] hover:text-[#c53938]'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label="Go to next page"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-soft)] text-[var(--secondary-text)] transition hover:text-[#c53938] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-[var(--secondary-text)]"
                >
                  →
                </button>
              </nav>
            )}

            <p
              className="sr-only"
              aria-live="polite"
              aria-atomic="true"
            >
              Cart now contains {cartCount} items.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}