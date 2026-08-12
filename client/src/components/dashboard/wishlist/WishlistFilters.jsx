import { Check } from "lucide-react";

const categories = [
  "All",
  "Electronics",
  "Fashion",
  "Accessories",
  "Home",
];

export default function WishlistFilters({
  selected,
  onSelect,
  onClose,
}) {
  return (
    <div className="absolute right-0 top-16 z-50 w-56 overflow-hidden rounded-2xl border border-[#ECECEC] bg-white shadow-xl">

      {categories.map((category) => (
        <button
          key={category}
          onClick={() => {
            onSelect(category);
            onClose();
          }}
          className={`flex w-full items-center justify-between px-5 py-3 text-left transition hover:bg-[#F8F8F8]
          ${
            selected === category
              ? "bg-[#FDF3F3] text-[#C53938]"
              : "text-[#444]"
          }`}
        >
          {category}

          {selected === category && (
            <Check
              size={18}
              color="#C53938"
            />
          )}
        </button>
      ))}
    </div>
  );
}