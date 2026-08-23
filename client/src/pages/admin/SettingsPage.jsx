import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { userApi, authApi, shippingZoneApi } from '../../services/api';
import { getStoredUser, saveAuthSession, getAuthToken } from '../../utils/auth';

/* ── Mock shipping zones ── */
const initialZones = [
  { id: 1, name: 'Cairo & Giza', eta: '1-2 days', price: 30 },
  { id: 2, name: 'Alexandria', eta: '2-3 days', price: 40 },
  { id: 3, name: 'Delta & Canal', eta: '3-5 days', price: 50 },
  { id: 4, name: 'Upper Egypt', eta: '5-7 days', price: 65 },
];

const tabs = [
  { id: 'profile', label: 'Profile', icon: 'user' },
  { id: 'shipping', label: 'Shipping Zones', icon: 'pin' },
];

/* ── Small icon set (no extra deps) ── */
function TabIcon({ type }) {
  const paths = {
    user: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1m18 0v-1a4 4 0 0 0-3-3.87M14 3.13a4 4 0 0 1 0 7.75M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
    ),
    pin: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-7-6.1-7-11a7 7 0 1 1 14 0c0 4.9-7 11-7 11Z" />
        <circle cx="12" cy="10" r="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
    mail: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18v12H3V6Zm0 0 9 7 9-7" />
    ),
    lock: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 11V8a6 6 0 1 1 12 0v3m-13 0h14v10H5V11Z" />
    ),
    eye: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
    eyeOff: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.6 10.6a3 3 0 0 0 4.24 4.24M9.88 5.09A10.6 10.6 0 0 1 12 5c6.5 0 10 7 10 7a17.6 17.6 0 0 1-3.22 4.19M6.5 6.64A17.9 17.9 0 0 0 2 12s3.5 7 10 7a10.5 10.5 0 0 0 3.02-.44" />
    ),
    edit: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.06 2.06 0 1 1 2.912 2.912L7.5 19.673l-4 1 1-4L16.862 4.487Z" />
    ),
    plus: (
      <path strokeLinecap="round" d="M12 5v14M5 12h14" />
    ),
  };
  return (
    <svg className="h-[18px] w-[18px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      {paths[type]}
    </svg>
  );
}

function PasswordField({ label, value, onChange, placeholder, hint, disabled }) {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-[var(--primary-text)]">{label}</label>
      <div className="relative">
        <input
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className="h-11 w-full rounded-xl border border-[var(--border-color)] bg-[var(--surface-soft)] px-4 pr-11 text-sm text-[var(--primary-text)] placeholder-[var(--secondary-text)] focus:border-[#c53938] focus:outline-none focus:ring-2 focus:ring-[#c53938]/20 disabled:cursor-not-allowed disabled:opacity-60"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          disabled={disabled}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--secondary-text)] hover:text-[var(--primary-text)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <TabIcon type={visible ? 'eyeOff' : 'eye'} />
        </button>
      </div>
      {hint && <p className="mt-1.5 text-xs text-[var(--secondary-text)]">{hint}</p>}
    </div>
  );
}

function ProfileSection() {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('Admin');
  const [lastName, setLastName] = useState('User');
  const [email, setEmail] = useState('admin123@gmail.com');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    authApi.me()
      .then((data) => {
        if (data.user) {
          setFirstName(data.user.firstName || 'Admin');
          setLastName(data.user.lastName || 'User');
          setEmail(data.user.email || 'admin123@gmail.com');
        }
      })
      .catch(() => {
        const local = getStoredUser();
        if (local) {
          setFirstName(local.firstName || 'Admin');
          setLastName(local.lastName || 'User');
          setEmail(local.email || 'admin123@gmail.com');
        }
      });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      /* Update Profile (FirstName, LastName, Email) */
      const profileRes = await userApi.updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
      });

      if (profileRes.user) {
        const token = getAuthToken();
        saveAuthSession({ user: profileRes.user, token });
      }

      /* Update Password if requested */
      if (newPassword) {
        if (!currentPassword) {
          throw new Error('Current password is required to set a new password.');
        }
        if (newPassword.length < 8) {
          throw new Error('New password must be at least 8 characters.');
        }
        if (newPassword !== confirmPassword) {
          throw new Error('New passwords do not match.');
        }

        await userApi.updatePassword({
          currentPassword,
          newPassword,
        });
      }

      setMessage({ type: 'success', text: 'Admin credentials updated in database!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsEditing(false);
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to update settings.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface-bg)] p-6 sm:p-8">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#c53938]/10 text-[#c53938]">
            <TabIcon type="user" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-[var(--primary-text)]">Admin Profile & Security</h2>
            <p className="text-sm text-[var(--secondary-text)]">
              Update your name, email, and password directly in the database.
            </p>
          </div>
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 rounded-full bg-[#c53938] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            <TabIcon type="edit" />
            Edit Profile
          </button>
        )}
      </div>

      {message && (
        <div className={`mt-4 rounded-xl p-3.5 text-xs font-medium ${
          message.type === 'error' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
        }`}>
          {message.text}
        </div>
      )}

      <div className="my-6 h-px bg-[var(--border-color)]" />

      {/* ── Name + Email ── */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-[var(--primary-text)]">First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name"
            disabled={!isEditing}
            className="h-11 w-full rounded-xl border border-[var(--border-color)] bg-[var(--surface-soft)] px-4 text-sm text-[var(--primary-text)] placeholder-[var(--secondary-text)] focus:border-[#c53938] focus:outline-none focus:ring-2 focus:ring-[#c53938]/20 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-[var(--primary-text)]">Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last name"
            disabled={!isEditing}
            className="h-11 w-full rounded-xl border border-[var(--border-color)] bg-[var(--surface-soft)] px-4 text-sm text-[var(--primary-text)] placeholder-[var(--secondary-text)] focus:border-[#c53938] focus:outline-none focus:ring-2 focus:ring-[#c53938]/20 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-[var(--primary-text)]">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            disabled={!isEditing}
            className="h-11 w-full rounded-xl border border-[var(--border-color)] bg-[var(--surface-soft)] px-4 text-sm text-[var(--primary-text)] placeholder-[var(--secondary-text)] focus:border-[#c53938] focus:outline-none focus:ring-2 focus:ring-[#c53938]/20 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>
      </div>

      <div className="my-6 h-px bg-[var(--border-color)]" />

      {/* ── Password ── */}
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-[var(--secondary-text)]">
        Change Password
      </h3>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <PasswordField
            label="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
            disabled={!isEditing}
          />
        </div>
        <PasswordField
          label="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
          hint="Must be at least 8 characters."
          disabled={!isEditing}
        />
        <PasswordField
          label="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Re-enter new password"
          disabled={!isEditing}
        />
      </div>

      {/* ── Save / Cancel ── */}
      {isEditing && (
        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="rounded-full border border-[var(--border-color)] px-6 py-2.5 text-sm font-semibold text-[var(--secondary-text)] transition hover:bg-[var(--surface-soft)] hover:text-[var(--primary-text)]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-[#c53938] px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}
    </form>
  );
}

function ShippingZoneModal({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({
    name: '',
    eta: '',
    price: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        eta: initialData.eta || '',
        price: initialData.price ?? '',
      });
    } else {
      setFormData({ name: '', eta: '', price: '' });
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Zone name is required.');
      return;
    }
    if (!formData.eta.trim()) {
      setError('Estimated delivery time (ETA) is required.');
      return;
    }
    if (formData.price === '' || isNaN(formData.price) || Number(formData.price) < 0) {
      setError('Please enter a valid shipping price.');
      return;
    }

    onSave({
      id: initialData ? initialData.id : Date.now(),
      name: formData.name.trim(),
      eta: formData.eta.trim(),
      price: Number(formData.price),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl border border-[var(--border-color)] bg-[var(--surface-bg)] p-6 shadow-2xl animate-[fadeIn_0.15s_ease-out]">
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4 mb-4">
          <h3 className="text-lg font-bold text-[var(--primary-text)]">
            {initialData ? 'Edit Shipping Zone' : 'Add New Shipping Zone'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[var(--secondary-text)] hover:bg-[var(--surface-soft)] hover:text-[var(--primary-text)] transition"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-rose-500/10 p-3 text-xs font-medium text-rose-500 border border-rose-500/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[var(--primary-text)]">
              Zone Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Cairo & Giza, Red Sea..."
              className="h-11 w-full rounded-xl border border-[var(--border-color)] bg-[var(--surface-soft)] px-4 text-sm text-[var(--primary-text)] placeholder-[var(--secondary-text)] focus:border-[#c53938] focus:outline-none focus:ring-2 focus:ring-[#c53938]/20"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[var(--primary-text)]">
              Estimated Delivery Time (ETA)
            </label>
            <input
              type="text"
              value={formData.eta}
              onChange={(e) => setFormData({ ...formData, eta: e.target.value })}
              placeholder="e.g. 1-2 days, 3-5 business days"
              className="h-11 w-full rounded-xl border border-[var(--border-color)] bg-[var(--surface-soft)] px-4 text-sm text-[var(--primary-text)] placeholder-[var(--secondary-text)] focus:border-[#c53938] focus:outline-none focus:ring-2 focus:ring-[#c53938]/20"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[var(--primary-text)]">
              Shipping Price (EGP)
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="e.g. 35"
              className="h-11 w-full rounded-xl border border-[var(--border-color)] bg-[var(--surface-soft)] px-4 text-sm text-[var(--primary-text)] placeholder-[var(--secondary-text)] focus:border-[#c53938] focus:outline-none focus:ring-2 focus:ring-[#c53938]/20"
            />
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-[var(--border-color)] px-5 py-2 text-xs font-semibold text-[var(--secondary-text)] transition hover:bg-[var(--surface-soft)] hover:text-[var(--primary-text)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-[#c53938] px-6 py-2 text-xs font-semibold text-white transition hover:opacity-90 shadow-sm"
            >
              {initialData ? 'Update Zone' : 'Add Zone'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ShippingZonesSection() {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingZone, setEditingZone] = useState(null);

  const fetchZones = async () => {
    try {
      setLoading(true);
      const data = await shippingZoneApi.getZones();
      let fetched = data.zones || [];

      // If DB has no zones yet, seed initial mock zones into DB automatically
      if (fetched.length === 0) {
        for (const iz of initialZones) {
          try {
            await shippingZoneApi.createZone(iz);
          } catch {
            // ignore seed errors
          }
        }
        const seeded = await shippingZoneApi.getZones();
        fetched = seeded.zones || [];
      }

      setZones(fetched);
    } catch (err) {
      console.error('Failed to fetch shipping zones:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

  const handleAddClick = () => {
    setEditingZone(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (zone) => {
    setEditingZone(zone);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await shippingZoneApi.deleteZone(id);
      setZones((prev) => prev.filter((z) => (z._id || z.id) !== id));
      toast.success('Shipping zone deleted');
    } catch (err) {
      toast.error(err.message || 'Failed to delete shipping zone.');
    }
  };

  const handleSaveZone = async (zoneData) => {
    try {
      if (editingZone) {
        const id = editingZone._id || editingZone.id;
        const updated = await shippingZoneApi.updateZone(id, {
          name: zoneData.name,
          eta: zoneData.eta,
          price: zoneData.price,
        });
        setZones((prev) =>
          prev.map((z) => ((z._id || z.id) === id ? updated.zone || zoneData : z))
        );
        toast.success(`Shipping zone "${zoneData.name}" updated`);
      } else {
        const created = await shippingZoneApi.createZone({
          name: zoneData.name,
          eta: zoneData.eta,
          price: zoneData.price,
        });
        setZones((prev) => [...prev, created.zone]);
        toast.success(`Shipping zone "${zoneData.name}" added`);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to save shipping zone.');
    }
  };

  return (
    <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface-bg)] p-6 sm:p-8">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#c53938]/10 text-[#c53938]">
            <TabIcon type="pin" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-[var(--primary-text)]">Shipping Zones & Rates</h2>
            <p className="text-sm text-[var(--secondary-text)]">
              Manage delivery areas, timeframes, and prices saved directly in MongoDB.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleAddClick}
          className="flex items-center gap-2 rounded-full bg-[#c53938] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 cursor-pointer shadow-sm"
        >
          <TabIcon type="plus" />
          Add Zone
        </button>
      </div>

      <div className="my-6 h-px bg-[var(--border-color)]" />

      {/* ── Zones list ── */}
      {loading ? (
        <div className="p-8 text-center text-sm text-[var(--secondary-text)] animate-pulse">
          Loading shipping zones from database...
        </div>
      ) : zones.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--border-color)] p-8 text-center text-sm text-[var(--secondary-text)]">
          No shipping zones added yet. Click "Add Zone" above to create your first delivery area.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {zones.map((zone) => {
            const id = zone._id || zone.id;
            return (
              <div
                key={id}
                className="flex items-center justify-between gap-4 rounded-xl border border-[var(--border-color)] bg-[var(--surface-soft)] px-4 py-3.5 sm:px-5 hover:border-[var(--border-color)] transition"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#c53938]/10 text-[#c53938]">
                    <TabIcon type="pin" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[var(--primary-text)]">{zone.name}</p>
                    <p className="text-xs text-[var(--secondary-text)]">{zone.eta}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-[var(--primary-text)]">EGP {zone.price}</span>
                  <button
                    type="button"
                    onClick={() => handleEditClick(zone)}
                    title="Edit zone"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--secondary-text)] transition hover:bg-[var(--surface-bg)] hover:text-[var(--primary-text)] cursor-pointer"
                  >
                    <TabIcon type="edit" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(id)}
                    title="Delete zone"
                    className="text-xs font-semibold text-[#c53938] hover:underline cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for Add / Edit */}
      <ShippingZoneModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveZone}
        initialData={editingZone}
      />
    </div>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-[var(--primary-text)]">Settings</h1>
        <p className="text-sm text-[var(--secondary-text)]">Manage your account and store preferences</p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[240px_1fr]">
        {/* ── Sidebar tabs ── */}
        <div className="flex h-fit flex-row gap-2 rounded-2xl border border-[var(--border-color)] bg-[var(--surface-bg)] p-2 lg:flex-col">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-1 items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition lg:flex-none ${
                activeTab === tab.id
                  ? 'bg-[#c53938]/10 text-[#c53938]'
                  : 'text-[var(--secondary-text)] hover:bg-[var(--surface-soft)] hover:text-[var(--primary-text)]'
              }`}
            >
              <TabIcon type={tab.icon} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ── Active section ── */}
        <div>
          {activeTab === 'profile' && <ProfileSection />}
          {activeTab === 'shipping' && <ShippingZonesSection />}
        </div>
      </div>
    </div>
  );
}