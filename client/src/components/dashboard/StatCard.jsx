import {
  Package,
  Heart,
  Gift,
  Wallet,
} from "lucide-react";

const icons = {
  orders:   Package,
  wishlist: Heart,
  loyalty:  Gift,
  wallet:   Wallet,
};

const iconColors = {
  orders:   "bg-[#fff2f2] text-[#c53938] [html[data-theme='dark']_&]:bg-[#c53938]/20",
  wishlist: "bg-[#fff8eb] text-[#f59e0b] [html[data-theme='dark']_&]:bg-[#f59e0b]/20",
  loyalty:  "bg-[#eef9f2] text-[#10b981] [html[data-theme='dark']_&]:bg-[#10b981]/20",
  wallet:   "bg-[#eef5ff] text-[#3b82f6] [html[data-theme='dark']_&]:bg-[#3b82f6]/20",
};

export default function StatCard({ type, number, title, subtitle }) {
  const Icon = icons[type];

  return (
    <article className="rounded-[24px] border border-[var(--border-color)] bg-[var(--surface-bg)] p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-[14px] font-medium text-[var(--secondary-text)]">
            {title}
          </p>

          <h3 className="mt-3 text-[32px] font-bold text-[var(--primary-text)]">
            {number}
          </h3>

          <p className="mt-2 text-[13px] text-[var(--secondary-text)]">
            {subtitle}
          </p>
        </div>

        <div className={`flex h-[62px] w-[62px] items-center justify-center rounded-2xl ${iconColors[type]}`}>
          <Icon size={30} strokeWidth={2} />
        </div>

      </div>

    </article>
  );
}