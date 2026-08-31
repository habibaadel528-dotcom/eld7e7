import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import tagIcon from '../../assets/icons/cart/tag.svg';
import arrowRightIcon from '../../assets/icons/cart/arrow-right.svg';
import { useLanguage } from '../../context/LanguageContext';

export default function OrderSummary({ subtotal }) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const tr = t('cart');

  const [promoCode, setPromoCode] = useState('');
  const [promoMessage, setPromoMessage] = useState('');

  const total = subtotal;

  const handlePromoSubmit = (event) => {
    event.preventDefault();
    const normalizedCode = promoCode.trim().toUpperCase();
    if (!normalizedCode) { setPromoMessage(tr.promoEmpty); return; }
    setPromoMessage(tr.promoInvalid);
  };

  const handleCheckout = () => navigate('/checkout');

  return (
    <section
      aria-labelledby="order-summary-heading"
      className="rounded-[20px] border border-[var(--border-color)] bg-[var(--surface-bg)] px-6 py-5"
    >
      <h2 id="order-summary-heading" className="m-0 text-2xl font-normal text-[var(--primary-text)]">
        {tr.orderSummary}
      </h2>

      <dl className="mt-6 space-y-4">
        <div className="flex items-center justify-between gap-5">
          <dt className="text-xl text-[var(--secondary-text)]">{tr.subtotal}</dt>
          <dd className="m-0 text-xl text-[var(--primary-text)] font-semibold">EGP {subtotal.toFixed(2)}</dd>
        </div>

        <div className="rounded-xl bg-[var(--surface-soft)] p-3 text-xs text-[var(--secondary-text)]">
          {tr.shippingNote}
        </div>

        <div className="h-px bg-[var(--border-color)]" />

        <div className="flex items-center justify-between gap-5">
          <dt className="text-xl font-bold text-[var(--primary-text)]">{tr.total}</dt>
          <dd className="m-0 text-2xl font-bold text-[var(--primary-text)]">EGP {total.toFixed(2)}</dd>
        </div>
      </dl>

      <form onSubmit={handlePromoSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">{tr.promoCodeLabel}</span>
          <img src={tagIcon} alt="" width="24" height="24" className="pointer-events-none absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 object-contain" />
          <input
            type="text"
            value={promoCode}
            onChange={(event) => { setPromoCode(event.target.value); setPromoMessage(''); }}
            maxLength={30}
            autoComplete="off"
            placeholder={tr.promoPlaceholder}
            className="h-12 w-full rounded-full border border-transparent bg-[var(--surface-soft)] pl-12 pr-5 text-base text-[var(--primary-text)] outline-none placeholder:text-[var(--muted-text)] focus:border-[#c94545]"
          />
        </label>

        <button
          type="submit"
          className="btn-outline-custom h-12 rounded-full px-8 text-base font-bold cursor-pointer active:scale-95 shadow-xs shrink-0"
        >
          {tr.apply}
        </button>
      </form>

      {promoMessage && (
        <p aria-live="polite" className="mb-0 mt-2 text-sm text-[var(--secondary-text)]">
          {promoMessage}
        </p>
      )}

      <button
        type="button"
        onClick={handleCheckout}
        disabled={subtotal <= 0}
        className="mx-auto mt-6 flex h-[60px] w-full max-w-[656px] items-center justify-center gap-3 rounded-full bg-[#c94545] px-8 text-xl font-bold text-white transition hover:bg-[#ef5350] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer shadow-md"
      >
        <span>{tr.goToCheckout}</span>
        <img src={arrowRightIcon} alt="" width="24" height="24" className="h-6 w-6 object-contain" />
      </button>
    </section>
  );
}