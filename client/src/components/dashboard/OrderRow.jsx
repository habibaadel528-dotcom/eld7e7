import { ArrowRight } from "lucide-react";

import headphones from "../../assets/images/dashboard/order-headphones.png";
import watch      from "../../assets/images/dashboard/order-watch.png";
import camera     from "../../assets/images/dashboard/order-camera.png";

const images = {
  "order-headphones.png": headphones,
  "order-watch.png":      watch,
  "order-camera.png":     camera,
};

const badgeStyle = {
  Delivered:  "bg-[#eafaf1] text-[#16a34a]",
  Processing: "bg-[#fff7e8] text-[#d97706]",
  Pending:    "bg-[#eef5ff] text-[#2563eb]",
  Cancelled:  "bg-[#ffeaea] text-[#dc2626]",
};

export default function OrderRow({ image, title, status, price }) {
  return (
    <tr className="rounded-2xl bg-[var(--surface-soft)] transition hover:bg-[var(--surface-bg)]">

      <td className="rounded-l-2xl py-5">
        <div className="flex items-center gap-4">
          <img
            src={images[image]}
            alt={title}
            loading="lazy"
            width="70"
            height="70"
            className="h-[70px] w-[70px] rounded-xl object-cover"
          />
          <div>
            <h4 className="text-[16px] font-semibold text-[var(--primary-text)]">
              {title}
            </h4>
            <p className="mt-1 text-sm text-[var(--secondary-text)]">
              Quantity: 1
            </p>
          </div>
        </div>
      </td>

      <td>
        <span className={`rounded-full px-4 py-2 text-[13px] font-semibold ${badgeStyle[status]}`}>
          {status}
        </span>
      </td>

      <td className="text-[16px] font-bold text-[var(--primary-text)]">
        {price}
      </td>

      <td className="rounded-r-2xl text-right">
        <button type="button" className="inline-flex items-center gap-2 text-sm font-semibold text-[#c53938] transition hover:gap-3">
          Details
          <ArrowRight size={18} strokeWidth={2.2} />
        </button>
      </td>

    </tr>
  );
}