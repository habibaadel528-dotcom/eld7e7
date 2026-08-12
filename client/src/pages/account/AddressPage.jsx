import { useState } from 'react';

/* ── Mock data — replace with real API data later ── */
const initialAddresses = [
  {
    id: 'addr-home',
    label: 'Home',
    person: 'Eman Mohamed',
    lines: ['12 El-Nasr Street, Apt 5B', 'Heliopolis', 'Cairo, Egypt 11341'],
    phone: '+20 100 234 5678',
    isDefault: true,
    icon: 'home',
    iconBg: 'bg-indigo-100 text-indigo-500',
  },
  {
    id: 'addr-work',
    label: 'Work',
    person: 'Eman Mohamed',
    lines: ['Smart Village, Building C3', '6th of October City', 'Giza, Egypt 12577'],
    phone: '+20 111 987 6543',
    isDefault: false,
    icon: 'work',
    iconBg: 'bg-amber-100 text-amber-500',
  },
  {
    id: 'addr-parents',
    label: 'Parents',
    person: 'Farid Mohamed',
    lines: ['88 Corniche El-Nile, Floor 3', 'Garden City', 'Cairo, Egypt 11451'],
    phone: '+20 122 345 6789',
    isDefault: false,
    icon: 'pin',
    iconBg: 'bg-emerald-100 text-emerald-500',
  },
];

/* ── Small icon set (no extra deps) ── */
function AddressIcon({ type }) {
  const paths = {
    home: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 11.5 12 4l9 7.5M5.5 10v9a1 1 0 0 0 1 1h4v-6h3v6h4a1 1 0 0 0 1-1v-9" />
    ),
    work: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 21V8a1 1 0 0 1 1-1h4V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3h4a1 1 0 0 1 1 1v13H4Zm5-13h6M9 13h6M9 17h6" />
    ),
    pin: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657 13.414 20.9a2 2 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0Z" />
        <circle cx="12" cy="11" r="3" />
      </>
    ),
  };
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      {paths[type]}
    </svg>
  );
}

function AddressCard({ address, onSetDefault, onDelete }) {
  return (
    <div className="flex flex-col rounded-2xl border border-[var(--border-color)] bg-[var(--surface-bg)] p-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${address.iconBg}`}>
            <AddressIcon type={address.icon} />
          </span>
          <div>
            <p className="text-sm font-semibold text-[var(--primary-text)]">{address.label}</p>
            <p className="text-xs text-[var(--secondary-text)]">{address.person}</p>
          </div>
        </div>

        {address.isDefault && (
          <span className="flex items-center gap-1 rounded-full bg-[#c53938] px-3 py-1 text-[11px] font-semibold text-white">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
            </svg>
            Default
          </span>
        )}
      </div>

      {/* Address lines */}
      <div className="mt-4 space-y-0.5 text-sm text-[var(--primary-text)]">
        {address.lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>

      <p className="mt-2 flex items-center gap-1.5 text-sm text-[var(--secondary-text)]">
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 0 1 2-2h2.28a1 1 0 0 1 .97.76l1 4a1 1 0 0 1-.29 1L7.4 10.3a12 12 0 0 0 6.3 6.3l1.54-1.56a1 1 0 0 1 1-.29l4 1a1 1 0 0 1 .76.97V19a2 2 0 0 1-2 2h-1C10.6 21 3 13.4 3 4V5Z" />
        </svg>
        {address.phone}
      </p>

      {/* Footer actions */}
      <div className="mt-4 flex items-center justify-between border-t border-[var(--border-color)] pt-3 text-xs font-medium">
        {!address.isDefault ? (
          <button
            type="button"
            onClick={() => onSetDefault(address.id)}
            className="text-[#c53938] hover:underline"
          >
            Set as Default
          </button>
        ) : (
          <span />
        )}

        <div className="flex items-center gap-4">
          <button
            type="button"
            className="flex items-center gap-1 text-[var(--secondary-text)] hover:text-[var(--primary-text)]"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.06 2.06 0 1 1 2.912 2.912L7.5 19.673l-4 1 1-4L16.862 4.487Z" />
            </svg>
            Edit
          </button>

          {!address.isDefault && (
            <button
              type="button"
              onClick={() => onDelete(address.id)}
              className="flex items-center gap-1 text-[var(--secondary-text)] hover:text-[#c53938]"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M9 7V4h6v3m-8 0 1 13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-13" />
              </svg>
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function AddNewAddressCard({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[180px] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[var(--border-color)] text-[var(--secondary-text)] transition hover:border-[#c53938]/50 hover:text-[#c53938]"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--surface-soft)]">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" d="M12 5v14M5 12h14" />
        </svg>
      </span>
      <span className="text-sm font-medium">Add New Address</span>
    </button>
  );
}

export default function AddressPage() {
  const [addresses, setAddresses] = useState(initialAddresses);

  const handleSetDefault = (id) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
  };

  const handleDelete = (id) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="flex flex-col gap-1">
      {/* ── Page header ── */}
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary-text)]">My Addresses</h1>
          <p className="text-sm text-[var(--secondary-text)]">
            {addresses.length} saved address{addresses.length !== 1 ? 'es' : ''}
          </p>
        </div>

        <button
          type="button"
          className="flex items-center gap-1.5 rounded-full bg-[#c53938] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" d="M12 5v14M5 12h14" />
          </svg>
          Add New Address
        </button>
      </div>

      {/* ── Address grid ── */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {addresses.map((address) => (
          <AddressCard
            key={address.id}
            address={address}
            onSetDefault={handleSetDefault}
            onDelete={handleDelete}
          />
        ))}

        <AddNewAddressCard onClick={() => { /* open add-address modal/form */ }} />
      </div>
    </div>
  );
}