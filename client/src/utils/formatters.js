/**
 * Formats numbers into Eastern Arabic numerals (٠-٩)
 */
export function toArabicDigits(val) {
  if (val === null || val === undefined) return '';
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(val).replace(/[0-9]/g, (d) => arabicDigits[Number(d)]);
}

/**
 * Format currency with language awareness
 */
export function formatCurrency(amount, lang = 'en') {
  const num = Number(amount) || 0;
  if (lang === 'ar') {
    return `${toArabicDigits(num.toLocaleString('en-US'))} ج.م`;
  }
  return `EGP ${num.toLocaleString('en-US')}`;
}
