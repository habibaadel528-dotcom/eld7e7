import iconTruck from '../assets/icons/icon-truck.svg';

export default function AnnouncementBar() {
  return (
    <div className="border-b border-white/5 bg-[#c94545]">
      <div className="mx-auto flex min-h-[51px] w-full max-w-[1280px] items-center justify-between px-5 py-[10px] sm:px-8 lg:px-0">
        <div className="flex items-center gap-2">
          <img
            src={iconTruck}
            alt=""
            className="h-5 w-5 shrink-0 object-contain"
          />

          <p className="m-0 text-[12px] leading-5 sm:text-sm">
            <span className="text-white">Free Delivery </span>
            <span className="text-[#151515]">on orders </span>
            <span className="font-medium text-[var(--primary-text)]">1,000 EGP+</span>
          </p>
        </div>

        <a
          href="#learn-more"
          className="rounded-full border border-white px-4 py-[7px] text-[11px] leading-4 !text-white sm:px-[17px] sm:text-xs"
        >
          Learn more
        </a>
      </div>
    </div>
  );
}