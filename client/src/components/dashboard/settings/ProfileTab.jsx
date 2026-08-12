import React, { useState } from 'react';
import { User } from 'lucide-react';
import { ProfileHeader } from '../ProfileHeader';
import { LabeledInput } from '../LabeledInput';
import { GenderSelectDropdown } from '../GenderSelectDropdown';
import { LanguageSelectDropdown } from '../LanguageSelectDropdown';
import { EmailAddressRow } from '../EmailAddressRow';

export default function ProfileTab() {
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    nickName: '',
    gender: 'male',
    country: '',
    language: 'english',
    timeZone: '',
  });

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setIsEditing((prev) => !prev);
  };

  const handleAddEmail = () => {
    alert('Add Email Address modal/flow triggered!');
  };

  return (
    <div className="rounded-[24px] border border-[var(--border-color)] bg-[var(--surface-card)] p-6 sm:p-10 shadow-xs transition-colors duration-250">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-5 border-b border-[var(--border-color)]">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--brand-soft-bg)] text-[#c53938]">
          <User className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[var(--primary-text)]">Profile</h2>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] mt-0.5">
            Manage your personal information and contact details.
          </p>
        </div>
      </div>

      {saved && (
        <div className="mb-6 rounded-[14px] bg-emerald-500/10 p-4 text-xs sm:text-sm font-medium text-emerald-400 border border-emerald-500/20">
          Profile updated successfully!
        </div>
      )}

      <ProfileHeader isEditing={isEditing} onEditToggle={handleEditToggle} />

      <form
        onSubmit={(e) => e.preventDefault()}
        className="grid grid-cols-1 md:grid-cols-2 gap-x-10 sm:gap-x-12 gap-y-6 items-start"
      >
        <LabeledInput
          id="fullName"
          label="Full Name"
          value={formData.fullName}
          onChange={handleChange('fullName')}
          placeholder="Your First Name"
          disabled={!isEditing}
        />
        <LabeledInput
          id="nickName"
          label="Nick Name"
          value={formData.nickName}
          onChange={handleChange('nickName')}
          placeholder="Your Nick Name"
          disabled={!isEditing}
        />

        <GenderSelectDropdown
          id="gender"
          label="Gender"
          value={formData.gender}
          onChange={handleChange('gender')}
          disabled={!isEditing}
        />
        <LabeledInput
          id="country"
          label="Country"
          value={formData.country}
          onChange={handleChange('country')}
          placeholder="e.g., Egypt, United States, United Kingdom"
          disabled={!isEditing}
        />

        <LanguageSelectDropdown
          id="language"
          label="Language"
          value={formData.language}
          onChange={handleChange('language')}
          disabled={!isEditing}
        />
        <LabeledInput
          id="timeZone"
          label="Time Zone"
          value={formData.timeZone}
          onChange={handleChange('timeZone')}
          placeholder="e.g., UTC, GMT+2 (Cairo), GMT-5 (New York)"
          disabled={!isEditing}
        />
      </form>

      <EmailAddressRow
        email="alexarawles@gmail.com"
        timeAgo="1 month ago"
        onAddEmail={handleAddEmail}
      />
    </div>
  );
}
