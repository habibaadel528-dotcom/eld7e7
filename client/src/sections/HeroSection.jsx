import heroWoman from '../assets/images/hero-woman.png';
import iconPenTool from '../assets/icons/icon-pen-tool.svg';
import iconMessageCircle from '../assets/icons/icon-message-circle.svg';

export default function HeroSection() {
  return (
    <section className="overflow-hidden bg-[var(--page-bg)] px-5 pb-20 pt-14 sm:px-8 lg:px-20 lg:pb-24 lg:pt-[70px]">
      <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(480px,1fr)] lg:gap-16">
        <div className="relative z-10 max-w-[725px]">
          <h1 className="m-0 text-[42px] font-bold leading-[1.15] tracking-[-1.5px] text-[var(--primary-text)] sm:text-[52px] lg:text-[60px] lg:leading-[75px]">
            Everything You Need
            <br />
            in One Place
          </h1>

          <p className="mt-6 max-w-[680px] text-[17px] leading-8 sm:text-[20px] sm:leading-[32.5px]">
            <span className="text-[#ef5350]">Shop</span>

            <span className="text-[var(--secondary-text)]">
              {' '}
              premium stationery and handcraft supplies online, with
              exclusive clearance offers on selected cultural books.
            </span>
          </p>

          <p className="mt-4 max-w-[670px] text-[15px] font-light leading-7 text-[var(--secondary-text)] sm:text-[17.5px] sm:leading-[25px]">
            Enjoy fast delivery and flexible payment options, including cash
            on delivery, Visa, InstaPay, and Vodafone Cash, with responsive
            WhatsApp support for a smooth shopping experience.
          </p>

          <a
            href="#shop"
            className="mt-8 inline-flex h-[60px] w-[250px] items-center justify-center rounded-full bg-[#c94545] px-6 text-xl font-medium text-[var(--primary-text)] transition hover:bg-[#ef5350]"
          >
            Shop Now
          </a>
        </div>

        <div className="relative mx-auto h-[500px] w-full max-w-[560px] sm:h-[580px]">
          <div
            aria-hidden="true"
            className="absolute right-0 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-[var(--surface-bg)]/60 blur-[32px]"
          />

          <img
            src={heroWoman}
            alt="Customer using a smartphone"
            className="absolute bottom-0 right-0 z-10 h-[108%] w-auto max-w-none object-contain sm:h-[112%]"
          />

          <div className="absolute left-[1%] top-[14%] z-20 rounded-bl-[4px] rounded-br-2xl rounded-tl-2xl rounded-tr-2xl bg-[#ef5350] px-5 py-3 text-sm leading-5 text-[var(--primary-text)] shadow-xl sm:left-[4%] sm:top-[17%]">
            Hi! 👋 How can I help you?
          </div>

          <div className="absolute left-[14%] top-[31%] z-20 max-w-[220px] rounded-bl-2xl rounded-br-[4px] rounded-tl-2xl rounded-tr-2xl bg-[#ef5350]/90 px-5 py-3 text-sm leading-5 text-[var(--primary-text)] shadow-xl backdrop-blur-sm sm:left-[18%]">
            I&apos;m looking for a nice pen.
          </div>

          <div className="absolute left-[-2%] top-[47%] z-20 flex items-center gap-3 sm:left-[2%] sm:top-[50%]">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ef5350] shadow-lg">
              <img
                src={iconMessageCircle}
                alt=""
                className="h-5 w-5 object-contain"
              />
            </div>

            <div className="rounded-bl-[4px] rounded-br-2xl rounded-tl-2xl rounded-tr-2xl bg-[#ef5350] px-5 py-3 text-sm leading-5 text-[var(--primary-text)] shadow-xl">
              I&apos;ve got you covered! 😎
            </div>
          </div>

          <div className="absolute bottom-[13%] right-[2%] z-20 rounded-bl-2xl rounded-br-[4px] rounded-tl-2xl rounded-tr-2xl bg-[#ef5350]/90 px-5 py-3 text-sm leading-5 text-[var(--primary-text)]   shadow-xl backdrop-blur-sm">
            Thanks! 😍
          </div>

          <div className="absolute bottom-0 left-[3%] z-20 hidden w-36 rounded-2xl border border-[#ef5350] bg-[var(--page-bg)] p-4 shadow-2xl sm:block">
            <div className="flex h-24 items-center justify-center rounded-xl bg-white/5 p-2">
              <img
                src={iconPenTool}
                alt=""
                className="h-12 w-12 object-contain"
              />
            </div>

            <div className="py-3">
              <p className="m-0 text-sm font-bold leading-5 text-[var(--primary-text)]">
                Black Pen
              </p>

              <p className="m-0 text-sm leading-5 text-[var(--primary-text)] ">EGP 30</p>
            </div>

            <button
              type="button"
              className="flex h-8 w-full items-center justify-center rounded-full border border-[#ef5350] text-xs font-bold text-[#ef5350] transition hover:bg-[#ef5350] hover:text-[var(--primary-text)]"
            >
              Buy
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}