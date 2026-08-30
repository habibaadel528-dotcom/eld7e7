import { useState } from 'react';
import { toast } from 'sonner';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import AuthLayout from '../../layouts/AuthLayout';
import AuthInput from '../../components/auth/AuthInput';
import SocialLogin from '../../components/auth/SocialLogin';
import logoWordmark from '../../assets/icons/logo-wordmark.png';
import logoMascot from '../../assets/icons/logo-mascot-transparent.png';
import { getStoredUser, isAuthenticated, saveAuthSession } from '../../utils/auth';
import { authApi } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useLanguage();
    const tr = t('auth').login;

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (isAuthenticated()) {
        const storedUser = getStoredUser();
        if (storedUser?.role === 'admin' || localStorage.getItem('isAdminAuthenticated') === 'true') {
            return <Navigate to="/admin/customers" replace />;
        }
        return <Navigate to="/account/dashboard" replace />;
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((cur) => ({ ...cur, [name]: value }));
        setErrors((cur) => ({ ...cur, [name]: '' }));
        setSubmitError('');
    };

    const validateForm = () => {
        const newErrors = {};
        const email = formData.email.trim();
        const password = formData.password;
        const errTr = t('auth').signup.errors;

        if (!email) newErrors.email = errTr.emailRequired;
        else if (!EMAIL_PATTERN.test(email)) newErrors.email = errTr.emailInvalid;
        if (!password) newErrors.password = errTr.passwordRequired;
        else if (password.length < 6) newErrors.password = errTr.passwordShort;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        setSubmitError('');

        try {
            const data = await authApi.login({
                email: formData.email.trim(),
                password: formData.password,
            });
            saveAuthSession({ user: data.user, token: data.token });

            if (data.user.role === 'admin') {
                localStorage.setItem('isAdminAuthenticated', 'true');
                toast.success(`Welcome back, ${data.user.firstName || 'Admin'}!`);
                navigate('/admin/customers', { replace: true });
            } else {
                toast.success(`Welcome back, ${data.user.firstName || ''}!`);
                const destination = location.state?.from || '/account/dashboard';
                navigate(destination, { replace: true });
            }
        } catch (err) {
            setSubmitError(err.message || 'Unable to log in. Please check your details and try again.');
            toast.error(err.message || 'Login failed. Please check your details.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Log In | El-D7E7</title>
                <meta name="description" content="Log in to your El-D7E7 account to manage your orders, wishlist, addresses and account settings." />
                <meta name="robots" content="noindex, nofollow" />
                <meta name="referrer" content="strict-origin-when-cross-origin" />
            </Helmet>

            <AuthLayout>
                <div className="w-full">
                    <Link to="/" aria-label="Return to El-D7E7 home page" className="inline-flex items-center gap-1">
                        <img src={logoMascot} alt="" width="52" height="52" className="h-[52px] w-[52px] shrink-0 object-contain" />
                        <img src={logoWordmark} alt="El-D7E7" width="125" height="42" className="h-[40px] w-auto object-contain" />
                    </Link>

                    <p className="mb-0 text-[13px] font-semibold tracking-[0.4px] text-[#535353]/70">
                        {tr.welcomeBack}
                    </p>

                    <h1 className="mb-0 mt-1 text-[40px] font-semibold leading-none text-[#535353]">
                        {tr.signIn}
                    </h1>

                    <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-3.5">
                        <AuthInput
                            id="login-email"
                            label={tr.emailLabel}
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="test1@gmail.com"
                            autoComplete="email"
                            required
                            error={errors.email}
                        />

                        <AuthInput
                            id="login-password"
                            label={tr.passwordLabel}
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            autoComplete="current-password"
                            required
                            error={errors.password}
                        />

                        <div>
                            <Link to="/forgot-password" className="text-[12px] font-medium text-[#c53938] underline underline-offset-2 transition hover:text-[#ef5350]">
                                {tr.forgotPassword}
                            </Link>
                        </div>

                        {submitError && (
                            <p role="alert" className="rounded-xl bg-[#c53938]/10 px-4 py-3 text-xs text-[#c53938]">
                                {submitError}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="mt-2 flex h-[44px] w-full items-center justify-center rounded-[14px] bg-[#535353] px-6 text-sm font-semibold text-white transition hover:bg-[#3f3f3f] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSubmitting ? tr.loggingIn : tr.logIn}
                        </button>
                    </form>

                    <p className="mb-0 mt-5 text-[13px] text-[#535353]/70">
                        {tr.noAccount}{' '}
                        <Link to="/signup" className="font-medium !text-[#c53938]">
                            {tr.signUp}
                        </Link>
                    </p>

                    <div className="mt-6">
                        <SocialLogin />
                    </div>
                </div>
            </AuthLayout>
        </>
    );
}