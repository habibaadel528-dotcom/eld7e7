import React from 'react';
import { getStoredUser } from '../../utils/auth';

export const ProfileHeader = ({ isEditing, onEditToggle }) => {
  const currentUser = getStoredUser();
  const displayName = currentUser?.name || 'مستخدم';
  const displayEmail = currentUser?.email || '';
  const initialLetter = displayName.trim().charAt(0).toUpperCase() || '?';

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-4 pb-6">
        {/* Profile Info */}
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-[#ffb31f] flex items-center justify-center text-2xl font-semibold text-white">
            {initialLetter}
          </div>
          <div className="flex flex-col">
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
          {isEditing ? 'Save' : 'Edit'}
        </button>
      </div>

      {/* Horizontal Divider */}
      <div className="h-px w-full bg-[var(--border-color)] mb-8" />
    </div>
  );
};
