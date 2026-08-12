import visaLogo from '../assets/icons/visa.svg';
import mastercardLogo from '../assets/icons/mastercard.svg';
import paymobLogo from '../assets/icons/paymob.png';
import whatsappLogo from '../assets/icons/whatsapp.svg';

const trustedBrands = [
  {
    name: 'Visa',
    logo: visaLogo,
    className: 'h-[23px] w-[72px]',
  },
  {
    name: 'Mastercard',
    logo: mastercardLogo,
    className: 'h-[49px] w-[63px]',
  },
  {
    name: 'Paymob',
    logo: paymobLogo,
    className: 'h-[39px] w-[152px]',
  },
  {
    name: 'WhatsApp',
    logo: whatsappLogo,
    className: 'h-[49px] w-[49px]',
  },
];

export default function TrustedBrands() {
  return (
    <section
      aria-labelledby="trusted-brands-title"
      className="bg-[var(--page-bg)] px-5 pb-16 sm:px-8 lg:px-20 lg:pb-20"
    >
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="flex min-h-[257px] flex-col items-center justify-center gap-8 overflow-hidden rounded-[32px] bg-[var(--surface-bg)] px-6 py-12 sm:px-10">
          <h2
            id="trusted-brands-title"
            className="m-0 text-center text-[22px] leading-8 sm:text-[28px]"
          >
            <span className="font-bold text-[var(--primary-text)]">
              Trusted by Students, Creatives
            </span>

            <span className="font-light text-[#9a9797]">
              , and Small Businesses
            </span>
          </h2>

          <div
            className="flex min-h-[87px] w-full max-w-[671px] flex-wrap items-center justify-center gap-8 rounded-[47px] bg-[var(--page-bg)] px-8 py-5 sm:gap-12"
            aria-label="Supported payment and contact services"
          >
            {trustedBrands.map((brand) => (
              <div
                key={brand.name}
                className="flex shrink-0 items-center justify-center"
              >
                <img
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  loading="lazy"
                  decoding="async"
                  className={`object-contain ${brand.className}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}