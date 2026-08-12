import notebookImage from '../assets/images/best-seller-notebook.png';

export default function BestSeller() {
  return (
    <section
      id="best-seller"
      aria-labelledby="best-seller-title"
      className="bg-[var(--page-bg)] px-5 py-16 sm:px-8 lg:px-20 lg:py-20"
    >
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="flex justify-center">
          <h2
            id="best-seller-title"
            className="m-0 flex items-start text-center text-[30px] font-normal leading-10 tracking-[-0.9px] sm:text-4xl"
          >
            <span className="mr-2 text-[#ef5350]">Best</span>

            <span className="relative pb-2 text-[var(--primary-text)]">
              Seller

              <span
                aria-hidden="true"
                className="absolute bottom-0 left-0 h-1 w-full rounded-full bg-[#364153]"
              />

              <span
                aria-hidden="true"
                className="absolute bottom-0 left-1/2 h-1 w-1/2 -translate-x-1/2 rounded-full bg-[#ef5350]"
              />
            </span>
          </h2>
        </div>

        <article className="mt-16 overflow-hidden rounded-[32px] bg-[var(--surface-bg)]">
          <div className="grid min-h-[449px] grid-cols-1 items-stretch lg:grid-cols-[minmax(0,1fr)_540px]">
            <div className="flex flex-col items-center justify-center px-6 py-14 text-center sm:px-12 lg:px-20">
              <h3 className="m-0 text-xl font-medium leading-[30px] text-[#ef5350]">
                NoteBook
              </h3>

              <p className="mt-[38px] max-w-[520px] text-base font-light leading-[25px] text-[var(--secondary-text)]">
                A premium notebook designed for daily writing, studying, and
                creative planning.
              </p>

              <p className="mt-[62px] max-w-[560px] text-base font-medium leading-[25px] text-[var(--secondary-text)]">
                Premium paper • Durable cover • Designed for everyday use
              </p>

              <a
                href="/products/notebook"
                aria-label="View Notebook product"
                className="mt-[74px] inline-flex h-[60px] w-[250px] items-center justify-center rounded-full bg-[#c94545] px-6 text-xl font-medium text-[var(--primary-text)] transition duration-200 hover:bg-[#ef5350] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef5350] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1e1e1e] active:scale-[0.98]"
              >
                View Product
              </a>
            </div>

            <div className="relative min-h-[360px] overflow-hidden bg-white/10 lg:min-h-[445px]">
              <img
                src={notebookImage}
                alt="Pink premium notebook beside green leaves and a gold pen"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}