import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import johnyImage from '../assets/images/johny.png';
import martaImage from '../assets/images/marta.png';
import { useLanguage } from '../context/LanguageContext';

const reviewImages = [johnyImage, martaImage, johnyImage];

export default function CustomerReviews() {
  const { lang, t } = useLanguage();
  const tr = t('customerReviews');
  const [activeIndex, setActiveIndex] = useState(0);

  const reviews = tr.reviews || [];

  useEffect(() => {
    if (reviews.length <= 1) return;
    const intervalId = window.setInterval(() => {
      setActiveIndex((curr) => (curr + 1) % reviews.length);
    }, 6000);
    return () => window.clearInterval(intervalId);
  }, [reviews.length]);

  const handlePrev = () => {
    setActiveIndex((curr) => (curr === 0 ? reviews.length - 1 : curr - 1));
  };

  const handleNext = () => {
    setActiveIndex((curr) => (curr + 1) % reviews.length);
  };

  const isRtl = lang === 'ar';

  return (
    <section
      id="customer-reviews"
      aria-labelledby="customer-reviews-title"
      className="overflow-hidden bg-[var(--page-bg)] px-4 py-14 sm:px-8 lg:px-20 lg:py-20"
    >
      <div className="mx-auto w-full max-w-[1280px]">
        {/* Section Heading */}
        <div className="flex justify-center text-center">
          <h2
            id="customer-reviews-title"
            className="m-0 flex flex-wrap items-center justify-center gap-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--primary-text)]"
          >
            <span className="text-[#ef5350]">{tr.sectionTitle1}</span>
            <span className="relative pb-2">
              {tr.sectionTitle2}
              <span
                aria-hidden="true"
                className="absolute bottom-0 left-0 h-1 w-full rounded-full bg-[#364153]"
              />
              <span
                aria-hidden="true"
                className="absolute bottom-0 left-1/2 h-1 w-1/2 -translate-x-1/2 rounded-full bg-[#ef5350]"
              />
            </span>
          </h2>
        </div>

        {/* Carousel Container */}
        <div className="relative mt-10 sm:mt-14 overflow-hidden rounded-[28px] sm:rounded-[36px] border border-[var(--border-color)] bg-[var(--surface-bg)] px-4 py-8 sm:p-12 shadow-xs">
          
          {/* Slider viewport */}
          <div className="overflow-hidden w-full max-w-3xl mx-auto">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(${isRtl ? activeIndex * 100 : -activeIndex * 100}%)`,
              }}
            >
              {reviews.map((review, index) => {
                const image = reviewImages[index % reviewImages.length];
                return (
                  <div
                    key={index}
                    className="w-full shrink-0 px-2 sm:px-4"
                  >
                    <article className="flex flex-col gap-5 sm:gap-6 rounded-2xl bg-[var(--surface-soft)] p-6 sm:p-8 border border-[var(--border-color)]">
                      {/* Quote Icon */}
                      <span
                        aria-hidden="true"
                        className="font-serif text-4xl sm:text-5xl font-bold leading-none text-[#c53938] select-none"
                      >
                        “
                      </span>

                      {/* Review Text */}
                      <p className="m-0 text-sm sm:text-base lg:text-lg leading-relaxed text-[var(--primary-text)] font-medium text-start">
                        {review.text}
                      </p>

                      {/* Author Info & Rating */}
                      <div className="mt-2 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[var(--border-color)]">
                        <div className="flex items-center gap-3">
                          <img
                            src={image}
                            alt={`${review.name}, customer`}
                            loading="lazy"
                            decoding="async"
                            className="h-11 w-11 rounded-full object-cover border border-[var(--border-color)]"
                          />
                          <div className="text-start">
                            <p className="m-0 text-sm sm:text-base font-bold text-[var(--primary-text)]">
                              {review.name}
                            </p>
                            <span className="text-xs text-[var(--secondary-text)]">Verified Customer</span>
                          </div>
                        </div>

                        {/* Stars */}
                        <div
                          aria-label="5 out of 5 stars"
                          className="flex items-center text-lg sm:text-xl text-[#f4a04b]"
                        >
                          {'★★★★★'.split('').map((star, sIdx) => (
                            <span key={sIdx} aria-hidden="true">
                              {star}
                            </span>
                          ))}
                        </div>
                      </div>
                    </article>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="mt-8 flex items-center justify-center gap-4">
            {/* Prev Button */}
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous review"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 dark:border-white/15 bg-[var(--surface-soft)] text-black dark:text-white transition hover:bg-[#c53938] hover:border-[#c53938] hover:!text-white cursor-pointer shadow-2xs"
            >
              {isRtl ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>

            {/* Dots */}
            <div
              className="flex items-center gap-2"
              role="tablist"
              aria-label="Customer reviews pagination"
            >
              {reviews.map((review, index) => (
                <button
                  key={index}
                  type="button"
                  role="tab"
                  aria-selected={activeIndex === index}
                  aria-label={`Show review from ${review.name}`}
                  onClick={() => setActiveIndex(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    activeIndex === index
                      ? 'w-8 bg-[#c53938]'
                      : 'w-2.5 bg-gray-300 dark:bg-white/20 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            {/* Next Button */}
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next review"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 dark:border-white/15 bg-[var(--surface-soft)] text-black dark:text-white transition hover:bg-[#c53938] hover:border-[#c53938] hover:!text-white cursor-pointer shadow-2xs"
            >
              {isRtl ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}