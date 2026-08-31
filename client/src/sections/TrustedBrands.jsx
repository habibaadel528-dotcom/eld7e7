import { useLanguage } from '../context/LanguageContext';

export default function TrustedBrands() {
  const { lang, t } = useLanguage();
  const tr = t('trustedBrands');

  return (
    <section
      aria-labelledby="trusted-brands-title"
      className="bg-[var(--page-bg)] px-5 pb-16 sm:px-8 lg:px-20 lg:pb-20"
    >
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="flex min-h-[240px] flex-col items-center justify-center gap-6 overflow-hidden rounded-[32px] bg-[var(--surface-bg)] px-6 py-10 sm:px-10">
          <h2
            id="trusted-brands-title"
            className="m-0 text-center text-[20px] leading-7 sm:text-[26px]"
          >
            <span className="font-bold text-[var(--primary-text)]">
              {tr.title1}
            </span>
            <span className="font-light text-[#9a9797]">
              {tr.title2}
            </span>
          </h2>

          <div
            className="flex w-full max-w-[580px] flex-wrap items-center justify-center gap-4 sm:gap-6 rounded-[28px] sm:rounded-[47px] bg-[var(--page-bg)] p-3 sm:p-5 border border-[var(--border-color)]"
            aria-label="Supported payment methods: Vodafone Cash and InstaPay"
          >
            {/* Vodafone Cash */}
            <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-[var(--surface-bg)] border border-[var(--border-color)] shadow-xs transition hover:scale-105">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E60000] text-white shadow-xs">
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                  <circle cx="12" cy="12" r="7" stroke="white" strokeWidth="2.2" fill="none" />
                  <path d="M12 8.5v3.8l2.5 1.3" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
              <div className="text-start">
                <span className="block text-sm sm:text-base font-bold tracking-tight text-[var(--primary-text)]">
                  Vodafone Cash
                </span>
                <span className="block text-[11px] font-semibold text-[#E60000]">
                  {lang === 'ar' ? 'فودافون كاش' : 'Instant Mobile Wallet'}
                </span>
              </div>
            </div>

            {/* InstaPay */}
            <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-[var(--surface-bg)] border border-[var(--border-color)] shadow-xs transition hover:scale-105">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#5C2D91] text-white shadow-xs">
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                  <path d="M5 17.5L12 5.5L19 17.5H13.2L12 14.2L10.8 17.5H5Z" fill="white" />
                </svg>
              </span>
              <div className="text-start">
                <span className="block text-sm sm:text-base font-bold tracking-tight text-[var(--primary-text)]">
                  InstaPay
                </span>
                <span className="block text-[11px] font-semibold text-[#5C2D91]">
                  {lang === 'ar' ? 'إنستاباي' : 'National Instant Transfer'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}