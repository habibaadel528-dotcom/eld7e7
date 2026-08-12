import { stationeryCategories } from '../data/stationeryProducts';

const colorOptions = ['red', 'green', 'blue'];

const availabilityOptions = [
  { value: 'in', label: 'In Stock' },
  { value: 'soon', label: 'Soon' },
  { value: 'out', label: 'Out of Stock' },
];

export default function StationeryFilters({
  selectedCategory,
  onCategoryChange,
  selectedColors,
  onColorChange,
  selectedAvailability,
  onAvailabilityChange,
  maxPrice,
  onMaxPriceChange,
  onClearFilters,
}) {
  return (
    <aside className="space-y-6">
      <section className="overflow-hidden rounded-[15px] border border-[var(--border-color)] bg-[var(--surface-bg)]">
        <div className="border-b border-[var(--border-color)] px-5 py-4">
          <h2 className="m-0 text-xl font-bold text-[var(--primary-text)]">
            Category
          </h2>

          <div className="mt-3 h-[2px] w-16 bg-[#c53938]" />
        </div>

        <div className="space-y-2 p-3">
          {stationeryCategories.map((category) => {
            const isActive = selectedCategory === category.name;

            return (
              <button
                key={category.name}
                type="button"
                onClick={() =>
                  onCategoryChange(isActive ? '' : category.name)
                }
                className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left text-sm transition ${
                  isActive
                    ? 'border-[#c53938] bg-[#c53938]/10 text-[#c53938]'
                    : 'border-[var(--border-color)] text-[var(--primary-text)] hover:border-[#c53938]'
                }`}
              >
                <span>{category.name}</span>

                <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#c53938] px-1.5 text-xs text-white">
                  {category.count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-[15px] border border-[var(--border-color)] bg-[var(--surface-bg)] p-5 shadow-[5px_5px_15px_rgba(0,0,0,0.05)]">
        <div className="border-b border-[var(--border-color)] pb-4">
          <h2 className="m-0 text-xl font-bold text-[var(--primary-text)]">
            Fill by price
          </h2>

          <div className="mt-3 h-[2px] w-20 bg-[#c53938]" />
        </div>

        <div className="mt-6">
          <input
            type="range"
            min="5"
            max="3500"
            step="5"
            value={maxPrice}
            onChange={(event) =>
              onMaxPriceChange(Number(event.target.value))
            }
            aria-label="Maximum price"
            className="w-full accent-[#c53938]"
          />

          <div className="mt-2 flex justify-between text-xs text-[var(--secondary-text)]">
            <span>
              From: <strong className="text-[#c53938]">EGP 5</strong>
            </span>

            <span>
              To:{' '}
              <strong className="text-[#c53938]">
                EGP {maxPrice.toLocaleString()}
              </strong>
            </span>
          </div>
        </div>

        <fieldset className="mt-6">
          <legend className="mb-3 text-sm font-bold text-[var(--secondary-text)]">
            Color
          </legend>

          <div className="space-y-3">
            {colorOptions.map((color) => (
              <label
                key={color}
                className="flex cursor-pointer items-center gap-3 text-sm text-[var(--secondary-text)]"
              >
                <input
                  type="checkbox"
                  checked={selectedColors.includes(color)}
                  onChange={() => onColorChange(color)}
                  className="h-4 w-4 accent-[#c53938]"
                />

                <span className="capitalize">{color}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-6">
          <legend className="mb-3 text-sm font-bold text-[var(--secondary-text)]">
            Availability
          </legend>

          <div className="space-y-3">
            {availabilityOptions.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-3 text-sm text-[var(--secondary-text)]"
              >
                <input
                  type="checkbox"
                  checked={selectedAvailability.includes(option.value)}
                  onChange={() =>
                    onAvailabilityChange(option.value)
                  }
                  className="h-4 w-4 accent-[#c53938]"
                />

                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <button
          type="button"
          onClick={onClearFilters}
          className="mt-7 flex h-10 w-full items-center justify-center rounded bg-[#c53938] text-sm font-bold text-white transition hover:bg-[#ef5350]"
        >
          Clear Filters
        </button>
      </section>
    </aside>
  );
}