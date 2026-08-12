import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import AnnouncementBar from '../sections/AnnouncementBar';
import Header from '../sections/Header';
import Navigation from '../sections/Navigation';
import Footer from '../sections/Footer';
import SchoolProjectsModal from '../components/SchoolProjectsModal';

/* ── Mock data — replace with real API data later ── */
const categories = [
  { id: 'paper-crafts', label: 'Paper Crafts', icon: 'gift' },
  { id: 'drawing-painting', label: 'Drawing & Painting', icon: 'brush' },
  { id: 'sewing-fabric', label: 'Sewing & Fabric', icon: 'shirt' },
  { id: 'beads-jewelry', label: 'Beads & Jewelry', icon: 'gem' },
  { id: 'clay-sculpting', label: 'Clay & Sculpting', icon: 'droplet' },
  { id: 'tools', label: 'Tools', icon: 'wrench' },
];

const productsByCategory = {
  'paper-crafts': [
    { id: 'cardstock-50', name: 'Cardstock Set 50pcs', description: 'Vivid colors, A4 size', price: 85, badge: 'Best Seller' },
    { id: 'origami-100', name: 'Origami Paper 100pcs', description: 'Classic, Japanese patterns', price: 60, badge: null },
    { id: 'scrapbook-kit', name: 'Scrapbook Kit', description: 'Stickers, tape, and more', price: 120, badge: 'New' },
    { id: 'craft-foam', name: 'Craft Foam Sheets', description: '10 colors, A4 pads', price: 45, badge: null },
    { id: 'glitter-paper', name: 'Glitter Paper Roll', description: 'Gold, Silver, Rose Pink', price: 55, badge: null },
    { id: 'cardboard-panels', name: 'Cardboard Panels', description: 'Durable, sized, thick', price: 70, badge: 'Sale' },
  ],
};

const promoStrips = [
  {
    id: 'starter-kits',
    title: 'Starter Kits',
    subtitle: 'All-in-one bundles for beginners',
    icon: 'gift',
    iconBg: 'bg-orange-500/15 text-orange-400',
  },
  {
    id: 'school-projects',
    title: 'School Projects',
    subtitle: 'Approved supplies for class assignments',
    icon: 'cap',
    iconBg: 'bg-sky-500/15 text-sky-400',
  },
  {
    id: 'bundle-save',
    title: 'Bundle & Save',
    subtitle: 'Mix categories and get up to 30% off',
    icon: 'bag',
    iconBg: 'bg-emerald-500/15 text-emerald-400',
  },
];

const badgeStyles = {
  'Best Seller': 'bg-pink-500 text-white',
  New: 'bg-[#c53938] text-white',
  Sale: 'bg-[#c53938] text-white',
};

/* ── Small icon set (no extra deps) ── */
function CategoryIcon({ type }) {
  const paths = {
    gift: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 12v9H4v-9M2 7h20v5H2V7Zm10 14V7M12 7C10 3 6 3 6 6c0 1 .8 1.5 2 1.5h4Zm0 0c2-4 6-4 6-1 0 1-.8 1.5-2 1.5h-4Z" />
    ),
    brush: (
      <path strokeLinecap="round" strokeLinejoin="round" d="m9 11 6-6 4 4-6 6M9 11 5.5 14.5a2.5 2.5 0 1 0 3 3L12 14M9 11l3 3" />
    ),
    shirt: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 3 4 6l1.5 3L8 8v13h8V8l2.5 1L20 6l-4-3-2 2h-4L8 3Z" />
    ),
    gem: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 3h12l3 5-9 13L3 8l3-5Zm0 0 3 5m9-5-3 5M3 8h18M9 8l3 13 3-13" />
    ),
    droplet: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3s6 6.5 6 10.5a6 6 0 1 1-12 0C6 9.5 12 3 12 3Z" />
    ),
    wrench: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.7 6.3a4 4 0 0 0-5.6 5.1L3 17.5 5.5 20l6.1-6.1a4 4 0 0 0 5.1-5.6l-2.6 2.6-2-2 2.6-2.6Z" />
    ),
    box: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8 12 3 3 8m18 0-9 5m9-5v9l-9 5m0-9L3 8m9 5v9M3 8v9l9 5" />
    ),
  };
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      {paths[type]}
    </svg>
  );
}

function PromoIcon({ type }) {
  const paths = {
    gift: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 12v9H4v-9M2 7h20v5H2V7Zm10 14V7M12 7C10 3 6 3 6 6c0 1 .8 1.5 2 1.5h4Zm0 0c2-4 6-4 6-1 0 1-.8 1.5-2 1.5h-4Z" />
    ),
    cap: (
      <path strokeLinecap="round" strokeLinejoin="round" d="m2 9 10-5 10 5-10 5-10-5Zm4 2.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-4.5M22 9v6" />
    ),
    bag: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12l1 13H5L6 7Zm3 0V5a3 3 0 1 1 6 0v2" />
    ),
  };
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      {paths[type]}
    </svg>
  );
}

function formatEGP(n) {
  return `EGP ${n.toLocaleString('en-US')}`;
}

export default function HandcraftSuppliesPage() {
  const [activeCategory, setActiveCategory] = useState('paper-crafts');
  const [isSchoolProjectsOpen, setIsSchoolProjectsOpen] = useState(false);
  const activeCategoryLabel = useMemo(
    () => categories.find((c) => c.id === activeCategory)?.label ?? '',
    [activeCategory]
  );
  const products = productsByCategory[activeCategory] ?? [];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--page-bg)] text-[var(--primary-text)]">
      <Helmet>
        <title>Handcraft Supplies | El-D7E7</title>
        <meta
          name="description"
          content="Premium art & craft supplies for students, hobbyists, and professional makers."
        />
      </Helmet>

      <AnnouncementBar />
      <Header />
      <Navigation />

      <main>
        {/* ── Hero ── */}
        <section className="mx-auto flex max-w-[1280px] flex-col items-center px-5 pb-10 pt-14 text-center sm:px-8">
          <span className="mb-4 rounded-full border border-[var(--soft-border-color)] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--secondary-text)]">
            Handcraft Supplies
          </span>

          <h1 className="text-3xl font-bold text-[var(--primary-text)] sm:text-4xl">
            Create Something <span className="text-[#c53938]">Beautiful</span>
          </h1>

          <p className="mt-3 max-w-md text-sm text-[var(--secondary-text)]">
            Premium art &amp; craft supplies for students, hobbyists, and professional makers.
          </p>

          {/* Category filter pills */}
          <div className="mt-7 flex w-full max-w-full gap-2.5 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition ${
                  activeCategory === cat.id
                    ? 'bg-[#c53938] text-white'
                    : 'border border-[var(--soft-border-color)] text-[var(--secondary-text)] hover:text-[var(--primary-text)]'
                }`}
              >
                <CategoryIcon type={cat.icon} />
                {cat.label}
              </button>
            ))}
          </div>
        </section>

        {/* ── Product collection ── */}
        <section className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <div className="rounded-2xl border border-[var(--soft-border-color)] bg-[var(--surface-bg)] p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--page-bg)] text-[var(--secondary-text)]">
                  <CategoryIcon type="box" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-[var(--primary-text)]">{activeCategoryLabel}</p>
                  <p className="text-xs text-[var(--secondary-text)]">
                    {products.length} products available
                  </p>
                </div>
              </div>
              <a href="#" className="flex items-center gap-1 text-xs font-semibold text-[#c53938] hover:underline">
                View all
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
                </svg>
              </a>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {products.map((p) => (
                <div key={p.id} className="flex flex-col">
                  <div className="relative mb-2 aspect-square w-full overflow-hidden rounded-xl bg-gradient-to-br from-pink-100 to-pink-200">
                    {p.badge && (
                      <span
                        className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold ${badgeStyles[p.badge]}`}
                      >
                        {p.badge}
                      </span>
                    )}
                    <div className="flex h-full w-full items-center justify-center text-amber-600">
                      <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8 12 3 3 8m18 0-9 5m9-5v9l-9 5m0-9L3 8m9 5v9M3 8v9l9 5" />
                      </svg>
                    </div>
                  </div>

                  <p className="truncate text-xs font-semibold text-[var(--primary-text)]">{p.name}</p>
                  <p className="truncate text-[11px] text-[var(--secondary-text)]">{p.description}</p>

                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="text-sm font-bold text-[#c53938]">{formatEGP(p.price)}</span>
                    <button
                      type="button"
                      aria-label={`Add ${p.name} to cart`}
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--page-bg)] text-[var(--primary-text)] transition hover:bg-[#c53938] hover:text-white"
                    >
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" d="M12 5v14M5 12h14" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust strip */}
            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-[var(--soft-border-color)] pt-4 text-[11px] text-[var(--secondary-text)]">
              <span className="flex items-center gap-1.5">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h11v10H3V7Zm11 3h4l3 3v4h-7v-7ZM6 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm12 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
                </svg>
                Free delivery over EGP 5,000
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m9 12 2 2 4-4m5 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                Quality guaranteed
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M4 9a8 8 0 1 1 2.34 5.66" />
                </svg>
                Easy returns within 14 days
              </span>
            </div>
          </div>
        </section>

        {/* ── Promo strips ── */}
        <section className="mx-auto max-w-[1280px] px-5 py-8 sm:px-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {promoStrips.map((promo) => {
              const isSchoolProjects = promo.id === 'school-projects';
              const Tag = isSchoolProjects ? 'button' : 'a';

              return (
                <Tag
                  key={promo.id}
                  {...(isSchoolProjects
                    ? { type: 'button', onClick: () => setIsSchoolProjectsOpen(true) }
                    : { href: '#' })}
                  className="flex w-full items-center gap-3 rounded-xl border border-[var(--soft-border-color)] bg-[var(--surface-bg)] p-4 text-left transition hover:border-[#c53938]/40"
                >
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${promo.iconBg}`}>
                    <PromoIcon type={promo.icon} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[var(--primary-text)]">{promo.title}</p>
                    <p className="truncate text-xs text-[var(--secondary-text)]">{promo.subtitle}</p>
                  </div>
                  <svg className="h-4 w-4 shrink-0 text-[var(--secondary-text)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
                  </svg>
                </Tag>
              );
            })}
          </div>
        </section>

        <SchoolProjectsModal
          isOpen={isSchoolProjectsOpen}
          onClose={() => setIsSchoolProjectsOpen(false)}
        />

        <Footer />
      </main>
    </div>
  );
}