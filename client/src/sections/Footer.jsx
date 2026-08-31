import appStoreLogo from '../assets/icons/app-store.png';
import googlePlayLogo from '../assets/icons/google-play.png';

import phoneIcon from '../assets/icons/phone.svg';
import { useLanguage } from '../context/LanguageContext';

function FooterLinks({ title, links }) {
  return (
    <nav aria-label={title}>
      <h2 className="m-0 text-[13px] font-semibold leading-5 text-[var(--primary-text)]">
        {title}
      </h2>

      <ul className="mt-2.5 space-y-1.5">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="text-[12px] leading-5 text-[var(--primary-text)]/85 transition-colors hover:text-[#ef5350] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef5350]"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function Footer() {
  const { t } = useLanguage();
  const tr = t('footer');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--page-bg)] px-5 pb-4 pt-[42px] text-[var(--primary-text)] sm:px-8 lg:px-20">
      <div className="mx-auto w-full max-w-[1280px]">
        {/* Top footer */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-[150px_1fr_1.1fr_1.25fr_1.35fr]">
          {/* Instagram + LinkedIn */}
          <div className="flex items-start gap-2.5 pt-6">
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow El-D7E7 on Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--surface-soft)] text-gray-600 dark:text-gray-300 transition-all hover:bg-[#c53938] hover:border-[#c53938] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef5350] cursor-pointer shadow-2xs"
            >
              <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>

            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow El-D7E7 on LinkedIn"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--surface-soft)] text-gray-600 dark:text-gray-300 transition-all hover:bg-[#c53938] hover:border-[#c53938] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef5350] cursor-pointer shadow-2xs"
            >
              <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0H5C2.239 0 0 2.239 0 5V19C0 21.761 2.239 24 5 24H19C21.762 24 24 21.761 24 19V5C24 2.239 21.762 0 19 0ZM8 19H5V8H8V19ZM6.5 6.732C5.534 6.732 4.75 5.942 4.75 4.968C4.75 3.994 5.534 3.204 6.5 3.204C7.466 3.204 8.25 3.994 8.25 4.968C8.25 5.942 7.467 6.732 6.5 6.732ZM20 19H17V13.396C17 10.028 13 10.283 13 13.396V19H10V8H13V9.765C14.396 7.179 20 6.988 20 12.241V19Z" />
              </svg>
            </a>
          </div>

          <FooterLinks title={tr.aboutUs}      links={tr.aboutLinks} />
          <FooterLinks title={tr.helpSupport}  links={tr.supportLinks} />
          <FooterLinks title={tr.categories}   links={tr.categoryLinks} />

          {/* Install app */}
          <section aria-labelledby="install-app-title">
            <h2
              id="install-app-title"
              className="m-0 text-[13px] font-semibold leading-5 text-[var(--primary-text)]"
            >
              {tr.installApp}
            </h2>

            <div className="mt-2.5 flex flex-wrap gap-2">
              <a
                href="#app-store"
                aria-label="Download El-D7E7 from the App Store"
                className="rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef5350]"
              >
                <img
                  src={appStoreLogo}
                  alt="Download on the App Store"
                  loading="lazy"
                  decoding="async"
                  className="h-[34px] w-[102px] object-contain"
                />
              </a>

              <a
                href="#google-play"
                aria-label="Download El-D7E7 from Google Play"
                className="rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef5350]"
              >
                <img
                  src={googlePlayLogo}
                  alt="Get it on Google Play"
                  loading="lazy"
                  decoding="async"
                  className="h-[34px] w-[102px] object-contain"
                />
              </a>
            </div>

            <p className="mb-0 mt-2.5 text-[11px] leading-4 text-[#253d4e]">
              {tr.securedPayment}
            </p>

            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--surface-soft)] px-2.5 py-1 text-[10px] font-bold text-[var(--primary-text)]">
                <svg className="h-3.5 w-3.5 text-[#c53938]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="6" width="20" height="12" rx="2" />
                  <circle cx="12" cy="12" r="2" />
                  <path d="M6 12h.01M18 12h.01" />
                </svg>
                Cash
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--surface-soft)] px-2.5 py-1 text-[10px] font-bold text-[var(--primary-text)]">
                <span className="flex h-3.5 w-3.5 items-center justify-center rounded bg-[#5C2D91] text-white">
                  <svg viewBox="0 0 24 24" fill="none" className="h-2.5 w-2.5">
                    <path d="M5 17.5L12 5.5L19 17.5H13.2L12 14.2L10.8 17.5H5Z" fill="white" />
                  </svg>
                </span>
                InstaPay
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--surface-soft)] px-2.5 py-1 text-[10px] font-bold text-[var(--primary-text)]">
                <span className="flex h-3.5 w-3.5 items-center justify-center rounded bg-[#E60000] text-white">
                  <svg viewBox="0 0 24 24" fill="none" className="h-2.5 w-2.5">
                    <circle cx="12" cy="12" r="7" stroke="white" strokeWidth="2.5" fill="none" />
                  </svg>
                </span>
                Vodafone Cash
              </span>
            </div>
          </section>
        </div>

        {/* Red divider */}
        <div className="mt-[42px] h-px w-full bg-[#c53938]/70" />

        {/* Bottom footer */}
        <div className="grid gap-6 py-[18px] md:grid-cols-3 md:items-start">
          {/* Copyright */}
          <div className="text-[10px] leading-[18px] text-[var(--primary-text)]">
            <p className="m-0">
              {tr.copyright(currentYear)}{' '}
              <span className="font-semibold text-[#c53938]">
                {tr.brandName}
              </span>{' '}
              {tr.tagline}
            </p>

            <p className="m-0">{tr.allRights}</p>
          </div>

          {/* Hotline */}
          <div className="flex flex-col items-center text-center">
            <a
              href="tel:+201005535668"
              className="flex items-center gap-2.5 text-[19px] font-bold leading-[26px] text-[#c53938] transition-colors hover:text-[#ef5350] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef5350]"
            >
              <img
                src={phoneIcon}
                alt=""
                className="h-[24px] w-[24px] object-contain opacity-45"
              />

              <span className="text-[#c53938]">01005535668</span>
            </a>

            <p className="mt-3 text-[10px] leading-[11px] tracking-[0.75px] text-[var(--primary-text)]">
              {tr.workingHours}
              <br />
              <br />
              <strong>{tr.exceptNote}</strong>{' '}
              <u>{tr.thursdayNote}</u> {tr.thursdayClose}
              <br />
              <u>{tr.fridayNote}</u> {tr.fridayOpen}
            </p>
          </div>

          {/* Follow us */}
          <div className="md:text-right">
            <div className="flex flex-wrap items-center gap-2 md:justify-end">
              <span className="text-[12px] font-bold text-[var(--primary-text)]">
                {tr.followUs}
              </span>

              {/* Facebook */}
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow El-D7E7 on Facebook"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--surface-soft)] text-gray-600 dark:text-gray-300 transition-all hover:bg-[#c53938] hover:border-[#c53938] hover:text-white cursor-pointer shadow-2xs"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow El-D7E7 on Instagram"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--surface-soft)] text-gray-600 dark:text-gray-300 transition-all hover:bg-[#c53938] hover:border-[#c53938] hover:text-white cursor-pointer shadow-2xs"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>

              {/* Twitter / X */}
              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow El-D7E7 on Twitter"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--surface-soft)] text-gray-600 dark:text-gray-300 transition-all hover:bg-[#c53938] hover:border-[#c53938] hover:text-white cursor-pointer shadow-2xs"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>

            <p className="mb-0 mt-2 text-[10px] leading-4 text-[var(--primary-text)]">
              {tr.discount}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}