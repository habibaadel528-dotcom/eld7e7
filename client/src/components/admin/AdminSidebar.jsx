import { NavLink } from 'react-router-dom';

const mainNav = [
  { to: '/admin/orders', label: 'Orders', icon: 'orders', badge: 2 },
  { to: '/admin/products', label: 'Products', icon: 'box' },
  { to: '/admin/customers', label: 'Customers', icon: 'users' },
];

const secondaryNav = [
  { to: '/admin/settings', label: 'Settings', icon: 'settings' },
];

/* ── Small icon set (no extra deps) ── */
function NavIcon({ type }) {
  const paths = {
    grid: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z" />
    ),
    orders: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16v13H4V7Zm4-3v3m8-3v3M4 11h16" />
    ),
    box: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8 12 3 3 8m18 0-9 5m9-5v9l-9 5m0-9L3 8m9 5v9M3 8v9l9 5" />
    ),
    users: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1m18 0v-1a4 4 0 0 0-3-3.87M14 3.13a4 4 0 0 1 0 7.75M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
    ),
    chart: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 20V10m6 10V4m6 16v-7" />
    ),
    tag: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.59 13.41 11 3.83 4 4l-.17 7L13.41 20.6a2 2 0 0 0 2.83 0l4.35-4.35a2 2 0 0 0 0-2.83ZM8 8h.01" />
    ),
    settings: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7.4-3a7.4 7.4 0 0 0-.13-1.4l2.11-1.65-2-3.46-2.48 1a7.5 7.5 0 0 0-2.42-1.4L14 2h-4l-.48 2.6a7.5 7.5 0 0 0-2.42 1.4l-2.48-1-2 3.46L4.73 10.6a7.4 7.4 0 0 0 0 2.8L2.62 15l2 3.46 2.48-1c.72.6 1.53 1.08 2.42 1.4L10 22h4l.48-2.6a7.5 7.5 0 0 0 2.42-1.4l2.48 1 2-3.46-2.11-1.65c.09-.46.13-.93.13-1.4Z" />
    ),
  };
  return (
    <svg className="h-[18px] w-[18px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      {paths[type]}
    </svg>
  );
}

function AdminNavItem({ item, isCollapsed }) {
  return (
    <NavLink
      to={item.to}
      title={isCollapsed ? item.label : undefined}
      className={({ isActive }) =>
        `group relative flex items-center transition-all duration-150 ${
          isCollapsed
            ? 'h-10 w-10 justify-center p-0 mx-auto rounded-xl'
            : 'gap-3 rounded-xl px-3 py-2.5 text-sm font-medium'
        } ${
          isActive
            ? 'bg-[#c53938]/10 text-[#c53938]'
            : 'text-[var(--secondary-text)] hover:bg-[var(--surface-soft)] hover:text-[var(--primary-text)]'
        }`
      }
    >
      <NavIcon type={item.icon} />
      {!isCollapsed && <span className="truncate flex-1">{item.label}</span>}
      {item.badge ? (
        <span
          className={`flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#c53938] px-1 text-[10px] font-bold text-white ${
            isCollapsed ? 'absolute -right-1 -top-1' : ''
          }`}
        >
          {item.badge}
        </span>
      ) : null}
    </NavLink>
  );
}

export default function AdminSidebar({ isCollapsed, onToggleCollapse }) {
  return (
    <aside
      className={`relative flex h-full flex-col rounded-2xl border border-[var(--border-color)] bg-[var(--surface-bg)] transition-all duration-300 ease-in-out ${
        isCollapsed ? 'py-10 px-2 items-center' : 'p-4 sm:p-5'
      }`}
    >
      {/* ── Top Header / Toggle ── */}
      <div className={`flex items-center w-full mb-3 ${isCollapsed ? 'justify-center' : 'justify-between px-1'}`}>
        {!isCollapsed && (
          <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--secondary-text)] opacity-70">
            Admin Menu
          </span>
        )}
        <button
          type="button"
          onClick={onToggleCollapse}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-color)] bg-[var(--surface-soft)] text-[var(--secondary-text)] transition-all hover:bg-[#c53938] hover:text-white hover:border-[#c53938] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c53938]"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          <svg
            className={`h-4 w-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* ── Navigation ── */}
      <nav aria-label="Admin navigation" className={`mt-2 flex flex-1 flex-col gap-1 w-full ${isCollapsed ? 'items-center' : ''}`}>
        {mainNav.map((item) => (
          <AdminNavItem key={item.to} item={item} isCollapsed={isCollapsed} />
        ))}

        <div className={`my-2 border-t border-[var(--border-color)] ${isCollapsed ? 'w-8 mx-auto' : 'w-full'}`} />

        {secondaryNav.map((item) => (
          <AdminNavItem key={item.to} item={item} isCollapsed={isCollapsed} />
        ))}
      </nav>

      {/* ── Store status widget ── */}
      <div className={`mt-auto border-t border-[var(--border-color)] pt-3 w-full ${isCollapsed ? 'hidden' : ''}`}>
        <div className="rounded-xl bg-[var(--surface-soft)] p-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-semibold text-[var(--primary-text)]">Store Online</span>
          </div>
          <p className="mt-1.5 text-[11px] text-[var(--secondary-text)]">
            284 products · 3,420 customers
          </p>
          <p className="text-[11px] text-[var(--secondary-text)]">2 new orders today</p>
        </div>
      </div>
    </aside>
  );
}