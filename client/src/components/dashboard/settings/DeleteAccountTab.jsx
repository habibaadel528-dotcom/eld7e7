import React, { useState } from 'react';
import { AlertTriangle, Trash2, ShieldAlert } from 'lucide-react';

export default function DeleteAccountTab() {
  const [confirmInput, setConfirmInput] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const isConfirmed = confirmInput.trim() === 'DELETE';

  const handleDelete = (e) => {
    e.preventDefault();
    if (!isConfirmed) return;
    setIsDeleting(true);
    setTimeout(() => { setIsDeleting(false); setDeleted(true); }, 1200);
  };

  return (
    <div className="rounded-[24px] border border-red-500/25 bg-[var(--surface-card)] p-6 sm:p-10 shadow-xs relative overflow-hidden transition-colors duration-250">

      {/* Danger stripe at top */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-400 via-[#c53938] to-red-600" />

      {/* Header */}
      <div className="flex items-start gap-4 mb-6 pb-6 border-b border-[var(--border-color)]">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-500/15 text-[#c53938]">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[var(--primary-text)]">Delete Account</h2>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] mt-1">
            Permanently delete your profile, order history, and all account data.
          </p>
        </div>
      </div>

      {deleted ? (
        <div className="p-6 rounded-[18px] bg-red-500/10 border border-red-500/20 text-red-400 space-y-3 text-center">
          <ShieldAlert className="h-10 w-10 text-[#c53938] mx-auto" />
          <h3 className="text-lg font-bold text-[var(--primary-text)]">Account Deletion Initiated</h3>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] max-w-md mx-auto">
            Your request has been processed. You will be signed out shortly.
          </p>
        </div>
      ) : (
        <div className="space-y-6 max-w-xl">
          {/* Warning box */}
          <div className="p-5 rounded-[18px] bg-red-500/8 border border-red-500/20 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-[#c53938]">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>Warning: This action is permanent and irreversible</span>
            </div>
            <p className="text-xs sm:text-sm text-[var(--secondary-text)] leading-relaxed">
              Once deleted, your personal information, order history, saved addresses, wishlist items, and payment methods will be permanently erased and cannot be recovered.
            </p>
          </div>

          {/* Confirmation form */}
          <form onSubmit={handleDelete} className="space-y-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="confirmDelete" className="text-xs sm:text-[13px] font-semibold text-[var(--label-text)]">
                Type <span className="font-bold text-[#c53938]">DELETE</span> to confirm:
              </label>
              <input
                id="confirmDelete"
                type="text"
                value={confirmInput}
                onChange={(e) => setConfirmInput(e.target.value)}
                placeholder="TYPE DELETE TO CONFIRM"
                className="
                  h-12 w-full rounded-[14px]
                  border border-[var(--input-border)]
                  bg-[var(--surface-input)]
                  px-4 text-sm font-bold text-[var(--primary-text)]
                  uppercase tracking-widest
                  outline-none transition-all
                  focus:border-[#c53938] focus:ring-2 focus:ring-[#c53938]/15
                  placeholder:text-[var(--muted-text)] placeholder:normal-case placeholder:tracking-normal placeholder:font-normal
                "
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={!isConfirmed || isDeleting}
                className="
                  w-full sm:w-auto inline-flex items-center justify-center gap-2
                  rounded-full border-2 border-[#c53938]
                  bg-transparent px-8 py-3
                  text-xs sm:text-sm font-bold text-[#c53938]
                  transition-all hover:bg-[#c53938] hover:text-white
                  active:scale-[0.98] shadow-xs
                  disabled:opacity-40 disabled:cursor-not-allowed
                  disabled:hover:bg-transparent disabled:hover:text-[#c53938]
                  cursor-pointer
                "
              >
                <Trash2 className="h-4 w-4" />
                {isDeleting ? 'Deleting Account...' : 'Delete My Account'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
