import { useState } from 'react';

import eyeIcon from '../../assets/icons/auth/eye.svg';
import eyeOffIcon from '../../assets/icons/auth/eye-off.svg';

export default function AuthInput({
  id,
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder = '',
  autoComplete,
  required = false,
  error = '',
}) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';

  const inputType =
    isPassword && showPassword
      ? 'text'
      : type;

  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-[#535353]"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`h-[52px] w-full rounded-[18px] border bg-white/25 px-5 text-sm text-[#535353] outline-none backdrop-blur-sm transition placeholder:text-[#7d7d7d] ${
            error
              ? 'border-[#c53938]'
              : 'border-[#9f9f9f] focus:border-[#c53938] focus:shadow-[0_0_20px_rgba(197,57,56,0.15)]'
          } ${isPassword ? 'pr-14' : ''}`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full"
          >
            <img
              src={showPassword ? eyeOffIcon : eyeIcon}
              alt=""
              width="20"
              height="20"
              className="h-5 w-5 object-contain opacity-70"
            />
          </button>
        )}
      </div>

      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mb-0 mt-1.5 text-xs text-[#c53938]"
        >
          {error}
        </p>
      )}
    </div>
  );
}