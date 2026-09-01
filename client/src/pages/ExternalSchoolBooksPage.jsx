import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Heart, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useLanguage } from '../context/LanguageContext';

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
  return `EGP ${n.toLocaleString('en-US')}`;
}

function BookIcon() {
  return (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20" />
    </svg>
  );
}

/* ── Reusable grade-level section ── */
function GradeLevelSection({ icon, title, titleAr, subtitle, subtitleAr, accent, tabs, booksByTab, defaultTab, lang }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const books = booksByTab[activeTab] ?? [];

  return (
    <section
      className={`rounded-2xl border-t-2 ${accent.border} border-x border-b border-[var(--soft-border-color)] bg-[var(--surface-bg)] p-5 sm:p-6 text-start`}
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className={`flex h-9 w-9 items-center justify-center rounded-full text-base ${accent.iconBg}`}>
            {icon}
          </span>
          <div>
            <p className="text-sm font-semibold text-[var(--primary-text)]">{lang === 'ar' ? (titleAr || title) : title}</p>
            <p className={`text-xs ${accent.text}`}>{lang === 'ar' ? (subtitleAr || subtitle) : subtitle}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                activeTab === tab.id
                  ? accent.tabActive
                  : 'border border-[var(--soft-border-color)] text-[var(--secondary-text)] hover:text-[var(--primary-text)]'
              }`}
            >
              {lang === 'ar' ? (tab.labelAr || tab.label) : tab.label}
            </button>
          ))}
        </div>
      </div>

      {books.length === 0 ? (
        <p className="py-8 text-center text-sm text-[var(--secondary-text)]">
          {lang === 'ar' ? 'كتب هذه المرحلة ستتوفر قريباً.' : 'Books for this grade are coming soon.'}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {books.map((book, i) => {
            const palette = CARD_PALETTE[i % CARD_PALETTE.length];
            const isSaved = isInWishlist(book._id || book.id);
            const displayName = lang === 'ar' ? (book.nameAr || book.name) : book.name;
            const displaySubject = lang === 'ar' ? (book.subjectAr || book.subject) : book.subject;
            const displayGrade = lang === 'ar' ? (book.gradeLabelAr || book.gradeLabel) : book.gradeLabel;

            return (
              <div key={book.id} className="group flex flex-col">
                <div className={`relative mb-2 flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-xl px-2 text-center ${palette.bg} ${palette.text}`}>
                  {/* Heart Icon */}
                  <button
                    type="button"
                    onClick={() => toggleWishlist(book)}
                    aria-label={isSaved ? (lang === 'ar' ? 'إزالة من المفضلة' : 'Remove from Wishlist') : (lang === 'ar' ? 'إضافة إلى المفضلة' : 'Add to Wishlist')}
                    title={isSaved ? (lang === 'ar' ? 'إزالة من المفضلة' : 'Remove from Wishlist') : (lang === 'ar' ? 'إضافة إلى المفضلة' : 'Add to Wishlist')}
                    className="absolute ltr:right-2 rtl:left-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow-sm transition hover:scale-110 cursor-pointer"
                  >
                    <Heart
                      size={14}
                      className={isSaved ? 'fill-[#c53938] text-[#c53938]' : 'text-gray-500 hover:text-[#c53938]'}
                    />
                  </button>

                  <BookIcon />
                  <span className="text-[11px] font-bold leading-tight">{displayName}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${accent.tabActive}`}>
                    {displayGrade}
                  </span>
                </div>

                <p className="truncate text-xs font-semibold text-[var(--primary-text)]">{displayName}</p>
                <p className="truncate text-[11px] text-[var(--secondary-text)]">{displaySubject}</p>

                <div className="mt-1.5 flex items-center justify-between">
                  <span className={`text-sm font-bold ${accent.priceText}`}>{formatEGP(book.price)}</span>
                  <button
                    type="button"
                    onClick={() => addToCart(book)}
                    aria-label={`Add ${displayName} to cart`}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-800 shadow-2xs transition-all duration-200 hover:scale-105 hover:border-[#c53938] hover:bg-[#c53938] hover:text-white active:scale-95 cursor-pointer dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:border-[#c53938] dark:hover:bg-[#c53938]"
                  >
                    <Plus size={14} className="stroke-[2.5]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

const kindergarten = {
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

const primaryLower = {
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

const primaryUpper = {
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

const preparatory = {
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

const secondary = {
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

const sections = [kindergarten, primaryLower, primaryUpper, preparatory, secondary];

export default function ExternalSchoolBooksPage() {
  const { lang } = useLanguage();

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
        <section className="mx-auto flex max-w-[1280px] flex-col items-center px-5 pb-10 pt-14 text-center sm:px-8">
          <span className="mb-4 rounded-full border border-[var(--soft-border-color)] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--secondary-text)]">
            {lang === 'ar' ? 'الكتب الخارجية المدرسية' : 'External School Books'}
          </span>

          <h1 className="text-3xl font-bold text-[var(--primary-text)] sm:text-4xl">
            {lang === 'ar' ? (
              <>تسوق حسب <span className="text-[#c53938]">المرحلة الدراسية</span></>
            ) : (
              <>Shop by <span className="text-[#c53938]">Grade Level</span></>
            )}
          </h1>

          <p className="mt-3 max-w-lg text-sm text-[var(--secondary-text)]">
            {lang === 'ar'
              ? 'جميع كتب المناهج الرسمية لكافة المراحل — من رياض الأطفال وحتى الثانوية — تصلك حتى باب البيت.'
              : 'All official curriculum books for every stage — from KG to Thanawy — delivered to your door.'
            }
          </p>
        </section>

        {/* ── Stacked grade-level sections ── */}
        <section className="mx-auto flex max-w-[1280px] flex-col gap-5 px-5 pb-10 sm:px-8">
          {sections.map((s) => (
            <GradeLevelSection key={s.title} {...s} lang={lang} />
          ))}
        </section>

        <Footer />
      </main>
    </div>
  );
}
