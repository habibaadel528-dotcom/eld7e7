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
      <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 pb-6">
        {/* Profile Info */}
        <div className="flex items-center gap-3.5 min-w-0 flex-1">
          <div className="flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-full bg-[#c53938] text-white text-xl sm:text-2xl font-bold uppercase shadow-sm">
            {formatted.initial || '👤'}
          </div>
          <div className="flex flex-col text-start min-w-0 flex-1">
            <h2 className="text-base sm:text-xl font-bold text-[var(--primary-text)] truncate">
              {displayName}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--muted-text)] truncate">
              {displayEmail}
            </p>
          </div>
        </div>

        {/* Edit Button */}
        <button
          type="button"
          onClick={onEditToggle}
          className="shrink-0 rounded-full bg-[#c53938] px-5 py-2 text-xs sm:text-sm font-semibold text-white transition-opacity hover:opacity-90 shadow-xs cursor-pointer active:scale-95"
        >
          {isEditing ? (lang === 'ar' ? 'حفظ' : 'Save') : (lang === 'ar' ? 'تعديل' : 'Edit')}
        </button>
      </div>

      {/* Horizontal Divider */}
      <div className="h-px w-full bg-[var(--border-color)] mb-6 sm:mb-8" />
    </div>
  );
};
