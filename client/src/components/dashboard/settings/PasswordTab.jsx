import React, { useState } from 'react';
import { Eye, EyeOff, Lock, CheckCircle2 } from 'lucide-react';

export default function PasswordTab() {
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field) => (e) => {
    setPasswords((prev) => ({ ...prev, [field]: e.target.value }));
    if (message) setMessage(null);
  };

  const toggleShow = (field) => () => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
      setMessage({ type: 'error', text: 'Please fill in all password fields.' });
      return;
    }
    if (passwords.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'New password must be at least 8 characters long.' });
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setMessage({ type: 'success', text: 'Your password has been updated successfully!' });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }, 600);
  };

  const inputClass = `
    h-12 w-full rounded-[14px]
    border border-[var(--input-border)]
    bg-[var(--surface-input)]
    px-4 pr-12
    text-sm text-[var(--primary-text)]
    outline-none transition-all
    focus:border-[#c53938] focus:ring-2 focus:ring-[#c53938]/10
    placeholder:text-[var(--muted-text)]
  `;

  return (
    <div className="rounded-[24px] border border-[var(--border-color)] bg-[var(--surface-card)] p-6 sm:p-10 shadow-xs transition-colors duration-250">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-5 border-b border-[var(--border-color)]">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--brand-soft-bg)] text-[#c53938]">
          <Lock className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[var(--primary-text)]">Password</h2>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] mt-0.5">
            Update your password to keep your account secure.
          </p>
        </div>
      </div>

      {/* Alert */}
      {message && (
        <div className={`mb-6 flex items-center gap-3 rounded-[14px] p-4 text-xs sm:text-sm font-medium ${
          message.type === 'error'
            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
        }`}>
          {message.type === 'success' && <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-xl">
        {[
          { id: 'currentPassword', label: 'Current Password', field: 'current' },
          { id: 'newPassword',     label: 'New Password',     field: 'new',     hint: 'Must be at least 8 characters with numbers & symbols.' },
          { id: 'confirmPassword', label: 'Confirm New Password', field: 'confirm' },
        ].map(({ id, label, field, hint }) => (
          <div key={id} className="flex flex-col gap-2">
            <label htmlFor={id} className="text-xs sm:text-[13px] font-semibold text-[var(--label-text)]">
              {label}
            </label>
            <div className="relative">
              <input
                id={id}
                type={showPasswords[field] ? 'text' : 'password'}
                value={passwords[id]}
                onChange={handleChange(id)}
                placeholder="••••••••••••"
                className={inputClass}
              />
              <button
                type="button"
                onClick={toggleShow(field)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--muted-text)] hover:text-[var(--primary-text)] transition-colors p-1 cursor-pointer"
                aria-label="Toggle password visibility"
              >
                {showPasswords[field] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {hint && <p className="text-[11px] text-[var(--muted-text)]">{hint}</p>}
          </div>
        ))}

        <div className="mt-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-[#c53938] px-7 py-3 text-xs sm:text-sm font-bold text-white transition-all hover:bg-[#a83130] active:scale-[0.98] shadow-xs disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </form>
    </div>
  );
}
