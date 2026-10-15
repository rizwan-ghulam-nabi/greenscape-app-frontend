// better version for performance
// app/account/profile/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  User, Mail, Phone, MapPin, Shield,
  Calendar, Edit3, Key, Save, ArrowLeft,
  Camera, Trash2,
  ShoppingBag, Star,
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// ✅ FIX: Cloudinary transform for avatar (small circular image)
const AVATAR_TRANSFORM = 'w_224,h_224,c_fill,g_auto,q_auto:good,f_auto';

const optimizeAvatarUrl = (url) => {
  if (!url || typeof url !== 'string') return url;
  if (!url.includes('res.cloudinary.com')) return url;
  if (/\/upload\/[a-z]_/.test(url)) return url;
  return url.replace('/upload/', `/upload/${AVATAR_TRANSFORM}/`);
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [imageKey, setImageKey] = useState(Date.now());

  // ===== REAL STATS STATE =====
  const [stats, setStats] = useState({ ordersCount: 0, avgRating: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  // ===== CLOUDINARY STATE =====
  const [uploadingImage, setUploadingImage] = useState(false);
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_PRODUCT; // or general preset

  // ===== FORM STATE =====
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    bio: '',
    gender: '',
    language: 'English',
  });

  // ==========================================
  // ✅ LOAD USER DATA
  // ==========================================
  const fetchUser = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setFormData({
          firstName: data.user.firstName || '',
          lastName: data.user.lastName || '',
          email: data.user.email || '',
          phone: data.user.phone || '',
          country: data.user.country || '',
          bio: data.user.bio || 'Plant lover and nature enthusiast. 🌱',
          gender: data.user.gender || 'Prefer not to say',
          language: 'English',
        });
      } else {
        router.push('/login');
      }
    } catch {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // ✅ FETCH REAL STATS
  // ==========================================
  const fetchStats = async () => {
    try {
      setStatsLoading(true);

      let orders = [];
      try {
        const ordersRes = await fetch(`${API_BASE_URL}/api/orders/my-orders`, {
          credentials: 'include',
        });
        if (ordersRes.ok) {
          const data = await ordersRes.json();
          orders = data.orders || data.data || data || [];
          if (!Array.isArray(orders)) orders = [];
        }
      } catch {
        // silent
      }

      let reviews = [];
      try {
        const reviewsRes = await fetch(`${API_BASE_URL}/api/reviews/my`, {
          credentials: 'include',
        });
        if (reviewsRes.ok) {
          const data = await reviewsRes.json();
          reviews = data.reviews || data.data || data || [];
          if (!Array.isArray(reviews)) reviews = [];
        }
      } catch {
        // silent
      }

      const avgRating =
        reviews.length > 0
          ? Number(
              (
                reviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
                reviews.length
              ).toFixed(1)
            )
          : 0;

      setStats({ ordersCount: orders.length, avgRating });
    } catch {
      // silent
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    // ✅ FIX: run both fetches in parallel
    Promise.all([fetchUser(), fetchStats()]);

    const handleAuthChange = () => {
      fetchUser();
      fetchStats();
    };
    window.addEventListener('authChange', handleAuthChange);

    return () => {
      window.removeEventListener('authChange', handleAuthChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  // ===== HANDLE FORM CHANGES =====
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ===== TOGGLE EDIT MODE =====
  const toggleEdit = () => {
    if (isEditing) {
      if (user) {
        setFormData({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          phone: user.phone || '',
          country: user.country || '',
          bio: user.bio || 'Plant lover and nature enthusiast. 🌱',
          gender: user.gender || 'Prefer not to say',
          language: 'English',
        });
      }
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  // ===== CLOUDINARY UPLOAD =====
  const openCloudinaryWidget = () => {
    if (!cloudName || !uploadPreset) {
      alert('Cloudinary configuration missing.');
      return;
    }

    if (!document.querySelector('script[src*="upload-widget.cloudinary"]')) {
      const script = document.createElement('script');
      script.src = 'https://upload-widget.cloudinary.com/global/all.js';
      script.async = true;
      document.body.appendChild(script);
      script.onload = () => openCloudinaryWidget();
      return;
    }

    if (window.cloudinary) {
      const widget = window.cloudinary.createUploadWidget(
        {
          cloudName: cloudName,
          uploadPreset: uploadPreset,
          sources: ['local', 'url'],
          multiple: false,
          cropping: true,
          croppingAspectRatio: 1,
          resourceType: 'image',
          // ✅ FIX: cap avatar upload at 1 MB
          maxFileSize: 1000000,
          clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'avif'],
        },
        async (error, result) => {
          if (!error && result && result.event === 'success') {
            if (result.info.resource_type === 'image') {
              // ✅ FIX: transform the URL before saving
              const optimized = optimizeAvatarUrl(result.info.secure_url);
              setUploadingImage(false);
              await saveProfileImageToBackend(optimized);
            } else {
              alert('Upload failed: Please select an image file.');
              setUploadingImage(false);
            }
          } else if (error) {
            setUploadingImage(false);
          }
        }
      );
      setUploadingImage(true);
      widget.open();
    } else {
      setTimeout(() => openCloudinaryWidget(), 500);
    }
  };

  // ===== SAVE PROFILE IMAGE TO BACKEND =====
  const saveProfileImageToBackend = async (imageUrl) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/update-profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ profileImage: imageUrl }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.user && data.user.profileImage) {
          const updatedUser = { ...data.user, profileImage: data.user.profileImage };
          setUser(updatedUser);
          try {
            localStorage.setItem('authUser', JSON.stringify(updatedUser));
          } catch {}
          window.dispatchEvent(new Event('authChange'));
          window.dispatchEvent(new Event('profileImageUpdated'));
          setImageKey(Date.now());
        } else {
          window.location.reload();
        }
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Failed to save profile image');
      }
    } catch {
      alert('Error connecting to server');
    }
  };

  // ===== REMOVE PROFILE IMAGE =====
  const removeProfileImage = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/update-profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ profileImage: null }),
      });

      if (res.ok) {
        const data = await res.json();
        const updatedUser = { ...data.user, profileImage: null };
        setUser(updatedUser);
        setImageKey(Date.now());
        try {
          localStorage.setItem('authUser', JSON.stringify(updatedUser));
        } catch {}
        window.dispatchEvent(new Event('authChange'));
        window.dispatchEvent(new Event('profileImageUpdated'));
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Failed to remove profile image');
      }
    } catch {
      alert('Error removing profile image');
    }
  };

  // ===== SAVE PROFILE CHANGES =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/update-profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          country: formData.country,
          bio: formData.bio,
          gender: formData.gender,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const updatedUser = { ...data.user };
        setUser(updatedUser);
        try {
          localStorage.setItem('authUser', JSON.stringify(updatedUser));
        } catch {}
        window.dispatchEvent(new Event('authChange'));
        setIsEditing(false);
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Failed to update profile');
      }
    } catch {
      alert('Error connecting to server');
    } finally {
      setIsSaving(false);
    }
  };

  // ===== DATE FORMATTER =====
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return 'N/A';
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div
          className="w-12 h-12 border-4 border-[#2B7A4B] border-t-transparent rounded-full animate-spin"
          role="status"
          aria-label="Loading profile"
        />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="w-full h-full flex flex-col justify-start bg-gray-50">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 lg:py-10">
        {/* ===== PAGE HEADER ===== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Link
              href="/account"
              aria-label="Back to account"
              className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
              <p className="text-sm text-gray-500">
                Manage your account information and preferences.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleEdit}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm ${
                isEditing
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-[#2B7A4B] text-white hover:bg-[#23663e]'
              }`}
            >
              {isEditing ? (
                'Cancel'
              ) : (
                <>
                  <Edit3 className="w-4 h-4" /> Edit Profile
                </>
              )}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#2B7A4B] text-white rounded-lg text-sm font-medium hover:bg-[#23663e] transition-colors shadow-sm disabled:opacity-70"
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save Changes
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* ===== MAIN GRID ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* === LEFT COLUMN: PROFILE SUMMARY === */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center">
              {/* ===== PROFILE PICTURE ===== */}
              <div className="relative w-28 h-28 mx-auto mb-4">
                {user?.profileImage ? (
                  <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-sm bg-[#2B7A4B] relative">
                    <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-3xl">
                      {user.firstName?.[0]}
                      {user.lastName?.[0]}
                    </div>
                    {/* ✅ FIX: Cloudinary transform + no cache-busting query (cache-bust via key) */}
                    <Image
                      key={imageKey}
                      src={optimizeAvatarUrl(user.profileImage)}
                      alt={`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Profile'}
                      fill
                      sizes="112px"
                      className="object-cover"
                      priority
                    />
                  </div>
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-[#2B7A4B] to-[#4ADE80] flex items-center justify-center border-4 border-white shadow-sm">
                    <span className="text-4xl font-bold text-white">
                      {user.firstName?.[0]}
                      {user.lastName?.[0]}
                    </span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={openCloudinaryWidget}
                  disabled={uploadingImage}
                  aria-label="Upload profile picture"
                  className="absolute bottom-1 right-1 bg-white rounded-full p-1.5 shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  {uploadingImage ? (
                    <div className="w-4 h-4 border-2 border-[#2B7A4B] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4 text-[#2B7A4B]" />
                  )}
                </button>

                {user?.profileImage && (
                  <button
                    type="button"
                    onClick={removeProfileImage}
                    aria-label="Remove profile picture"
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* ✅ FIX: name + email now fully responsive */}
              <h2
                className="text-xl font-bold text-gray-900 truncate px-2"
                title={`${user.firstName || ''} ${user.lastName || ''}`.trim()}
              >
                {user.firstName} {user.lastName}
              </h2>

              <p
                className="text-sm text-gray-500 mb-2 break-all px-2 leading-tight"
                title={user.email}
              >
                {user.email}
              </p>

              <p className="text-xs text-[#2B7A4B] bg-[#2B7A4B]/10 inline-block px-3 py-1 rounded-full font-medium capitalize">
                {user.role || 'Customer'}
              </p>

              {/* ===== QUICK STATS ===== */}
              <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-gray-100">
                <div className="bg-gray-50 rounded-lg p-3">
                  <ShoppingBag className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                  {statsLoading ? (
                    <div className="h-6 w-10 bg-gray-200 rounded mx-auto animate-pulse" />
                  ) : (
                    <p className="text-lg font-bold text-gray-900">
                      {stats.ordersCount}
                    </p>
                  )}
                  <p className="text-[10px] text-gray-500 uppercase">Orders</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <Star className="w-4 h-4 text-yellow-500 mx-auto mb-1" />
                  {statsLoading ? (
                    <div className="h-6 w-10 bg-gray-200 rounded mx-auto animate-pulse" />
                  ) : (
                    <p className="text-lg font-bold text-gray-900">
                      {stats.avgRating > 0 ? stats.avgRating : '—'}
                    </p>
                  )}
                  <p className="text-[10px] text-gray-500 uppercase">Rating</p>
                </div>
              </div>

              {/* ===== JOINED DATE ===== */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4 text-[#2B7A4B]" />
                  <span>
                    Joined:{' '}
                    <span className="font-medium text-gray-900">
                      {user.createdAt ? formatDate(user.createdAt) : 'Recently'}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* === RIGHT COLUMN: PERSONAL DETAILS === */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
                <User className="w-5 h-5 text-[#2B7A4B]" />
                <h3 className="text-lg font-bold text-gray-900">Personal Details</h3>
              </div>

              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    First Name
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Enter your first name"
                        aria-label="First name"
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A4B]"
                        required
                      />
                    </div>
                  ) : (
                    <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400 shrink-0" />
                      <span className="truncate">
                        {user.firstName || (
                          <span className="text-gray-400 italic">Not provided</span>
                        )}
                      </span>
                    </div>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Last Name
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Enter your last name"
                        aria-label="Last name"
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A4B]"
                        required
                      />
                    </div>
                  ) : (
                    <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400 shrink-0" />
                      <span className="truncate">
                        {user.lastName || (
                          <span className="text-gray-400 italic">Not provided</span>
                        )}
                      </span>
                    </div>
                  )}
                </div>

                {/* Email */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        aria-label="Email address"
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A4B]"
                        required
                      />
                    </div>
                  ) : (
                    <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                      <span className="break-all">
                        {user.email || (
                          <span className="text-gray-400 italic">Not provided</span>
                        )}
                      </span>
                    </div>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="e.g. +1 (555) 123-4567"
                        aria-label="Phone number"
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A4B]"
                      />
                    </div>
                  ) : (
                    <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                      <span className="truncate">
                        {user.phone || (
                          <span className="text-gray-400 italic">Not provided</span>
                        )}
                      </span>
                    </div>
                  )}
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Country / Region
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        placeholder="e.g. United States"
                        aria-label="Country"
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A4B]"
                      />
                    </div>
                  ) : (
                    <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                      <span className="truncate">
                        {user.country || (
                          <span className="text-gray-400 italic">Not provided</span>
                        )}
                      </span>
                    </div>
                  )}
                </div>

                {/* Bio */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    About Me
                  </label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Tell us a little about yourself..."
                      aria-label="Bio"
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A4B] resize-none"
                    />
                  ) : (
                    <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
                      {user.bio || (
                        <span className="text-gray-400 italic">
                          No bio yet. Click Edit to add one!
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Gender
                  </label>
                  {isEditing ? (
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      aria-label="Gender"
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A4B]"
                    >
                      <option value="Prefer not to say">Prefer not to say</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Non-binary">Non-binary</option>
                    </select>
                  ) : (
                    <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
                      {user.gender || (
                        <span className="text-gray-400 italic">Not specified</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Language */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Preferred Language
                  </label>
                  {isEditing ? (
                    <select
                      name="language"
                      value={formData.language}
                      onChange={handleChange}
                      aria-label="Preferred language"
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A4B]"
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                    </select>
                  ) : (
                    <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
                      {formData.language || (
                        <span className="text-gray-400 italic">Not selected</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Change Password */}
                <div className="md:col-span-2 pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Shield className="w-4 h-4 text-[#2B7A4B]" />
                    <span>Secure your account with a strong password.</span>
                  </div>
                  <Link
                    href="/account/change-password"
                    className="text-[#2B7A4B] text-sm font-medium hover:underline flex items-center gap-1"
                  >
                    <Key className="w-4 h-4" />
                    Change Password
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}