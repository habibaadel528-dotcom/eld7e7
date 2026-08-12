import appStoreLogo from '../assets/icons/app-store.png';
import googlePlayLogo from '../assets/icons/google-play.png';

import instagramIcon from '../assets/icons/instagram.svg';
import linkedinIcon from '../assets/icons/linkedin.svg';
import facebookIcon from '../assets/icons/facebook.svg';
import twitterIcon from '../assets/icons/twitter.svg';
import phoneIcon from '../assets/icons/phone.svg';

import paymentMethods from '../assets/icons/payment-methods.png';

const aboutLinks = [
  { label: 'Our Story', href: '/about' },
  { label: 'Blogs', href: '/blogs' },
  { label: 'Contact Us', href: '/contact' },
];

const supportLinks = [
  { label: 'FAQs', href: '/faqs' },
  { label: 'Shipping & Returns', href: '/shipping-returns' },
  { label: 'Payment Methods', href: '/payment-methods' },
];

const categoryLinks = [
  {
    label: 'Cultural Books Clearance',
    href: '/categories/cultural-books-clearance',
  },
  {
    label: 'Stationery',
    href: '/categories/stationery',
  },
  {
    label: 'External School Books',
    href: '/categories/external-school-books',
  },
  {
    label: 'Handcraft Supplies',
    href: '/categories/handcraft-supplies',
  },
];

const socialLinks = [
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/',
    icon: facebookIcon,
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/',
    icon: instagramIcon,
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com/',
    icon: twitterIcon,
  },
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

          <FooterLinks title="About Us" links={aboutLinks} />

          <FooterLinks
            title="Help and Support"
            links={supportLinks}
          />

          <FooterLinks
            title="Categories"
            links={categoryLinks}
          />

          {/* Install app */}
          <section aria-labelledby="install-app-title">
            <h2
              id="install-app-title"
              className="m-0 text-[13px] font-semibold leading-5 text-[var(--primary-text)]"
            >
              Install App
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
              Secured Payment Gateways
            </p>

            <img
              src={paymentMethods}
              alt="Supported secured payment methods"
              loading="lazy"
              decoding="async"
              className="mt-1.5 h-auto w-[180px] object-contain opacity-55"
            />
          </section>
        </div>

        {/* Red divider */}
        <div className="mt-[42px] h-px w-full bg-[#c53938]/70" />

        {/* Bottom footer */}
        <div className="grid gap-6 py-[18px] md:grid-cols-3 md:items-start">
          {/* Copyright */}
          <div className="text-[10px] leading-[18px] text-[var(--primary-text)]">
            <p className="m-0">
              © {currentYear},{' '}
              <span className="font-semibold text-[#c53938]">
                El D7e7
              </span>{' '}
              - HTML Ecommerce Template
            </p>

            <p className="m-0">
              All rights reserved
            </p>
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

              <span className=" text-[#c53938]">01005535668</span>
            </a>

            <p className="mt-3 text-[10px] leading-[11px] tracking-[0.75px] text-[var(--primary-text)]">
              Working 10:00 AM - 11:00 PM
              <br />
              <br />
              <strong>Except</strong>{' '}
              <u>Thursday</u> Close on 5 PM
              <br />
              <u>Friday</u> Open on 2 PM
            </p>
          </div>

          {/* Follow us */}
          <div className="md:text-right">
            <div className="flex flex-wrap items-center gap-2.5 md:justify-end">
              <span className="text-[12px] font-bold">
                Follow Us
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
              Up to 10% discount on your first subscribe
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}