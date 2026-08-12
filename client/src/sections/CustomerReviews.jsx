import { useEffect, useState } from 'react';

import johnyImage from '../assets/images/johny.png';
import martaImage from '../assets/images/marta.png';

const reviews = [
  {
    id: 1,
    name: 'Johny Assloy',
    image: johnyImage,
    rating: 4,
    text: 'This store has become my go-to place for stationery and creative supplies. The selection is carefully curated and the quality is consistently high. Customer support was responsive and helpful. The order arrived on time and in perfect condition.',
  },
  {
    id: 2,
    name: 'Michael Roberts',
    image: martaImage,
    rating: 4,
    text: 'I purchased craft supplies for a school project and the experience exceeded expectations. The materials were high-quality, carefully selected, and perfectly suited for creative work. The order arrived quickly and in excellent condition. Overall, a smooth and trustworthy shopping experience.',
  },
  {
    id: 3,
    name: 'Marta Brown',
    image: martaImage,
    rating: 4,
    text: 'I ordered stationery and cultural books and was very satisfied with the experience. The product quality was excellent and matched the descriptions perfectly. The checkout process was simple and smooth. Delivery was fast and well-organized.',
  },
];

function ReviewCard({ review, isActive }) {
  return (
    <article
      aria-hidden={!isActive}
      className={`flex w-[min(82vw,600px)] shrink-0 flex-col gap-7 rounded-[32px] bg-[var(--surface-bg)] p-8 transition duration-500 sm:p-[42px] ${
        isActive
          ? 'scale-100 opacity-100'
          : 'scale-[0.92] opacity-60'
      }`}
    >
      <span
        aria-hidden="true"
        className="font-serif text-[72px] font-bold leading-[40px] text-[#d64545]"
      >
        “
      </span>

      <p className="m-0 text-left text-base leading-7 text-[var(--primary-text)] sm:text-[18px]">
        {review.text}
      </p>

      <div className="mt-auto flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-[14px]">
          <img
            src={review.image}
            alt={`${review.name}, customer`}
            loading="lazy"
            decoding="async"
            className="h-11 w-11 rounded-full object-cover"
          />

          <p className="m-0 whitespace-nowrap text-base text-[var(--primary-text)] sm:text-[18px]">
            {review.name}
          </p>
        </div>

        <div
          aria-label={`${review.rating} out of 5 stars`}
          className="flex items-center text-[24px] leading-none"
        >
          {Array.from({ length: 5 }, (_, index) => (
            <span
              key={index}
              aria-hidden="true"
              className={
                index < review.rating
                  ? 'text-[#f4a04b]'
                  : 'text-[#6b6259]'
              }
            >
              ★
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function CustomerReviews() {
  const [activeIndex, setActiveIndex] = useState(1);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) =>
        currentIndex === reviews.length - 1 ? 0 : currentIndex + 1,
      );
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, []);

  const selectReview = (index) => {
    setActiveIndex(index);
  };

  return (
    <section
      id="customer-reviews"
      aria-labelledby="customer-reviews-title"
      className="overflow-hidden bg-[var(--page-bg)] px-5 py-16 sm:px-8 lg:px-20 lg:py-20"
    >
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="flex justify-center">
          <h2
            id="customer-reviews-title"
            className="m-0 flex items-start text-center text-[30px] font-normal leading-10 tracking-[-0.9px] sm:text-4xl"
          >
            <span className="mr-2 text-[#ef5350]">Customer</span>

            <span className="relative pb-2 text-[var(--primary-text)]">
              Review

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

        <div className="mt-16 overflow-hidden rounded-[32px] bg-black/[0.03] py-[66px]">
          <div
            className="flex items-center gap-6 transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(calc(50% - ${
                activeIndex * 624 + 300
              }px))`,
            }}
          >
            {reviews.map((review, index) => (
              <ReviewCard
                key={review.id}
                review={review}
                isActive={index === activeIndex}
              />
            ))}
          </div>

          <div
            className="mt-16 flex items-center justify-center gap-4"
            role="tablist"
            aria-label="Customer reviews"
          >
            {reviews.map((review, index) => (
              <button
                key={review.id}
                type="button"
                role="tab"
                aria-selected={activeIndex === index}
                aria-label={`Show review from ${review.name}`}
                onClick={() => selectReview(index)}
                className={`h-[18px] w-[18px] rounded-full transition ${
                  activeIndex === index
                    ? 'bg-[#d64545]'
                    : 'bg-[#e5e5e5] hover:bg-white'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}