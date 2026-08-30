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
import { useLanguage } from '../../../context/LanguageContext';

/* ── Full Country List with Emoji Flags ── */
const COUNTRIES = [
  { value: 'egypt',        label: 'Egypt',               labelAr: 'مصر',                 flag: '🇪🇬' },
  { value: 'saudi-arabia', label: 'Saudi Arabia',        labelAr: 'المملكة العربية السعودية', flag: '🇸🇦' },
  { value: 'uae',          label: 'United Arab Emirates',labelAr: 'الإمارات العربية المتحدة',flag: '🇦🇪' },
  { value: 'kuwait',       label: 'Kuwait',              labelAr: 'الكويت',              flag: '🇰🇼' },
  { value: 'qatar',        label: 'Qatar',               labelAr: 'قطر',                flag: '🇶🇦' },
  { value: 'bahrain',      label: 'Bahrain',             labelAr: 'البحرين',             flag: '🇧🇭' },
  { value: 'oman',         label: 'Oman',                labelAr: 'عمان',               flag: '🇴🇲' },
  { value: 'jordan',       label: 'Jordan',              labelAr: 'الأردن',              flag: '🇯🇴' },
  { value: 'lebanon',      label: 'Lebanon',             labelAr: 'لبنان',              flag: '🇱🇧' },
  { value: 'morocco',      label: 'Morocco',             labelAr: 'المغرب',              flag: '🇲🇦' },
  { value: 'tunisia',      label: 'Tunisia',             labelAr: 'تونس',               flag: '🇹🇳' },
  { value: 'algeria',      label: 'Algeria',             labelAr: 'الجزائر',             flag: '🇩🇿' },
  { value: 'libya',        label: 'Libya',               labelAr: 'ليبيا',               flag: '🇱🇾' },
  { value: 'sudan',        label: 'Sudan',               labelAr: 'السودان',             flag: '🇸🇩' },
  { value: 'iraq',         label: 'Iraq',                labelAr: 'العراق',              flag: '🇮🇶' },
  { value: 'syria',        label: 'Syria',               labelAr: 'سوريا',              flag: '🇸🇾' },
  { value: 'palestine',    label: 'Palestine',           labelAr: 'فلسطين',             flag: '🇵🇸' },
  { value: 'yemen',        label: 'Yemen',               labelAr: 'اليمن',              flag: '🇾🇪' },
  { value: 'usa',          label: 'United States',       labelAr: 'الولايات المتحدة',     flag: '🇺🇸' },
  { value: 'uk',           label: 'United Kingdom',      labelAr: 'المملكة المتحدة',     flag: '🇬🇧' },
  { value: 'germany',      label: 'Germany',             labelAr: 'ألمانيا',             flag: '🇩🇪' },
  { value: 'france',       label: 'France',              labelAr: 'فرنسا',              flag: '🇫🇷' },
  { value: 'italy',        label: 'Italy',               labelAr: 'إيطاليا',             flag: '🇮🇹' },
  { value: 'spain',        label: 'Spain',               labelAr: 'إسبانيا',            flag: '🇪🇸' },
  { value: 'canada',       label: 'Canada',              labelAr: 'كندا',               flag: '🇨🇦' },
  { value: 'australia',    label: 'Australia',           labelAr: 'أستراليا',            flag: '🇦🇺' },
  { value: 'turkey',       label: 'Turkey',              labelAr: 'تركيا',              flag: '🇹🇷' },
];

/* ── Country Dropdown Component ── */
function CountryDropdown({ value, onChange, disabled, lang }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef(null);
  const searchRef = useRef(null);

  const selected = COUNTRIES.find((c) => c.value === value || c.label.toLowerCase() === value?.toLowerCase() || c.labelAr === value)
    || { flag: '🌍', label: value || (lang === 'ar' ? 'اختر الدولة' : 'Select a country'), labelAr: value || 'اختر الدولة' };

  const filtered = COUNTRIES.filter((c) =>
    c.label.toLowerCase().includes(search.toLowerCase()) ||
    (c.labelAr && c.labelAr.includes(search))
  );

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  useEffect(() => {
    if (open && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 50);
    } else {
      setSearch('');
    }
  }, [open]);

  const handleSelect = (country) => {
    onChange(lang === 'ar' ? country.labelAr : country.label);
    setOpen(false);
  };

  const displayLabel = lang === 'ar' ? (selected.labelAr || selected.label) : selected.label;

  return (
    <div className="flex flex-col gap-2 relative" ref={containerRef}>
      <label className="text-xs sm:text-[13px] font-semibold text-[var(--label-text)]">
        {lang === 'ar' ? 'الدولة' : 'Country'}
      </label>

      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className={`
          flex items-center justify-between gap-3
          w-full h-12 px-4
          rounded-[14px] border
          text-sm font-semibold
          transition-all duration-200
          ${disabled
            ? 'border-[var(--input-border)] bg-[var(--surface-input)] opacity-60 cursor-not-allowed text-[var(--primary-text)]'
            : open
            ? 'border-[#c53938] bg-[var(--surface-input)] ring-2 ring-[#c53938]/15 cursor-pointer text-[var(--primary-text)]'
            : 'border-[var(--input-border)] bg-[var(--surface-input)] hover:border-[var(--muted-text)] cursor-pointer text-[var(--primary-text)]'
          }
        `}
      >
        <span className="flex items-center gap-3">
          <span className="text-[20px] leading-none">{selected.flag}</span>
          <span className="text-[13px] font-semibold text-[var(--primary-text)]">{displayLabel}</span>
        </span>
        {!disabled && (
          open
            ? <ChevronUp className="h-4 w-4 text-[var(--muted-text)] shrink-0" />
            : <ChevronDown className="h-4 w-4 text-[var(--muted-text)] shrink-0" />
        )}
      </button>

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
          <div className="px-2.5 py-2 border-b border-[var(--border-color)]">
            <div className="flex items-center gap-1.5 rounded-lg border border-[var(--input-border)] bg-[var(--surface-input)] px-2.5 h-7">
              <Search className="h-3 w-3 shrink-0 text-[var(--muted-text)]" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={lang === 'ar' ? 'بحث عن دولة...' : 'Search country...'}
                className="flex-1 bg-transparent text-[11px] text-[var(--primary-text)] outline-none placeholder:text-[var(--muted-text)] text-start"
              />
            </div>
          </div>

          <div className="max-h-52 overflow-y-auto overscroll-contain">
            {filtered.length === 0 ? (
              <p className="px-4 py-4 text-center text-xs text-[var(--muted-text)]">
                {lang === 'ar' ? 'لم يتم العثور على دولة.' : 'No country found.'}
              </p>
            ) : (
              filtered.map((country) => {
                const isSelected = selected.label === country.label || selected.labelAr === country.labelAr;
                const cLabel = lang === 'ar' ? country.labelAr : country.label;
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
                      text-start cursor-pointer
                      transition-colors duration-150 text-sm
                      ${isSelected
                        ? 'bg-[var(--brand-soft-bg)] text-[#c53938] font-semibold'
                        : 'text-[var(--primary-text)] hover:bg-[var(--surface-soft)]'
                      }
                    `}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-[20px] leading-none">{country.flag}</span>
                      <span className="text-[13px]">{cLabel}</span>
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
  const { lang, t } = useLanguage();
  const tr = t('settings').profileTab;

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

      toast.success(lang === 'ar' ? 'تم تحديث الملف الشخصي بنجاح!' : 'Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      toast.error(err.message || (lang === 'ar' ? 'فشل تحديث الملف الشخصي.' : 'Failed to update profile.'));
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
        <div className="text-start">
          <h2 className="text-xl font-bold text-[var(--primary-text)]">{tr.title}</h2>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] mt-0.5">
            {tr.subtitle}
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
          label={tr.firstName}
          value={formData.firstName}
          onChange={handleChange('firstName')}
          placeholder={tr.firstName}
          disabled={!isEditing}
        />
        <LabeledInput
          id="lastName"
          label={tr.lastName}
          value={formData.lastName}
          onChange={handleChange('lastName')}
          placeholder={tr.lastName}
          disabled={!isEditing}
        />
        <LabeledInput
          id="email"
          label={tr.email}
          value={formData.email}
          onChange={handleChange('email')}
          placeholder={tr.email}
          disabled={!isEditing}
        />

        <GenderSelectDropdown
          id="gender"
          label={tr.gender}
          value={formData.gender}
          onChange={handleChange('gender')}
          disabled={!isEditing}
        />

        {/* Country Dropdown with emoji flags */}
        <CountryDropdown
          value={formData.country}
          onChange={handleCountryChange}
          disabled={!isEditing}
          lang={lang}
        />

        <LanguageSelectDropdown
          id="language"
          label={tr.language}
          value={formData.language}
          onChange={handleChange('language')}
          disabled={!isEditing}
        />
      </form>

      <EmailAddressRow
        email={formData.email || 'user@eld7e7.com'}
        timeAgo={tr.verified}
        onAddEmail={() => {}}
      />
    </div>
  );
}
