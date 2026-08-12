import { useState } from 'react';

/* ── Mock data — replace with real API data later ── */
const grades = [
  { id: 'kg', label: 'KG', icon: '🍎', dotColor: 'bg-rose-500' },
  { id: 'primary', label: 'Primary', icon: '📗', dotColor: 'bg-emerald-500' },
  { id: 'preparatory', label: 'Preparatory', icon: '✏️', dotColor: 'bg-amber-500' },
  { id: 'secondary', label: 'Secondary', icon: '🎓', dotColor: 'bg-slate-400' },
];

const kitsByGrade = {
  primary: [
    {
      id: 'science-project-box',
      name: 'Science Project Box',
      itemsCount: 5,
      items: ['Magnifying glass', 'Pipettes', 'Petri dish', 'Lab gloves', 'Report book'],
      price: 145,
      badge: 'Best Seller',
    },
    {
      id: 'nature-journal-kit',
      name: 'Nature Journal Kit',
      itemsCount: 4,
      items: ['Sketchbook A4', 'Watercolors 24', 'Botanical stencils', 'Pencils 12H-B'],
      price: 130,
      badge: null,
    },
    {
      id: 'math-manipulatives-set',
      name: 'Math Manipulatives Set',
      itemsCount: 4,
      items: ['Counting cubes 100pcs', 'Fraction tiles', 'Ruler set', 'Graph paper'],
      price: 110,
      badge: 'New',
    },
    {
      id: 'arabic-calligraphy-set',
      name: 'Arabic Calligraphy Set',
      itemsCount: 4,
      items: ['Qalam pen', 'Ink bottle', 'Tracing sheets', 'Practice booklet'],
      price: 120,
      badge: null,
    },
  ],
  kg: [],
  preparatory: [],
  secondary: [],
};

const badgeStyles = {
  'Best Seller': 'bg-[#c53938] text-white',
  New: 'bg-emerald-500 text-white',
};

function formatEGP(n) {
  return `EGP ${n.toLocaleString('en-US')}`;
}

export default function SchoolProjectsModal({ isOpen, onClose }) {
  const [activeGrade, setActiveGrade] = useState('primary');

  if (!isOpen) return null;

  const kits = kitsByGrade[activeGrade] ?? [];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-[var(--soft-border-color)] bg-[var(--surface-bg)] text-[var(--primary-text)]"
      >
        {/* ── Header ── */}
        <div className="flex items-start justify-between border-b border-[var(--soft-border-color)] p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--page-bg)] text-lg">
              🎒
            </span>
            <div>
              <p className="text-base font-semibold">School Projects</p>
              <p className="text-xs text-[var(--secondary-text)]">
                Curated supply kits for every grade level
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--page-bg)] text-[var(--secondary-text)] transition hover:text-[var(--primary-text)]"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Grade tabs ── */}
        <div className="flex flex-wrap gap-2 p-5 pb-0">
          {grades.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setActiveGrade(g.id)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition ${
                activeGrade === g.id
                  ? 'bg-[#c53938] text-white'
                  : 'border border-[var(--soft-border-color)] text-[var(--secondary-text)] hover:text-[var(--primary-text)]'
              }`}
            >
              <span>{g.icon}</span>
              {g.label}
            </button>
          ))}
        </div>

        {/* ── Kits grid ── */}
        <div className="p-5">
          {kits.length === 0 ? (
            <p className="py-10 text-center text-sm text-[var(--secondary-text)]">
              Kits for this grade level are coming soon.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {kits.map((kit) => (
                <div
                  key={kit.id}
                  className="rounded-xl border-t-2 border-[#c53938] bg-[var(--page-bg)] p-4"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--surface-bg)] text-sm">
                        📗
                      </span>
                      <div>
                        <p className="text-sm font-semibold">{kit.name}</p>
                        <p className="text-xs text-[var(--secondary-text)]">
                          {kit.itemsCount} items included
                        </p>
                      </div>
                    </div>
                    {kit.badge && (
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${badgeStyles[kit.badge]}`}>
                        {kit.badge}
                      </span>
                    )}
                  </div>

                  <ul className="mb-4 space-y-1.5">
                    {kit.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-xs text-[var(--secondary-text)]">
                        <svg className="h-3.5 w-3.5 shrink-0 text-[#c53938]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <circle cx="12" cy="12" r="9" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="m8.5 12.5 2.3 2.3L15.5 10" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-[#c53938]">{formatEGP(kit.price)}</span>
                    <button
                      type="button"
                      className="flex items-center gap-1.5 rounded-full border border-[#c53938]/40 bg-[#c53938]/10 px-3.5 py-2 text-xs font-semibold text-[#ef5350] transition hover:bg-[#c53938]/20"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <circle cx="9" cy="21" r="1" />
                        <circle cx="19" cy="21" r="1" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
                      </svg>
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Footer note ── */}
        <div className="flex items-center gap-2 border-t border-[var(--soft-border-color)] px-5 py-4 text-xs text-[#c53938]">
          <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h11v10H3V7Zm11 3h4l3 3v4h-7v-7ZM6 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm12 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
          </svg>
          All school project kits ship within 24 hours — guaranteed for exam season.
        </div>
      </div>
    </div>
  );
}