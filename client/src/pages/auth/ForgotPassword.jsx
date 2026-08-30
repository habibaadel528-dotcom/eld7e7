import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import AuthLayout from '../../layouts/AuthLayout';
import AuthInput from '../../components/auth/AuthInput';
import logoMascot from '../../assets/icons/logo-mascot-transparent.png';
import logoWordmark from '../../assets/icons/logo-wordmark.png';
import { useLanguage } from '../../context/LanguageContext';
import { authApi } from '../../services/api';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPassword() {
  const { t } = useLanguage();
  const tr = t('auth').forgotPassword;

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

    if (!trimmed) { setEmailError(tr.errors.emailRequired); return; }
    if (!EMAIL_PATTERN.test(trimmed)) { setEmailError(tr.errors.emailInvalid); return; }

    setIsSubmitting(true);
    setServerError('');

    try {
      await authApi.forgotPassword(trimmed);
      setSubmitted(true);
    } catch (err) {
      if (err.status === 404) {
        setSubmitted(true);
      } else {
        setServerError(err.message || tr.errors.serverError);
      }
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
          <Link to="/" aria-label="Return to El-D7E7 home page" className="inline-flex items-center gap-1">
            <img src={logoMascot} alt="" width="52" height="52" className="h-[52px] w-[52px] shrink-0 object-contain" />
            <img src={logoWordmark} alt="El-D7E7" width="125" height="42" className="h-[40px] w-auto object-contain" />
          </Link>

          {submitted ? (
            <div className="mt-6">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
                <svg className="h-7 w-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="mb-2 text-[32px] font-semibold leading-tight text-[#535353]">{tr.checkEmail}</h1>
              <p className="text-sm text-[#535353]/70">{tr.checkEmailDesc(email)}</p>
              <Link to="/login" className="mt-6 inline-flex h-[44px] w-full items-center justify-center rounded-[14px] bg-[#535353] px-6 text-sm font-semibold text-white transition hover:bg-[#3f3f3f]">
                {tr.backToSignIn}
              </Link>
            </div>
          ) : (
            <>
              <p className="mb-0 mt-3 text-[13px] font-semibold tracking-[0.4px] text-[#535353]/70">{tr.recovery}</p>
              <h1 className="mb-0 mt-1 text-[34px] font-semibold leading-none text-[#535353]">{tr.title}</h1>
              <p className="mt-2 text-sm text-[#535353]/70">{tr.subtitle}</p>

              <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
                <AuthInput
                  id="forgot-email"
                  label={tr.emailLabel}
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  placeholder={tr.emailPlaceholder}
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
                  {isSubmitting ? tr.sending : tr.sendLink}
                </button>
              </form>

              <p className="mb-0 mt-5 text-[13px] text-[#535353]/70">
                {tr.rememberPassword}{' '}
                <Link to="/login" className="font-medium !text-[#c53938]">{tr.signIn}</Link>
              </p>
            </>
          )}
        </div>
      </AuthLayout>
    </>
  );
}
