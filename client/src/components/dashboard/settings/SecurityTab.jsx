import React, { useState } from 'react';
import { ShieldCheck, Laptop, Smartphone, Monitor, MapPin, Clock, LogOut, CheckCircle2 } from 'lucide-react';

export default function SecurityTab() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessions, setSessions] = useState([
    { id: 1, deviceName: 'MacBook Pro 16"', deviceType: 'laptop',     browser: 'Chrome 122.0 · macOS Sonoma',          location: 'Cairo, Egypt',      lastActive: 'Active now',           isCurrent: true },
    { id: 2, deviceName: 'iPhone 15 Pro',   deviceType: 'smartphone', browser: 'Safari 17.2 · iOS 17.4',               location: 'Cairo, Egypt',      lastActive: '12 minutes ago',       isCurrent: false },
    { id: 3, deviceName: 'Windows Workstation', deviceType: 'desktop', browser: 'Microsoft Edge 121.0 · Windows 11',  location: 'Alexandria, Egypt', lastActive: 'Yesterday at 18:45',   isCurrent: false },
  ]);
  const [notification, setNotification] = useState(null);

  const toggle2FA = () => {
    const next = !twoFactorEnabled;
    setTwoFactorEnabled(next);
    setNotification(next ? 'Two-Factor Authentication enabled.' : 'Two-Factor Authentication disabled.');
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSignOutSession = (id, name) => {
    setSessions((p) => p.filter((s) => s.id !== id));
    setNotification(`Signed out from ${name}.`);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleSignOutAll = () => {
    setSessions((p) => p.filter((s) => s.isCurrent));
    setNotification('Signed out from all other active sessions.');
    setTimeout(() => setNotification(null), 4000);
  };

  const DeviceIcon = ({ type }) => {
    const cls = 'h-5 w-5 text-[var(--label-text)]';
    if (type === 'smartphone') return <Smartphone className={cls} />;
    if (type === 'desktop')    return <Monitor    className={cls} />;
    return <Laptop className={cls} />;
  };

  return (
    <div className="rounded-[24px] border border-[var(--border-color)] bg-[var(--surface-card)] p-6 sm:p-10 shadow-xs space-y-8 transition-colors duration-250">

      {/* Header */}
      <div className="flex items-center gap-3 pb-5 border-b border-[var(--border-color)]">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--brand-soft-bg)] text-[#c53938]">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[var(--primary-text)]">Security</h2>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] mt-0.5">
            Manage two-factor authentication and active login sessions.
          </p>
        </div>
      </div>

      {/* Toast */}
      {notification && (
        <div className="flex items-center gap-3 rounded-[14px] bg-emerald-500/10 p-4 text-xs sm:text-sm font-medium text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
          <span>{notification}</span>
        </div>
      )}

      {/* 2FA */}
      <div className="rounded-[20px] border border-[var(--border-color)] p-6 bg-[var(--surface-soft)]">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="text-base font-bold text-[var(--primary-text)]">Two-Factor Authentication (2FA)</h3>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                twoFactorEnabled
                  ? 'bg-emerald-500/15 text-emerald-400'
                  : 'bg-[var(--surface-soft)] text-[var(--muted-text)] border border-[var(--border-color)]'
              }`}>
                {twoFactorEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed">
              Add an extra layer of security. When enabled, you will need an authentication code alongside your password to sign in.
            </p>
          </div>
          <button
            type="button" role="switch" aria-checked={twoFactorEnabled} onClick={toggle2FA}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 mt-1 ${twoFactorEnabled ? 'bg-[#c53938]' : 'bg-[var(--surface-soft)] border border-[var(--border-color)]'}`}
          >
            <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>

      {/* Sessions */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-[var(--primary-text)]">Login Sessions</h3>
            <p className="text-xs text-[var(--muted-text)] mt-0.5">Devices currently signed in to your account.</p>
          </div>
          {sessions.filter((s) => !s.isCurrent).length > 0 && (
            <button type="button" onClick={handleSignOutAll}
              className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-transparent px-4 py-2 text-xs font-bold text-[#c53938] transition-all hover:bg-[var(--brand-soft-bg)] active:scale-[0.98] cursor-pointer shadow-xs self-start sm:self-auto">
              <LogOut className="h-3.5 w-3.5" />
              Sign out from all devices
            </button>
          )}
        </div>

        <div className="grid gap-4">
          {sessions.map((session) => (
            <div key={session.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-[18px] border border-[var(--border-color)] bg-[var(--surface-soft)] hover:border-[var(--brand-accent)]/20 transition-all">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--surface-card)] border border-[var(--border-color)] text-[var(--label-text)]">
                  <DeviceIcon type={session.deviceType} />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h4 className="text-sm font-bold text-[var(--primary-text)]">{session.deviceName}</h4>
                    {session.isCurrent && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Current Device
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--muted-text)]">{session.browser}</p>
                  <div className="flex items-center gap-4 text-[11px] text-[var(--muted-text)] pt-1">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{session.location}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{session.lastActive}</span>
                  </div>
                </div>
              </div>

              {!session.isCurrent && (
                <button type="button"
                  onClick={() => handleSignOutSession(session.id, session.deviceName)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-color)] bg-[var(--surface-card)] px-4 py-2 text-xs font-semibold text-[var(--secondary-text)] transition-all hover:border-red-500/40 hover:text-[#c53938] cursor-pointer self-end sm:self-center">
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out
                </button>
              )}
            </div>
          ))}
          {sessions.length === 0 && (
            <div className="p-8 text-center text-sm text-[var(--muted-text)] border border-dashed border-[var(--border-color)] rounded-[18px]">
              No active login sessions found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
