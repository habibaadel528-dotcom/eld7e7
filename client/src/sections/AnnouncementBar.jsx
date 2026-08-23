import iconTruck from '../assets/icons/icon-truck.svg';

export default function AnnouncementBar() {
  return (
    <div className="border-b border-white/5 bg-[#c94545] overflow-hidden">
      <div className="mx-auto flex min-h-[51px] w-full max-w-[1280px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-8 py-[10px]">
        {/* Left — truck + text */}
        <div className="flex items-center gap-2 shrink-0">
          <img
            src={iconTruck}
            alt=""
            className="h-5 w-5 shrink-0 object-contain"
          />
          <p className="m-0 text-[12px] leading-5 sm:text-sm whitespace-nowrap">
            <span className="text-white font-semibold">Free Delivery </span>
            <span className="text-white/80">on orders </span>
            <span className="font-bold text-white">1,000 EGP+</span>
          </p>
        </div>

        {/* Right — button */}
        <a
          href="#learn-more"
          className="shrink-0 rounded-full border border-white/70 px-4 py-[7px] text-[11px] leading-4 text-white transition hover:bg-white/10 sm:px-[17px] sm:text-xs"
        >
          Learn more
        </a>
      </div>
    </div>
  );
}