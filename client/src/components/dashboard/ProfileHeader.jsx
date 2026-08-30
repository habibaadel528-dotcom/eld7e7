import React from 'react';
import { getStoredUser } from '../../utils/auth';
import { useLanguage } from '../../context/LanguageContext';
import { formatUserName } from '../../utils/arabicNames';

export const ProfileHeader = ({ isEditing, onEditToggle }) => {
  const user = getStoredUser();
  const { lang } = useLanguage();
  const formatted = formatUserName(user, lang);
  const displayName = formatted.fullName;
  const displayEmail = user?.email || 'user@eld7e7.com';

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-4 pb-6">
        {/* Profile Info */}
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#c53938]/10 text-2xl font-bold text-[#c53938] uppercase ring-2 ring-[#c53938]/20">
            {formatted.initial}
          </div>
          <div className="flex flex-col text-start">
            <h2 className="text-lg sm:text-xl font-bold text-[var(--primary-text)]">
              {displayName}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--muted-text)]">
              {displayEmail}
            </p>
          </div>
        </div>

        {/* Edit Button */}
        <button
          type="button"
          onClick={onEditToggle}
          className="rounded-full bg-[#c53938] px-6 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 shadow-xs cursor-pointer"
        >
          {isEditing ? (lang === 'ar' ? 'حفظ' : 'Save') : (lang === 'ar' ? 'تعديل' : 'Edit')}
        </button>
      </div>

      {/* Horizontal Divider */}
      <div className="h-px w-full bg-[var(--border-color)] mb-8" />
    </div>
  );
};
