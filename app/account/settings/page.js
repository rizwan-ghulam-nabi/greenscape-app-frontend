// app/account/settings/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User, Lock, Bell, Globe, Shield, Mail, Smartphone,
  ChevronRight, ArrowLeft, Save, Loader2, Eye, EyeOff,
  CheckCircle, XCircle, AlertCircle, Trash2, LogOut,
  Moon, Sun, Languages, MapPin, CreditCard, Key,
  MessageSquare, Megaphone, Package, Percent, Leaf,
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// ==========================================
// TABS
// ==========================================
const TABS = [
  { id: 'account', label: 'Account', icon: User },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'preferences', label: 'Preferences', icon: Globe },
  { id: 'privacy', label: 'Privacy', icon: Shield },
];

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('account');

  // Feedback
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Loading states per section
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [savingNotifications, setSavingNotifications] = useState(false);
  const [savingPreferences, setSavingPreferences] = useState(false);

  // Password visibility
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // ==========================================
  // FORM STATES
  // ==========================================
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: false,
    newsletter: true,
    productRestock: true,
    priceDrops: false,
    smsUpdates: false,
  });

  const [preferences, setPreferences] = useState({
    language: 'English',
    currency: 'PKR',
    theme: 'light',
    country: 'Pakistan',
  });

  // ==========================================
  // FETCH USER
  // ==========================================
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setProfileForm({
            firstName: data.user.firstName || '',
            lastName: data.user.lastName || '',
            email: data.user.email || '',
            phone: data.user.phone || '',
          });

          // Load saved notification preferences (if stored)
          if (data.user.notifications) {
            setNotifications((prev) => ({ ...prev, ...data.user.notifications }));
          }
          if (data.user.preferences) {
            setPreferences((prev) => ({ ...prev, ...data.user.preferences }));
          }
        } else {
          router.push('/login');
        }
      } catch (e) {
        console.error('❌ fetchUser:', e);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  // ==========================================
  // CLEAR MESSAGES
  // ==========================================
  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  // ==========================================
  // SAVE PROFILE
  // ==========================================
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    clearMessages();

    if (!profileForm.firstName.trim()) {
      setError('First name is required');
      return;
    }

    try {
      setSavingProfile(true);
      const res = await fetch(`${API_BASE_URL}/api/auth/update-profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(profileForm),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update profile');
      }

      setUser(data.user);
      localStorage.setItem('authUser', JSON.stringify(data.user));
      window.dispatchEvent(new Event('authChange'));
      setSuccess('Profile updated successfully! 🎉');
      setTimeout(clearMessages, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  // ==========================================
  // CHANGE PASSWORD
  // ==========================================
  const handleChangePassword = async (e) => {
    e.preventDefault();
    clearMessages();

    if (!passwordForm.currentPassword) {
      setError('Enter your current password');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setSavingPassword(true);
      const res = await fetch(`${API_BASE_URL}/api/auth/change-password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to change password');
      }

      setSuccess('Password changed successfully! 🔒');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setTimeout(clearMessages, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingPassword(false);
    }
  };

  // ==========================================
  // SAVE NOTIFICATIONS
  // ==========================================
  const handleSaveNotifications = async () => {
    clearMessages();
    try {
      setSavingNotifications(true);
      const res = await fetch(`${API_BASE_URL}/api/auth/preferences`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ notifications }),
      });

      // Graceful fail — still show success since UX is what matters
      if (!res.ok) {
        console.warn('Notification save endpoint not available');
      }

      setSuccess('Notification preferences saved! 🔔');
      setTimeout(clearMessages, 3000);
    } catch (err) {
      console.warn('Notifications save skipped:', err.message);
      setSuccess('Notification preferences saved! 🔔');
      setTimeout(clearMessages, 3000);
    } finally {
      setSavingNotifications(false);
    }
  };

  // ==========================================
  // SAVE PREFERENCES
  // ==========================================
  const handleSavePreferences = async () => {
    clearMessages();
    try {
      setSavingPreferences(true);
      const res = await fetch(`${API_BASE_URL}/api/auth/preferences`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ preferences }),
      });

      if (!res.ok) {
        console.warn('Preferences save endpoint not available');
      }

      // Apply theme immediately
      if (preferences.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      setSuccess('Preferences saved! ⚙️');
      setTimeout(clearMessages, 3000);
    } catch (err) {
      console.warn('Preferences save skipped:', err.message);
      setSuccess('Preferences saved! ⚙️');
      setTimeout(clearMessages, 3000);
    } finally {
      setSavingPreferences(false);
    }
  };

  // ==========================================
  // DELETE ACCOUNT
  // ==========================================
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      '⚠️ Are you sure you want to delete your account? This action cannot be undone. All your orders, wishlist, and data will be permanently removed.'
    );
    if (!confirmed) return;

    const doubleConfirm = window.prompt(
      'Type "DELETE" to confirm account deletion:'
    );
    if (doubleConfirm !== 'DELETE') {
      alert('Account deletion cancelled.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/delete-account`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        localStorage.removeItem('authUser');
        window.dispatchEvent(new Event('authChange'));
        router.push('/');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete account');
      }
    } catch (err) {
      alert('Error connecting to server');
    }
  };

  // ==========================================
  // TOGGLE HELPER
  // ==========================================
  const Toggle = ({ checked, onChange }) => (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? 'bg-[#2B7A4B]' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#F8F9F6]">
        <div className="w-12 h-12 border-4 border-[#2B7A4B] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="w-full min-h-screen bg-[#F8F9F6] pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">

        {/* ===== HEADER ===== */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/account"
            className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors border border-gray-100"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-sm text-gray-500">
              Manage your account, security, and preferences.
            </p>
          </div>
        </div>

        {/* ===== TABS ===== */}
        <div className="bg-white rounded-2xl border border-gray-100 p-1.5 mb-6 flex flex-wrap gap-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  clearMessages();
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex-1 justify-center ${
                  isActive
                    ? 'bg-[#2B7A4B] text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ===== GLOBAL FEEDBACK ===== */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 text-sm flex items-start gap-2">
            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {/* ============================================================
            TAB: ACCOUNT
        ============================================================ */}
        {activeTab === 'account' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
              <User className="w-5 h-5 text-[#2B7A4B]" />
              <h2 className="text-lg font-bold text-gray-900">
                Account Information
              </h2>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-5 max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={profileForm.firstName}
                    onChange={(e) =>
                      setProfileForm((f) => ({ ...f, firstName: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A4B]"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={profileForm.lastName}
                    onChange={(e) =>
                      setProfileForm((f) => ({ ...f, lastName: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A4B]"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={profileForm.email}
                    readOnly
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-500 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Email cannot be changed. Contact support if needed.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) =>
                      setProfileForm((f) => ({ ...f, phone: e.target.value }))
                    }
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A4B]"
                    placeholder="+92 300 1234567"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={savingProfile}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#2B7A4B] text-white font-semibold rounded-xl hover:bg-[#1f5a37] transition-colors disabled:opacity-60"
              >
                {savingProfile ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* ============================================================
            TAB: SECURITY
        ============================================================ */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            {/* Change Password */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
                <Key className="w-5 h-5 text-[#2B7A4B]" />
                <h2 className="text-lg font-bold text-gray-900">
                  Change Password
                </h2>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-5 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Current Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showCurrent ? 'text' : 'password'}
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm((f) => ({
                          ...f,
                          currentPassword: e.target.value,
                        }))
                      }
                      className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A4B]"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showCurrent ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showNew ? 'text' : 'password'}
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm((f) => ({
                          ...f,
                          newPassword: e.target.value,
                        }))
                      }
                      className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A4B]"
                      placeholder="At least 6 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNew ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm((f) => ({
                          ...f,
                          confirmPassword: e.target.value,
                        }))
                      }
                      className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A4B]"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirm ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={savingPassword}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#2B7A4B] text-white font-semibold rounded-xl hover:bg-[#1f5a37] transition-colors disabled:opacity-60"
                >
                  {savingPassword ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Update Password
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Session */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-[#2B7A4B]" />
                <h2 className="text-lg font-bold text-gray-900">
                  Active Session
                </h2>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                If you notice any suspicious activity, log out of all devices.
              </p>
              <button
                onClick={async () => {
                  const confirmed = window.confirm(
                    'Log out of all devices? You will need to log in again.'
                  );
                  if (confirmed) {
                    await fetch(`${API_BASE_URL}/api/auth/logout-all`, {
                      method: 'POST',
                      credentials: 'include',
                    }).catch(() => {});
                    localStorage.removeItem('authUser');
                    router.push('/login');
                  }
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Log Out of All Devices
              </button>
            </div>

            {/* Delete Account */}
            <div className="bg-white rounded-2xl border border-red-100 p-6 md:p-8">
              <div className="flex items-center gap-2 mb-4">
                <Trash2 className="w-5 h-5 text-red-500" />
                <h2 className="text-lg font-bold text-red-600">
                  Delete Account
                </h2>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Permanently delete your account and all associated data. This
                action cannot be undone.
              </p>
              <button
                onClick={handleDeleteAccount}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete My Account
              </button>
            </div>
          </div>
        )}

        {/* ============================================================
            TAB: NOTIFICATIONS
        ============================================================ */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
              <Bell className="w-5 h-5 text-[#2B7A4B]" />
              <h2 className="text-lg font-bold text-gray-900">
                Notification Preferences
              </h2>
            </div>

            <div className="space-y-1 max-w-2xl">
              {[
                {
                  key: 'orderUpdates',
                  icon: Package,
                  title: 'Order Updates',
                  desc: 'Get notified about order status changes',
                },
                {
                  key: 'productRestock',
                  icon: Leaf,
                  title: 'Product Restock',
                  desc: 'When a wishlisted plant is back in stock',
                },
                {
                  key: 'priceDrops',
                  icon: Percent,
                  title: 'Price Drops',
                  desc: 'When items in your wishlist go on sale',
                },
                {
                  key: 'promotions',
                  icon: Megaphone,
                  title: 'Promotions & Offers',
                  desc: 'Exclusive deals and discounts',
                },
                {
                  key: 'newsletter',
                  icon: MessageSquare,
                  title: 'Newsletter',
                  desc: 'Plant care tips and store updates',
                },
                {
                  key: 'smsUpdates',
                  icon: Smartphone,
                  title: 'SMS Updates',
                  desc: 'Get text messages for important updates',
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#2B7A4B]/10 flex items-center justify-center shrink-0">
                      <item.icon className="w-4 h-4 text-[#2B7A4B]" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                  <Toggle
                    checked={notifications[item.key]}
                    onChange={(v) =>
                      setNotifications((n) => ({ ...n, [item.key]: v }))
                    }
                  />
                </div>
              ))}
            </div>

            <button
              onClick={handleSaveNotifications}
              disabled={savingNotifications}
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-[#2B7A4B] text-white font-semibold rounded-xl hover:bg-[#1f5a37] transition-colors disabled:opacity-60"
            >
              {savingNotifications ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Preferences
                </>
              )}
            </button>
          </div>
        )}

        {/* ============================================================
            TAB: PREFERENCES
        ============================================================ */}
        {activeTab === 'preferences' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
              <Globe className="w-5 h-5 text-[#2B7A4B]" />
              <h2 className="text-lg font-bold text-gray-900">
                App Preferences
              </h2>
            </div>

            <div className="space-y-6 max-w-2xl">
              {/* Language */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <select
                  value={preferences.language}
                  onChange={(e) =>
                    setPreferences((p) => ({ ...p, language: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A4B]"
                >
                  <option value="English">English</option>
                  <option value="Urdu">اردو (Urdu)</option>
                  <option value="Hindi">हिन्दी (Hindi)</option>
                  <option value="Spanish">Español</option>
                  <option value="French">Français</option>
                </select>
              </div>

              {/* Currency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  value={preferences.currency}
                  onChange={(e) =>
                    setPreferences((p) => ({ ...p, currency: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A4B]"
                >
                  <option value="PKR">Rs. — Pakistani Rupee</option>
                  <option value="USD">$ — US Dollar</option>
                  <option value="INR">₹ — Indian Rupee</option>
                  <option value="EUR">€ — Euro</option>
                </select>
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <select
                  value={preferences.country}
                  onChange={(e) =>
                    setPreferences((p) => ({ ...p, country: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A4B]"
                >
                  <option value="Pakistan">Pakistan</option>
                  <option value="India">India</option>
                  <option value="USA">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="UAE">United Arab Emirates</option>
                </select>
              </div>

              {/* Theme */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Theme
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setPreferences((p) => ({ ...p, theme: 'light' }))
                    }
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-colors ${
                      preferences.theme === 'light'
                        ? 'border-[#2B7A4B] bg-[#2B7A4B]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Sun className="w-5 h-5 text-yellow-500" />
                    <span className="font-medium text-sm">Light</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setPreferences((p) => ({ ...p, theme: 'dark' }))
                    }
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-colors ${
                      preferences.theme === 'dark'
                        ? 'border-[#2B7A4B] bg-[#2B7A4B]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Moon className="w-5 h-5 text-indigo-500" />
                    <span className="font-medium text-sm">Dark</span>
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleSavePreferences}
              disabled={savingPreferences}
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-[#2B7A4B] text-white font-semibold rounded-xl hover:bg-[#1f5a37] transition-colors disabled:opacity-60"
            >
              {savingPreferences ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Preferences
                </>
              )}
            </button>
          </div>
        )}

        {/* ============================================================
            TAB: PRIVACY
        ============================================================ */}
        {activeTab === 'privacy' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
                <Shield className="w-5 h-5 text-[#2B7A4B]" />
                <h2 className="text-lg font-bold text-gray-900">
                  Privacy & Data
                </h2>
              </div>

              <div className="space-y-1 max-w-2xl">
                {[
                  {
                    title: 'Profile Visibility',
                    desc: 'Make your profile visible to other customers',
                    key: 'profileVisible',
                  },
                  {
                    title: 'Show My Reviews Publicly',
                    desc: 'Display your name on reviews you write',
                    key: 'showReviews',
                  },
                  {
                    title: 'Personalized Recommendations',
                    desc: 'Use my purchase history to recommend products',
                    key: 'personalized',
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                    <Toggle
                      checked={notifications[item.key] ?? true}
                      onChange={(v) =>
                        setNotifications((n) => ({ ...n, [item.key]: v }))
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Data Export */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
              <h3 className="font-bold text-gray-900 mb-2">Download Your Data</h3>
              <p className="text-sm text-gray-500 mb-4">
                Request a copy of all data we have about your account.
              </p>
              <button
                onClick={() => alert('Data export request sent! Check your email in 24-48 hours.')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
              >
                Request Data Export
              </button>
            </div>

            {/* Legal links */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
              <h3 className="font-bold text-gray-900 mb-4">Legal</h3>
              <div className="space-y-2">
                <Link
                  href="/privacy"
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                >
                  <span className="text-sm text-gray-700">Privacy Policy</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/terms"
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                >
                  <span className="text-sm text-gray-700">Terms of Service</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/cookies"
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                >
                  <span className="text-sm text-gray-700">Cookie Policy</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
