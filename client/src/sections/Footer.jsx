import { Link } from 'react-router-dom';
import appStoreLogo from '../assets/icons/app-store.png';
import googlePlayLogo from '../assets/icons/google-play.png';

import phoneIcon from '../assets/icons/phone.svg';
import { useLanguage } from '../context/LanguageContext';
import { SOCIAL_LINKS } from '../data/socialLinks';

function FooterLinks({ title, links }) {
  return (
    <nav aria-label={title}>
      <h2 className="m-0 text-[13px] font-semibold leading-5 text-[var(--primary-text)]">
        {title}
      </h2>

      <ul className="mt-2.5 space-y-1.5">
        {links.map((link) => {
          const isInternal = link.href && link.href.startsWith('/');
          const Tag = isInternal ? Link : 'a';
          const linkProps = isInternal ? { to: link.href } : { href: link.href };

          return (
            <li key={link.label}>
              <Tag
                {...linkProps}
                className="text-[12px] leading-5 text-[var(--primary-text)]/85 transition-colors hover:text-[#ef5350] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef5350]"
              >
                {link.label}
              </Tag>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default function Footer() {
  const { lang, t } = useLanguage();
  const tr = t('footer');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--page-bg)] px-5 pb-4 pt-[42px] text-[var(--primary-text)] sm:px-8 lg:px-20">
      <div className="mx-auto w-full max-w-[1280px]">
        {/* Top footer */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-[150px_1fr_1.1fr_1.25fr_1.35fr]">
          {/* Social icons: Facebook + Instagram + TikTok + WhatsApp */}
          <div className="flex flex-wrap items-start gap-2 pt-6">
            {/* Facebook */}
            <a
              href={SOCIAL_LINKS.facebook.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow El-D7E7 on Facebook"
              className="group flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--surface-soft)] text-[var(--primary-text)] transition-all hover:bg-[#1877F2] hover:border-[#1877F2] hover:!text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef5350] cursor-pointer shadow-2xs"
            >
              <svg className="h-4 w-4 text-[var(--primary-text)] transition-colors group-hover:text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>

            {/* Instagram */}
            <a
              href={SOCIAL_LINKS.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow El-D7E7 on Instagram"
              className="group flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--surface-soft)] text-[var(--primary-text)] transition-all hover:bg-[#E4405F] hover:border-[#E4405F] hover:!text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef5350] cursor-pointer shadow-2xs"
            >
              <svg className="h-4.5 w-4.5 text-[var(--primary-text)] transition-colors group-hover:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>

            {/* TikTok */}
            <a
              href={SOCIAL_LINKS.tiktok.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow El-D7E7 on TikTok"
              className="group flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--surface-soft)] text-[var(--primary-text)] transition-all hover:bg-black hover:border-black hover:!text-white dark:hover:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef5350] cursor-pointer shadow-2xs"
            >
              <svg className="h-4 w-4 text-[var(--primary-text)] transition-colors group-hover:text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
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

            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              <a
                href="#app-store"
                aria-label="Download El-D7E7 from the App Store"
                className="inline-block rounded-md overflow-hidden transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef5350]"
              >
                <img
                  src={appStoreLogo}
                  alt="Download on the App Store"
                  loading="lazy"
                  decoding="async"
                  className="h-[34px] w-auto max-w-[110px] object-contain no-invert !filter-none"
                  style={{ filter: 'none' }}
                />
              </a>

              <a
                href="#google-play"
                aria-label="Download El-D7E7 from Google Play"
                className="inline-block rounded-md overflow-hidden transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef5350]"
              >
                <img
                  src={googlePlayLogo}
                  alt="Get it on Google Play"
                  loading="lazy"
                  decoding="async"
                  className="h-[34px] w-auto max-w-[110px] object-contain no-invert !filter-none"
                  style={{ filter: 'none' }}
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
              href={`tel:+20${SOCIAL_LINKS.whatsapp.phone}`}
              className="flex items-center gap-2.5 text-[19px] font-bold leading-[26px] text-[#c53938] transition-colors hover:text-[#ef5350] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef5350]"
            >
              <img
                src={phoneIcon}
                alt=""
                className="h-[24px] w-[24px] object-contain opacity-45"
              />

              <span className="text-[#c53938]" dir="ltr">
                {tr.phone || (lang === 'ar' ? SOCIAL_LINKS.whatsapp.phoneAr : SOCIAL_LINKS.whatsapp.phone)}
              </span>
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
                href={SOCIAL_LINKS.facebook.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow El-D7E7 on Facebook"
                className="group flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--surface-soft)] text-[var(--primary-text)] transition-all hover:bg-[#1877F2] hover:border-[#1877F2] hover:!text-white cursor-pointer shadow-2xs"
              >
                <svg className="h-4 w-4 text-[var(--primary-text)] transition-colors group-hover:text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              {/* Instagram */}
              <a
                href={SOCIAL_LINKS.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow El-D7E7 on Instagram"
                className="group flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--surface-soft)] text-[var(--primary-text)] transition-all hover:bg-[#E4405F] hover:border-[#E4405F] hover:!text-white cursor-pointer shadow-2xs"
              >
                <svg className="h-4 w-4 text-[var(--primary-text)] transition-colors group-hover:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>

              {/* TikTok */}
              <a
                href={SOCIAL_LINKS.tiktok.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow El-D7E7 on TikTok"
                className="group flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--surface-soft)] text-[var(--primary-text)] transition-all hover:bg-black hover:border-black hover:!text-white dark:hover:border-white cursor-pointer shadow-2xs"
              >
                <svg className="h-3.5 w-3.5 text-[var(--primary-text)] transition-colors group-hover:text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
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