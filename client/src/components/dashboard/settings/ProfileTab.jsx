import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { User, ChevronDown, ChevronUp, Check, Search } from 'lucide-react';
import { ProfileHeader } from '../ProfileHeader';
import { LabeledInput } from '../LabeledInput';
import { GenderSelectDropdown } from '../GenderSelectDropdown';
import { LanguageSelectDropdown } from '../LanguageSelectDropdown';
import { EmailAddressRow } from '../EmailAddressRow';
import { userApi, authApi } from '../../../services/api';
import { getStoredUser, saveAuthSession, getAuthToken } from '../../../utils/auth';

/* ── Full Country List with Emoji Flags ── */
const COUNTRIES = [
  { value: 'egypt',        label: 'Egypt',               flag: '🇪🇬' },
  { value: 'saudi-arabia', label: 'Saudi Arabia',        flag: '🇸🇦' },
  { value: 'uae',          label: 'United Arab Emirates',flag: '🇦🇪' },
  { value: 'kuwait',       label: 'Kuwait',              flag: '🇰🇼' },
  { value: 'qatar',        label: 'Qatar',               flag: '🇶🇦' },
  { value: 'bahrain',      label: 'Bahrain',             flag: '🇧🇭' },
  { value: 'oman',         label: 'Oman',                flag: '🇴🇲' },
  { value: 'jordan',       label: 'Jordan',              flag: '🇯🇴' },
  { value: 'lebanon',      label: 'Lebanon',             flag: '🇱🇧' },
  { value: 'morocco',      label: 'Morocco',             flag: '🇲🇦' },
  { value: 'tunisia',      label: 'Tunisia',             flag: '🇹🇳' },
  { value: 'algeria',      label: 'Algeria',             flag: '🇩🇿' },
  { value: 'libya',        label: 'Libya',               flag: '🇱🇾' },
  { value: 'sudan',        label: 'Sudan',               flag: '🇸🇩' },
  { value: 'iraq',         label: 'Iraq',                flag: '🇮🇶' },
  { value: 'syria',        label: 'Syria',               flag: '🇸🇾' },
  { value: 'palestine',    label: 'Palestine',           flag: '🇵🇸' },
  { value: 'yemen',        label: 'Yemen',               flag: '🇾🇪' },
  { value: 'usa',          label: 'United States',       flag: '🇺🇸' },
  { value: 'uk',           label: 'United Kingdom',      flag: '🇬🇧' },
  { value: 'germany',      label: 'Germany',             flag: '🇩🇪' },
  { value: 'france',       label: 'France',              flag: '🇫🇷' },
  { value: 'italy',        label: 'Italy',               flag: '🇮🇹' },
  { value: 'spain',        label: 'Spain',               flag: '🇪🇸' },
  { value: 'canada',       label: 'Canada',              flag: '🇨🇦' },
  { value: 'australia',    label: 'Australia',           flag: '🇦🇺' },
  { value: 'turkey',       label: 'Turkey',              flag: '🇹🇷' },
  { value: 'india',        label: 'India',               flag: '🇮🇳' },
  { value: 'pakistan',     label: 'Pakistan',            flag: '🇵🇰' },
  { value: 'china',        label: 'China',               flag: '🇨🇳' },
  { value: 'japan',        label: 'Japan',               flag: '🇯🇵' },
  { value: 'south-korea',  label: 'South Korea',         flag: '🇰🇷' },
  { value: 'brazil',       label: 'Brazil',              flag: '🇧🇷' },
  { value: 'netherlands',  label: 'Netherlands',         flag: '🇳🇱' },
  { value: 'sweden',       label: 'Sweden',              flag: '🇸🇪' },
  { value: 'switzerland',  label: 'Switzerland',         flag: '🇨🇭' },
  { value: 'russia',       label: 'Russia',              flag: '🇷🇺' },
];

/* ── Country Dropdown Component ── */
function CountryDropdown({ value, onChange, disabled }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef(null);
  const searchRef = useRef(null);

  const selected = COUNTRIES.find((c) => c.value === value || c.label.toLowerCase() === value?.toLowerCase())
    || { flag: '🌍', label: value || 'Select a country' };

  const filtered = COUNTRIES.filter((c) =>
    c.label.toLowerCase().includes(search.toLowerCase())
  );

  /* Close on outside click */
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  /* Close on Escape */
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  /* Focus search when opening */
  useEffect(() => {
    if (open && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 50);
    } else {
      setSearch('');
    }
  }, [open]);

  const handleSelect = (country) => {
    onChange(country.label);
    setOpen(false);
  };

  if (disabled) {
    return (
      <div className="flex flex-col gap-2">
        <span className="text-xs sm:text-[13px] font-semibold text-[var(--label-text)]">Country</span>
        <div className="flex h-[52px] items-center gap-3 rounded-2xl border border-[var(--input-border)] bg-[var(--surface-input)] px-4 opacity-60 cursor-not-allowed">
          <span className="text-[22px] leading-none">{selected.flag}</span>
          <span className="text-[14px] font-semibold text-[var(--primary-text)]">{selected.label}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 relative" ref={containerRef}>
      <span className="text-xs sm:text-[13px] font-semibold text-[var(--label-text)]">Country</span>

      {/* Trigger */}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((p) => !p)}
        className={`
          flex items-center justify-between gap-3
          w-full h-[52px] px-4
          rounded-2xl border bg-[var(--surface-input)]
          text-sm font-semibold text-[var(--primary-text)]
          shadow-xs transition-all duration-200 cursor-pointer
          ${open
            ? 'border-[#c53938] ring-2 ring-[#c53938]/15'
            : 'border-[var(--input-border)] hover:border-[var(--muted-text)]'
          }
        `}
      >
        <span className="flex items-center gap-3">
          <span className="text-[22px] leading-none">{selected.flag}</span>
          <span className="text-[14px] font-semibold text-[var(--primary-text)]">{selected.label}</span>
        </span>
        {open
          ? <ChevronUp className="h-4 w-4 text-[#c53938] shrink-0" />
          : <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />
        }
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          role="listbox"
          className="
            absolute top-[calc(100%+6px)] left-0 right-0 z-50
            bg-[var(--surface-card)]
            rounded-2xl
            border border-[var(--border-color)]
            shadow-[0_8px_30px_rgba(0,0,0,0.18)]
            overflow-hidden
          "
        >
          {/* Search bar */}
          <div className="px-2.5 py-2 border-b border-[var(--border-color)]">
            <div className="flex items-center gap-1.5 rounded-lg border border-[var(--input-border)] bg-[var(--surface-input)] px-2.5 h-7">
              <Search className="h-3 w-3 shrink-0 text-[var(--muted-text)]" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search country..."
                className="flex-1 bg-transparent text-[11px] text-[var(--primary-text)] outline-none placeholder:text-[var(--muted-text)]"
              />
            </div>
          </div>

          {/* Scrollable list */}
          <div className="max-h-52 overflow-y-auto overscroll-contain">
            {filtered.length === 0 ? (
              <p className="px-4 py-4 text-center text-xs text-[var(--muted-text)]">No country found.</p>
            ) : (
              filtered.map((country) => {
                const isSelected = selected.label === country.label;
                return (
                  <button
                    key={country.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(country)}
                    className={`
                      flex items-center justify-between gap-3
                      w-full px-4 py-3
                      text-left cursor-pointer
                      transition-colors duration-150 text-sm
                      ${isSelected
                        ? 'bg-[var(--brand-soft-bg)] text-[#c53938] font-semibold'
                        : 'text-[var(--primary-text)] hover:bg-[var(--surface-soft)]'
                      }
                    `}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-[20px] leading-none">{country.flag}</span>
                      <span className="text-[13px]">{country.label}</span>
                    </span>
                    {isSelected && <Check className="h-3.5 w-3.5 text-[#c53938] shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProfileTab() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    gender: 'male',
    country: 'Egypt',
    language: 'english',
  });

  useEffect(() => {
    authApi.me()
      .then((data) => {
        if (data.user) {
          setFormData((prev) => ({
            ...prev,
            firstName: data.user.firstName || '',
            lastName: data.user.lastName || '',
            email: data.user.email || '',
            gender: data.user.gender || 'male',
            country: data.user.country || 'Egypt',
            language: data.user.language || 'english',
          }));
        }
      })
      .catch(() => {
        const local = getStoredUser();
        if (local) {
          setFormData((prev) => ({
            ...prev,
            firstName: local.firstName || local.name?.split(' ')[0] || '',
            lastName: local.lastName || local.name?.split(' ')[1] || '',
            email: local.email || '',
            gender: local.gender || 'male',
            country: local.country || 'Egypt',
            language: local.language || 'english',
          }));
        }
      });
  }, []);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleCountryChange = (countryLabel) => {
    setFormData((prev) => ({ ...prev, country: countryLabel }));
  };

  const handleSave = async () => {
    setIsSubmitting(true);

    try {
      const response = await userApi.updateProfile({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        gender: formData.gender,
        country: formData.country,
        language: formData.language,
      });

      if (response.user) {
        const token = getAuthToken();
        saveAuthSession({ user: response.user, token });
      }

      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      toast.error(err.message || 'Failed to update profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      handleSave();
    } else {
      setIsEditing(true);
    }
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

      <ProfileHeader isEditing={isEditing} onEditToggle={handleEditToggle} isSubmitting={isSubmitting} />

      <form
        onSubmit={(e) => e.preventDefault()}
        className="grid grid-cols-1 md:grid-cols-2 gap-x-10 sm:gap-x-12 gap-y-6 items-start"
      >
        <LabeledInput
          id="firstName"
          label="First Name"
          value={formData.firstName}
          onChange={handleChange('firstName')}
          placeholder="First Name"
          disabled={!isEditing}
        />
        <LabeledInput
          id="lastName"
          label="Last Name"
          value={formData.lastName}
          onChange={handleChange('lastName')}
          placeholder="Last Name"
          disabled={!isEditing}
        />
        <LabeledInput
          id="email"
          label="Email Address"
          value={formData.email}
          onChange={handleChange('email')}
          placeholder="Email Address"
          disabled={!isEditing}
        />

        <GenderSelectDropdown
          id="gender"
          label="Gender"
          value={formData.gender}
          onChange={handleChange('gender')}
          disabled={!isEditing}
        />

        {/* Country Dropdown with emoji flags */}
        <CountryDropdown
          value={formData.country}
          onChange={handleCountryChange}
          disabled={!isEditing}
        />

        <LanguageSelectDropdown
          id="language"
          label="Language"
          value={formData.language}
          onChange={handleChange('language')}
          disabled={!isEditing}
        />
      </form>

      <EmailAddressRow
        email={formData.email || 'user@eld7e7.com'}
        timeAgo="Verified"
        onAddEmail={() => {}}
      />
    </div>
  );
}
