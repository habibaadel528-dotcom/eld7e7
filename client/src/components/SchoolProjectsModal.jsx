import { useState } from 'react';
import { toast } from 'sonner';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { toArabicDigits } from '../utils/formatters';

/* ── Grades definition with Arabic & English labels ── */
const grades = [
  { id: 'kg', label: 'KG', labelAr: 'رياض الأطفال (KG)', icon: '🍎', dotColor: 'bg-rose-500' },
  { id: 'primary', label: 'Primary', labelAr: 'المرحلة الابتدائية', icon: '📗', dotColor: 'bg-emerald-500' },
  { id: 'preparatory', label: 'Preparatory', labelAr: 'المرحلة الإعدادية', icon: '✏️', dotColor: 'bg-amber-500' },
  { id: 'secondary', label: 'Secondary', labelAr: 'المرحلة الثانوية', icon: '🎓', dotColor: 'bg-slate-400' },
];

const kitsByGrade = {
  kg: [
    {
      id: 'kg-craft-starter',
      name: 'Little Explorers Craft Kit',
      nameAr: 'طقم المستكشف الصغير للأشغال اليدوية',
      itemsCount: 4,
      items: ['Safe round-tip scissors', 'Clay dough 6 colors', 'Jumbo crayons', 'Colored construction paper'],
      itemsAr: ['مقص آمن للأطفال برأس دائري', 'صلصال طبي ٦ ألوان', 'ألوان شمعية جامبو', 'ورق قص ولزق ملون'],
      price: 95,
      badge: 'Best Seller',
      badgeAr: 'الأكثر مبيعاً',
    },
    {
      id: 'kg-alphabet-art',
      name: 'Alphabet & Phonics Project Box',
      nameAr: 'صندوق الحروف والأنشطة التفاعلية',
      itemsCount: 4,
      items: ['Foam letters set', 'Washable finger paint', 'Large activity sheets', 'Sticker stars pack'],
      itemsAr: ['حروف فوم مجسمة ملونة', 'ألوان أصابع آمنة قابلة للغسل', 'كراسة أنشطة كبيرة', 'طقم ملصقات نجوم تشجيعية'],
      price: 110,
      badge: 'New',
      badgeAr: 'جديد',
    },
  ],
  primary: [
    {
      id: 'science-project-box',
      name: 'Science Project Box',
      nameAr: 'صندوق مشاريع العلوم',
      itemsCount: 5,
      items: ['Magnifying glass', 'Pipettes', 'Petri dish', 'Lab gloves', 'Report book'],
      itemsAr: ['عدسة مكبرة', 'ماصات مدرجة', 'أطباق بتري', 'قفازات معملية', 'دفتر تقارير وتجارب'],
      price: 145,
      badge: 'Best Seller',
      badgeAr: 'الأكثر مبيعاً',
    },
    {
      id: 'nature-journal-kit',
      name: 'Nature Journal Kit',
      nameAr: 'طقم مجلة استكشاف الطبيعة',
      itemsCount: 4,
      items: ['Sketchbook A4', 'Watercolors 24', 'Botanical stencils', 'Pencils 12H-B'],
      itemsAr: ['كشكول رسم A4', 'ألوان مائية ٢٤ لون', 'استنسل نباتي', 'أقلام رصاص درجات متعددة'],
      price: 130,
      badge: null,
      badgeAr: null,
    },
    {
      id: 'math-manipulatives-set',
      name: 'Math Manipulatives Set',
      nameAr: 'مجموعة أدوات الرياضيات التفاعلية',
      itemsCount: 4,
      items: ['Counting cubes 100pcs', 'Fraction tiles', 'Ruler set', 'Graph paper'],
      itemsAr: ['مكعبات عد ١٠٠ قطعة', 'قطع الكسور التعليمية', 'طقم مساطر هندسية', 'ورق رسم بياني'],
      price: 110,
      badge: 'New',
      badgeAr: 'جديد',
    },
    {
      id: 'arabic-calligraphy-set',
      name: 'Arabic Calligraphy Set',
      nameAr: 'طقم أدوات الخط العربي',
      itemsCount: 4,
      items: ['Qalam pen', 'Ink bottle', 'Tracing sheets', 'Practice booklet'],
      itemsAr: ['أقلام خط عربي', 'محبرة خط عربي سائل', 'ورق كلك شفاف للرسم', 'كراسة تدريب وتطبيق'],
      price: 120,
      badge: null,
      badgeAr: null,
    },
  ],
  preparatory: [
    {
      id: 'prep-science-kit',
      name: 'Middle School Science Lab Kit',
      nameAr: 'حقيبة تجارب العلوم الإعدادية',
      itemsCount: 5,
      items: ['Test tubes & rack', 'Measuring cylinder', 'Digital thermometer', 'Filter papers', 'Safety goggles'],
      itemsAr: ['أنابيب اختبار وحامل', 'مخبار مدرج شفاف', 'ترمومتر رقمي دقيق', 'ورق ترشيح معملي', 'نظارات حماية'],
      price: 180,
      badge: 'Best Seller',
      badgeAr: 'الأكثر مبيعاً',
    },
    {
      id: 'prep-geometry-drafting',
      name: 'Engineering & Geometry Drafting Set',
      nameAr: 'طقم الهندسة والرسم الفني الإعدادي',
      itemsCount: 4,
      items: ['Heavy-duty compass set', 'Set squares & protractor', 'Technical fineliners', 'Drafting grid book'],
      itemsAr: ['برجل معدني احترافي', 'مجموعة مثلثات ومنقلة', 'أقلام تحبير فنية دقيقة', 'دفتر رسم بياني هندسي'],
      price: 155,
      badge: null,
      badgeAr: null,
    },
  ],
  secondary: [
    {
      id: 'sec-advanced-stem-box',
      name: 'Secondary STEM Electronics Kit',
      nameAr: 'حقيبة الإلكترونيات والروبوتات الثانوية',
      itemsCount: 5,
      items: ['Breadboard & wires', 'Electronic components set', 'Multimeter', 'Soldering practice kit', 'Manual'],
      itemsAr: ['لوحة تجارب إلكترونية وأسلاك', 'طقم مكونات وليدات ومقاومات', 'ملتيميتر قياس رقمي', 'طقم تدريب عملي', 'كتيب توجيهي للمشاريع'],
      price: 260,
      badge: 'Best Seller',
      badgeAr: 'الأكثر مبيعاً',
    },
    {
      id: 'sec-biology-specimen-kit',
      name: 'Biology & Microscope Slide Kit',
      nameAr: 'حقيبة شرائح الأحياء والمجهر للمرحلة الثانوية',
      itemsCount: 4,
      items: ['Prepared slides set 25pcs', 'Blank glass slides & covers', 'Dissection instruments', 'Observation journal'],
      itemsAr: ['طقم شرائح مجهرية جاهزة ٢٥ شريحة', 'شرائح زجاجية وسواتر', 'أدوات تشريح آمنة', 'سجل ملاحظات علمي'],
      price: 220,
      badge: 'New',
      badgeAr: 'جديد',
    },
  ],
};

const badgeStyles = {
  'Best Seller': 'bg-[#c53938] text-white',
  'الأكثر مبيعاً': 'bg-[#c53938] text-white',
  New: 'bg-emerald-500 text-white',
  'جديد': 'bg-emerald-500 text-white',
};

function formatPrice(n, isAr) {
  if (isAr) {
    return `${toArabicDigits(n)} ج.م`;
  }
  return `EGP ${n.toLocaleString('en-US')}`;
}

export default function SchoolProjectsModal({ isOpen, onClose }) {
  const [activeGrade, setActiveGrade] = useState('primary');
  const { addToCart } = useCart();
  const { lang } = useLanguage();
  const isAr = lang === 'ar';

  if (!isOpen) return null;

  const kits = kitsByGrade[activeGrade] ?? [];

  const handleAddKitToCart = (kit) => {
    const kitName = isAr ? (kit.nameAr || kit.name) : kit.name;
    addToCart({
      id: kit.id,
      name: kitName,
      price: kit.price,
      quantity: 1,
    });
    toast.success(
      isAr
        ? `تمت إضافة "${kitName}" إلى سلة المشتريات!`
        : `Added "${kit.name}" to cart!`
    );
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        dir={isAr ? 'rtl' : 'ltr'}
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-[var(--soft-border-color)] bg-[var(--surface-bg)] text-[var(--primary-text)]"
      >
        {/* ── Header ── */}
        <div className="flex items-start justify-between border-b border-[var(--soft-border-color)] p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--page-bg)] text-lg">
              🎒
            </span>
            <div>
              <p className="text-base font-semibold">
                {isAr ? 'المشاريع المدرسية' : 'School Projects'}
              </p>
              <p className="text-xs text-[var(--secondary-text)]">
                {isAr
                  ? 'أطقم ومستلزمات دراسية مختارة لجميع المراحل التعليمية'
                  : 'Curated supply kits for every grade level'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={isAr ? 'إغلاق' : 'Close'}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--page-bg)] text-[var(--secondary-text)] transition hover:text-[var(--primary-text)] cursor-pointer"
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
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition cursor-pointer ${
                activeGrade === g.id
                  ? 'bg-[#c53938] text-white'
                  : 'border border-[var(--soft-border-color)] text-[var(--secondary-text)] hover:text-[var(--primary-text)]'
              }`}
            >
              <span>{g.icon}</span>
              {isAr ? g.labelAr : g.label}
            </button>
          ))}
        </div>

        {/* ── Kits grid ── */}
        <div className="p-5">
          {kits.length === 0 ? (
            <p className="py-10 text-center text-sm text-[var(--secondary-text)]">
              {isAr
                ? 'أطقم هذه المرحلة الدراسية ستتوفر قريباً.'
                : 'Kits for this grade level are coming soon.'}
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {kits.map((kit) => {
                const displayName = isAr ? (kit.nameAr || kit.name) : kit.name;
                const displayItems = isAr ? (kit.itemsAr || kit.items) : kit.items;
                const displayBadge = isAr ? (kit.badgeAr || kit.badge) : kit.badge;
                const badgeClass = displayBadge ? (badgeStyles[displayBadge] || badgeStyles[kit.badge] || 'bg-[#c53938] text-white') : '';

                return (
                  <div
                    key={kit.id}
                    className="rounded-xl border-t-2 border-[#c53938] bg-[var(--page-bg)] p-4 text-start"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--surface-bg)] text-sm">
                          📗
                        </span>
                        <div>
                          <p className="text-sm font-semibold">{displayName}</p>
                          <p className="text-xs text-[var(--secondary-text)]">
                            {isAr
                              ? `${toArabicDigits(kit.itemsCount)} عناصر مشمولة`
                              : `${kit.itemsCount} items included`}
                          </p>
                        </div>
                      </div>
                      {displayBadge && (
                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${badgeClass}`}>
                          {displayBadge}
                        </span>
                      )}
                    </div>

                    <ul className="mb-4 space-y-1.5">
                      {displayItems.map((item) => (
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
                      <span className="text-base font-bold text-[#c53938]">{formatPrice(kit.price, isAr)}</span>
                      <button
                        type="button"
                        onClick={() => handleAddKitToCart(kit)}
                        className="flex items-center gap-1.5 rounded-full border border-[#c53938]/40 bg-[#c53938]/10 px-3.5 py-2 text-xs font-semibold text-[#ef5350] transition hover:bg-[#c53938]/20 cursor-pointer active:scale-95"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <circle cx="9" cy="21" r="1" />
                          <circle cx="19" cy="21" r="1" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
                        </svg>
                        {isAr ? 'أضف للسلة' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Footer note ── */}
        <div className="flex items-center gap-2 border-t border-[var(--soft-border-color)] px-5 py-4 text-xs text-[#c53938]">
          <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h11v10H3V7Zm11 3h4l3 3v4h-7v-7ZM6 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm12 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
          </svg>
          {isAr
            ? 'يتم شحن جميع أطقم المشاريع المدرسية خلال ٢٤ ساعة — مضمونة لموسم الامتحانات.'
            : 'All school project kits ship within 24 hours — guaranteed for exam season.'}
        </div>
      </div>
    </div>
  );
}