import newsletterBackground from '../assets/images/newsletter-bg.png';
import { useLanguage } from '../context/LanguageContext';

export default function Newsletter() {
  const { t } = useLanguage();
  const tr = t('newsletter');

  return (
    <section
      aria-labelledby="newsletter-title"
      className="bg-[var(--page-bg)] px-5 py-12 sm:px-8 lg:px-20"
    >
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="relative min-h-[220px] sm:min-h-[250px] overflow-hidden rounded-[32px]">
          <img
            src={newsletterBackground}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[var(--surface-bg)]/85 backdrop-blur-[2px]"
          />

          <div className="relative z-10 flex min-h-[220px] sm:min-h-[250px] flex-col justify-center px-6 py-10 sm:px-10 lg:px-14">
            <h2
              id="newsletter-title"
              className="m-0 text-[28px] font-bold leading-tight tracking-[-0.96px] text-[var(--primary-text)] sm:text-[38px] lg:text-[46px]"
            >
              {tr.title}
            </h2>

            <p className="mt-4 max-w-[750px] text-base leading-7 tracking-[-0.36px] text-[var(--secondary-text)] sm:text-[18px]">
              {tr.subtitle}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}