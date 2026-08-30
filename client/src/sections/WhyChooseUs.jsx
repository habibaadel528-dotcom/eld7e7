import deliveryImage from '../assets/images/delivery-man.png';
import paymentImage from '../assets/images/payment-hands.png';
import supportImage from '../assets/images/support-girl.png';
import { useLanguage } from '../context/LanguageContext';

const images = [deliveryImage, paymentImage, supportImage];
const alts = [
  'Delivery man holding a package',
  'Egyptian cash and credit card',
  'WhatsApp customer support',
];
const backgroundShapes = [
  'rounded-tl-[80px] rounded-tr-[40px] rounded-br-[80px] rounded-bl-[40px]',
  'rounded-tl-[40px] rounded-tr-[80px] rounded-br-[40px] rounded-bl-[80px]',
  'rounded-tl-[60px] rounded-tr-[60px] rounded-br-[40px] rounded-bl-[40px]',
];
const imageClasses = [
  'bottom-0 left-[-1%] h-[90%] w-[75%] object-contain object-bottom',
  'bottom-[-1%] left-[18%] h-[90%] w-[64%] object-contain object-bottom',
  'bottom-0 left-[9%] h-[92%] w-[82%] object-contain object-bottom',
];

export default function WhyChooseUs() {
  const { t } = useLanguage();
  const tr = t('whyChooseUs');

  return (
    <section
      id="why-choose-us"
      className="bg-[var(--page-bg)] px-5 py-[72px] sm:px-8 lg:px-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="flex items-start justify-center text-center">
          <h2 className="m-0 flex items-start text-[30px] font-bold leading-10 tracking-[-0.9px] sm:text-4xl">
            <span className="mr-3 text-[#ef5350]">{tr.sectionTitle1}</span>

            <span className="relative pb-2 text-[var(--primary-text)]">
              {tr.sectionTitle2}

              <span className="absolute bottom-0 left-0 h-1 w-full rounded-full bg-[#364153]" />
              <span className="absolute bottom-0 left-1/4 h-1 w-1/2 rounded-full bg-[#ef5350]" />
            </span>
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-16 md:grid-cols-3 md:gap-8 lg:gap-12">
          {tr.features.map((feature, index) => (
            <article
              key={index}
              className="flex flex-col items-center text-center"
            >
              <h3 className="m-0 mb-8 text-[20px] font-bold leading-8 text-[var(--primary-text)] sm:text-2xl">
                {feature.firstWord}{' '}
                <span className="text-[#ef5350]">
                  {feature.highlightedWord}
                </span>
              </h3>

              <div className="relative aspect-square w-full max-w-[320px] overflow-hidden">
                <div
                  className={`absolute bottom-0 left-[5%] right-[5%] top-1/4 bg-[var(--surface-bg)] ${backgroundShapes[index]}`}
                />

                <img
                  src={images[index]}
                  alt={alts[index]}
                  className={`absolute max-w-none ${imageClasses[index]}`}
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}