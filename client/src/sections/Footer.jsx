import appStoreLogo from '../assets/icons/app-store.png';
import googlePlayLogo from '../assets/icons/google-play.png';

import instagramIcon from '../assets/icons/instagram.svg';
import linkedinIcon from '../assets/icons/linkedin.svg';
import facebookIcon from '../assets/icons/facebook.svg';
import twitterIcon from '../assets/icons/twitter.svg';
import phoneIcon from '../assets/icons/phone.svg';
import { useLanguage } from '../context/LanguageContext';

const socialLinks = [
  { name: 'Facebook',  href: 'https://www.facebook.com/',  icon: facebookIcon },
  { name: 'Instagram', href: 'https://www.instagram.com/', icon: instagramIcon },
  { name: 'Twitter',   href: 'https://twitter.com/',       icon: twitterIcon },
];

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
          <div className="flex items-start gap-3 pt-6">
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow El-D7E7 on Instagram"
              className="rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef5350]"
            >
              <img
                src={instagramIcon}
                alt=""
                className="h-[18px] w-[18px] object-contain"
              />
            </a>

            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow El-D7E7 on LinkedIn"
              className="rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef5350]"
            >
              <img
                src={linkedinIcon}
                alt=""
                className="h-[18px] w-[18px] object-contain"
              />
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
            <div className="flex flex-wrap items-center gap-2.5 md:justify-end">
              <span className="text-[12px] font-bold">
                {tr.followUs}
              </span>

              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow El-D7E7 on ${social.name}`}
                  className="flex h-[25px] w-[25px] items-center justify-center rounded-full bg-[#c53938] transition-colors hover:bg-[#ef5350] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef5350]"
                >
                  <img
                    src={social.icon}
                    alt=""
                    className="h-[15px] w-[15px] object-contain"
                  />
                </a>
              ))}
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