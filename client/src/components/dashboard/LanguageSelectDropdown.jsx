import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const LANGUAGES = [
  { id: 'arabic', label: 'Arabic', labelAr: 'العربية', code: 'eg' },
  { id: 'english', label: 'English', labelAr: 'الإنجليزية', code: 'gb' },
  { id: 'french', label: 'French', labelAr: 'الفرنسية', code: 'fr' },
  { id: 'german', label: 'German', labelAr: 'الألمانية', code: 'de' },
  { id: 'spanish', label: 'Spanish', labelAr: 'الإسبانية', code: 'es' },
  { id: 'italian', label: 'Italian', labelAr: 'الإيطالية', code: 'it' },
  { id: 'turkish', label: 'Turkish', labelAr: 'التركية', code: 'tr' },
  { id: 'japanese', label: 'Japanese', labelAr: 'اليابانية', code: 'jp' },
  { id: 'korean', label: 'Korean', labelAr: 'الكورية', code: 'kr' },
];

export const LanguageSelectDropdown = ({
  label = 'Language',
  value,
  onChange,
  disabled = false,
  id,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { lang, setLang } = useLanguage();

  const selectedLang = LANGUAGES.find((l) => l.id === value || l.label.toLowerCase() === (value || '').toLowerCase() || l.labelAr === value);
  const displayLabel = selectedLang
    ? (lang === 'ar' ? selectedLang.labelAr : selectedLang.label)
    : (lang === 'ar' ? 'اختر' : 'Select');

  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  const handleSelect = (langId) => {
    if (disabled) return;
    if (onChange) {
      onChange({ target: { value: langId } });
    }
    if (langId === 'arabic' && lang !== 'ar') setLang('ar');
    if (langId === 'english' && lang !== 'en') setLang('en');
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col gap-1.5 w-full relative text-start" ref={dropdownRef}>
      {label && (
        <label htmlFor={id} className="text-xs sm:text-[13px] font-semibold text-[var(--label-text)]">
          {label}
        </label>
      )}

      {/* Input / Select Trigger */}
      <button
        type="button"
        id={id}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        disabled={disabled}
        className="h-11 w-full flex items-center justify-between rounded-[12px] border border-[var(--input-border)] bg-[var(--surface-input)] px-4 text-sm text-[var(--primary-text)] outline-none transition-all focus:border-[#c53938] focus:ring-1 focus:ring-[#c53938]/30 disabled:cursor-not-allowed disabled:opacity-70 text-start cursor-pointer"
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          {selectedLang ? (
            <>
              <img
                src={`https://flagcdn.com/w40/${selectedLang.code}.png`}
                alt={selectedLang.label}
                className="h-3.5 w-5 object-cover rounded-xs shrink-0 shadow-2xs"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <span className="font-medium text-[var(--primary-text)] truncate">{displayLabel}</span>
            </>
          ) : (
            <span className="text-[var(--muted-text)]">{lang === 'ar' ? 'اختر' : 'Select'}</span>
          )}
        </div>

        <ChevronDown
          className={[
            'h-4 w-4 text-[var(--muted-text)] transition-transform duration-200 shrink-0',
            isOpen ? 'rotate-180 text-[#c53938]' : '',
          ].join(' ')}
        />
      </button>

      {/* Floating Custom Dropdown Popup */}
      {isOpen && (
        <div className="absolute top-full mt-1 left-0 z-50 w-full max-h-48 overflow-y-auto rounded-[14px] border border-[var(--border-color)] bg-[var(--surface-card)] p-1 shadow-lg animate-in fade-in-50 zoom-in-95 duration-150">
          {LANGUAGES.map((item) => {
            const isSelected = selectedLang?.id === item.id;
            const itemLabel = lang === 'ar' ? item.labelAr : item.label;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={[
                  'flex w-full items-center justify-between rounded-[8px] px-3 py-2 text-start transition-colors cursor-pointer',
                  isSelected
                    ? 'bg-[var(--brand-soft-bg)] text-[#c53938] font-bold'
                    : 'text-[var(--primary-text)] hover:bg-[var(--surface-soft)]',
                ].join(' ')}
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={`https://flagcdn.com/w40/${item.code}.png`}
                    alt={item.label}
                    className="h-3.5 w-5 object-cover rounded-xs shrink-0 shadow-2xs"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <span className="text-xs sm:text-sm font-medium">{itemLabel}</span>
                </div>

                {isSelected && <Check className="h-3.5 w-3.5 text-[#c53938] stroke-[2.5]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
