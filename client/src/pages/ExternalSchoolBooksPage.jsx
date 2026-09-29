import { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Heart, Plus, Search, BookOpen, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useLanguage } from '../context/LanguageContext';
import { productApi } from '../services/api';
import {
  normalizeBookGrade,
  getGradeById,
} from '../data/schoolBooksData';

import AnnouncementBar from '../sections/AnnouncementBar';
import Header from '../sections/Header';
import Navigation from '../sections/Navigation';
import Footer from '../sections/Footer';

/* ── Shared pastel card palette (cycled by index) ── */
const CARD_PALETTE = [
  { bg: 'bg-amber-100', text: 'text-amber-700' },
  { bg: 'bg-sky-100', text: 'text-sky-700' },
  { bg: 'bg-pink-100', text: 'text-pink-700' },
  { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  { bg: 'bg-orange-100', text: 'text-orange-700' },
  { bg: 'bg-violet-100', text: 'text-violet-700' },
];

function formatEGP(n) {
  return `EGP ${Number(n || 0).toLocaleString('en-US')}`;
}

function BookIcon() {
  return (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20" />
    </svg>
  );
}

/* ── Base / Fallback seed curriculum books ── */
const baseKindergarten = {
  id: 'kindergarten',
  icon: '🧸',
  title: 'Kindergarten',
  titleAr: 'رياض الأطفال',
  subtitle: 'KG 1 · KG 2',
  subtitleAr: 'المستوى ١ · المستوى ٢',
  accent: {
    border: 'border-pink-500',
    iconBg: 'bg-pink-500/15 text-pink-400',
    tabActive: 'bg-pink-500 text-white',
    text: 'text-pink-400',
    priceText: 'text-pink-400',
  },
  tabs: [
    { id: 'kg1', label: 'KG 1', labelAr: 'كي جي ١' },
    { id: 'kg2', label: 'KG 2', labelAr: 'كي جي ٢' },
  ],
  defaultTab: 'kg1',
  booksByTab: {
    kg1: [
      { id: 'kg1-arabic', name: 'Arabic for KG 1', nameAr: 'اللغة العربية كي جي ١', subject: 'Arabic', subjectAr: 'عربي', price: 45, gradeLabel: 'KG 1', gradeLabelAr: 'كي جي ١' },
      { id: 'kg1-math', name: 'Math for KG 1', nameAr: 'الحساب كي جي ١', subject: 'Mathematics', subjectAr: 'حساب', price: 45, gradeLabel: 'KG 1', gradeLabelAr: 'كي جي ١' },
      { id: 'kg1-connect', name: 'Connect English KG 1', nameAr: 'كونكت إنجليزي كي جي ١', subject: 'English', subjectAr: 'إنجليزي', price: 50, gradeLabel: 'KG 1', gradeLabelAr: 'كي جي ١' },
      { id: 'kg1-discover', name: 'Discover KG 1', nameAr: 'اكتشف كي جي ١', subject: 'Discover', subjectAr: 'اكتشف', price: 40, gradeLabel: 'KG 1', gradeLabelAr: 'كي جي ١' },
      { id: 'kg1-art', name: 'Art & Coloring KG 1', nameAr: 'تلوين ورسم كي جي ١', subject: 'Activity', subjectAr: 'أنشطة', price: 35, gradeLabel: 'KG 1', gradeLabelAr: 'كي جي ١' },
      { id: 'kg1-phonics', name: 'Phonics Starter KG 1', nameAr: 'فونكس كي جي ١', subject: 'English', subjectAr: 'إنجليزي', price: 48, gradeLabel: 'KG 1', gradeLabelAr: 'كي جي ١' },
    ],
    kg2: [],
  },
};

const basePrimaryLower = {
  id: 'primaryLower',
  icon: '🌱',
  title: 'Primary — Lower',
  titleAr: 'الابتدائية — الصفوف الأولى',
  subtitle: 'Grades 1 · 2 · 3',
  subtitleAr: 'الصفوف ١ · ٢ · ٣',
  accent: {
    border: 'border-sky-500',
    iconBg: 'bg-sky-500/15 text-sky-400',
    tabActive: 'bg-sky-500 text-white',
    text: 'text-sky-400',
    priceText: 'text-sky-400',
  },
  tabs: [
    { id: 'grade1', label: 'Grade 1', labelAr: 'الصف الأول' },
    { id: 'grade2', label: 'Grade 2', labelAr: 'الصف الثاني' },
    { id: 'grade3', label: 'Grade 3', labelAr: 'الصف الثالث' },
  ],
  defaultTab: 'grade1',
  booksByTab: {
    grade1: [
      { id: 'pl-arabic1', name: 'Arabic Language 1', nameAr: 'اللغة العربية ١', subject: 'Arabic', subjectAr: 'عربي', price: 55, gradeLabel: 'Grade 1', gradeLabelAr: 'الصف الأول' },
      { id: 'pl-math1', name: 'Mathematics 1', nameAr: 'الرياضيات ١', subject: 'Mathematics', subjectAr: 'رياضيات', price: 55, gradeLabel: 'Grade 1', gradeLabelAr: 'الصف الأول' },
      { id: 'pl-connect1', name: 'Connect English 1', nameAr: 'كونكت إنجليزي ١', subject: 'English', subjectAr: 'إنجليزي', price: 60, gradeLabel: 'Grade 1', gradeLabelAr: 'الصف الأول' },
      { id: 'pl-discover1', name: 'Discover 1', nameAr: 'اكتشف ١', subject: 'Discover', subjectAr: 'اكتشف', price: 50, gradeLabel: 'Grade 1', gradeLabelAr: 'الصف الأول' },
      { id: 'pl-religion1', name: 'Islamic / Christian 1', nameAr: 'التربية الدينية ١', subject: 'Religion', subjectAr: 'تربية دينية', price: 40, gradeLabel: 'Grade 1', gradeLabelAr: 'الصف الأول' },
      { id: 'pl-values1', name: 'Values & Ethics 1', nameAr: 'القيم والأخلاق ١', subject: 'Values', subjectAr: 'قيم وأخلاق', price: 42, gradeLabel: 'Grade 1', gradeLabelAr: 'الصف الأول' },
    ],
    grade2: [],
    grade3: [],
  },
};

const basePrimaryUpper = {
  id: 'primaryUpper',
  icon: '📘',
  title: 'Primary — Upper',
  titleAr: 'الابتدائية — الصفوف العليا',
  subtitle: 'Grades 4 · 5 · 6',
  subtitleAr: 'الصفوف ٤ · ٥ · ٦',
  accent: {
    border: 'border-emerald-500',
    iconBg: 'bg-emerald-500/15 text-emerald-400',
    tabActive: 'bg-emerald-500 text-white',
    text: 'text-emerald-400',
    priceText: 'text-emerald-400',
  },
  tabs: [
    { id: 'grade4', label: 'Grade 4', labelAr: 'الصف الرابع' },
    { id: 'grade5', label: 'Grade 5', labelAr: 'الصف الخامس' },
    { id: 'grade6', label: 'Grade 6', labelAr: 'الصف السادس' },
  ],
  defaultTab: 'grade4',
  booksByTab: {
    grade4: [
      { id: 'pu-arabic4', name: 'Arabic Language 4', nameAr: 'اللغة العربية ٤', subject: 'Arabic', subjectAr: 'عربي', price: 65, gradeLabel: 'Grade 4', gradeLabelAr: 'الصف الرابع' },
      { id: 'pu-math4', name: 'Mathematics 4', nameAr: 'الرياضيات ٤', subject: 'Mathematics', subjectAr: 'رياضيات', price: 62, gradeLabel: 'Grade 4', gradeLabelAr: 'الصف الرابع' },
      { id: 'pu-science4', name: 'Science 4', nameAr: 'العلوم ٤', subject: 'Science', subjectAr: 'علوم', price: 60, gradeLabel: 'Grade 4', gradeLabelAr: 'الصف الرابع' },
      { id: 'pu-eng4', name: 'English 4', nameAr: 'اللغة الإنجليزية ٤', subject: 'English', subjectAr: 'إنجليزي', price: 68, gradeLabel: 'Grade 4', gradeLabelAr: 'الصف الرابع' },
      { id: 'pu-social4', name: 'Social Studies 4', nameAr: 'الدراسات الاجتماعية ٤', subject: 'Social', subjectAr: 'دراسات', price: 55, gradeLabel: 'Grade 4', gradeLabelAr: 'الصف الرابع' },
      { id: 'pu-tech4', name: 'Technology 4', nameAr: 'تكنولوجيا المعلومات ٤', subject: 'ICT', subjectAr: 'تكنولوجيا', price: 58, gradeLabel: 'Grade 4', gradeLabelAr: 'الصف الرابع' },
    ],
    grade5: [],
    grade6: [],
  },
};

const basePreparatory = {
  id: 'preparatory',
  icon: '📙',
  title: 'Preparatory',
  titleAr: 'المرحلة الإعدادية',
  subtitle: 'Prep 1 · 2 · 3',
  subtitleAr: 'الصفوف ١ · ٢ · ٣ إعدادي',
  accent: {
    border: 'border-orange-500',
    iconBg: 'bg-orange-500/15 text-orange-400',
    tabActive: 'bg-orange-500 text-white',
    text: 'text-orange-400',
    priceText: 'text-orange-400',
  },
  tabs: [
    { id: 'prep1', label: 'Prep 1', labelAr: 'أولى إعدادي' },
    { id: 'prep2', label: 'Prep 2', labelAr: 'تانية إعدادي' },
    { id: 'prep3', label: 'Prep 3', labelAr: 'تالتة إعدادي' },
  ],
  defaultTab: 'prep1',
  booksByTab: {
    prep1: [
      { id: 'prep-arabic1', name: 'Arabic Language P1', nameAr: 'اللغة العربية ١ إعدادي', subject: 'Arabic', subjectAr: 'عربي', price: 75, gradeLabel: 'Prep 1', gradeLabelAr: '١ إعدادي' },
      { id: 'prep-algebra1', name: 'Algebra & Geometry P1', nameAr: 'الجبر والهندسة ١ إعدادي', subject: 'Mathematics', subjectAr: 'رياضيات', price: 72, gradeLabel: 'Prep 1', gradeLabelAr: '١ إعدادي' },
      { id: 'prep-science1', name: 'Science P1', nameAr: 'العلوم ١ إعدادي', subject: 'Science', subjectAr: 'علوم', price: 70, gradeLabel: 'Prep 1', gradeLabelAr: '١ إعدادي' },
      { id: 'prep-eng1', name: 'English P1', nameAr: 'اللغة الإنجليزية ١ إعدادي', subject: 'English', subjectAr: 'إنجليزي', price: 78, gradeLabel: 'Prep 1', gradeLabelAr: '١ إعدادي' },
      { id: 'prep-history1', name: 'History & Geography P1', nameAr: 'الدراسات الاجتماعية ١ إعدادي', subject: 'Social', subjectAr: 'دراسات', price: 65, gradeLabel: 'Prep 1', gradeLabelAr: '١ إعدادي' },
      { id: 'prep-ict1', name: 'ICT & Computing P1', nameAr: 'الكمبيوتر وتكنولوجيا المعلومات ١ إعدادي', subject: 'Computing', subjectAr: 'حاسب آلي', price: 68, gradeLabel: 'Prep 1', gradeLabelAr: '١ إعدادي' },
    ],
    prep2: [],
    prep3: [],
  },
};

const baseSecondary = {
  id: 'secondary',
  icon: '🎓',
  title: 'Secondary',
  titleAr: 'المرحلة الثانوية',
  subtitle: 'Sec 1 · 2 · 3',
  subtitleAr: 'الصفوف ١ · ٢ · ٣ ثانوي',
  accent: {
    border: 'border-[#c53938]',
    iconBg: 'bg-[#c53938]/15 text-[#ef5350]',
    tabActive: 'bg-[#c53938] text-white',
    text: 'text-[#ef5350]',
    priceText: 'text-[#ef5350]',
  },
  tabs: [
    { id: 'sec1', label: 'Sec 1', labelAr: 'أولى ثانوي' },
    { id: 'sec2', label: 'Sec 2', labelAr: 'تانية ثانوي' },
    { id: 'sec3', label: 'Sec 3', labelAr: 'تالتة ثانوي' },
  ],
  defaultTab: 'sec1',
  booksByTab: {
    sec1: [
      { id: 'sec-arabic1', name: 'Arabic Literature S1', nameAr: 'اللغة العربية ١ ثانوي', subject: 'Arabic', subjectAr: 'عربي', price: 88, gradeLabel: 'Sec 1', gradeLabelAr: '١ ثانوي' },
      { id: 'sec-math1', name: 'Pure Math S1', nameAr: 'الرياضيات البحتة ١ ثانوي', subject: 'Mathematics', subjectAr: 'رياضيات', price: 85, gradeLabel: 'Sec 1', gradeLabelAr: '١ ثانوي' },
      { id: 'sec-physics1', name: 'Physics S1', nameAr: 'الفيزياء ١ ثانوي', subject: 'Physics', subjectAr: 'فيزياء', price: 82, gradeLabel: 'Sec 1', gradeLabelAr: '١ ثانوي' },
      { id: 'sec-chem1', name: 'Chemistry S1', nameAr: 'الكيمياء ١ ثانوي', subject: 'Chemistry', subjectAr: 'كيمياء', price: 92, gradeLabel: 'Sec 1', gradeLabelAr: '١ ثانوي' },
      { id: 'sec-bio1', name: 'Biology S1', nameAr: 'الأحياء ١ ثانوي', subject: 'Biology', subjectAr: 'أحياء', price: 80, gradeLabel: 'Sec 1', gradeLabelAr: '١ ثانوي' },
      { id: 'sec-eng1', name: 'English S1', nameAr: 'اللغة الإنجليزية ١ ثانوي', subject: 'English', subjectAr: 'إنجليزي', price: 90, gradeLabel: 'Sec 1', gradeLabelAr: '١ ثانوي' },
    ],
    sec2: [],
    sec3: [],
  },
};

const BASE_SECTIONS = [baseKindergarten, basePrimaryLower, basePrimaryUpper, basePreparatory, baseSecondary];

/* ── Individual Book Card ── */
function SchoolBookCard({ book, index, accent, lang }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const palette = CARD_PALETTE[index % CARD_PALETTE.length];
  const isSaved = isInWishlist(book._id || book.id);
  const displayName = lang === 'ar' ? (book.nameAr || book.name) : book.name;
  const displaySubject = lang === 'ar' ? (book.subjectAr || book.subject || book.description || '') : (book.subject || book.description || '');
  const displayGrade = lang === 'ar' ? (book.gradeLabelAr || book.gradeLabel || '') : (book.gradeLabel || '');
  const bookImg = book.images?.[0] || book.image || '';

  const handleAddToCart = () => {
    addToCart({
      ...book,
      id: book._id || book.id,
      name: displayName,
      price: Number(book.price || 0),
      image: bookImg,
      category: 'school-books',
    });
  };

  return (
    <div className="group flex flex-col transition duration-200 hover:-translate-y-1">
      {/* Thumbnail area */}
      <div className="relative mb-2 aspect-square w-full rounded-xl overflow-hidden border border-[var(--soft-border-color)] bg-[var(--surface-soft)]">
        {bookImg ? (
          <img
            src={bookImg}
            alt={displayName}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className={`flex h-full w-full flex-col items-center justify-center gap-1.5 p-3 text-center ${palette.bg} ${palette.text}`}>
            <BookIcon />
            <span className="text-[11px] font-bold leading-tight line-clamp-2 px-1">{displayName}</span>
          </div>
        )}

        {/* Heart / Wishlist button */}
        <button
          type="button"
          onClick={() => toggleWishlist(book)}
          aria-label={isSaved ? (lang === 'ar' ? 'إزالة من المفضلة' : 'Remove from Wishlist') : (lang === 'ar' ? 'إضافة إلى المفضلة' : 'Add to Wishlist')}
          title={isSaved ? (lang === 'ar' ? 'إزالة من المفضلة' : 'Remove from Wishlist') : (lang === 'ar' ? 'إضافة إلى المفضلة' : 'Add to Wishlist')}
          className="absolute ltr:right-2 rtl:left-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 shadow-sm transition hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-xs"
        >
          <Heart
            size={14}
            className={isSaved ? 'fill-[#c53938] text-[#c53938]' : 'text-gray-500 hover:text-[#c53938]'}
          />
        </button>

        {/* Grade badge */}
        {displayGrade && (
          <span className={`absolute bottom-2 ltr:left-2 rtl:right-2 rounded-full px-2 py-0.5 text-[9px] font-bold shadow-xs ${accent.tabActive}`}>
            {displayGrade}
          </span>
        )}

        {/* Dynamic new badge for DB books */}
        {book.isDbBook && (
          <span className="absolute top-2 ltr:left-2 rtl:right-2 rounded-full bg-emerald-500 text-white px-1.5 py-0.5 text-[9px] font-bold shadow-xs flex items-center gap-0.5">
            <Sparkles size={10} />
            <span>{lang === 'ar' ? 'جديد' : 'NEW'}</span>
          </span>
        )}
      </div>

      {/* Info */}
      <p className="truncate text-xs font-semibold text-[var(--primary-text)] group-hover:text-[#c53938] transition-colors" title={displayName}>
        {displayName}
      </p>
      {displaySubject && (
        <p className="truncate text-[11px] text-[var(--secondary-text)]">{displaySubject}</p>
      )}

      {/* Price + Add to cart */}
      <div className="mt-1.5 flex items-center justify-between">
        <span className={`text-sm font-bold ${accent.priceText}`}>{formatEGP(book.price)}</span>
        <button
          type="button"
          onClick={handleAddToCart}
          aria-label={`Add ${displayName} to cart`}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-[#c53938] text-white shadow-2xs transition-all duration-200 hover:bg-[#a82e2d] hover:scale-110 active:scale-95 cursor-pointer"
        >
          <Plus size={14} className="stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
}

/* ── Reusable grade-level section ── */
function GradeLevelSection({ id, icon, title, titleAr, subtitle, subtitleAr, accent, tabs, booksByTab, defaultTab, lang }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const books = booksByTab[activeTab] ?? [];

  return (
    <section
      id={id}
      className={`scroll-mt-24 rounded-2xl border-t-4 ${accent.border} border-x border-b border-[var(--soft-border-color)] bg-[var(--surface-bg)] p-5 sm:p-6 text-start shadow-xs transition-shadow hover:shadow-sm`}
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className={`flex h-10 w-10 items-center justify-center rounded-full text-lg ${accent.iconBg}`}>
            {icon}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-base font-bold text-[var(--primary-text)]">{lang === 'ar' ? (titleAr || title) : title}</p>
              <span className="rounded-full bg-[var(--surface-soft)] px-2 py-0.5 text-[10px] font-semibold text-[var(--secondary-text)]">
                {Object.values(booksByTab).reduce((sum, list) => sum + (list?.length || 0), 0)} {lang === 'ar' ? 'كتاب' : 'books'}
              </span>
            </div>
            <p className={`text-xs ${accent.text}`}>{lang === 'ar' ? (subtitleAr || subtitle) : subtitle}</p>
          </div>
        </div>

        {/* Tab Buttons (e.g. Prep 1, Prep 2, Prep 3) */}
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const count = (booksByTab[tab.id] || []).length;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition cursor-pointer ${
                  isActive
                    ? accent.tabActive
                    : 'border border-[var(--soft-border-color)] text-[var(--secondary-text)] hover:text-[var(--primary-text)] hover:bg-[var(--surface-soft)]'
                }`}
              >
                <span>{lang === 'ar' ? (tab.labelAr || tab.label) : tab.label}</span>
                <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${isActive ? 'bg-white/25 text-white' : 'bg-[var(--surface-soft)] text-[var(--secondary-text)]'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {books.length === 0 ? (
        <div className="py-12 text-center rounded-xl border border-dashed border-[var(--soft-border-color)] bg-[var(--surface-soft)]/30">
          <BookOpen className="mx-auto h-8 w-8 text-[var(--muted-text)] mb-2 opacity-60" />
          <p className="text-sm font-medium text-[var(--primary-text)]">
            {lang === 'ar' ? 'كتب هذا الصف ستتوفر قريباً' : 'Books for this grade are coming soon'}
          </p>
          <p className="text-xs text-[var(--secondary-text)] mt-1">
            {lang === 'ar' ? 'تابعنا باستمرار حيث نقوم بإضافة أحدث الطبعات المدرسية الخارجية أولاً بأول.' : 'Check back regularly as new editions are added continuously.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {books.map((book, i) => (
            <SchoolBookCard
              key={book._id || book.id || `${book.name}-${i}`}
              book={book}
              index={i}
              accent={accent}
              lang={lang}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default function ExternalSchoolBooksPage() {
  const { lang } = useLanguage();
  const [dbBooks, setDbBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch real school books from backend
  useEffect(() => {
    setIsLoading(true);
    productApi.getProducts({ category: 'school-books', limit: 100 })
      .then((data) => {
        setDbBooks(data.products || []);
      })
      .catch((err) => {
        console.error('Failed to load school books from API:', err);
        setDbBooks([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Merge database books into their corresponding stages and tabs
  const sections = useMemo(() => {
    return BASE_SECTIONS.map((sec) => {
      const updatedBooksByTab = { ...sec.booksByTab };

      sec.tabs.forEach((tab) => {
        // Find matching dynamic books from backend
        const matchingDbBooks = dbBooks
          .filter((b) => {
            const normalized = normalizeBookGrade(b);
            return normalized === tab.id;
          })
          .map((b) => {
            const gradeInfo = getGradeById(tab.id);
            return {
              id: b._id || b.id,
              _id: b._id || b.id,
              name: b.name,
              nameAr: b.name,
              subject: b.subject || b.description || '',
              subjectAr: b.subject || b.description || '',
              price: b.price,
              originalPrice: b.originalPrice,
              image: b.images?.[0] || b.image || '',
              images: b.images || [],
              gradeLabel: gradeInfo ? (lang === 'ar' ? gradeInfo.shortLabelAr : gradeInfo.shortLabelEn) : tab.label,
              gradeLabelAr: gradeInfo ? gradeInfo.shortLabelAr : tab.labelAr,
              stock: b.stock,
              isDbBook: true,
            };
          });

        // Filter out duplicate seed books if a DB product has the exact same name or ID
        const existingSeedBooks = (sec.booksByTab[tab.id] || []).filter(
          (seed) => !matchingDbBooks.some((db) => db.name.toLowerCase().trim() === seed.name.toLowerCase().trim())
        );

        // Put DB books FIRST so freshly added admin books appear at the top!
        updatedBooksByTab[tab.id] = [...matchingDbBooks, ...existingSeedBooks];
      });

      return {
        ...sec,
        booksByTab: updatedBooksByTab,
      };
    });
  }, [dbBooks, lang]);

  // Compute total books across all stages
  const totalBooksCount = useMemo(() => {
    let count = 0;
    sections.forEach((sec) => {
      Object.values(sec.booksByTab).forEach((list) => {
        count += list?.length || 0;
      });
    });
    return count;
  }, [sections]);

  // Search filter across all books
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    const matches = [];
    sections.forEach((sec) => {
      Object.entries(sec.booksByTab).forEach(([, books]) => {
        books.forEach((b) => {
          const matchName = (b.name || '').toLowerCase().includes(q);
          const matchNameAr = (b.nameAr || '').toLowerCase().includes(q);
          const matchSub = (b.subject || '').toLowerCase().includes(q);
          const matchSubAr = (b.subjectAr || '').toLowerCase().includes(q);
          const matchGrade = (b.gradeLabel || '').toLowerCase().includes(q);
          const matchGradeAr = (b.gradeLabelAr || '').toLowerCase().includes(q);

          if (matchName || matchNameAr || matchSub || matchSubAr || matchGrade || matchGradeAr) {
            if (!matches.some((m) => (m._id || m.id) === (b._id || b.id))) {
              matches.push({ ...b, accent: sec.accent });
            }
          }
        });
      });
    });
    return matches;
  }, [searchQuery, sections]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--page-bg)] text-[var(--primary-text)]">
      <Helmet>
        <title>{lang === 'ar' ? 'الكتب الخارجية المدرسية' : 'External School Books'} | El-D7E7</title>
        <meta
          name="description"
          content={lang === 'ar' ? 'جميع كتب المناهج الرسمية لكافة المراحل — من رياض الأطفال وحتى الثانوية — تصلك حتى باب البيت.' : 'All official curriculum books for every stage — from KG to Thanawy — delivered to your door.'}
        />
      </Helmet>

      <AnnouncementBar />
      <Header />
      <Navigation />

      <main>
        {/* ── Hero ── */}
        <section className="mx-auto flex max-w-[1280px] flex-col items-center px-5 pb-6 pt-12 text-center sm:px-8">
          <div className="inline-flex items-center gap-2 mb-4 rounded-full border border-[var(--soft-border-color)] bg-[var(--surface-bg)] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--secondary-text)]">
            <BookOpen size={14} className="text-[#c53938]" />
            <span>{lang === 'ar' ? 'الكتب الخارجية والمدرسية' : 'External School Books'}</span>
            <span className="h-1 w-1 rounded-full bg-[#c53938]" />
            <span className="text-[#c53938] font-bold">{totalBooksCount} {lang === 'ar' ? 'كتاب متوفر' : 'books available'}</span>
          </div>

          <h1 className="text-3xl font-extrabold text-[var(--primary-text)] sm:text-4xl lg:text-5xl tracking-tight">
            {lang === 'ar' ? (
              <>تسوق حسب <span className="text-[#c53938]">المرحلة والصف الدراسي</span></>
            ) : (
              <>Shop by <span className="text-[#c53938]">Stage & Grade Level</span></>
            )}
          </h1>

          <p className="mt-3 max-w-xl text-sm sm:text-base text-[var(--secondary-text)]">
            {lang === 'ar'
              ? 'جميع كتب المناهج الخارجية الرسمية (المعاصر، الأضواء، سلاح التلميذ، الامتحان...) لكافة المراحل — ابتدائي، إعدادي، وثانوي.'
              : 'All official curriculum books for every educational stage — Primary, Preparatory, and Secondary — delivered straight to your door.'}
          </p>

          {/* ── Search Bar ── */}
          <div className="mt-6 w-full max-w-md relative">
            <Search className="pointer-events-none absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--secondary-text)]" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'ar' ? 'ابحث باسم الكتاب، المادة، أو الصف (مثال: المعاصر، رياضيات، أولى إعدادي)...' : 'Search by book title, subject, or grade (e.g. Math, Prep 1)...'}
              className="h-11 w-full rounded-full border border-[var(--border-color)] bg-[var(--surface-bg)] ltr:pl-11 ltr:pr-4 rtl:pr-11 rtl:pl-4 text-sm text-[var(--primary-text)] placeholder-[var(--secondary-text)] shadow-xs outline-none focus:border-[#c53938] focus:ring-2 focus:ring-[#c53938]/20 transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute ltr:right-3 rtl:left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[var(--secondary-text)] hover:text-[#c53938] cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* ── Stage Quick Jump Links ── */}
          {!searchQuery && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs font-semibold text-[var(--muted-text)] ltr:mr-1 rtl:ml-1">
                {lang === 'ar' ? 'الانتقال السريع:' : 'Quick Jump:'}
              </span>
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--soft-border-color)] bg-[var(--surface-bg)] px-3.5 py-1 text-xs font-medium text-[var(--secondary-text)] transition hover:border-[#c53938] hover:text-[#c53938] hover:shadow-xs cursor-pointer"
                >
                  <span>{s.icon}</span>
                  <span>{lang === 'ar' ? (s.titleAr || s.title) : s.title}</span>
                </a>
              ))}
            </div>
          )}
        </section>

        {/* ── Search Results View ── */}
        {searchQuery ? (
          <section className="mx-auto max-w-[1280px] px-5 pb-16 sm:px-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[var(--primary-text)]">
                  {lang === 'ar' ? `نتائج البحث عن "${searchQuery}"` : `Search results for "${searchQuery}"`}
                </h2>
                <p className="text-xs text-[var(--secondary-text)] mt-0.5">
                  {searchResults.length} {lang === 'ar' ? 'كتاب مطابق' : 'matching books'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs font-semibold text-[#c53938] hover:underline cursor-pointer"
              >
                {lang === 'ar' ? 'عرض كل المراحل' : 'Clear and view all stages'}
              </button>
            </div>

            {searchResults.length === 0 ? (
              <div className="py-16 text-center rounded-2xl border border-dashed border-[var(--border-color)] bg-[var(--surface-bg)]">
                <p className="text-base font-semibold text-[var(--primary-text)]">
                  {lang === 'ar' ? 'لم يتم العثور على كتب مطابقة' : 'No matching books found'}
                </p>
                <p className="text-xs text-[var(--secondary-text)] mt-1">
                  {lang === 'ar' ? 'جرب البحث بكلمات أخرى أو تصفح المراحل الدراسية بالأسفل.' : 'Try different search terms or browse by grade level below.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {searchResults.map((book, i) => (
                  <SchoolBookCard
                    key={book._id || book.id || `${book.name}-${i}`}
                    book={book}
                    index={i}
                    accent={book.accent || { tabActive: 'bg-[#c53938] text-white', priceText: 'text-[#c53938]' }}
                    lang={lang}
                  />
                ))}
              </div>
            )}
          </section>
        ) : (
          /* ── Stacked grade-level sections ── */
          <section className="mx-auto flex max-w-[1280px] flex-col gap-6 px-5 pb-16 sm:px-8">
            {isLoading ? (
              <div className="py-12 text-center text-sm text-[var(--muted-text)]">
                <span className="animate-pulse">{lang === 'ar' ? 'جارٍ تحميل الكتب المدرسية…' : 'Loading school books…'}</span>
              </div>
            ) : (
              sections.map((s) => (
                <GradeLevelSection key={s.id || s.title} {...s} lang={lang} />
              ))
            )}
          </section>
        )}

        <Footer />
      </main>
    </div>
  );
}
