import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

/**
 * PasswordSecurityCard
 * Card for updating account password with Current, New, and Confirm password fields.
 */
export const PasswordSecurityCard = () => {
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
    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    setMessage({ type: 'success', text: 'Password updated successfully!' });
    setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="rounded-[24px] border border-gray-200/80 bg-white p-6 sm:p-8 shadow-xs">
      <h3 className="text-lg font-bold text-[#535353] mb-5">
        Password &amp; Security
      </h3>

      {message && (
        <div
          className={`mb-5 rounded-[12px] p-3.5 text-xs sm:text-sm font-medium ${
            message.type === 'error'
              ? 'bg-red-50 text-red-700 border border-red-200'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-xl">
        {/* Current Password */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="currentPassword" className="text-xs sm:text-[13px] font-medium text-[#535353]">
            Current Password
          </label>
          <div className="relative">
            <input
              id="currentPassword"
              type={showPasswords.current ? 'text' : 'password'}
              value={passwords.currentPassword}
              onChange={handleChange('currentPassword')}
              className="h-11 w-full rounded-[12px] border border-gray-200/90 bg-white px-4 pr-11 text-sm text-[#535353] outline-none transition-all focus:border-[#c53938]/40 focus:ring-1 focus:ring-[#c53938]/20"
            />
            <button
              type="button"
              onClick={toggleShow('current')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Toggle password visibility"
            >
              {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="newPassword" className="text-xs sm:text-[13px] font-medium text-[#535353]">
            New Password
          </label>
          <div className="relative">
            <input
              id="newPassword"
              type={showPasswords.new ? 'text' : 'password'}
              value={passwords.newPassword}
              onChange={handleChange('newPassword')}
              className="h-11 w-full rounded-[12px] border border-gray-200/90 bg-white px-4 pr-11 text-sm text-[#535353] outline-none transition-all focus:border-[#c53938]/40 focus:ring-1 focus:ring-[#c53938]/20"
            />
            <button
              type="button"
              onClick={toggleShow('new')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Toggle password visibility"
            >
              {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Confirm New Password */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="confirmPassword" className="text-xs sm:text-[13px] font-medium text-[#535353]">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showPasswords.confirm ? 'text' : 'password'}
              value={passwords.confirmPassword}
              onChange={handleChange('confirmPassword')}
              className="h-11 w-full rounded-[12px] border border-gray-200/90 bg-white px-4 pr-11 text-sm text-[#535353] outline-none transition-all focus:border-[#c53938]/40 focus:ring-1 focus:ring-[#c53938]/20"
            />
            <button
              type="button"
              onClick={toggleShow('confirm')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Toggle password visibility"
            >
              {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-2">
          <button
            type="submit"
            className="rounded-full bg-[#535353] px-6 py-2.5 text-xs sm:text-sm font-semibold text-white transition-opacity hover:opacity-90 shadow-xs"
          >
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
};
