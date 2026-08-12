import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import AdminHeader from '../components/admin/AdminHeader';
import AdminSidebar from '../components/admin/AdminSidebar';

export default function AdminLayout() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(
    () => localStorage.getItem('sidebar_collapsed') === 'true'
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('sidebar_collapsed', String(next));
      return next;
    });
  };

  useEffect(() => {
    const handleStorageChange = () => {
      setIsCollapsed(localStorage.getItem('sidebar_collapsed') === 'true');
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--primary-text)]">
      {/* Header with mobile menu trigger */}
      <AdminHeader 
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
      />

      <div
        className={`mx-auto w-full items-stretch max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 transition-all duration-300 ${
          isCollapsed
            ? 'lg:grid lg:grid-cols-[80px_minmax(0,1fr)] lg:gap-8'
            : 'lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8'
        }`}
      >
        {/* Desktop Sidebar (hidden on mobile) */}
        <div className="hidden lg:block h-full">
          <AdminSidebar
            isCollapsed={isCollapsed}
            onToggleCollapse={toggleCollapse}
          />
        </div>

        {/* Mobile Slide-Over Sidebar Drawer */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Dark Backdrop */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Slide-in Menu Panel */}
            <div className="fixed inset-y-0 left-0 z-50 w-[290px] max-w-[85vw] bg-[var(--surface-bg)] p-4 shadow-2xl border-r border-[var(--border-color)] overflow-y-auto animate-in slide-in-from-left duration-300">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)] mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--secondary-text)]">
                  Account Navigation
                </span>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-lg p-1.5 text-[var(--secondary-text)] hover:bg-[var(--surface-soft)] hover:text-[var(--primary-text)] transition"
                  aria-label="Close mobile menu"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <AdminSidebar
                isCollapsed={false}
                onToggleCollapse={() => setIsMobileMenuOpen(false)}
                onNavClick={() => setIsMobileMenuOpen(false)}
                isMobile
              />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}