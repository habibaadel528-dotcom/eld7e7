import { useState } from 'react';

/* ── Mock data — replace with real API data later ── */
const savedCards = [
    {
        id: 'card-1',
        holder: 'EMAN MOHAMED',
        number: '4291',
        expires: '09/28',
        brand: 'Visa',
        isDefault: true,
        gradient: 'from-[#4338ca] via-[#4f46e5] to-[#3730a3]',
    },
    {
        id: 'card-2',
        holder: 'EMAN MOHAMED',
        number: '7835',
        expires: '02/27',
        brand: 'Mastercard',
        isDefault: false,
        gradient: 'from-[#2b2b2b] via-[#1f1f1f] to-[#0d0d0d]',
    },
];

/* ── Payment methods ──
   active / off  -> normal toggle-able methods, already available.
   comingSoon    -> shown in the list but disabled (not toggle-able yet),
                     e.g. Visa direct debit not wired up on the backend yet. */
const initialPaymentMethods = [
    { id: 'cod', label: 'Cash on Delivery', active: true, icon: 'cash' },
    { id: 'vodafone', label: 'Vodafone Cash', active: true, icon: 'phone' },
    { id: 'fawry', label: 'Fawry', active: true, icon: 'bolt' },
    { id: 'instapay', label: 'InstaPay', active: true, icon: 'transfer' },
    { id: 'visa', label: 'Visa', active: false, comingSoon: true, icon: 'card' },
];

const transactions = [
    { id: 'TXN-8821', order: 'Order #ELD-7291 — 3 items', date: 'Jul 28, 2026', amount: -8499, type: 'debit' },
    { id: 'TXN-8810', order: 'Order #ELD-7204 — iPhone 15 Pro Max', date: 'Jul 22, 2026', amount: -39999, type: 'debit' },
    { id: 'TXN-8799', order: 'Refund for Order #ELD-7144', date: 'Jul 20, 2026', amount: 4500, type: 'refund' },
    { id: 'TXN-8754', order: 'Order #ELD-7144 — MacBook Air M3', date: 'Jul 18, 2026', amount: -28999, type: 'debit' },
    { id: 'TXN-8703', order: 'Loyalty reward redeemed', date: 'Jul 10, 2026', amount: 250, type: 'reward' },
    { id: 'TXN-8681', order: 'Order #ELD-6988 — 2 items', date: 'Jul 5, 2026', amount: -5899, type: 'debit' },
];

/* ── Small icon set (no extra deps) ── */
function TxnIcon({ type }) {
    const base = 'flex h-9 w-9 shrink-0 items-center justify-center rounded-full';
    if (type === 'refund') {
        return (
            <span className={`${base} bg-emerald-500/10 text-emerald-500`}>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M4 9a8 8 0 1 1 2.34 5.66" />
                </svg>
            </span>
        );
    }
    if (type === 'reward') {
        return (
            <span className={`${base} bg-amber-500/10 text-amber-500`}>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="8" r="5" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 13 7 21l5-2.5L17 21l-1.5-8" />
                </svg>
            </span>
        );
    }
    return (
        <span className={`${base} bg-[#c53938]/10 text-[#c53938]`}>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h15l-1.5 9h-12L6 6Zm0 0L5 3H2" />
                <circle cx="9" cy="20" r="1" />
                <circle cx="17" cy="20" r="1" />
            </svg>
        </span>
    );
}

function MethodIcon({ icon }) {
    const paths = {
        cash: (
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18v10H3V7Zm9 2.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z" />
        ),
        phone: (
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 3h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm4 15h.01" />
        ),
        bolt: (
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
        ),
        transfer: (
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h11l-3-3m3 3-3 3M17 17H6l3 3m-3-3 3-3" />
        ),
        card: (
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Zm0 4h18" />
        ),
    };
    return (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            {paths[icon]}
        </svg>
    );
}

function formatEGP(n) {
    const abs = Math.abs(n).toLocaleString('en-US');
    return `${n < 0 ? '-' : '+'}EGP ${abs}`;
}

export default function PaymentsPage() {
    const [methods, setMethods] = useState(initialPaymentMethods);

    const toggleMethod = (id) => {
        setMethods((prev) =>
            prev.map((m) =>
                m.id === id && !m.comingSoon ? { ...m, active: !m.active } : m
            )
        );
    };

    return (
        <div className="flex flex-col gap-1">
            {/* ── Page header ── */}
            <h1 className="text-2xl font-bold text-[var(--primary-text)]">Payments</h1>
            <p className="mb-5 text-sm text-[var(--secondary-text)]">
                Manage your cards, wallet, and transactions
            </p>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                {/* ══════════════ LEFT COLUMN (2/3) ══════════════ */}
                <div className="flex flex-col gap-5 lg:col-span-2">
                    {/* ── Saved Cards ── */}
                    <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface-bg)] p-5">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-[var(--primary-text)]">Saved Cards</h2>
                            <button
                                type="button"
                                className="flex items-center gap-1.5 rounded-full bg-[#c53938]/10 px-4 py-2 text-xs font-semibold text-[#c53938] transition hover:bg-[#c53938]/20"
                            >
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" d="M12 5v14M5 12h14" />
                                </svg>
                                Add Card
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {savedCards.map((card) => (
                                <div
                                    key={card.id}
                                    className={`relative flex h-[170px] flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br p-4 text-white ${card.gradient}`}
                                >
                                    {/* decorative circles */}
                                    <span className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10" />
                                    <span className="pointer-events-none absolute -bottom-10 -right-2 h-24 w-24 rounded-full bg-white/5" />

                                    <div className="relative flex items-start justify-between">
                                        <span className="flex h-6 w-9 items-center justify-center rounded-md bg-amber-400/90">
                                            <svg className="h-3.5 w-4 text-amber-800/80" fill="currentColor" viewBox="0 0 24 24">
                                                <rect x="2" y="6" width="20" height="12" rx="2" />
                                            </svg>
                                        </span>
                                        {card.isDefault ? (
                                            <span className="rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-bold tracking-wide backdrop-blur-sm">
                                                DEFAULT
                                            </span>
                                        ) : (
                                            <span className="text-xs font-medium opacity-80">{card.brand}</span>
                                        )}
                                    </div>

                                    <div className="relative">
                                        <p className="mb-2 text-sm tracking-[3px] opacity-90">
                                            •••• •••• •••• {card.number}
                                        </p>
                                        <div className="flex items-end justify-between">
                                            <p className="text-xs font-semibold tracking-wide">{card.holder}</p>
                                            <div className="text-right">
                                                <p className="text-[9px] uppercase opacity-60">Expires</p>
                                                <p className="text-xs font-medium">{card.expires}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* ── Transaction History ── */}
                    <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface-bg)] p-5">
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-[var(--primary-text)]">Transaction History</h2>
                            <button
                                type="button"
                                className="flex items-center gap-1 text-xs font-semibold text-[#c53938] hover:underline"
                            >
                                Download
                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M8 7h9v9" />
                                </svg>
                            </button>
                        </div>

                        <ul className="flex flex-col divide-y divide-[var(--border-color)]">
                            {transactions.map((t) => (
                                <li key={t.id} className="flex items-center gap-3 py-3">
                                    <TxnIcon type={t.type} />
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium text-[var(--primary-text)]">{t.order}</p>
                                        <p className="text-[11px] text-[var(--secondary-text)]">
                                            {t.id} · {t.date}
                                        </p>
                                    </div>
                                    <span
                                        className={`shrink-0 text-sm font-semibold ${t.amount < 0 ? 'text-[var(--primary-text)]' : 'text-emerald-500'
                                            }`}
                                    >
                                        {formatEGP(t.amount)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>

                {/* ══════════════ RIGHT COLUMN (1/3) ══════════════ */}
                <div className="flex flex-col gap-5">
                    {/* ── Wallet ── */}
                    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#c53938] to-[#8f2524] p-5 text-white">
                        <span className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10" />
                        <span className="pointer-events-none absolute -bottom-12 -right-4 h-28 w-28 rounded-full bg-white/5" />

                        <div className="relative flex items-center gap-2 text-sm opacity-90">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="6" width="18" height="12" rx="2" />
                                <path strokeLinecap="round" d="M16 12h.01" />
                            </svg>
                            El-D7e7 Wallet
                        </div>
                        <p className="relative mt-2 text-3xl font-bold">EGP 450</p>
                        <p className="relative mb-4 text-xs opacity-80">Available balance</p>

                        <button
                            type="button"
                            className="relative flex w-full items-center justify-center gap-1.5 rounded-full bg-white/15 py-2.5 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/25"
                        >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" d="M12 5v14M5 12h14" />
                            </svg>
                            Add Money
                        </button>
                    </section>

                    {/* ── Spend Summary ── */}
                    <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface-bg)] p-5">
                        <h2 className="mb-4 text-sm font-semibold text-[var(--primary-text)]">Spend Summary</h2>

                        <div className="mb-4">
                            <div className="mb-1.5 flex items-center justify-between text-xs">
                                <span className="text-[var(--secondary-text)]">This Month</span>
                                <span className="font-semibold text-[var(--primary-text)]">EGP 48,498</span>
                            </div>
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface-soft)]">
                                <div className="h-full w-[85%] rounded-full bg-[#c53938]" />
                            </div>
                            <p className="mt-1 text-[10px] text-[var(--secondary-text)]">Jul 2026</p>
                        </div>

                        <div>
                            <div className="mb-1.5 flex items-center justify-between text-xs">
                                <span className="text-[var(--secondary-text)]">Last Month</span>
                                <span className="font-semibold text-[var(--primary-text)]">EGP 5,899</span>
                            </div>
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface-soft)]">
                                <div className="h-full w-[15%] rounded-full bg-[#c53938]/50" />
                            </div>
                            <p className="mt-1 text-[10px] text-[var(--secondary-text)]">Jun 2026</p>
                        </div>
                    </section>

                    {/* ── Payment Methods ── */}
                    <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface-bg)] p-5">
                        <h2 className="mb-3 text-sm font-semibold text-[var(--primary-text)]">Payment Methods</h2>

                        <ul className="flex flex-col divide-y divide-[var(--border-color)]">
                            {methods.map((m) => (
                                <li
                                    key={m.id}
                                    className={`flex items-center gap-3 py-3 ${m.comingSoon ? 'opacity-60' : ''}`}
                                >
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--surface-soft)] text-[var(--secondary-text)]">
                                        <MethodIcon icon={m.icon} />
                                    </span>
                                    <span className="flex-1 text-sm font-medium text-[var(--primary-text)]">
                                        {m.label}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => toggleMethod(m.id)}
                                        disabled={m.comingSoon}
                                        className={`text-xs font-semibold ${m.comingSoon
                                                ? 'cursor-not-allowed text-[var(--secondary-text)]'
                                                : m.active
                                                    ? 'text-emerald-500'
                                                    : 'text-[var(--secondary-text)]'
                                            }`}
                                    >
                                        {m.comingSoon ? 'Coming Soon' : m.active ? 'Active' : 'Off'}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
}