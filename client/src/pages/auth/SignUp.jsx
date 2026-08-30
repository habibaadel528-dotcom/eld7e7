import { useState } from 'react';
import { toast } from 'sonner';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import AuthLayout from '../../layouts/AuthLayout';
import AuthInput from '../../components/auth/AuthInput';
import SocialLogin from '../../components/auth/SocialLogin';
import logoMascot from '../../assets/icons/logo-mascot-transparent.png';
import logoWordmark from '../../assets/icons/logo-wordmark.png';
import { isAuthenticated, saveAuthSession } from '../../utils/auth';
import { authApi } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignUp() {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const tr = t('auth').signup;

    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (isAuthenticated()) {
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
        const { errors: e } = tr;
        const firstName = formData.firstName.trim();
        const lastName = formData.lastName.trim();
        const email = formData.email.trim();
        const password = formData.password;

        if (!firstName) newErrors.firstName = e.firstNameRequired;
        else if (firstName.length < 2) newErrors.firstName = e.firstNameShort;
        if (!lastName) newErrors.lastName = e.lastNameRequired;
        else if (lastName.length < 2) newErrors.lastName = e.lastNameShort;
        if (!email) newErrors.email = e.emailRequired;
        else if (!EMAIL_PATTERN.test(email)) newErrors.email = e.emailInvalid;
        if (!password) newErrors.password = e.passwordRequired;
        else if (password.length < 8) newErrors.password = e.passwordShort;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        setSubmitError('');

        try {
            const data = await authApi.register({
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                email: formData.email.trim(),
                password: formData.password,
            });
            saveAuthSession({ user: data.user, token: data.token });
            toast.success(`Welcome to El-D7E7, ${data.user.firstName}! 🎉`);
            navigate('/account/dashboard', { replace: true });
        } catch (err) {
            setSubmitError(err.message || tr.errors.createFailed);
            toast.error(err.message || tr.errors.createFailed);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Create Account | El-D7E7</title>
                <meta name="description" content="Create your El-D7E7 account to manage orders, wishlist, addresses and account settings." />
                <meta name="robots" content="noindex, nofollow" />
                <meta name="referrer" content="strict-origin-when-cross-origin" />
            </Helmet>

            <AuthLayout>
                <div className="w-full">
                    <Link to="/" aria-label="Return to El-D7E7 home page" className="inline-flex items-center gap-1">
                        <img src={logoMascot} alt="" width="52" height="52" className="h-[52px] w-[52px] shrink-0 object-contain" />
                        <img src={logoWordmark} alt="El-D7E7" width="125" height="42" className="h-[40px] w-auto object-contain" />
                    </Link>

                    <p className="mb-0 mt-3 text-[11px] font-semibold uppercase tracking-[0.7px] text-[#535353]/70">
                        {tr.startFree}
                    </p>

                    <h1 className="mb-0 mt-1 whitespace-nowrap text-[30px] font-semibold leading-tight text-[#535353] sm:text-[34px]">
                        {tr.createAccount}
                    </h1>

                    <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-2.5">
                        <div className="grid grid-cols-2 gap-3">
                            <AuthInput
                                id="signup-first-name"
                                label={tr.firstNameLabel}
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="Prabhatsinh"
                                autoComplete="given-name"
                                required
                                error={errors.firstName}
                            />
                            <AuthInput
                                id="signup-last-name"
                                label={tr.lastNameLabel}
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Rathod"
                                autoComplete="family-name"
                                required
                                error={errors.lastName}
                            />
                        </div>

                        <AuthInput
                            id="signup-email"
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
                            id="signup-password"
                            label={tr.passwordLabel}
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder={tr.passwordPlaceholder}
                            autoComplete="new-password"
                            required
                            error={errors.password}
                        />

                        {submitError && (
                            <p role="alert" className="rounded-xl bg-[#c53938]/10 px-4 py-2 text-xs text-[#c53938]">
                                {submitError}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="mt-1 flex h-[42px] w-full items-center justify-center rounded-[14px] bg-[#535353] px-6 text-sm font-semibold text-white transition hover:bg-[#3f3f3f] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSubmitting ? tr.creatingAccount : tr.createBtn}
                        </button>
                    </form>

                    <p className="mb-0 mt-3 text-[12px] text-[#535353]/70">
                        {tr.alreadyMember}{' '}
                        <Link to="/login" className="font-medium !text-[#c53938]">
                            {tr.logIn}
                        </Link>
                    </p>

                    <div className="mt-3">
                        <SocialLogin />
                    </div>
                </div>
            </AuthLayout>
        </>
    );
}