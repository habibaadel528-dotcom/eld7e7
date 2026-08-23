import { useEffect } from 'react';

export default function LogoutModal({ onConfirm, onCancel, subtitle }) {
  // Close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Card */}
      <div className="relative w-full max-w-sm rounded-2xl border border-[var(--border-color)] bg-[var(--page-bg)] p-6 shadow-2xl animate-[fadeSlideUp_0.2s_ease_both]">
        {/* Icon */}
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#c53938]/10">
          <svg
            className="h-7 w-7 text-[#c53938]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </div>

        <h2
          id="logout-modal-title"
          className="mb-1 text-center text-lg font-bold text-[var(--primary-text)]"
        >
          Sign Out?
        </h2>
        <p className="mb-6 text-center text-sm text-[var(--secondary-text)]">
          {subtitle || "Are you sure you want to log out of your account?"}
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-full border border-[var(--border-color)] bg-[var(--surface-soft)] py-2.5 text-sm font-semibold text-[var(--secondary-text)] transition hover:border-[var(--primary-text)] hover:text-[var(--primary-text)] active:scale-[0.98] cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-full bg-[#c53938] py-2.5 text-sm font-semibold text-white transition hover:bg-[#a83130] active:scale-[0.98] shadow-sm shadow-[#c53938]/30 cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
      `}</style>
    </div>
  );
}
