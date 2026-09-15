import { useLanguage } from '../../context/LanguageContext';
import { SOCIAL_LINKS } from '../../data/socialLinks';

export default function FloatingWhatsAppButton() {
  const { lang } = useLanguage();

  return (
    <aside aria-label="WhatsApp Contact" className="fixed bottom-6 ltr:right-6 rtl:left-6 z-40">
      <a
        href={SOCIAL_LINKS.whatsapp.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={lang === 'ar' ? 'تواصل معنا عبر واتساب' : 'Chat with us on WhatsApp'}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_25px_rgba(37,211,102,0.45)] transition-all duration-300 hover:scale-110 hover:shadow-[0_12px_32px_rgba(37,211,102,0.6)] focus:outline-none focus:ring-4 focus:ring-[#25D366]/40"
      >
        {/* Pulse ring animation */}
        <span className="absolute -inset-1 -z-10 rounded-full bg-[#25D366]/40 animate-ping opacity-75" />

        {/* WhatsApp SVG */}
        <svg
          className="h-7 w-7 fill-current transition-transform duration-300 group-hover:scale-105"
          viewBox="0 0 24 24"
        >
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.41a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.11-.23-.17-.48-.29z" />
        </svg>

        {/* Hover Tooltip */}
        <span className="pointer-events-none absolute bottom-full mb-3 hidden whitespace-nowrap rounded-xl bg-gray-900/95 px-3 py-1.5 text-xs font-semibold text-white shadow-xl backdrop-blur-sm transition-opacity duration-200 group-hover:block ltr:right-0 rtl:left-0">
          {lang === 'ar' ? 'تواصل معنا على واتساب' : 'Chat on WhatsApp'}
          <span className="absolute top-full h-0 w-0 border-x-4 border-t-4 border-x-transparent border-t-gray-900/95 ltr:right-5 rtl:left-5" />
        </span>
      </a>
    </aside>
  );
}
