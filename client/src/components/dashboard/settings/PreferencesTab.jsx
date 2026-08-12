import React, { useState, useRef, useEffect } from 'react';
import {
  Sliders,
  CheckCircle2,
  Bell,
  Mail,
  ShoppingBag,
  Moon,
  ChevronDown,
  ChevronUp,
  Check,
} from 'lucide-react';
import { useTheme } from '../../../utils/useTheme';

/* ─────────────────────── data ─────────────────────── */

const LANGUAGES = [
  { value: 'arabic',  label: 'Arabic',  flag: '🇸🇦' },
  { value: 'bengali', label: 'Bengali', flag: '🇧🇩' },
  { value: 'english', label: 'English', flag: '🇬🇧' },
  { value: 'french',  label: 'French',  flag: '🇫🇷' },
  { value: 'german',  label: 'German',  flag: '🇩🇪' },
  { value: 'spanish', label: 'Spanish', flag: '🇪🇸' },
];

const CURRENCIES = [
  { value: 'egp', label: 'Egyptian Pound', symbol: 'E£', flag: '🇪🇬' },
  { value: 'usd', label: 'US Dollar',       symbol: '$',  flag: '🇺🇸' },
  { value: 'eur', label: 'Euro',             symbol: '€',  flag: '🇪🇺' },
  { value: 'gbp', label: 'British Pound',   symbol: '£',  flag: '🇬🇧' },
  { value: 'sar', label: 'Saudi Riyal',      symbol: '﷼', flag: '🇸🇦' },
  { value: 'aed', label: 'UAE Dirham',       symbol: 'د.إ',flag: '🇦🇪' },
];

/* ─────────────── FlagDropdown (custom, fully accessible) ─────────────── */

function FlagDropdown({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  const selected = options.find((o) => o.value === value) ?? options[0];

  const handleSelect = (optValue) => {
    onChange(optValue);
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-2 relative" ref={containerRef}>
      {/* Label */}
      <span className="text-[13px] font-semibold text-[var(--label-text)]">{label}</span>

      {/* Trigger button */}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className={`
          flex items-center justify-between gap-3
          w-full h-[52px] px-4
          rounded-2xl border bg-[var(--surface-input)]
          text-sm font-semibold text-[var(--primary-text)]
          shadow-xs
          transition-all duration-200 cursor-pointer
          ${open ? 'border-[#c53938] ring-2 ring-[#c53938]/15' : 'border-[var(--input-border)] hover:border-[var(--muted-text)]'}
        `}
      >
        <span className="flex items-center gap-3">
          <span className="text-[22px] leading-none">{selected.flag}</span>
          <span className="text-[14px] font-semibold text-[var(--primary-text)]">
            {selected.label}
            {'symbol' in selected && (
              <span className="ml-1.5 text-[12px] font-medium text-[var(--muted-text)]">
                ({selected.symbol})
              </span>
            )}
          </span>
        </span>

        {open
          ? <ChevronUp  className="h-4 w-4 text-[#c53938] shrink-0" />
          : <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />
        }
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          role="listbox"
          aria-label={label}
          className="
            absolute top-[calc(100%+6px)] left-0 right-0 z-50
            bg-[var(--surface-card)]
            rounded-2xl
            border border-[var(--border-color)]
            shadow-[0_8px_30px_rgba(0,0,0,0.18)]
            overflow-hidden
            animate-in fade-in-0 slide-in-from-top-2
            duration-150
          "
        >
          {/* Scrollable list */}
          <div className="max-h-60 overflow-y-auto overscroll-contain">
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(opt.value)}
                  className={`
                    flex items-center justify-between gap-3
                    w-full px-4 py-3.5
                    text-left cursor-pointer
                    transition-colors duration-150
                    ${isSelected
                      ? 'bg-[var(--brand-soft-bg)] text-[#c53938]'
                      : 'text-[var(--primary-text)] hover:bg-[var(--surface-soft)]'}
                  `}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-[22px] leading-none">{opt.flag}</span>
                    <span className={`text-[14px] font-${isSelected ? 'bold' : 'medium'} text-[var(--primary-text)] ${isSelected ? 'text-[#c53938]' : ''}`}>
                      {opt.label}
                      {'symbol' in opt && (
                        <span className={`ml-1.5 text-[12px] ${isSelected ? 'text-[#c53938]/70' : 'text-[var(--muted-text)]'}`}>
                          ({opt.symbol})
                        </span>
                      )}
                    </span>
                  </span>

                  {isSelected && (
                    <Check className="h-4 w-4 text-[#c53938] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────── ToggleSwitch ─────────────── */

function ToggleSwitch({ checked, onChange, id }) {
  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`
        relative inline-flex h-[26px] w-[46px] shrink-0 cursor-pointer
        rounded-full border-2 border-transparent
        transition-colors duration-200 ease-in-out
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c53938]/40
        ${checked ? 'bg-[#c53938]' : 'bg-gray-200'}
      `}
    >
      <span
        className={`
          pointer-events-none inline-block h-[22px] w-[22px]
          rounded-full bg-white shadow-md ring-0
          transition-transform duration-200 ease-in-out
          ${checked ? 'translate-x-5' : 'translate-x-0'}
        `}
      />
    </button>
  );
}

/* ─────────────── PreferenceRow ─────────────── */

function PreferenceRow({ icon: Icon, label, description, checked, onToggle, switchId }) {
  return (
    <div className="
      group flex items-center justify-between gap-4
      px-5 py-4
      rounded-[16px]
      border border-[var(--border-color)]
      bg-[var(--surface-card)]
      shadow-[0_1px_4px_rgba(0,0,0,0.05)]
      hover:border-[var(--brand-accent)]/30 hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)]
      transition-all duration-200
    ">
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--surface-soft)] text-[var(--label-text)] group-hover:border-[var(--muted-text)]/30 transition-colors duration-200">
          <Icon className="h-[17px] w-[17px]" />
        </div>
        <div className="min-w-0">
          <p className="text-[13.5px] font-semibold text-[var(--primary-text)] leading-snug">{label}</p>
          <p className="text-[12px] text-[var(--muted-text)] mt-0.5 leading-snug">{description}</p>
        </div>
      </div>
      <ToggleSwitch checked={checked} onChange={onToggle} id={switchId} />
    </div>
  );
}

/* ─────────────── Main component ─────────────── */

export default function PreferencesTab() {
  const { isDark, toggle: toggleDarkMode } = useTheme();

  const [prefs, setPrefs] = useState({
    language: 'english',
    currency: 'egp',
    emailNotifications: true,
    pushNotifications: true,
    orderUpdates: true,
    promotionalEmails: false,
  });

  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleDropdown = (field) => (val) => {
    setPrefs((p) => ({ ...p, [field]: val }));
    setSaved(false);
  };

  const handleToggle = (field) => () => {
    setPrefs((p) => ({ ...p, [field]: !p[field] }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3500);
    }, 500);
  };

  const TOGGLE_ROWS = [
    { id: 'emailNotifications', label: 'Email Notifications',  description: 'Account activity and order confirmation emails.', icon: Mail },
    { id: 'pushNotifications',  label: 'Push Notifications',   description: 'Real-time alerts in your browser or phone.',      icon: Bell },
    { id: 'orderUpdates',       label: 'Order Updates',        description: 'Get notified when your order status changes.',    icon: ShoppingBag },
    { id: 'promotionalEmails',  label: 'Promotional Emails',   description: 'Sales, new arrivals, and discount offers.',       icon: Mail },
  ];

  return (
    <div className="rounded-[24px] border border-[var(--border-color)] bg-[var(--surface-card)] p-6 sm:p-9 shadow-xs transition-colors duration-250">

      {/* Header */}
      <div className="flex items-center gap-3.5 mb-7 pb-6 border-b border-gray-100">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fdecec] text-[#c53938]">
          <Sliders className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-[19px] font-bold text-[var(--primary-text)] leading-tight">Preferences</h2>
          <p className="text-[12.5px] text-[var(--muted-text)] mt-0.5">Language, currency, notifications, and appearance.</p>
        </div>
      </div>

      {/* Success Toast */}
      {saved && (
        <div className="mb-6 flex items-center gap-3 rounded-[14px] bg-emerald-50 px-4 py-3.5 text-[13px] font-medium text-emerald-700 border border-emerald-200 shadow-xs">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>Preferences saved successfully!</span>
        </div>
      )}

      <div className="flex flex-col gap-7">

        {/* Section 1: Regional */}
        <div className="space-y-3.5">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#aaaaaa]">
            Regional &amp; Localization
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FlagDropdown
              label="Language"
              options={LANGUAGES}
              value={prefs.language}
              onChange={handleDropdown('language')}
            />
            <FlagDropdown
              label="Currency"
              options={CURRENCIES}
              value={prefs.currency}
              onChange={handleDropdown('currency')}
            />
          </div>
        </div>

        <div className="h-px bg-gray-100" />

        {/* Section 2: Notifications */}
        <div className="space-y-3.5">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#aaaaaa]">
            Notification Settings
          </p>
          <div className="flex flex-col gap-3">
            {TOGGLE_ROWS.map((row) => (
              <PreferenceRow
                key={row.id}
                switchId={`switch-${row.id}`}
                icon={row.icon}
                label={row.label}
                description={row.description}
                checked={prefs[row.id]}
                onToggle={handleToggle(row.id)}
              />
            ))}
          </div>
        </div>

        <div className="h-px bg-gray-100" />

        {/* Section 3: Appearance */}
        <div className="space-y-3.5">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#aaaaaa]">
            Appearance
          </p>
          <PreferenceRow
            switchId="switch-darkMode"
            icon={Moon}
            label="Dark Mode"
            description="Switch between light and dark interface themes."
            checked={isDark}
            onToggle={toggleDarkMode}
          />
        </div>

        {/* Save */}
        <div className="pt-1">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-full bg-[#535353] px-7 py-[10px] text-[13px] font-bold text-white shadow-xs transition-all duration-200 hover:bg-[#3d3d3d] active:scale-[0.97] disabled:opacity-60 cursor-pointer"
          >
            {saving ? 'Saving…' : 'Save Preferences'}
          </button>
        </div>

      </div>
    </div>
  );
}
