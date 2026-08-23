import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import AuthLayout from '../../layouts/AuthLayout';
import AuthInput from '../../components/auth/AuthInput';
import logoMascot from '../../assets/icons/logo-mascot-transparent.png';
import logoWordmark from '../../assets/icons/logo-wordmark.png';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    setEmail(e.target.value);
    setEmailError('');
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmed = email.trim();

    if (!trimmed) {
      setEmailError('Email is required.');
      return;
    }

    if (!EMAIL_PATTERN.test(trimmed)) {
      setEmailError('Enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setServerError('');

    try {
      const res = await fetch(
        (import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + '/auth/forgot-password',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: trimmed }),
        }
      );

      // Always show success regardless of whether email exists (security best practice)
      if (res.ok || res.status === 404) {
        setSubmitted(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setServerError(data.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setServerError('Unable to connect. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Forgot Password | El-D7E7</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <AuthLayout>
        <div className="w-full">

          {/* Logo */}
          <Link
            to="/"
            aria-label="Return to El-D7E7 home page"
            className="inline-flex items-center gap-1"
          >
            <img
              src={logoMascot}
              alt=""
              width="52"
              height="52"
              className="h-[52px] w-[52px] shrink-0 object-contain"
            />
            <img
              src={logoWordmark}
              alt="El-D7E7"
              width="125"
              height="42"
              className="h-[40px] w-auto object-contain"
            />
          </Link>

          {submitted ? (
            /* Success state */
            <div className="mt-6">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
                <svg className="h-7 w-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h1 className="mb-2 text-[32px] font-semibold leading-tight text-[#535353]">
                Check your email
              </h1>
              <p className="text-sm text-[#535353]/70">
                If an account exists for <span className="font-semibold text-[#535353]">{email}</span>, we've sent a password reset link. Check your inbox (and spam folder).
              </p>

              <Link
                to="/login"
                className="mt-6 inline-flex h-[44px] w-full items-center justify-center rounded-[14px] bg-[#535353] px-6 text-sm font-semibold text-white transition hover:bg-[#3f3f3f]"
              >
                Back to Sign in
              </Link>
            </div>
          ) : (
            /* Form state */
            <>
              <p className="mb-0 mt-3 text-[13px] font-semibold tracking-[0.4px] text-[#535353]/70">
                Password recovery
              </p>

              <h1 className="mb-0 mt-1 text-[34px] font-semibold leading-none text-[#535353]">
                Forgot Password?
              </h1>

              <p className="mt-2 text-sm text-[#535353]/70">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
                <AuthInput
                  id="forgot-email"
                  label="Email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  autoComplete="email"
                  required
                  error={emailError}
                />

                {serverError && (
                  <p role="alert" className="rounded-xl bg-[#c53938]/10 px-4 py-3 text-xs text-[#c53938]">
                    {serverError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 flex h-[44px] w-full items-center justify-center rounded-[14px] bg-[#535353] px-6 text-sm font-semibold text-white transition hover:bg-[#3f3f3f] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>

              <p className="mb-0 mt-5 text-[13px] text-[#535353]/70">
                Remember your password?{' '}
                <Link to="/login" className="font-medium !text-[#c53938]">
                  Sign in
                </Link>
              </p>
            </>
          )}

        </div>
      </AuthLayout>
    </>
  );
}
