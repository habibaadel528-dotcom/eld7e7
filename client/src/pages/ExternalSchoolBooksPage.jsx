import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

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

/* ── Reusable grade-level section — each instance owns its own active-tab state ── */
function GradeLevelSection({ icon, title, subtitle, accent, tabs, booksByTab, defaultTab }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const books = booksByTab[activeTab] ?? [];

  return (
    <section
      className={`rounded-2xl border-t-2 ${accent.border} border-x border-b border-[var(--soft-border-color)] bg-[var(--surface-bg)] p-5 sm:p-6`}
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className={`flex h-9 w-9 items-center justify-center rounded-full text-base ${accent.iconBg}`}>
            {icon}
          </span>
          <div>
            <p className="text-sm font-semibold text-[var(--primary-text)]">{title}</p>
            <p className={`text-xs ${accent.text}`}>{subtitle}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                activeTab === tab.id
                  ? accent.tabActive
                  : 'border border-[var(--soft-border-color)] text-[var(--secondary-text)] hover:text-[var(--primary-text)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {books.length === 0 ? (
        <p className="py-8 text-center text-sm text-[var(--secondary-text)]">
          Books for this grade are coming soon.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {books.map((book, i) => {
            const palette = CARD_PALETTE[i % CARD_PALETTE.length];
            return (
              <div key={book.id} className="flex flex-col">
                <div className={`relative mb-2 flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-xl px-2 text-center ${palette.bg} ${palette.text}`}>
                  <BookIcon />
                  <span className="text-[11px] font-bold leading-tight">{book.name}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${accent.tabActive}`}>
                    {book.gradeLabel}
                  </span>
                </div>

                <p className="truncate text-xs font-semibold text-[var(--primary-text)]">{book.name}</p>
                <p className="truncate text-[11px] text-[var(--secondary-text)]">{book.subject}</p>

                <div className="mt-1.5 flex items-center justify-between">
                  <span className={`text-sm font-bold ${accent.priceText}`}>{formatEGP(book.price)}</span>
                  <button
                    type="button"
                    aria-label={`Add ${book.name} to cart`}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--page-bg)] text-[var(--primary-text)] transition hover:opacity-90"
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" d="M12 5v14M5 12h14" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-4 flex justify-end">
        <a href="#" className={`flex items-center gap-1 text-xs font-semibold hover:underline ${accent.text}`}>
          View all {title} books
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
          </svg>
        </a>
      </div>
    </section>
  );
}

/* ── Section configs ── */
const kindergarten = {
  icon: '🍎',
  title: 'Kindergarten',
  subtitle: 'KG Level',
  accent: {
    border: 'border-violet-500',
    iconBg: 'bg-violet-500/15 text-violet-400',
    tabActive: 'bg-violet-500 text-white',
    text: 'text-violet-400',
    priceText: 'text-violet-400',
  },
  tabs: [
    { id: 'pre-nursery', label: 'Pre-Nursery' },
    { id: 'kg1', label: 'KG1' },
    { id: 'kg2', label: 'KG2' },
  ],
  defaultTab: 'pre-nursery',
  booksByTab: {
    'pre-nursery': [
      { id: 'kg-alphabet', name: 'My First Alphabet', subject: 'Arabic & English', price: 45, gradeLabel: 'KG1' },
      { id: 'kg-numbers', name: 'Number Fun', subject: 'Mathematics', price: 40, gradeLabel: 'KG1' },
      { id: 'kg-colors', name: 'Colors & Shapes', subject: 'Art & Drawing', price: 35, gradeLabel: 'KG1' },
      { id: 'kg-stories', name: 'Stories for Kids', subject: 'Reading', price: 38, gradeLabel: 'KG1' },
      { id: 'kg-health', name: 'My Body & Health', subject: 'Science', price: 42, gradeLabel: 'KG1' },
      { id: 'kg-songs', name: 'Sing & Learn', subject: 'Music & Songs', price: 30, gradeLabel: 'KG1' },
    ],
    kg1: [],
    kg2: [],
  },
};

const primaryLower = {
  icon: '📗',
  title: 'Primary — Lower',
  subtitle: 'Grades 1 · 2 · 3',
  accent: {
    border: 'border-blue-500',
    iconBg: 'bg-blue-500/15 text-blue-400',
    tabActive: 'bg-blue-500 text-white',
    text: 'text-blue-400',
    priceText: 'text-blue-400',
  },
  tabs: [
    { id: 'grade1', label: 'Grade 1' },
    { id: 'grade2', label: 'Grade 2' },
    { id: 'grade3', label: 'Grade 3' },
  ],
  defaultTab: 'grade1',
  booksByTab: {
    grade1: [
      { id: 'pl-arabic1', name: 'Arabic Language 1', subject: 'Arabic', price: 55, gradeLabel: 'Grade 1' },
      { id: 'pl-math1', name: 'Math Basics 1', subject: 'Mathematics', price: 52, gradeLabel: 'Grade 1' },
      { id: 'pl-env1', name: 'My Environment 1', subject: 'Science', price: 50, gradeLabel: 'Grade 1' },
      { id: 'pl-eng1', name: 'English for All 1', subject: 'English', price: 58, gradeLabel: 'Grade 1' },
      { id: 'pl-islamic1', name: 'Islamic Studies 1', subject: 'Religion', price: 45, gradeLabel: 'Grade 1' },
      { id: 'pl-social1', name: 'Social Studies 1', subject: 'Social', price: 48, gradeLabel: 'Grade 1' },
    ],
    grade2: [],
    grade3: [],
  },
};

const primaryUpper = {
  icon: '📘',
  title: 'Primary — Upper',
  subtitle: 'Grades 4 · 5 · 6',
  accent: {
    border: 'border-emerald-500',
    iconBg: 'bg-emerald-500/15 text-emerald-400',
    tabActive: 'bg-emerald-500 text-white',
    text: 'text-emerald-400',
    priceText: 'text-emerald-400',
  },
  tabs: [
    { id: 'grade4', label: 'Grade 4' },
    { id: 'grade5', label: 'Grade 5' },
    { id: 'grade6', label: 'Grade 6' },
  ],
  defaultTab: 'grade4',
  booksByTab: {
    grade4: [
      { id: 'pu-arabic4', name: 'Arabic Language 4', subject: 'Arabic', price: 65, gradeLabel: 'Grade 4' },
      { id: 'pu-math4', name: 'Mathematics 4', subject: 'Mathematics', price: 62, gradeLabel: 'Grade 4' },
      { id: 'pu-science4', name: 'Science 4', subject: 'Science', price: 60, gradeLabel: 'Grade 4' },
      { id: 'pu-eng4', name: 'English 4', subject: 'English', price: 68, gradeLabel: 'Grade 4' },
      { id: 'pu-social4', name: 'Social Studies 4', subject: 'Social', price: 55, gradeLabel: 'Grade 4' },
      { id: 'pu-tech4', name: 'Technology 4', subject: 'ICT', price: 58, gradeLabel: 'Grade 4' },
    ],
    grade5: [],
    grade6: [],
  },
};

const preparatory = {
  icon: '📙',
  title: 'Preparatory',
  subtitle: 'Prep 1 · 2 · 3',
  accent: {
    border: 'border-orange-500',
    iconBg: 'bg-orange-500/15 text-orange-400',
    tabActive: 'bg-orange-500 text-white',
    text: 'text-orange-400',
    priceText: 'text-orange-400',
  },
  tabs: [
    { id: 'prep1', label: 'Prep 1' },
    { id: 'prep2', label: 'Prep 2' },
    { id: 'prep3', label: 'Prep 3' },
  ],
  defaultTab: 'prep1',
  booksByTab: {
    prep1: [
      { id: 'prep-arabic1', name: 'Arabic Language P1', subject: 'Arabic', price: 75, gradeLabel: 'Prep 1' },
      { id: 'prep-algebra1', name: 'Algebra & Geometry P1', subject: 'Mathematics', price: 72, gradeLabel: 'Prep 1' },
      { id: 'prep-science1', name: 'Science P1', subject: 'Science', price: 70, gradeLabel: 'Prep 1' },
      { id: 'prep-eng1', name: 'English P1', subject: 'English', price: 78, gradeLabel: 'Prep 1' },
      { id: 'prep-history1', name: 'History & Geography P1', subject: 'Social', price: 65, gradeLabel: 'Prep 1' },
      { id: 'prep-ict1', name: 'ICT & Computing P1', subject: 'Computing', price: 68, gradeLabel: 'Prep 1' },
    ],
    prep2: [],
    prep3: [],
  },
};

const secondary = {
  icon: '🎓',
  title: 'Secondary',
  subtitle: 'Sec 1 · 2 · 3',
  accent: {
    border: 'border-[#c53938]',
    iconBg: 'bg-[#c53938]/15 text-[#ef5350]',
    tabActive: 'bg-[#c53938] text-white',
    text: 'text-[#ef5350]',
    priceText: 'text-[#ef5350]',
  },
  tabs: [
    { id: 'sec1', label: 'Sec 1' },
    { id: 'sec2', label: 'Sec 2' },
    { id: 'sec3', label: 'Sec 3' },
  ],
  defaultTab: 'sec1',
  booksByTab: {
    sec1: [
      { id: 'sec-arabic1', name: 'Arabic Literature S1', subject: 'Arabic', price: 88, gradeLabel: 'Sec 1' },
      { id: 'sec-math1', name: 'Pure Math S1', subject: 'Mathematics', price: 85, gradeLabel: 'Sec 1' },
      { id: 'sec-physics1', name: 'Physics S1', subject: 'Physics', price: 82, gradeLabel: 'Sec 1' },
      { id: 'sec-chem1', name: 'Chemistry S1', subject: 'Chemistry', price: 92, gradeLabel: 'Sec 1' },
      { id: 'sec-bio1', name: 'Biology S1', subject: 'Biology', price: 80, gradeLabel: 'Sec 1' },
      { id: 'sec-eng1', name: 'English S1', subject: 'English', price: 90, gradeLabel: 'Sec 1' },
    ],
    sec2: [],
    sec3: [],
  },
};

const sections = [kindergarten, primaryLower, primaryUpper, preparatory, secondary];

export default function ExternalSchoolBooksPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--page-bg)] text-[var(--primary-text)]">
      <Helmet>
        <title>External School Books | El-D7E7</title>
        <meta
          name="description"
          content="All official curriculum books for every stage — from KG to Thanawy — delivered to your door."
        />
      </Helmet>

      <AnnouncementBar />
      <Header />
      <Navigation />

      <main>
        {/* ── Hero ── */}
        <section className="mx-auto flex max-w-[1280px] flex-col items-center px-5 pb-10 pt-14 text-center sm:px-8">
          <span className="mb-4 rounded-full border border-[var(--soft-border-color)] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--secondary-text)]">
            External School Books
          </span>

          <h1 className="text-3xl font-bold text-[var(--primary-text)] sm:text-4xl">
            Shop by <span className="text-[#c53938]">Grade Level</span>
          </h1>

          <p className="mt-3 max-w-lg text-sm text-[var(--secondary-text)]">
            All official curriculum books for every stage — from KG to Thanawy — delivered to your door.
          </p>
        </section>

        {/* ── Stacked grade-level sections ── */}
        <section className="mx-auto flex max-w-[1280px] flex-col gap-5 px-5 pb-10 sm:px-8">
          {sections.map((s) => (
            <GradeLevelSection key={s.title} {...s} />
          ))}
        </section>

        <Footer />
      </main>
    </div>
  );
}
