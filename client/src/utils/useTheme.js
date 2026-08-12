import { useState, useEffect } from 'react';

/**
 * useTheme — reads and writes the real dark/light theme
 * using the same mechanism already bootstrapped in main.jsx:
 *   document.documentElement.dataset.theme = 'dark' | 'light'
 *   localStorage.getItem/setItem('theme')
 */
export function useTheme() {
  const [isDark, setIsDark] = useState(
    () => document.documentElement.dataset.theme === 'dark'
  );

  const toggle = () => {
    const next = !isDark;
    const value = next ? 'dark' : 'light';

    document.documentElement.dataset.theme = value;
    localStorage.setItem('theme', value);
    setIsDark(next);
  };

  // Keep local state in sync if theme changes outside this hook
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.dataset.theme === 'dark');
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  return { isDark, toggle };
}
