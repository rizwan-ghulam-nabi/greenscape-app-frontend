'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Plus, 
  Home, 
  Briefcase, 
  Heart, 
  Gift, 
  Edit2, 
  MoreVertical, 
  Trash2, 
  CheckCircle, 
  MapPin, 
  Phone, 
  Lock,
  ShoppingBag, 
  User,
  LayoutGrid,
  Leaf,
  Box,
  X
} from 'lucide-react';

export default function AddressesPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal & Form State
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Delete State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);

  // ===== FORM DATA STATE =====
  const [formData, setFormData] = useState({
    type: 'home',
    label: '',
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phone: '',
    isDefault: false,
  });

  // ===== FETCH REAL USER & ADDRESSES =====
  const fetchData = async () => {
    try {
      const userRes = await fetch('http://localhost:5000/api/auth/me', {
        credentials: 'include',
      });

      if (!userRes.ok) {
        router.push('/login');
        return;
      }

      const userData = await userRes.json();
      setUser(userData.user);

      const addrRes = await fetch('http://localhost:5000/api/addresses', {
        credentials: 'include',
      });
      
      if (addrRes.ok) {
        const addrData = await addrRes.json();
        setAddresses(addrData.addresses || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [router]);

  // ===== HANDLE FORM INPUT CHANGES =====
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // ===== OPEN ADD/EDIT MODAL =====
  const openAddModal = () => {
    setEditingAddress(null);
    setFormData({
      type: 'home',
      label: '',
      fullName: user ? `${user.firstName} ${user.lastName}` : '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      phone: user?.phone || '',
      isDefault: false,
    });
    setShowModal(true);
  };

  const openEditModal = (address) => {
    setEditingAddress(address);
    setFormData({
      type: address.type || 'home',
      label: address.label || '',
      fullName: address.fullName || (user ? `${user.firstName} ${user.lastName}` : ''),
      addressLine1: address.addressLine1 || '',
      addressLine2: address.addressLine2 || '',
      city: address.city || '',
      state: address.state || '',
      postalCode: address.postalCode || '',
      country: address.country || '',
      phone: address.phone || (user?.phone || ''),
      isDefault: address.isDefault || false,
    });
    setShowModal(true);
  };

  // ===== SAVE ADDRESS (CREATE OR UPDATE) =====
  const handleSaveAddress = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const url = editingAddress 
        ? `http://localhost:5000/api/addresses/${editingAddress._id}` 
        : 'http://localhost:5000/api/addresses';
      
      const method = editingAddress ? 'PUT' : 'POST';

      // ✅ Ensure all required fields are present
      const addressData = {
        type: formData.type || 'home',
        label: formData.label || 'Home',
        fullName: formData.fullName || (user ? `${user.firstName} ${user.lastName}` : 'Guest User'),
        addressLine1: formData.addressLine1 || '',
        addressLine2: formData.addressLine2 || '',
        city: formData.city || '',
        state: formData.state || '',
        postalCode: formData.postalCode || '',
        country: formData.country || 'Pakistan',
        phone: formData.phone || user?.phone || '03001234567',
        isDefault: formData.isDefault || false,
      };

      console.log('📤 Sending address data:', addressData);

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(addressData),
      });

      if (res.ok) {
        const data = await res.json();
        console.log('✅ Address saved:', data);
        setShowModal(false);
        fetchData();
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Failed to save address');
      }
    } catch (error) {
      console.error('Error saving address:', error);
      alert('Error connecting to server');
    } finally {
      setIsSaving(false);
    }
  };

  // ===== DELETE ADDRESS =====
  const confirmDelete = (id) => {
    setAddressToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/addresses/${addressToDelete}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        setShowDeleteModal(false);
        setAddressToDelete(null);
        fetchData();
      } else {
        alert('Failed to delete address');
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      alert('Error connecting to server');
    }
  };

  // ===== SET DEFAULT ADDRESS =====
  const handleSetDefault = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/addresses/${id}/default`, {
        method: 'PUT',
        credentials: 'include',
      });

      if (res.ok) {
        fetchData();
      } else {
        alert('Failed to set default address');
      }
    } catch (error) {
      console.error('Error setting default address:', error);
    }
  };

  // ===== HELPER FUNCTIONS (UI) =====
  const getTypeIcon = (type) => {
    switch(type) {
      case 'home': return <Home className="w-6 h-6 text-[#2B7A4B]" />;
      case 'office': return <Briefcase className="w-6 h-6 text-blue-600" />;
      case 'parents': return <Heart className="w-6 h-6 text-rose-500" />;
      case 'gift': return <Gift className="w-6 h-6 text-purple-500" />;
      default: return <MapPin className="w-6 h-6 text-gray-600" />;
    }
  };

  const getTypeBg = (type) => {
    switch(type) {
      case 'home': return 'bg-[#2B7A4B]/10';
      case 'office': return 'bg-blue-50';
      case 'parents': return 'bg-rose-50';
      case 'gift': return 'bg-purple-50';
      default: return 'bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9F6]">
        <div className="w-12 h-12 border-4 border-[#2B7A4B] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9F6] pb-24 md:pb-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-10">
        
        {/* ===== PAGE HEADER ===== */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link 
              href="/account" 
              className="p-2 bg-white rounded-full hover:bg-gray-50 transition-colors shadow-sm"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Addresses</h1>
              <p className="text-sm text-gray-500">Manage your saved addresses for a faster checkout</p>
            </div>
          </div>
          <button 
            onClick={openAddModal}
            className="hidden md:inline-flex items-center gap-2 px-4 py-2.5 bg-[#2B7A4B] text-white rounded-lg text-sm font-medium hover:bg-[#23663e] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New Address
          </button>
        </div>

        {/* ===== MOBILE ADD BUTTON ===== */}
        <div className="md:hidden mb-6">
          <button 
            onClick={openAddModal}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#2B7A4B] text-white rounded-xl text-sm font-medium hover:bg-[#23663e] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New Address
          </button>
        </div>

        {/* ===== ADDRESS LIST ===== */}
        <div className="space-y-4">
          {addresses.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 shadow-sm">
              <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">No addresses saved</h3>
              <p className="text-sm text-gray-500 mb-4">Add an address to make checkout faster.</p>
              <button onClick={openAddModal} className="px-6 py-2 bg-[#2B7A4B] text-white rounded-lg text-sm font-medium">
                Add Address
              </button>
            </div>
          ) : (
            addresses.map((address) => (
              <div 
                key={address._id} 
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group"
              >
                <div className="absolute -bottom-8 -right-8 w-32 h-32 opacity-5 pointer-events-none">
                  <Leaf className="w-full h-full text-[#2B7A4B]" />
                </div>

                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getTypeBg(address.type)}`}>
                      {getTypeIcon(address.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-gray-900">{address.label}</h3>
                        {address.isDefault && (
                          <span className="flex items-center gap-1 text-[10px] font-medium text-[#2B7A4B] bg-[#2B7A4B]/10 px-2 py-0.5 rounded-full">
                            <CheckCircle className="w-3 h-3" />
                            Default Address
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-gray-700">
                        {address.fullName || (user ? `${user.firstName} ${user.lastName}` : 'User')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => openEditModal(address)}
                      className="p-2 text-gray-600 hover:text-[#2B7A4B] hover:bg-[#2B7A4B]/10 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    
                    <div className="relative group/actions">
                      <button className="p-2 text-gray-600 hover:text-gray-900 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      
                      <div className="absolute right-0 top-full mt-2 w-full min-w-[200px] bg-white rounded-xl shadow-lg border border-gray-100 hidden group-hover/actions:block z-10 p-2">
                        {!address.isDefault && (
                          <button 
                            onClick={() => handleSetDefault(address._id)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg text-left"
                          >
                            <CheckCircle className="w-4 h-4 text-[#2B7A4B]" />
                            Set as default
                          </button>
                        )}
                        <button 
                          onClick={() => confirmDelete(address._id)}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg text-left"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete address
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-600 space-y-1 pl-16">
                  <p>{address.addressLine1}</p>
                  {address.addressLine2 && <p>{address.addressLine2}</p>}
                  <p>{address.city}, {address.state}: {address.postalCode}</p>
                  <p>{address.country}</p>
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-500">{address.phone}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ===== SECURE MESSAGE CARD ===== */}
        <div className="mt-8 bg-green-50 rounded-2xl p-6 border border-green-100 relative overflow-hidden">
          <div className="absolute -bottom-8 -right-8 w-32 h-32 opacity-20 pointer-events-none">
            <Lock className="w-full h-full text-[#2B7A4B]" />
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 relative z-10">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
              <Lock className="w-5 h-5 text-[#2B7A4B]" />
            </div>
            <div>
              <h4 className="font-semibold text-[#1A3C34] text-sm">Your addresses are safe with us</h4>
              <p className="text-xs text-gray-600">We never share your personal information</p>
            </div>
          </div>
        </div>

        {/* ===== DELETE CONFIRMATION MODAL ===== */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-center text-gray-900 mb-2">Delete Address?</h3>
              <p className="text-sm text-gray-500 text-center mb-6">
                Are you sure you want to delete this address? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDelete}
                  className="flex-1 py-2.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===== ADD/EDIT ADDRESS MODAL ===== */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingAddress ? 'Edit Address' : 'Add New Address'}
                </h2>
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSaveAddress} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                    <input
                      type="text"
                      name="label"
                      value={formData.label}
                      onChange={handleInputChange}
                      placeholder="e.g. Home, Office"
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A4B]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A4B]"
                    >
                      <option value="home">Home</option>
                      <option value="office">Office</option>
                      <option value="parents">Parents Home</option>
                      <option value="gift">Gift Address</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A4B]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                  <input
                    type="text"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleInputChange}
                    placeholder="Street address"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A4B]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2 (Optional)</label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleInputChange}
                    placeholder="Apartment, suite, unit, etc."
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A4B]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="City"
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A4B]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="State"
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A4B]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder="Postal Code"
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A4B]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      placeholder="Country"
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A4B]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Phone number"
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A4B]"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isDefault"
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-[#2B7A4B] rounded focus:ring-[#2B7A4B]"
                  />
                  <label htmlFor="isDefault" className="text-sm text-gray-700 font-medium">
                    Set as default address
                  </label>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 py-2.5 bg-[#2B7A4B] text-white rounded-lg text-sm font-medium hover:bg-[#23663e] transition-colors disabled:opacity-70"
                  >
                    {isSaving ? 'Saving...' : editingAddress ? 'Update Address' : 'Save Address'}
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

        {/* ===== MOBILE BOTTOM NAVIGATION ===== */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-40">
          <div className="flex items-center justify-around py-2">
            <Link href="/" className="flex flex-col items-center gap-0.5 p-2 text-gray-500 hover:text-[#2B7A4B] transition-colors">
              <Home className="w-5 h-5" />
              <span className="text-[9px] font-medium">Home</span>
            </Link>
            <Link href="/products" className="flex flex-col items-center gap-0.5 p-2 text-gray-500 hover:text-[#2B7A4B] transition-colors">
              <ShoppingBag className="w-5 h-5" />
              <span className="text-[9px] font-medium">Shop</span>
            </Link>
            <Link href="/categories" className="flex flex-col items-center gap-0.5 p-2 text-gray-500 hover:text-[#2B7A4B] transition-colors">
              <LayoutGrid className="w-5 h-5" />
              <span className="text-[9px] font-medium">Categories</span>
            </Link>
            <Link href="/wishlist" className="flex flex-col items-center gap-0.5 p-2 text-gray-500 hover:text-[#2B7A4B] transition-colors">
              <div className="relative">
                <Heart className="w-5 h-5" />
                <span className="absolute -top-1 -right-2 bg-[#2B7A4B] text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">3</span>
              </div>
              <span className="text-[9px] font-medium">Wishlist</span>
            </Link>
            <Link href="/account/orders" className="flex flex-col items-center gap-0.5 p-2 text-gray-500 hover:text-[#2B7A4B] transition-colors">
              <Box className="w-5 h-5" />
              <span className="text-[9px] font-medium">Orders</span>
            </Link>
            <Link href="/account" className="flex flex-col items-center gap-0.5 p-2 text-[#2B7A4B] transition-colors">
              <User className="w-5 h-5" />
              <span className="text-[9px] font-medium font-bold">Account</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}