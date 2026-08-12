import React, { useState } from 'react';

/**
 * PrivacyCard
 * Card for managing email and push notification privacy preferences.
 */
export const PrivacyCard = () => {
  const [preferences, setPreferences] = useState({
    marketingEmails: false,
    pushNotifications: true,
  });

  const [saved, setSaved] = useState(false);

  const togglePreference = (key) => () => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="rounded-[24px] border border-gray-200/80 bg-white p-6 sm:p-8 shadow-xs">
      <h3 className="text-lg font-bold text-[#535353] mb-5">
        Privacy
      </h3>

      {saved && (
        <div className="mb-5 rounded-[12px] bg-emerald-50 p-3.5 text-xs sm:text-sm font-medium text-emerald-700 border border-emerald-200">
          Preferences saved successfully!
        </div>
      )}

      <div className="flex flex-col gap-6 max-w-xl">
        {/* Item 1: Marketing Emails */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-[#535353]">
              Marketing Emails
            </span>
            <span className="text-xs text-[#8a8a8a]">
              Receive offers and updates from our team.
            </span>
          </div>

          {/* Toggle switch */}
          <button
            type="button"
            role="switch"
            aria-checked={preferences.marketingEmails}
            onClick={togglePreference('marketingEmails')}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              preferences.marketingEmails ? 'bg-[#c53938]' : 'bg-gray-200'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                preferences.marketingEmails ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Item 2: Push Notifications */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-[#535353]">
              Push Notifications
            </span>
            <span className="text-xs text-[#8a8a8a]">
              Get real-time updates about your orders.
            </span>
          </div>

          {/* Toggle switch */}
          <button
            type="button"
            role="switch"
            aria-checked={preferences.pushNotifications}
            onClick={togglePreference('pushNotifications')}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              preferences.pushNotifications ? 'bg-[#c53938]' : 'bg-gray-200'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                preferences.pushNotifications ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Save Preferences Button */}
        <div className="mt-2 flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            className="rounded-full bg-[#535353] px-6 py-2.5 text-xs sm:text-sm font-semibold text-white transition-opacity hover:opacity-90 shadow-xs"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
