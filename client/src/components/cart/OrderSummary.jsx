import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import tagIcon from '../../assets/icons/cart/tag.svg';
import arrowRightIcon from '../../assets/icons/cart/arrow-right.svg';

export default function OrderSummary({
  subtotal,
  discountRate = 0.05,
  deliveryFee = 50,
}) {
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState('');
  const [promoMessage, setPromoMessage] = useState('');

  const discount = subtotal * discountRate;
  const total = subtotal - discount + deliveryFee;

  const handlePromoSubmit = (event) => {
    event.preventDefault();

    const normalizedCode = promoCode.trim().toUpperCase();

    if (!normalizedCode) {
      setPromoMessage('Enter a promo code first.');
      return;
    }

    if (normalizedCode === 'D7E7') {
      setPromoMessage('Promo code applied.');
      return;
    }

    setPromoMessage('This promo code is invalid.');
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <section
      aria-labelledby="order-summary-heading"
      className="rounded-[20px] border border-[var(--border-color)] bg-[var(--surface-bg)] px-6 py-5"
    >
      <h2
        id="order-summary-heading"
        className="m-0 text-2xl font-normal text-[var(--primary-text)]"
      >
        Order Summary
      </h2>

      <dl className="mt-6 space-y-5">
        <div className="flex items-center justify-between gap-5">
          <dt className="text-xl text-[var(--secondary-text)]">
            Subtotal
          </dt>

          <dd className="m-0 text-xl text-[var(--primary-text)]">
            EGP {subtotal.toFixed(2)}
          </dd>
        </div>

        <div className="flex items-center justify-between gap-5">
          <dt className="text-xl text-[var(--secondary-text)]">
            Discount (-{discountRate * 100}%)
          </dt>

          <dd className="m-0 text-xl text-[#359a03]">
            -EGP {discount.toFixed(2)}
          </dd>
        </div>

        <div className="flex items-center justify-between gap-5">
          <dt className="text-xl text-[var(--secondary-text)]">
            Delivery Fee
          </dt>

          <dd className="m-0 text-xl font-bold text-[var(--primary-text)]">
            EGP {deliveryFee.toFixed(2)}
          </dd>
        </div>

        <div className="h-px bg-[var(--border-color)]" />

        <div className="flex items-center justify-between gap-5">
          <dt className="text-xl text-[var(--primary-text)]">
            Total
          </dt>

          <dd className="m-0 text-2xl text-[var(--primary-text)]">
            EGP {total.toFixed(2)}
          </dd>
        </div>
      </dl>

      <form
        onSubmit={handlePromoSubmit}
        className="mt-6 flex flex-col gap-3 sm:flex-row"
      >
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">
            Promo code
          </span>

          <img
            src={tagIcon}
            alt=""
            width="24"
            height="24"
            className="pointer-events-none absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 object-contain"
          />

          <input
            type="text"
            value={promoCode}
            onChange={(event) => {
              setPromoCode(event.target.value);
              setPromoMessage('');
            }}
            maxLength={30}
            autoComplete="off"
            placeholder="Add promo code"
            className="h-12 w-full rounded-full border border-transparent bg-[var(--surface-soft)] pl-12 pr-5 text-base text-[var(--primary-text)] outline-none placeholder:text-[var(--muted-text)] focus:border-[#c94545]"
          />
        </label>

        <button
          type="submit"
          className="h-12 rounded-full border border-[#c94545] px-8 text-base text-[#c94545] transition hover:bg-[#c94545] hover:text-white"
        >
          Apply
        </button>
      </form>

      {promoMessage && (
        <p
          aria-live="polite"
          className="mb-0 mt-2 text-sm text-[var(--secondary-text)]"
        >
          {promoMessage}
        </p>
      )}

      <button
        type="button"
        onClick={handleCheckout}
        disabled={subtotal <= 0}
        className="mx-auto mt-6 flex h-[60px] w-full max-w-[656px] items-center justify-center gap-3 rounded-full bg-[#c94545] px-8 text-xl font-bold text-white transition hover:bg-[#ef5350] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span>Go to Checkout</span>

        <img
          src={arrowRightIcon}
          alt=""
          width="24"
          height="24"
          className="h-6 w-6 object-contain"
        />
      </button>
    </section>
  );
}