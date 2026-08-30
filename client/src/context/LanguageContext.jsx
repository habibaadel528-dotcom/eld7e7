import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import translations from '../data/translations';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('lang');
    return saved === 'ar' || saved === 'en' ? saved : 'en';
  });

  // Sync <html> attributes whenever lang changes
  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('lang', lang);
  }, [lang]);

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === 'en' ? 'ar' : 'en'));
  }, []);

  /**
   * t(section, key?)
   * Examples:
   *   t('nav').home
   *   t('hero').heading1
   *   t('footer').copyright(2025)
   */
  const t = useCallback(
    (section) => translations[lang][section],
    [lang],
  );

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>');
  return ctx;
}
