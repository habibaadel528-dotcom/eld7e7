import React, { useState } from 'react';
import { toast } from 'sonner';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { userApi } from '../../../services/api';
import { useLanguage } from '../../../context/LanguageContext';

export default function PasswordTab() {
  const { lang, t } = useLanguage();
  const tr = t('settings').passwordTab;

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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field) => (e) => {
    setPasswords((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const toggleShow = (field) => () => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
      toast.error(lang === 'ar' ? 'يرجى ملء جميع حقول كلمة المرور.' : 'Please fill in all password fields.');
      return;
    }
    if (passwords.newPassword.length < 8) {
      toast.error(lang === 'ar' ? 'يجب أن تتكون كلمة المرور الجديدة من 8 أحرف على الأقل.' : 'New password must be at least 8 characters long.');
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error(lang === 'ar' ? 'كلمات المرور الجديدة غير متطابقة.' : 'New passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      await userApi.updatePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });

      toast.success(lang === 'ar' ? 'تم تحديث كلمة المرور بنجاح!' : 'Password updated successfully!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.message || (lang === 'ar' ? 'فشل تحديث كلمة المرور.' : 'Failed to update password.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = `
    h-12 w-full rounded-[14px]
    border border-[var(--input-border)]
    bg-[var(--surface-input)]
    px-4 ltr:pr-12 rtl:pl-12
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
        <div className="text-start">
          <h2 className="text-xl font-bold text-[var(--primary-text)]">{tr.title}</h2>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] mt-0.5">
            {tr.subtitle}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-xl">
        {[
          { id: 'currentPassword', label: tr.currentPassword, field: 'current' },
          { id: 'newPassword',     label: tr.newPassword,     field: 'new', hint: lang === 'ar' ? 'يجب أن لا تقل عن 8 أحرف وتحتوي على أرقام ورموز.' : 'Must be at least 8 characters with numbers & symbols.' },
          { id: 'confirmPassword', label: tr.confirmPassword, field: 'confirm' },
        ].map(({ id, label, field, hint }) => (
          <div key={id} className="flex flex-col gap-2 text-start">
            <label htmlFor={id} className="text-xs sm:text-[13px] font-semibold text-[var(--label-text)]">
              {label}
            </label>
            <div className="relative">
              <input
                id={id}
                type={showPasswords[field] ? 'text' : 'password'}
                value={passwords[`${field}Password`]}
                onChange={handleChange(`${field}Password`)}
                placeholder={label}
                className={inputClass}
              />
              <button
                type="button"
                onClick={toggleShow(field)}
                className="absolute ltr:right-3.5 rtl:left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted-text)] hover:text-[var(--primary-text)] transition-colors p-1 cursor-pointer"
                aria-label="Toggle password visibility"
              >
                {showPasswords[field] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {hint && (
              <p className="text-[11px] text-[var(--muted-text)] leading-tight">{hint}</p>
            )}
          </div>
        ))}

        <div className="pt-2 text-start">
          <button
            type="submit"
            disabled={isSubmitting}
            className="
              inline-flex items-center justify-center
              h-11 px-8 rounded-full
              bg-[#c53938] text-white text-xs sm:text-sm font-semibold
              transition-all duration-200 hover:opacity-90 active:scale-[0.98]
              shadow-xs disabled:opacity-50 disabled:cursor-not-allowed
              cursor-pointer
            "
          >
            {isSubmitting ? tr.updating : tr.updatePassword}
          </button>
        </div>
      </form>
    </div>
  );
}
