import deliveryImage from '../assets/images/delivery-man.png';
import paymentImage from '../assets/images/payment-hands.png';
import supportImage from '../assets/images/support-girl.png';

const features = [
  {
    id: 1,
    firstWord: 'Fast',
    highlightedWord: 'Delivery',
    image: deliveryImage,
    alt: 'Delivery man holding a package',
    backgroundShape:
      'rounded-tl-[80px] rounded-tr-[40px] rounded-br-[80px] rounded-bl-[40px]',
    imageClass:
      'bottom-0 left-[-1%] h-[90%] w-[75%] object-contain object-bottom',
  },
  {
    id: 2,
    firstWord: 'Easy',
    highlightedWord: 'Payments',
    image: paymentImage,
    alt: 'Egyptian cash and credit card',
    backgroundShape:
      'rounded-tl-[40px] rounded-tr-[80px] rounded-br-[40px] rounded-bl-[80px]',
    imageClass:
      'bottom-[-1%] left-[18%] h-[90%] w-[64%] object-contain object-bottom',
  },
  {
    id: 3,
    firstWord: 'WhatsApp',
    highlightedWord: 'Support',
    image: supportImage,
    alt: 'WhatsApp customer support',
    backgroundShape:
      'rounded-tl-[60px] rounded-tr-[60px] rounded-br-[40px] rounded-bl-[40px]',
    imageClass:
      'bottom-0 left-[9%] h-[92%] w-[82%] object-contain object-bottom',
  },
];

export default function WhyChooseUs() {
  return (
    <section
      id="why-choose-us"
      className="bg-[var(--page-bg)] px-5 py-[72px] sm:px-8 lg:px-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="flex items-start justify-center text-center">
          <h2 className="m-0 flex items-start text-[30px] font-bold leading-10 tracking-[-0.9px] sm:text-4xl">
            <span className="mr-3 text-[#ef5350]">Why</span>

            <span className="relative pb-2 text-[var(--primary-text)]">
              Choose Us

              <span className="absolute bottom-0 left-0 h-1 w-full rounded-full bg-[#364153]" />
              <span className="absolute bottom-0 left-1/4 h-1 w-1/2 rounded-full bg-[#ef5350]" />
            </span>
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-16 md:grid-cols-3 md:gap-8 lg:gap-12">
          {features.map((feature) => (
            <article
              key={feature.id}
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
                  className={`absolute bottom-0 left-[5%] right-[5%] top-1/4 bg-[var(--surface-bg)] ${feature.backgroundShape}`}
                />

                <img
                  src={feature.image}
                  alt={feature.alt}
                  className={`absolute max-w-none ${feature.imageClass}`}
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}