import React from 'react';

export const LabeledInput = ({
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
  type = 'text',
  id,
}) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label htmlFor={id} className="text-xs sm:text-[13px] font-semibold text-[var(--label-text)]">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="h-11 w-full rounded-[12px] border border-[var(--input-border)] bg-[var(--surface-input)] px-4 text-sm text-[var(--primary-text)] placeholder:text-[var(--muted-text)] outline-none transition-all focus:border-[#c53938] focus:ring-1 focus:ring-[#c53938]/30 disabled:cursor-not-allowed disabled:opacity-70"
      />
    </div>
  );
};
