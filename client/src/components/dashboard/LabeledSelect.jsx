import React from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * LabeledSelect
 * Label above select dropdown with light gray fill (#f5f5f5), rounded corners (12px), and custom chevron-down icon.
 */
export const LabeledSelect = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select',
  disabled = false,
  id,
}) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label htmlFor={id} className="text-xs sm:text-[13px] font-medium text-[#535353]">
        {label}
      </label>
      <div className="relative w-full">
        <select
          id={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="h-11 w-full appearance-none rounded-[12px] bg-[#f5f5f5] px-4 pr-10 text-sm text-[#535353] outline-none transition-all focus:bg-white focus:ring-1 focus:ring-[#c53938]/30 disabled:cursor-not-allowed disabled:opacity-80"
        >
          <option value="" disabled className="text-[#b0b0b0]">
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.value || opt} value={opt.value || opt}>
              {opt.label || opt}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      </div>
    </div>
  );
};
