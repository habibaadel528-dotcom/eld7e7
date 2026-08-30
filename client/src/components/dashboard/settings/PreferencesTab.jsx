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
import { useLanguage } from '../../../context/LanguageContext';

/* ─────────────────────── data ─────────────────────── */

const LANGUAGES = [
  { value: 'arabic',  label: 'Arabic',  labelAr: 'العربية',  flag: '🇪🇬' },
  { value: 'english', label: 'English', labelAr: 'الإنجليزية', flag: '🇬🇧' },
  { value: 'french',  label: 'French',  labelAr: 'الفرنسية',  flag: '🇫🇷' },
  { value: 'german',  label: 'German',  labelAr: 'الألمانية',  flag: '🇩🇪' },
  { value: 'spanish', label: 'Spanish', labelAr: 'الإسبانية', flag: '🇪🇸' },
];

const CURRENCIES = [
  { value: 'egp', label: 'Egyptian Pound', labelAr: 'جنيه مصري', symbol: 'EGP', flag: '🇪🇬' },
  { value: 'sar', label: 'Saudi Riyal',    labelAr: 'ريال سعودي',  symbol: 'SAR', flag: '🇸🇦' },
  { value: 'aed', label: 'UAE Dirham',     labelAr: 'درهم إماراتي',symbol: 'AED', flag: '🇦🇪' },
  { value: 'usd', label: 'US Dollar',      labelAr: 'دولار أمريكي',symbol: '$',   flag: '🇺🇸' },
  { value: 'eur', label: 'Euro',           labelAr: 'يورو',       symbol: '€',   flag: '🇪🇺' },
];

/* ─────────────── FlagDropdown (custom, fully accessible) ─────────────── */

function FlagDropdown({ label, options, value, onChange, lang }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

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

  const displayLabel = lang === 'ar' ? (selected.labelAr || selected.label) : selected.label;

  return (
    <div className="flex flex-col gap-2 relative text-start" ref={containerRef}>
      <span className="text-[13px] font-semibold text-[var(--label-text)]">{label}</span>

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
            {displayLabel}
            {'symbol' in selected && (
              <span className="mx-1.5 text-[12px] font-medium text-[var(--muted-text)]">
                ({selected.symbol})
              </span>
            )}
          </span>
        </span>

        {open ? (
          <ChevronUp className="h-4 w-4 text-[var(--muted-text)] shrink-0 transition-transform duration-200" />
        ) : (
          <ChevronDown className="h-4 w-4 text-[var(--muted-text)] shrink-0 transition-transform duration-200" />
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
            animate-in fade-in-0 zoom-in-95 duration-150
          "
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            const optLabel = lang === 'ar' ? (opt.labelAr || opt.label) : opt.label;
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(opt.value)}
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
                  <span className="text-[20px] leading-none">{opt.flag}</span>
                  <span className="text-[13px]">{optLabel}</span>
                  {'symbol' in opt && (
                    <span className="text-[11px] text-[var(--muted-text)]">({opt.symbol})</span>
                  )}
                </span>
                {isSelected && (
                  <Check className="h-3.5 w-3.5 text-[#c53938] shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─────────────── ToggleSwitch ─────────────── */

function ToggleSwitch({ checked, onChange, id, label }) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`
        relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full
        border-2 border-transparent
        transition-colors duration-200 ease-in-out
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c53938] focus-visible:ring-offset-2
        ${checked ? 'bg-[#c53938]' : 'bg-[var(--toggle-off-bg)]'}
      `}
    >
      <span
        aria-hidden="true"
        className={`
          pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md
          transform transition duration-200 ease-in-out
          ${checked ? 'ltr:translate-x-5 rtl:-translate-x-5' : 'translate-x-0'}
        `}
      />
    </button>
  );
}

export default function PreferencesTab() {
  const { isDark, toggle: toggleTheme } = useTheme();
  const { lang, setLang, t } = useLanguage();
  const tr = t('settings').preferencesTab;

  const [selectedLang, setSelectedLang] = useState(lang === 'ar' ? 'arabic' : 'english');
  const [selectedCurrency, setSelectedCurrency] = useState('egp');

  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promos: true,
    newsletter: false,
  });

  const [savedMessage, setSavedMessage] = useState(false);

  const handleLanguageChange = (val) => {
    setSelectedLang(val);
    if (val === 'arabic' && lang !== 'ar') setLang('ar');
    if (val === 'english' && lang !== 'en') setLang('en');
    showSavedNotification();
  };

  const handleCurrencyChange = (val) => {
    setSelectedCurrency(val);
    showSavedNotification();
  };

  const handleNotificationToggle = (key) => (value) => {
    setNotifications((prev) => ({ ...prev, [key]: value }));
    showSavedNotification();
  };

  const showSavedNotification = () => {
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2500);
  };

  return (
    <div className="rounded-[24px] border border-[var(--border-color)] bg-[var(--surface-card)] p-6 sm:p-10 shadow-xs transition-colors duration-250">

      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-8 pb-5 border-b border-[var(--border-color)]">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--brand-soft-bg)] text-[#c53938]">
            <Sliders className="h-5 w-5" />
          </div>
          <div className="text-start">
            <h2 className="text-xl font-bold text-[var(--primary-text)]">{tr.title}</h2>
            <p className="text-xs sm:text-sm text-[var(--muted-text)] mt-0.5">
              {tr.subtitle}
            </p>
          </div>
        </div>

        {savedMessage && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-semibold animate-in fade-in-0 duration-200">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>{lang === 'ar' ? 'تم الحفظ تلقائياً' : 'Saved'}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-10">

        {/* ── SECTION 1: System Localization ── */}
        <section className="flex flex-col gap-5">
          <div className="text-start">
            <h3 className="text-sm font-bold text-[var(--primary-text)] uppercase tracking-wider">
              {tr.systemLocalization}
            </h3>
            <p className="text-xs text-[var(--muted-text)] mt-0.5">
              {tr.localizationDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-xl">
            <FlagDropdown
              label={lang === 'ar' ? 'لغة الموقع' : 'Interface Language'}
              options={LANGUAGES}
              value={selectedLang}
              onChange={handleLanguageChange}
              lang={lang}
            />

            <FlagDropdown
              label={lang === 'ar' ? 'العملة الإقليمية' : 'Regional Currency'}
              options={CURRENCIES}
              value={selectedCurrency}
              onChange={handleCurrencyChange}
              lang={lang}
            />
          </div>
        </section>

        {/* ── SECTION 2: Notifications ── */}
        <section className="flex flex-col gap-5">
          <div className="text-start">
            <h3 className="text-sm font-bold text-[var(--primary-text)] uppercase tracking-wider">
              {tr.notifications}
            </h3>
          </div>

          <div className="flex flex-col divide-y divide-[var(--border-color)] max-w-2xl">
            <div className="flex items-center justify-between gap-4 py-4">
              <div className="flex items-start gap-3.5 text-start">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-soft)] text-[var(--label-text)]">
                  <ShoppingBag className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--primary-text)]">{tr.orderUpdates}</p>
                  <p className="text-xs text-[var(--muted-text)] mt-0.5">{tr.orderUpdatesDesc}</p>
                </div>
              </div>
              <ToggleSwitch
                id="notif-orders"
                label={tr.orderUpdates}
                checked={notifications.orderUpdates}
                onChange={handleNotificationToggle('orderUpdates')}
              />
            </div>

            <div className="flex items-center justify-between gap-4 py-4">
              <div className="flex items-start gap-3.5 text-start">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-soft)] text-[var(--label-text)]">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--primary-text)]">{tr.promos}</p>
                  <p className="text-xs text-[var(--muted-text)] mt-0.5">{tr.promosDesc}</p>
                </div>
              </div>
              <ToggleSwitch
                id="notif-promos"
                label={tr.promos}
                checked={notifications.promos}
                onChange={handleNotificationToggle('promos')}
              />
            </div>

            <div className="flex items-center justify-between gap-4 py-4">
              <div className="flex items-start gap-3.5 text-start">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-soft)] text-[var(--label-text)]">
                  <Bell className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--primary-text)]">{tr.newsletter}</p>
                  <p className="text-xs text-[var(--muted-text)] mt-0.5">{tr.newsletterDesc}</p>
                </div>
              </div>
              <ToggleSwitch
                id="notif-newsletter"
                label={tr.newsletter}
                checked={notifications.newsletter}
                onChange={handleNotificationToggle('newsletter')}
              />
            </div>
          </div>
        </section>

        {/* ── SECTION 3: Appearance ── */}
        <section className="flex flex-col gap-5">
          <div className="text-start">
            <h3 className="text-sm font-bold text-[var(--primary-text)] uppercase tracking-wider">
              {tr.appearance}
            </h3>
          </div>

          <div className="flex items-center justify-between gap-4 py-4 max-w-2xl">
            <div className="flex items-start gap-3.5 text-start">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-soft)] text-[var(--label-text)]">
                <Moon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--primary-text)]">
                  {lang === 'ar' ? (isDark ? 'الوضع الداكن' : 'الوضع الفاتح') : (isDark ? 'Dark Mode' : 'Light Mode')}
                </p>
                <p className="text-xs text-[var(--muted-text)] mt-0.5">{tr.darkModeDesc}</p>
              </div>
            </div>
            <ToggleSwitch
              id="theme-toggle"
              label="Theme Toggle"
              checked={isDark}
              onChange={toggleTheme}
            />
          </div>
        </section>

      </div>
    </div>
  );
}
