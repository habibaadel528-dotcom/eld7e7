import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

/**
 * GenderSelectDropdown
 * Renders a normal select input trigger with CSS variables matching LabeledInput.
 * Clicking opens a floating dropdown popup styled using --surface-card and --border-color for full dark mode support.
 */
export const GenderSelectDropdown = ({
  label = 'Gender',
  value,
  onChange,
  disabled = false,
  id,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const options = [
    { id: 'male', label: 'Male' },
    { id: 'female', label: 'Female' },
  ];

  const selectedOption = options.find((o) => o.id === value);

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

  const handleSelect = (optionId) => {
    if (disabled) return;
    if (onChange) {
      onChange({ target: { value: optionId } });
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
        className="h-11 w-full flex items-center justify-between rounded-[12px] border border-[var(--input-border)] bg-[var(--surface-input)] px-4 text-sm text-[var(--primary-text)] outline-none transition-all focus:border-[#c53938] focus:ring-1 focus:ring-[#c53938]/30 disabled:cursor-not-allowed disabled:opacity-70 text-left"
      >
        <span className={selectedOption ? 'font-medium text-[var(--primary-text)]' : 'text-[var(--muted-text)]'}>
          {selectedOption ? selectedOption.label : 'Select'}
        </span>
        <ChevronDown
          className={[
            'h-4 w-4 text-[var(--muted-text)] transition-transform duration-200',
            isOpen ? 'rotate-180 text-[#c53938]' : '',
          ].join(' ')}
        />
      </button>

      {/* Floating Custom Dropdown Popup */}
      {isOpen && (
        <div className="absolute top-full mt-1 left-0 z-50 w-full overflow-hidden rounded-[14px] border border-[var(--border-color)] bg-[var(--surface-card)] shadow-lg animate-in fade-in-50 zoom-in-95 duration-150">
          {options.map((option, index) => {
            const isSelected = value === option.id;
            return (
              <React.Fragment key={option.id}>
                {index > 0 && <div className="h-px w-full bg-[var(--border-color)]" />}
                <button
                  type="button"
                  onClick={() => handleSelect(option.id)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-[var(--surface-soft)] transition-colors cursor-pointer"
                >
                  {/* Rounded Checkbox */}
                  <div
                    className={[
                      'flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-[5px] border transition-all',
                      isSelected
                        ? 'border-[#c53938] bg-[#c53938] text-white'
                        : 'border-[var(--muted-text)] bg-[var(--surface-input)]',
                    ].join(' ')}
                  >
                    {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>

                  {/* Option Label */}
                  <span className="text-xs sm:text-sm font-medium text-[var(--primary-text)]">
                    {option.label}
                  </span>
                </button>
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
};
