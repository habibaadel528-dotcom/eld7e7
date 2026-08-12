import warehouseBackground from '../assets/images/auth/warehouse-bg.jpeg';
import ellipseDecor1 from '../assets/images/auth/ellipse-decor-1.svg';
import ellipseDecor2 from '../assets/images/auth/ellipse-decor-2.svg';
import ellipseDecor3 from '../assets/images/auth/ellipse-decor-3.svg';

export default function AuthLayout({ children }) {
  return (
    <main className="relative flex h-screen items-center justify-center overflow-hidden bg-[#f5f5f5] px-4 py-4 sm:px-6">
      <img
        src={ellipseDecor1}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -top-[260px] right-[18%] hidden w-[620px] max-w-none opacity-60 md:block"
      />

      <img
        src={ellipseDecor2}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[250px] -left-[320px] hidden w-[700px] max-w-none opacity-55 md:block"
      />

      <div className="relative z-10 grid h-[min(620px,calc(100vh-32px))] w-full max-w-[1180px] overflow-hidden rounded-[34px] bg-[#dad8d8] shadow-[18px_24px_0_rgba(0,0,0,0.08),0_18px_55px_rgba(0,0,0,0.14)] lg:grid-cols-[42%_58%]">
        <section className="relative z-20 flex min-h-0 items-center bg-[#dad8d8] px-7 py-5 sm:px-10 lg:px-[58px]">
          <div className="mx-auto w-full max-w-[350px]">
            {children}
          </div>
        </section>

        <section
          aria-hidden="true"
          className="relative hidden min-h-0 overflow-hidden lg:block"
        >
          <img
            src={warehouseBackground}
            alt=""
            fetchPriority="high"
            decoding="async"
            width="720"
            height="620"
            className="absolute inset-0 h-full w-full object-cover object-center grayscale"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-[#dad8d8] via-[#d7c5c5]/70 to-[#c53938]/80" />
        </section>
      </div>

      <img
        src={ellipseDecor3}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[300px] -right-[100px] z-20 hidden w-[760px] max-w-none opacity-60 lg:block"
      />
    </main>
  );
}