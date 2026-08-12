import { useState } from 'react';
import {
    Link,
    Navigate,
    useLocation,
    useNavigate,
} from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import AuthLayout from '../../layouts/AuthLayout';
import AuthInput from '../../components/auth/AuthInput';
import SocialLogin from '../../components/auth/SocialLogin';
import logoWordmark from '../../assets/icons/logo-wordmark.png';

import logoEllipse from '../../assets/icons/logo-ellipse.svg';
import logoMascot from '../../assets/icons/logo-mascot.jpg';
const ADMIN_EMAIL = 'admin123@gmail.com';
const ADMIN_PASSWORD = '123admain';
import {
    isAuthenticated,
    saveAuthSession,
} from '../../utils/auth';
import { loginRequest } from '../../services/api';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (isAuthenticated()) {
        return (
            <Navigate
                to="/account/dashboard"
                replace
            />
        );
    }

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((currentData) => ({
            ...currentData,
            [name]: value,
        }));

        setErrors((currentErrors) => ({
            ...currentErrors,
            [name]: '',
        }));

        setSubmitError('');
    };

    const validateForm = () => {
        const newErrors = {};
        const email = formData.email.trim();
        const password = formData.password;

        if (!email) {
            newErrors.email = 'Email is required.';
        } else if (!EMAIL_PATTERN.test(email)) {
            newErrors.email = 'Enter a valid email address.';
        }

        if (!password) {
            newErrors.password = 'Password is required.';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters.';
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setSubmitError('');

        const email = formData.email.trim();
        if (email === ADMIN_EMAIL && formData.password === ADMIN_PASSWORD) {
            localStorage.setItem('isAdminAuthenticated', 'true');
            setIsSubmitting(false);
            navigate('/admin/customers', { replace: true });
            return;
        }

        try {
            const { data, token } = await loginRequest({
                email,
                password: formData.password,
            });

            saveAuthSession({
                user: data,
                token,
            });

            const destination =
                location.state?.from || '/account/dashboard';

            navigate(destination, {
                replace: true,
            });
        } catch (error) {
            setSubmitError(
                error.message ||
                    'Unable to log in. Please check your details and try again.',
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Log In | El-D7E7</title>

                <meta
                    name="description"
                    content="Log in to your El-D7E7 account to manage your orders, wishlist, addresses and account settings."
                />

                <meta
                    name="robots"
                    content="noindex, nofollow"
                />

                <meta
                    name="referrer"
                    content="strict-origin-when-cross-origin"
                />
            </Helmet>

            <AuthLayout>
                <div className="w-full">
                    <Link
                        to="/"
                        aria-label="Return to El-D7E7 home page"
                        className="inline-flex items-center rounded-xl ml-[-12px] "
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

                    <p className="mb-0  text-[13px] font-semibold tracking-[0.4px] text-[#535353]/70">
                        Welcome back
                    </p>

                    <h1 className="mb-0 mt-1 text-[40px] font-semibold leading-none text-[#535353]">
                        Sign in
                    </h1>

                    <form
                        onSubmit={handleSubmit}
                        noValidate
                        className="mt-8 space-y-3.5"
                    >
                        <AuthInput
                            id="login-email"
                            label="Email"
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
                            label="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            required
                            error={errors.password}
                        />

                        <div>
                            <Link
                                to="/forgot-password"
                                className="text-[12px] font-medium text-[#c53938] underline underline-offset-2 transition hover:text-[#ef5350]"
                            >
                                Forgot Password?
                            </Link>
                        </div>

                        {submitError && (
                            <p
                                role="alert"
                                className="rounded-xl bg-[#c53938]/10 px-4 py-3 text-xs text-[#c53938]"
                            >
                                {submitError}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="mt-2 flex h-[44px] w-full items-center justify-center rounded-[14px] bg-[#535353] px-6 text-sm font-semibold text-white transition hover:bg-[#3f3f3f] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSubmitting ? 'Logging in...' : 'Log in'}
                        </button>
                    </form>

                    <p className="mb-0 mt-5 text-[13px] text-[#535353]/70">
                        Don&apos;t have an account?{' '}

                        <Link
                            to="/signup"
                            className="font-medium !text-[#c53938]"
                        >
                            Sign up
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