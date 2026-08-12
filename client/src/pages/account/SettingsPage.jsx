import React, { useState } from 'react';
import { User, Lock, Sliders, Shield, Trash2 } from 'lucide-react';
import ProfileTab from '../../components/dashboard/settings/ProfileTab';
import PasswordTab from '../../components/dashboard/settings/PasswordTab';
import PreferencesTab from '../../components/dashboard/settings/PreferencesTab';
import SecurityTab from '../../components/dashboard/settings/SecurityTab';
import DeleteAccountTab from '../../components/dashboard/settings/DeleteAccountTab';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'password' | 'preferences' | 'security' | 'delete'

  const settingsTabs = [
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
    },
    {
      id: 'password',
      label: 'Password',
      icon: Lock,
    },
    {
      id: 'preferences',
      label: 'Preferences',
      icon: Sliders,
    },
    {
      id: 'security',
      label: 'Security',
      icon: Shield,
    },
    {
      id: 'delete',
      label: 'Delete Account',
      icon: Trash2,
      isDanger: true,
    },
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl">
      {/* Page Title & Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--primary-text)]">
          Settings
        </h1>
        <p className="text-sm text-[var(--muted-text)] mt-1">
          Manage your account credentials, security preferences, and localization settings.
        </p>
      </div>

      {/* Main Tabbed Layout Grid */}
      <div className="flex flex-col md:flex-row gap-6 lg:gap-8 items-start">
        {/* Internal Settings Sidebar Card */}
        <div className="bg-[var(--surface-card)] rounded-[24px] p-3 sm:p-4 border border-[var(--border-color)] shadow-xs w-full md:w-60 shrink-0 transition-colors duration-250">
          <nav className="flex flex-row md:flex-col gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none" aria-label="Settings categories">
            {settingsTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={[
                    'flex items-center gap-3.5 px-4 py-3 text-sm font-semibold rounded-[16px] transition-all duration-200 ease-in-out text-left whitespace-nowrap cursor-pointer select-none',
                    isActive
                      ? tab.isDanger
                        ? 'bg-red-500/15 text-[#c53938] font-bold'
                        : 'bg-[var(--brand-soft-bg)] text-[#c53938] font-bold'
                      : tab.isDanger
                      ? 'text-[#c53938]/80 hover:bg-red-500/10 hover:text-[#c53938]'
                      : 'text-[var(--secondary-text)] hover:bg-[var(--surface-soft)] hover:text-[var(--primary-text)]',
                  ].join(' ')}
                >
                  <Icon
                    className={[
                      'h-4 w-4 shrink-0 transition-transform duration-200',
                      isActive ? 'scale-110 text-[#c53938]' : '',
                    ].join(' ')}
                  />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content Container with 200ms Fade+Slide transition */}
        <div className="flex-1 w-full min-w-0">
          <div key={activeTab} className="transition-all duration-200 ease-in-out animate-in fade-in-50 slide-in-from-bottom-2">
            {activeTab === 'profile' && <ProfileTab />}
            {activeTab === 'password' && <PasswordTab />}
            {activeTab === 'preferences' && <PreferencesTab />}
            {activeTab === 'security' && <SecurityTab />}
            {activeTab === 'delete' && <DeleteAccountTab />}
          </div>
        </div>
      </div>
    </div>
  );
}
