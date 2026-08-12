import minusIcon from '../../assets/icons/cart/minus.svg';
import plusIcon from '../../assets/icons/cart/plus.svg';
import trashIcon from '../../assets/icons/cart/trash.svg';

export default function CartItem({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}) {
  return (
    <article className="flex flex-col gap-5 py-5 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 gap-4">
        <div className="h-[124px] w-[124px] shrink-0 overflow-hidden rounded-[9px] bg-[var(--surface-soft)]">
          <img
            src={item.image}
            alt={item.name}
            width="124"
            height="124"
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex min-w-0 flex-col justify-between py-1">
          <div>
            <h2 className="m-0 text-xl font-bold text-[var(--primary-text)]">
              {item.name}
            </h2>

            <p className="mb-0 mt-1 text-sm text-[var(--primary-text)]">
              Size:{' '}
              <span className="text-[var(--secondary-text)]">
                {item.size}
              </span>
            </p>

            <p className="mb-0 mt-1 text-sm text-[var(--primary-text)]">
              Color:{' '}
              <span className="text-[var(--secondary-text)]">
                {item.color}
              </span>
            </p>
          </div>

          <p className="mb-0 mt-5 text-2xl text-[var(--primary-text)]">
            EGP {item.price.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 sm:h-[124px] sm:w-[225px] sm:flex-col sm:items-end">
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          aria-label={`Remove ${item.name} from cart`}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#ef5350] text-[#c53938] transition hover:bg-[#c53938] hover:text-white"
        >
          <img
            src={trashIcon}
            alt=""
            width="20"
            height="20"
            className="h-5 w-5 object-contain"
          />
        </button>

        <div className="flex items-center gap-5 rounded-full bg-[var(--surface-soft)] px-5 py-3">
          <button
            type="button"
            onClick={() => onDecrease(item.id)}
            disabled={item.quantity <= 1}
            aria-label={`Decrease ${item.name} quantity`}
            className="flex h-5 w-5 items-center justify-center disabled:cursor-not-allowed disabled:opacity-40"
          >
            <img
              src={minusIcon}
              alt=""
              width="20"
              height="20"
              className="h-5 w-5 object-contain"
            />
          </button>

          <span
            aria-live="polite"
            className="min-w-4 text-center text-sm text-[var(--primary-text)]"
          >
            {item.quantity}
          </span>

          <button
            type="button"
            onClick={() => onIncrease(item.id)}
            aria-label={`Increase ${item.name} quantity`}
            className="flex h-5 w-5 items-center justify-center"
          >
            <img
              src={plusIcon}
              alt=""
              width="20"
              height="20"
              className="h-5 w-5 object-contain"
            />
          </button>
        </div>
      </div>
    </article>
  );
}