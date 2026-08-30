import React from 'react';
import { Mail, Plus } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const EmailAddressRow = ({ email, timeAgo, onAddEmail }) => {
  const { lang } = useLanguage();

  return (
    <div className="w-full mt-8 sm:mt-10 text-start">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <h3 className="text-base font-bold text-[var(--primary-text)]">
          {lang === 'ar' ? 'عنوان البريد الإلكتروني' : 'My email Address'}
        </h3>
        <button
          type="button"
          onClick={onAddEmail}
          className="inline-flex items-center gap-1.5 rounded-full bg-[var(--brand-soft-bg)] px-4 py-1.5 text-xs sm:text-sm font-semibold text-[#c53938] hover:opacity-85 transition-opacity cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5 stroke-[3]" />
          <span>{lang === 'ar' ? 'إضافة بريد إلكتروني' : 'Add Email Address'}</span>
        </button>
      </div>

      {/* Email Row Item */}
      <div className="flex items-center gap-3.5">
        {/* Soft Icon Badge */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--brand-soft-bg)]">
          <Mail className="h-4 w-4 text-[#c53938]" />
        </div>

        {/* Info Text */}
        <div className="flex flex-col text-start">
          <span className="text-sm font-bold text-[var(--primary-text)]">
            {email}
          </span>
          <span className="text-xs text-[var(--muted-text)]">
            {timeAgo}
          </span>
        </div>
      </div>
    </div>
  );
};
