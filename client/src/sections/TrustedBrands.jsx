import { useLanguage } from '../context/LanguageContext';

export default function TrustedBrands() {
  const { t } = useLanguage();
  const tr = t('trustedBrands');

  return (
    <section
      aria-labelledby="trusted-brands-title"
      className="bg-[var(--page-bg)] px-5 pb-16 sm:px-8 lg:px-20 lg:pb-20"
    >
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="flex flex-col items-center justify-center rounded-[32px] border border-[var(--border-color)] bg-[var(--surface-bg)] px-6 py-10 sm:px-12 sm:py-14 text-center shadow-xs">
          
          {/* Top Badge */}
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[var(--border-color)] bg-[var(--surface-soft)] px-3.5 py-1 text-xs font-bold text-[#c53938]">
            {tr.badge}
          </span>

          {/* Heading & Subtitle */}
          <h2
            id="trusted-brands-title"
            className="m-0 text-2xl font-black text-[var(--primary-text)] sm:text-3xl lg:text-4xl"
          >
            {tr.title}
          </h2>

          <p className="mt-2.5 max-w-lg text-xs sm:text-sm text-[var(--secondary-text)] leading-relaxed">
            {tr.subtitle}
          </p>

          {/* Payment Cards Grid */}
          <div className="mt-8 grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
            
            {/* ── Vodafone Cash Card ── */}
            <div className="group relative flex flex-col items-start justify-between rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-500/5 to-transparent p-5 text-start transition-all duration-200 hover:-translate-y-1 hover:border-red-500/40 hover:shadow-md">
              <div className="flex w-full items-center justify-between gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E60000] text-white shadow-md">
                  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
                    <circle cx="12" cy="12" r="7" stroke="white" strokeWidth="2.2" fill="none" />
                    <path d="M12 8.5v3.8l2.5 1.3" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="rounded-full bg-red-500/10 px-2.5 py-0.5 text-[10px] font-bold text-[#E60000]">
                  {tr.vodafoneBadge}
                </span>
              </div>

              <div className="mt-4">
                <h3 className="text-base sm:text-lg font-black text-black dark:text-white">
                  {tr.vodafoneTitle}
                </h3>
                <p className="text-xs text-black/80 dark:text-gray-300 font-medium mt-0.5">
                  {tr.vodafoneSubtitle}
                </p>
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-black/5 dark:bg-white/10 px-3.5 py-1.5 text-xs font-black text-black dark:text-white border border-black/10 dark:border-white/10">
                  <span className="text-[#E60000] text-xs font-bold">📱</span>
                  <span>{tr.vodafoneDetail}</span>
                </div>
              </div>
            </div>

            {/* ── InstaPay Card ── */}
            <div className="group relative flex flex-col items-start justify-between rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-transparent p-5 text-start transition-all duration-200 hover:-translate-y-1 hover:border-purple-500/40 hover:shadow-md">
              <div className="flex w-full items-center justify-between gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#5C2D91] text-white shadow-md">
                  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
                    <path d="M5 17.5L12 5.5L19 17.5H13.2L12 14.2L10.8 17.5H5Z" fill="white" />
                  </svg>
                </div>
                <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-[10px] font-bold text-[#5C2D91]">
                  {tr.instapayBadge}
                </span>
              </div>

              <div className="mt-4">
                <h3 className="text-base sm:text-lg font-black text-black dark:text-white">
                  {tr.instapayTitle}
                </h3>
                <p className="text-xs text-black/80 dark:text-gray-300 font-medium mt-0.5">
                  {tr.instapaySubtitle}
                </p>
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-black/5 dark:bg-white/10 px-3.5 py-1.5 text-xs font-black text-black dark:text-white border border-black/10 dark:border-white/10">
                  <span className="text-[#5C2D91] text-xs font-bold">🏦</span>
                  <span>{tr.instapayDetail}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Trust Guarantees */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-6 border-t border-[var(--border-color)] w-full text-xs text-[var(--secondary-text)]">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="text-emerald-500">✓</span>
              <span>{tr.trust1}</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="text-emerald-500">✓</span>
              <span>{tr.trust2}</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="text-emerald-500">✓</span>
              <span>{tr.trust3}</span>
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}