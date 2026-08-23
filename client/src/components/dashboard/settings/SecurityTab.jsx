import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldCheck, Laptop, Smartphone, Monitor, Tablet,
  MapPin, Clock, LogOut, CheckCircle2, RefreshCw,
} from 'lucide-react';
import { sessionApi } from '../../../services/api';

/* Relative time helper */
function timeAgo(date) {
  if (!date) return 'Unknown';
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 30)  return 'Active now';
  if (diff < 60)  return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  const d = new Date(date);
  return d.toLocaleDateString('en-EG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function DeviceIcon({ type }) {
  const cls = 'h-5 w-5 text-[var(--label-text)]';
  if (type === 'smartphone') return <Smartphone className={cls} />;
  if (type === 'tablet')     return <Tablet     className={cls} />;
  if (type === 'laptop')     return <Laptop     className={cls} />;
  return <Monitor className={cls} />;
}

export default function SecurityTab() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessions, setSessions]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [notification, setNotification] = useState(null);
  const [revoking, setRevoking]     = useState(null); // session id being revoked

  const notify = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await sessionApi.getSessions();
      setSessions(data.sessions || []);
    } catch {
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSessions(); }, [fetchSessions]);

  const handleSignOutSession = async (id, name) => {
    setRevoking(id);
    try {
      await sessionApi.revokeSession(id);
      setSessions((p) => p.filter((s) => s.id !== id));
      notify(`Signed out from ${name}.`);
    } catch (err) {
      notify(err.message || 'Failed to sign out session.', 'error');
    } finally {
      setRevoking(null);
    }
  };

  const handleSignOutAll = async () => {
    setRevoking('all');
    try {
      await sessionApi.revokeAllSessions();
      setSessions((p) => p.filter((s) => s.isCurrent));
      notify('Signed out from all other devices.');
    } catch (err) {
      notify(err.message || 'Failed to sign out all sessions.', 'error');
    } finally {
      setRevoking(null);
    }
  };

  const toggle2FA = () => {
    const next = !twoFactorEnabled;
    setTwoFactorEnabled(next);
    notify(next ? 'Two-Factor Authentication enabled.' : 'Two-Factor Authentication disabled.');
  };

  const otherSessions = sessions.filter((s) => !s.isCurrent);

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
        <div className={`flex items-center gap-3 rounded-[14px] p-4 text-xs sm:text-sm font-medium border ${
          notification.type === 'error'
            ? 'bg-red-500/10 text-red-400 border-red-500/20'
            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
        }`}>
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
          <span>{notification.msg}</span>
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
            <p className="text-xs text-[var(--muted-text)] mt-0.5">
              {loading ? 'Loading sessions...' : `${sessions.length} device${sessions.length !== 1 ? 's' : ''} currently signed in`}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={fetchSessions}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-color)] bg-[var(--surface-soft)] px-3 py-2 text-xs font-semibold text-[var(--secondary-text)] transition hover:text-[var(--primary-text)] disabled:opacity-40 cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>

            {otherSessions.length > 0 && (
              <button
                type="button"
                onClick={handleSignOutAll}
                disabled={revoking === 'all'}
                className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-transparent px-4 py-2 text-xs font-bold text-[#c53938] transition-all hover:bg-[var(--brand-soft-bg)] active:scale-[0.98] cursor-pointer shadow-xs disabled:opacity-50"
              >
                <LogOut className="h-3.5 w-3.5" />
                {revoking === 'all' ? 'Signing out...' : 'Sign out all devices'}
              </button>
            )}
          </div>
        </div>

        <div className="grid gap-4">
          {loading ? (
            Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-24 rounded-[18px] border border-[var(--border-color)] bg-[var(--surface-soft)] animate-pulse" />
            ))
          ) : sessions.length === 0 ? (
            <div className="p-8 text-center text-sm text-[var(--muted-text)] border border-dashed border-[var(--border-color)] rounded-[18px]">
              No active login sessions found.
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-[18px] border border-[var(--border-color)] bg-[var(--surface-soft)] hover:border-[var(--brand-accent)]/20 transition-all"
              >
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
                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-[var(--muted-text)] pt-0.5">
                      {session.ip && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {session.ip}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {timeAgo(session.lastActive)}
                      </span>
                    </div>
                  </div>
                </div>

                {!session.isCurrent && (
                  <button
                    type="button"
                    onClick={() => handleSignOutSession(session.id, session.deviceName)}
                    disabled={revoking === session.id}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-color)] bg-[var(--surface-card)] px-4 py-2 text-xs font-semibold text-[var(--secondary-text)] transition-all hover:border-red-500/40 hover:text-[#c53938] cursor-pointer self-end sm:self-center disabled:opacity-50"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    {revoking === session.id ? 'Signing out...' : 'Sign Out'}
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
