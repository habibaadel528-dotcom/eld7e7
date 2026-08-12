import { useState } from 'react';
import newsletterBackground from '../assets/images/newsletter-bg.png';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setMessage('Please enter your email address.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setMessage('Please enter a valid email address.');
      return;
    }

    // مؤقت لحد ما نوصلها بالـbackend.
    setMessage('Thank you for subscribing!');
    setEmail('');
  };

  return (
    <section
      aria-labelledby="newsletter-title"
      className="bg-[var(--page-bg)] px-5 py-16 sm:px-8 lg:px-20"
    >
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="relative min-h-[297px] overflow-hidden rounded-[32px]">
          <img
            src={newsletterBackground}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[var(--surface-bg)]/85"
          />

          <div className="relative z-10 flex min-h-[297px] flex-col justify-center px-6 py-10 sm:px-10 lg:px-14">
            <h2
              id="newsletter-title"
              className="m-0 text-[32px] font-medium leading-tight tracking-[-0.96px] text-[var(--primary-text)] sm:text-[40px] lg:text-[48px]"
            >
              Ready to Shop Smarter ?
            </h2>

            <p className="mt-5 max-w-[600px] text-base leading-7 tracking-[-0.36px] text-[var(--secondary-text)] sm:text-[18px]">
              Discover Quality Stationary and Handcraft Supplies today.
            </p>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="mt-8 w-full max-w-[450px]"
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>

              <div className="flex h-16 overflow-hidden rounded-full bg-white">
                <div className="flex min-w-0 flex-1 items-center gap-3 px-5">
                  <span
                    aria-hidden="true"
                    className="text-lg text-[#838383]"
                  >
                    ✈
                  </span>

                  <input
                    id="newsletter-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    inputMode="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      if (message) setMessage('');
                    }}
                    aria-describedby={
                      message ? 'newsletter-message' : undefined
                    }
                    className="h-full min-w-0 flex-1 border-0 bg-transparent text-base text-[#121212] outline-none placeholder:text-[#838383]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-[145px] shrink-0 rounded-full bg-[#c94545] px-5 text-base font-bold tracking-[0.5px] text-[var(--primary-text)] transition hover:bg-[#ef5350] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef5350] focus-visible:ring-inset sm:w-[160px]"
                >
                  Subscribe
                </button>
              </div>

              <p
                id="newsletter-message"
                aria-live="polite"
                className={`mt-3 min-h-6 text-sm ${
                  message === 'Thank you for subscribing!'
                    ? 'text-green-400'
                    : 'text-[#ef5350]'
                }`}
              >
                {message}
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}