import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldCheck, Laptop, Smartphone, Monitor, Tablet,
  MapPin, Clock, LogOut, CheckCircle2, RefreshCw,
} from 'lucide-react';
import { sessionApi } from '../../../services/api';
import { useLanguage } from '../../../context/LanguageContext';

/* Relative time helper */
function timeAgo(date, lang = 'en') {
  if (!date) return lang === 'ar' ? 'غير معروف' : 'Unknown';
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 30)  return lang === 'ar' ? 'نشط الآن' : 'Active now';
  if (diff < 60)  return lang === 'ar' ? `منذ ${diff} ثانية` : `${diff}s ago`;
  if (diff < 3600) return lang === 'ar' ? `منذ ${Math.floor(diff / 60)} دقيقة` : `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return lang === 'ar' ? `منذ ${Math.floor(diff / 3600)} ساعة` : `${Math.floor(diff / 3600)}h ago`;
  const d = new Date(date);
  return d.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-EG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function DeviceIcon({ type }) {
  const cls = 'h-5 w-5 text-[var(--label-text)]';
  if (type === 'smartphone') return <Smartphone className={cls} />;
  if (type === 'tablet')     return <Tablet     className={cls} />;
  if (type === 'laptop')     return <Laptop     className={cls} />;
  return <Monitor className={cls} />;
}

export default function SecurityTab() {
  const { lang, t } = useLanguage();
  const tr = t('settings').securityTab;

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessions, setSessions]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [notification, setNotification] = useState(null);
  const [revoking, setRevoking]     = useState(null);

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
      notify(lang === 'ar' ? `تم تسجيل الخروج من ${name}.` : `Signed out from ${name}.`);
    } catch (err) {
      notify(err.message || (lang === 'ar' ? 'فشل تسجيل الخروج من الجلسة.' : 'Failed to sign out session.'), 'error');
    } finally {
      setRevoking(null);
    }
  };

  const handleSignOutAll = async () => {
    setRevoking('all');
    try {
      await sessionApi.revokeAllSessions();
      setSessions((p) => p.filter((s) => s.isCurrent));
      notify(lang === 'ar' ? 'تم تسجيل الخروج من كافة الأجهزة الأخرى.' : 'Signed out from all other devices.');
    } catch (err) {
      notify(err.message || (lang === 'ar' ? 'فشل تسجيل الخروج من كافة الجلسات.' : 'Failed to sign out all sessions.'), 'error');
    } finally {
      setRevoking(null);
    }
  };

  const toggle2FA = () => {
    setTwoFactorEnabled((v) => {
      const next = !v;
      notify(next
        ? (lang === 'ar' ? 'تم تفعيل المصادقة الثنائية (محاكاة تجريبية).' : 'Two-Factor Authentication enabled (Demo).')
        : (lang === 'ar' ? 'تم تعطيل المصادقة الثنائية.' : 'Two-Factor Authentication disabled.')
      );
      return next;
    });
  };

  const otherSessions = sessions.filter((s) => !s.isCurrent);
  const currentSession = sessions.find((s) => s.isCurrent);

  return (
    <div className="rounded-[24px] border border-[var(--border-color)] bg-[var(--surface-card)] p-6 sm:p-10 shadow-xs transition-colors duration-250">

      {/* Toast Notification */}
      {notification && (
        <div className={`
          mb-6 flex items-center gap-2 rounded-2xl px-4 py-3 text-xs font-semibold
          ${notification.type === 'error'
            ? 'border border-red-500/20 bg-red-500/10 text-red-400'
            : 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
          }
        `}>
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{notification.msg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-5 border-b border-[var(--border-color)]">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--brand-soft-bg)] text-[#c53938]">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div className="text-start">
          <h2 className="text-xl font-bold text-[var(--primary-text)]">{tr.title}</h2>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] mt-0.5">
            {tr.subtitle}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-8 max-w-2xl">

        {/* ── 2FA Section ── */}
        <div className="flex items-center justify-between gap-4 p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--surface-input)]">
          <div className="flex flex-col gap-1 text-start">
            <span className="text-sm font-bold text-[var(--primary-text)]">
              {tr.twoFactor}
            </span>
            <span className="text-xs text-[var(--muted-text)]">
              {tr.twoFactorDesc}
            </span>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={twoFactorEnabled}
            aria-label="Toggle 2FA"
            onClick={toggle2FA}
            className={`
              relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full
              border-2 border-transparent transition-colors duration-200 ease-in-out
              focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c53938]
              ${twoFactorEnabled ? 'bg-[#c53938]' : 'bg-[var(--toggle-off-bg)]'}
            `}
          >
            <span
              className={`
                pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md
                transform transition duration-200 ease-in-out
                ${twoFactorEnabled ? 'ltr:translate-x-5 rtl:-translate-x-5' : 'translate-x-0'}
              `}
            />
          </button>
        </div>

        {/* ── Sessions Section ── */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-[var(--primary-text)] uppercase tracking-wider text-start">
              {tr.activeSessions}
            </h3>
            <button
              type="button"
              onClick={fetchSessions}
              disabled={loading}
              className="flex items-center gap-1.5 text-xs text-[var(--muted-text)] hover:text-[var(--primary-text)] transition-colors cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{lang === 'ar' ? 'تحديث' : 'Refresh'}</span>
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col gap-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-20 rounded-2xl bg-[var(--surface-input)] animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {currentSession && (
                <div className="flex items-center justify-between gap-4 p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
                      <DeviceIcon type={currentSession.deviceType} />
                    </div>
                    <div className="flex flex-col text-start">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-[var(--primary-text)]">
                          {currentSession.deviceName}
                        </span>
                        <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                          {lang === 'ar' ? 'هذا الجهاز' : 'This Device'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-[11px] text-[var(--muted-text)]">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {currentSession.location}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {timeAgo(currentSession.lastActiveAt, lang)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {otherSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between gap-4 p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--surface-input)]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--surface-soft)] text-[var(--label-text)]">
                      <DeviceIcon type={session.deviceType} />
                    </div>
                    <div className="flex flex-col text-start">
                      <span className="text-xs sm:text-sm font-bold text-[var(--primary-text)]">
                        {session.deviceName}
                      </span>
                      <div className="flex items-center gap-3 mt-1 text-[11px] text-[var(--muted-text)]">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {session.location}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {timeAgo(session.lastActiveAt, lang)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSignOutSession(session.id, session.deviceName)}
                    disabled={revoking === session.id}
                    className="
                      flex items-center gap-1.5 px-3 py-1.5 rounded-xl
                      border border-red-500/20 text-xs font-semibold text-red-400
                      hover:bg-red-500/10 transition-colors duration-150
                      disabled:opacity-50 cursor-pointer
                    "
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>{revoking === session.id ? (lang === 'ar' ? 'جارٍ الخروج...' : 'Signing out...') : (lang === 'ar' ? 'خروج' : 'Sign out')}</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {otherSessions.length > 0 && (
            <div className="pt-2 text-start">
              <button
                type="button"
                onClick={handleSignOutAll}
                disabled={revoking === 'all'}
                className="
                  inline-flex items-center justify-center gap-2
                  h-10 px-5 rounded-full
                  border border-red-500/30 text-xs font-semibold text-[#c53938]
                  hover:bg-red-500/10 transition-colors duration-150
                  disabled:opacity-50 cursor-pointer
                "
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>{revoking === 'all' ? (lang === 'ar' ? 'جارٍ تسجيل الخروج...' : 'Signing out all...') : tr.signOutAll}</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
