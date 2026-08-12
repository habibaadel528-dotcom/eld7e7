import booksIcon from '../assets/icons/category-books.svg';
import stationeryIcon from '../assets/icons/category-stationery.svg';
import schoolIcon from '../assets/icons/category-school.svg';
import handcraftIcon from '../assets/icons/category-handcraft.svg';

const categories = [
  {
    title: 'Cultural Books Clearance',
    description:
      'Limited quantities of selected cultural books at special prices.',
    buttonLabel: 'View Clearance',
    href: '#cultural-books-clearance',
    icon: booksIcon,
  },
  {
    title: 'Stationery',
    description:
      'Pens, notebooks, supplies, and everyday essentials.',
    buttonLabel: 'Shop Stationery',
    href: '#stationery',
    icon: stationeryIcon,
  },
  {
    title: 'External School Books',
    description:
      'Popular school books and study guides.',
    buttonLabel: 'Browse Books',
    href: '#external-school-books',
    icon: schoolIcon,
  },
  {
    title: 'Handcraft Supplies',
    description:
      'Materials for handmade and creative projects.',
    buttonLabel: 'Explore Supplies',
    href: '#handcraft-supplies',
    icon: handcraftIcon,
  },
];

export default function CategorySection() {
  return (
    <section
      id="categories"
      className="bg-[var(--page-bg)] px-5 py-16 sm:px-8 lg:px-20 lg:py-20"
    >
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="flex flex-col items-center gap-4">
          <h2 className="m-0 flex items-start text-center text-[30px] font-bold leading-10 tracking-[-0.9px] sm:text-4xl">
            <span className="mr-2 text-[#ef5350]">Why</span>

            <span className="relative pb-2 text-[var(--primary-text)]">
              By Category

              <span className="absolute bottom-0 left-0 h-1 w-full rounded-full bg-[#364153]" />

              <span className="absolute bottom-0 left-1/2 h-1 w-1/2 -translate-x-1/2 rounded-full bg-[#ef5350]" />
            </span>
          </h2>

          <p className="m-0 max-w-[526px] text-center text-base leading-7 text-[var(--secondary-text)] sm:text-xl">
            Find what you need faster by browsing our main categories.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {categories.map((category) => (
            <article
              key={category.title}
              className="group flex min-h-[380px] flex-col items-center rounded-[24px] border border-[var(--border-color)] bg-[var(--surface-bg)] p-[33px] text-center transition duration-300 hover:-translate-y-1 hover:border-[#ef5350]/70 hover:shadow-[0_20px_45px_rgba(0,0,0,0.22)]"
            >
              <h3 className="m-0 flex min-h-[56px] items-center justify-center text-[18px] font-bold leading-[22.5px] text-[#ef5350]">
                {category.title}
              </h3>

              <div className="mb-6 mt-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/5">
                <img
                  src={category.icon}
                  alt=""
                  className="h-12 w-12 object-contain"
                />
              </div>

              <p className="m-0 flex-1 text-sm leading-[22.75px] text-[var(--secondary-text)]">
                {category.description}
              </p>

              <a
                href={category.href}
                className="mt-8 flex min-h-[52px] w-full items-center justify-center rounded-full bg-[#c94545] px-5 py-[14px] text-base leading-6 text-[var(--primary-text)] transition duration-200 hover:bg-[#ef5350] active:scale-[0.98]"
              >
                {category.buttonLabel}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}