import React from 'react';
import { RotateCw, Home } from 'lucide-react';
import { Error404Graphic } from '../Error404Graphic';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const isArabic = typeof document !== 'undefined' && document.documentElement.lang === 'ar';

      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--page-bg)] px-4 py-16 text-center text-[var(--primary-text)] transition-colors duration-200">
          <div className="mb-6 max-w-[320px] sm:max-w-[420px]">
            <Error404Graphic />
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl font-black uppercase tracking-wider text-[#c53938] sm:text-3xl">
              {isArabic ? 'حدث خطأ غير متوقع' : 'Something Went Wrong'}
            </h1>
            <p className="max-w-md text-sm text-[var(--secondary-text)] sm:text-base">
              {isArabic
                ? 'نعتذر، حدث خطأ غير متوقع أثناء تشغيل الصفحة. يرجى المحاولة مرة أخرى أو العودة للرئيسية.'
                : 'An unexpected error occurred. Please try reloading the page or return to the home page.'}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 rounded-full bg-[#c53938] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#c53938]/20 transition hover:bg-[#ef5350] cursor-pointer"
            >
              <RotateCw className="h-4 w-4" />
              <span>{isArabic ? 'إعادة المحاولة' : 'Reload Page'}</span>
            </button>

            <a
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--surface-soft)] px-6 py-3 text-sm font-bold text-[var(--primary-text)] transition hover:border-[#c53938] hover:text-[#c53938] cursor-pointer"
            >
              <Home className="h-4 w-4" />
              <span>{isArabic ? 'العودة للرئيسية' : 'Go Home'}</span>
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
