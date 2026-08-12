import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const LANGUAGES = [
  { id: 'arabic', label: 'Arabic', code: 'sa' },
  { id: 'bengali', label: 'Bengali', code: 'bd' },
  { id: 'english', label: 'English', code: 'gb' },
  { id: 'french', label: 'French', code: 'fr' },
  { id: 'german', label: 'German', code: 'de' },
  { id: 'hindi', label: 'Hindi', code: 'in' },
  { id: 'italian', label: 'Italian', code: 'it' },
  { id: 'japanese', label: 'Japanese', code: 'jp' },
  { id: 'javanese', label: 'Javanese', code: 'id' },
  { id: 'korean', label: 'Korean', code: 'kr' },
  { id: 'marathi', label: 'Marathi', code: 'in' },
  { id: 'portuguese', label: 'Portuguese', code: 'pt' },
  { id: 'russian', label: 'Russian', code: 'ru' },
  { id: 'spanish', label: 'Spanish', code: 'es' },
  { id: 'swahili', label: 'Swahili', code: 'ke' },
  { id: 'tamil', label: 'Tamil', code: 'lk' },
  { id: 'telugu', label: 'Telugu', code: 'in' },
];

/**
 * LanguageSelectDropdown
 * Compact language selector dropdown displaying flag icons and language names with CSS variables matching inputs.
 */
export const LanguageSelectDropdown = ({
  label = 'Language',
  value,
  onChange,
  disabled = false,
  id,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedLang = LANGUAGES.find((l) => l.id === value || l.label.toLowerCase() === (value || '').toLowerCase());

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
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col gap-1.5 w-full relative" ref={dropdownRef}>
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
        className="h-11 w-full flex items-center justify-between rounded-[12px] border border-[var(--input-border)] bg-[var(--surface-input)] px-4 text-sm text-[var(--primary-text)] outline-none transition-all focus:border-[#c53938] focus:ring-1 focus:ring-[#c53938]/30 disabled:cursor-not-allowed disabled:opacity-70 text-left cursor-pointer"
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
              <span className="font-medium text-[var(--primary-text)] truncate">{selectedLang.label}</span>
            </>
          ) : (
            <span className="text-[var(--muted-text)]">Select</span>
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
          {LANGUAGES.map((lang) => {
            const isSelected = selectedLang?.id === lang.id;
            return (
              <button
                key={lang.id}
                type="button"
                onClick={() => handleSelect(lang.id)}
                className={[
                  'flex w-full items-center justify-between rounded-[8px] px-3 py-2 text-left transition-colors cursor-pointer',
                  isSelected
                    ? 'bg-[var(--brand-soft-bg)] text-[#c53938] font-bold'
                    : 'text-[var(--primary-text)] hover:bg-[var(--surface-soft)]',
                ].join(' ')}
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={`https://flagcdn.com/w40/${lang.code}.png`}
                    alt={lang.label}
                    className="h-3.5 w-5 object-cover rounded-xs shrink-0 shadow-2xs"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <span className="text-xs sm:text-sm font-medium">{lang.label}</span>
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
