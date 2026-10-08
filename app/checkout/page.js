'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Leaf, Truck, ShieldCheck, HelpCircle,
  ChevronDown, Check, ShoppingBag,
  Info, Lock, ArrowLeft, MapPin,
  Building2, CreditCard, Edit,
  Mail, User, Phone, Globe, Headphones,
  RotateCcw, Plus, X, Home, Briefcase, Gift
} from 'lucide-react';
import { getCart } from '@/app/utils/cart';

// ==========================================
// ✅ MAIN CHECKOUT CONTENT
// ==========================================
function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ===== BUY NOW PARAMS =====
  const buyNowId = searchParams.get('buyNow');
  const buyNowQty = Number(searchParams.get('qty')) || 1;
  const isBuyNow = Boolean(buyNowId);

  // ===== STATE: Data =====
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // ===== STATE: User Data =====
  const [user, setUser] = useState(null);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  // ===== STATE: Checkout Form =====
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zip: '',
    promoCode: '',
  });
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit');

  // ===== NEW ADDRESS FORM STATE =====
  const [newAddressForm, setNewAddressForm] = useState({
    type: 'home',
    label: '',
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Pakistan',
    phone: '',
    isDefault: false,
  });

  // ==========================================
  // LOAD DATA (BUY NOW OR CART) + USER
  // ==========================================
  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        // ---------- 1. Load items ----------
        if (isBuyNow && buyNowId) {
          try {
            const res = await fetch(`/api/public/products/${buyNowId}`);
            if (res.ok) {
              const data = await res.json();
              const p = data.product || data;
              if (!cancelled) {
                setCartItems([
                  {
                    id: p._id,
                    name: p.name,
                    desc: p.desc,
                    price: p.price,
                    image: p.image,
                    quantity: buyNowQty,
                    category: p.category,
                  },
                ]);
              }
            } else if (!cancelled) {
              setErrorMessage('Product not found');
            }
          } catch (e) {
            console.error('Failed to load buy-now product:', e);
            if (!cancelled) setErrorMessage('Failed to load product');
          }
        } else {
          const cart = getCart();
          if (!cancelled) setCartItems(cart);
        }

        // ---------- 2. Saved payment method ----------
        const savedPaymentMethod = localStorage.getItem('paymentMethod');
        if (savedPaymentMethod && !cancelled) {
          setPaymentMethod(savedPaymentMethod);
        }

        // ---------- 3. User + addresses (guest-tolerant) ----------
        try {
          const userRes = await fetch('/api/auth/me', { credentials: 'include' });
          if (userRes.ok) {
            const userData = await userRes.json();
            if (!cancelled) setUser(userData.user);

            const addrRes = await fetch('/api/addresses', { credentials: 'include' });
            if (addrRes.ok) {
              const addrData = await addrRes.json();
              const addresses = addrData.addresses || [];
              if (!cancelled) setSavedAddresses(addresses);

              const defaultAddr = addresses.find((a) => a.isDefault);
              if (defaultAddr && !cancelled) {
                setSelectedAddressId(defaultAddr._id);
                setFormData((prev) => ({
                  ...prev,
                  firstName: defaultAddr.fullName?.split(' ')[0] || '',
                  lastName: defaultAddr.fullName?.split(' ').slice(1).join(' ') || '',
                  email: userData.user?.email || '',
                  phone: defaultAddr.phone || '',
                  address: defaultAddr.addressLine1 || '',
                  apartment: defaultAddr.addressLine2 || '',
                  city: defaultAddr.city || '',
                  state: defaultAddr.state || '',
                  zip: defaultAddr.postalCode || '',
                }));
              }
            }
          }
          // 401 → proceed as guest (user fills the form manually)
        } catch (err) {
          console.warn('Guest checkout — skipping user load');
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadData();
    return () => {
      cancelled = true;
    };
  }, [isBuyNow, buyNowId, buyNowQty]);

  // ===== CALCULATIONS =====
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const getDeliveryCharges = () => {
    if (subtotal > 7500) return 0;
    if (paymentMethod === 'jazzcash') return 140;
    return 150;
  };

  const deliveryCharges = getDeliveryCharges();

  const getTaxRate = () => {
    if (paymentMethod === 'jazzcash') return 0.014;
    return 0.02;
  };

  const taxRate = getTaxRate();
  const tax = subtotal * taxRate;
  const discount = isPromoApplied ? subtotal * 0.1 : 0;
  const total = subtotal + deliveryCharges + tax - discount;

  // ===== HANDLERS =====
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddressForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddressSelect = (address) => {
    setSelectedAddressId(address._id);
    setFormData((prev) => ({
      ...prev,
      firstName: address.fullName?.split(' ')[0] || '',
      lastName: address.fullName?.split(' ').slice(1).join(' ') || '',
      email: user?.email || prev.email || '',
      phone: address.phone || '',
      address: address.addressLine1 || '',
      apartment: address.addressLine2 || '',
      city: address.city || '',
      state: address.state || '',
      zip: address.postalCode || '',
    }));
  };

  // ===== SAVE NEW ADDRESS =====
  const handleSaveNewAddress = async (e) => {
    e.preventDefault();
    setIsSavingAddress(true);

    try {
      const addressData = {
        type: newAddressForm.type || 'home',
        label: newAddressForm.label || 'Home',
        fullName: newAddressForm.fullName || `${formData.firstName} ${formData.lastName}`,
        addressLine1: newAddressForm.addressLine1 || formData.address,
        addressLine2: newAddressForm.addressLine2 || formData.apartment,
        city: newAddressForm.city || formData.city,
        state: newAddressForm.state || formData.state,
        postalCode: newAddressForm.postalCode || formData.zip,
        country: newAddressForm.country || 'Pakistan',
        phone: newAddressForm.phone || formData.phone,
        isDefault: newAddressForm.isDefault || false,
      };

      const res = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(addressData),
      });

      if (res.ok) {
        const data = await res.json();
        const addrRes = await fetch('/api/addresses', { credentials: 'include' });
        if (addrRes.ok) {
          const addrData = await addrRes.json();
          setSavedAddresses(addrData.addresses || []);
          if (data.address) {
            setSelectedAddressId(data.address._id);
            handleAddressSelect(data.address);
          }
        }
        setShowAddressModal(false);
        alert('Address saved successfully!');
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Failed to save address');
      }
    } catch (error) {
      console.error('Error saving address:', error);
      alert('Error connecting to server');
    } finally {
      setIsSavingAddress(false);
    }
  };

  const applyPromoCode = () => {
    if (formData.promoCode.trim().toUpperCase() === 'SAVE10') {
      setIsPromoApplied(true);
    } else {
      alert('Invalid promo code. Try "SAVE10"');
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!selectedAddressId && !formData.address) {
        alert('Please select or add a shipping address');
        return;
      }
      if (!formData.email) {
        alert('Please fill in your email address');
        return;
      }
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    setErrorMessage('');

    try {
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.email ||
        !formData.phone ||
        !formData.address ||
        !formData.city ||
        !formData.state ||
        !formData.zip
      ) {
        throw new Error('Please fill in all required shipping fields');
      }

      if (cartItems.length === 0) {
        throw new Error('Your cart is empty');
      }

      const orderData = {
        items: cartItems.map((item) => ({
          product: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          country: 'Pakistan',
        },
        paymentMethod: paymentMethod,
        subtotal: subtotal,
        deliveryCharge: deliveryCharges,
        tax: tax,
        totalAmount: total,
      };

      console.log('Sending order data:', orderData);

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            errorData.message ||
            `Order failed with status ${response.status}`
        );
      }

      const data = await response.json();
      console.log('Order placed successfully:', data);

      // Clear cart only in normal flow, not buy-now
      if (!isBuyNow) {
        localStorage.removeItem('cart');
      }
      localStorage.removeItem('paymentMethod');
      setCurrentStep(4);

      if (data.message) {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      setErrorMessage(error.message || 'Failed to place order. Please try again.');
      alert(error.message || 'Failed to place order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#F8F9F6] pb-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6">

        {/* BREADCRUMBS */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-6">
          <span className="text-gray-400">🏠</span>
          <Link href="/" className="hover:text-[#2B7A4B]">Home</Link>
          <span className="text-gray-300">/</span>
          {!isBuyNow && (
            <>
              <Link href="/cart" className="hover:text-[#2B7A4B]">Cart</Link>
              <span className="text-gray-300">/</span>
            </>
          )}
          <span className="text-[#2B7A4B] font-medium">Checkout</span>
        </div>

        {/* PAGE HEADER */}
        <div className="flex items-center gap-2 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Checkout</h1>
          <Leaf className="w-5 h-5 text-[#2B7A4B]" />
          <p className="text-sm text-gray-500 ml-2">
            Complete your order and bring more green to your life!
          </p>
        </div>

        {isBuyNow && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm flex items-center justify-between flex-wrap gap-2">
            <span>⚡ Buying this item directly (skipping cart).</span>
            <button
              onClick={() => router.push('/checkout')}
              className="underline font-medium hover:no-underline"
            >
              Switch to cart checkout
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {errorMessage}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">

          {/* LEFT COLUMN */}
          <div className="flex-1">

            {/* STEP PROGRESS */}
            <div className="flex items-center justify-between mb-8 px-1">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentStep >= 1 ? 'bg-[#2B7A4B] text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-gray-900">Shipping</span>
                  <span className="text-[10px] text-gray-500">Where to deliver?</span>
                </div>
              </div>
              <div className={`flex-1 h-[1px] ${currentStep >= 2 ? 'bg-[#2B7A4B]' : 'bg-gray-200'}`}></div>

              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentStep >= 2 ? 'bg-[#2B7A4B] text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-gray-900">Payment</span>
                  <span className="text-[10px] text-gray-500">Choose payment method</span>
                </div>
              </div>
              <div className={`flex-1 h-[1px] ${currentStep >= 3 ? 'bg-[#2B7A4B]' : 'bg-gray-200'}`}></div>

              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentStep >= 3 ? 'bg-[#2B7A4B] text-white' : 'bg-gray-200 text-gray-500'}`}>3</div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-gray-900">Review</span>
                  <span className="text-[10px] text-gray-500">Confirm your order</span>
                </div>
              </div>
              <div className={`flex-1 h-[1px] ${currentStep >= 4 ? 'bg-[#2B7A4B]' : 'bg-gray-200'}`}></div>

              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentStep >= 4 ? 'bg-[#2B7A4B] text-white' : 'bg-gray-200 text-gray-500'}`}>4</div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-gray-900">Complete</span>
                  <span className="text-[10px] text-gray-500">Order placed successfully</span>
                </div>
              </div>
            </div>

            {/* STEP 1: SHIPPING */}
            {currentStep === 1 && (
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-[#2B7A4B]/10 rounded-full flex items-center justify-center text-[#2B7A4B]">
                    <Truck className="w-4 h-4" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Shipping Information</h2>
                </div>
                <p className="text-sm text-gray-500 mb-6">Please provide accurate details for safe delivery.</p>

                {savedAddresses.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Select a Saved Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {savedAddresses.map((address) => (
                        <div
                          key={address._id}
                          onClick={() => handleAddressSelect(address)}
                          className={`p-4 border rounded-xl cursor-pointer transition-all ${
                            selectedAddressId === address._id
                              ? 'border-[#2B7A4B] bg-[#2B7A4B]/5'
                              : 'border-gray-200 hover:border-[#2B7A4B]/50'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-[#2B7A4B]/10 rounded-lg flex items-center justify-center">
                              {address.type === 'home' ? (
                                <Home className="w-4 h-4 text-[#2B7A4B]" />
                              ) : address.type === 'office' ? (
                                <Briefcase className="w-4 h-4 text-blue-600" />
                              ) : (
                                <Gift className="w-4 h-4 text-purple-500" />
                              )}
                            </div>
                            <span className="font-medium text-gray-900">{address.label}</span>
                            {address.isDefault && (
                              <span className="text-[10px] text-[#2B7A4B] bg-[#2B7A4B]/10 px-2 py-0.5 rounded">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{address.addressLine1}</p>
                          <p className="text-sm text-gray-600">
                            {address.city}, {address.state} {address.postalCode}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{address.phone}</p>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => setShowAddressModal(true)}
                      className="mt-3 flex items-center gap-2 text-sm text-[#2B7A4B] font-medium hover:underline"
                    >
                      <Plus className="w-4 h-4" />
                      Add New Address
                    </button>
                  </div>
                )}

                <div className={savedAddresses.length > 0 ? 'hidden' : ''}>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="w-4 h-4 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A4B] placeholder:text-gray-400"
                            placeholder="Enter first name"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="w-4 h-4 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A4B] placeholder:text-gray-400"
                            placeholder="Enter last name"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="w-4 h-4 text-gray-400" />
                          </div>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A4B] placeholder:text-gray-400"
                            placeholder="Enter your email address"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone className="w-4 h-4 text-gray-400" />
                          </div>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A4B] placeholder:text-gray-400"
                            placeholder="Enter your phone number"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Street Address</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPin className="w-4 h-4 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A4B] placeholder:text-gray-400"
                          placeholder="House number and street name"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Apartment, suite, unit, etc. (optional)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Building2 className="w-4 h-4 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="apartment"
                          value={formData.apartment}
                          onChange={handleInputChange}
                          className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A4B] placeholder:text-gray-400"
                          placeholder="Apartment, suite, unit, building, etc."
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Building2 className="w-4 h-4 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A4B] placeholder:text-gray-400"
                            placeholder="Enter your city"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">State / Province</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Globe className="w-4 h-4 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A4B] placeholder:text-gray-400"
                            placeholder="Enter your state/province"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">ZIP / Postal Code</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MapPin className="w-4 h-4 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="zip"
                            value={formData.zip}
                            onChange={handleInputChange}
                            className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A4B] placeholder:text-gray-400"
                            placeholder="Enter ZIP / postal code"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Country</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Globe className="w-4 h-4 text-gray-400" />
                        </div>
                        <select className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A4B] bg-white appearance-none">
                          <option>Pakistan</option>
                          <option>United States</option>
                          <option>Canada</option>
                          <option>United Kingdom</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>

                {savedAddresses.length > 0 && (
                  <div className="mt-4">
                    <button
                      onClick={() => setShowAddressModal(true)}
                      className="w-full py-3 border-2 border-dashed border-gray-300 text-gray-500 rounded-xl text-sm font-medium hover:border-[#2B7A4B] hover:text-[#2B7A4B] transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add New Address
                    </button>
                  </div>
                )}

                {subtotal < 7500 && (
                  <div className="mt-6 p-4 bg-[#F8F9F6] rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-[#2B7A4B]">
                        <Truck className="w-4 h-4" />
                        <span>Great news! Add more to get FREE shipping</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        You&apos;re Rs. {(7500 - subtotal).toFixed(2)} away
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#2B7A4B]"
                        style={{ width: `${Math.min((subtotal / 7500) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleNextStep}
                  className="w-full py-4 bg-[#2B7A4B] text-white rounded-xl font-semibold text-base hover:bg-[#23663e] transition-all duration-300 shadow-md hover:shadow-lg mt-2"
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {/* STEP 2: PAYMENT */}
            {currentStep === 2 && (
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 bg-[#2B7A4B]/10 rounded-full flex items-center justify-center text-[#2B7A4B]">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
                    <p className="text-sm text-gray-500">Secure and encrypted payment</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div
                    className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-colors ${
                      paymentMethod === 'jazzcash'
                        ? 'border-[#2B7A4B] bg-[#2B7A4B]/5'
                        : 'border-gray-200 hover:border-[#2B7A4B]/50'
                    }`}
                    onClick={() => setPaymentMethod('jazzcash')}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'jazzcash' ? 'border-[#2B7A4B]' : 'border-gray-300'}`}>
                      {paymentMethod === 'jazzcash' && <div className="w-2.5 h-2.5 rounded-full bg-[#2B7A4B]"></div>}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">JazzCash</p>
                      <p className="text-xs text-gray-500">Delivery: Rs. 140 • Tax: 1.4%</p>
                    </div>
                    <div className="w-8 h-5 bg-green-600 rounded text-[8px] text-white flex items-center justify-center font-bold">
                      JC
                    </div>
                  </div>

                  <div
                    className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-colors ${
                      paymentMethod === 'cod'
                        ? 'border-[#2B7A4B] bg-[#2B7A4B]/5'
                        : 'border-gray-200 hover:border-[#2B7A4B]/50'
                    }`}
                    onClick={() => setPaymentMethod('cod')}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-[#2B7A4B]' : 'border-gray-300'}`}>
                      {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 rounded-full bg-[#2B7A4B]"></div>}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Cash on Delivery</p>
                      <p className="text-xs text-gray-500">Delivery: Rs. 150 • Tax: 2%</p>
                    </div>
                    <span className="text-[10px] font-bold">💵</span>
                  </div>

                  <div
                    className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-colors ${
                      paymentMethod === 'credit'
                        ? 'border-[#2B7A4B] bg-[#2B7A4B]/5'
                        : 'border-gray-200 hover:border-[#2B7A4B]/50'
                    }`}
                    onClick={() => setPaymentMethod('credit')}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'credit' ? 'border-[#2B7A4B]' : 'border-gray-300'}`}>
                      {paymentMethod === 'credit' && <div className="w-2.5 h-2.5 rounded-full bg-[#2B7A4B]"></div>}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Credit / Debit Card</p>
                      <p className="text-xs text-gray-500">Delivery: Rs. 150 • Tax: 2%</p>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-8 h-5 bg-blue-600 rounded text-[8px] text-white flex items-center justify-center font-bold">
                        VISA
                      </div>
                      <div className="w-8 h-5 bg-red-600 rounded text-[8px] text-white flex items-center justify-center font-bold">
                        MC
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-4">
                    <button
                      onClick={handlePrevStep}
                      className="flex-1 py-3 border border-gray-200 rounded-xl font-medium text-sm hover:bg-gray-50 transition-colors"
                    >
                      Back to Shipping
                    </button>
                    <button
                      onClick={handleNextStep}
                      className="flex-1 py-3 bg-[#2B7A4B] text-white rounded-xl font-semibold text-sm hover:bg-[#23663e] transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      Continue to Review
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: REVIEW */}
            {currentStep === 3 && (
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-[#2B7A4B]/10 rounded-full flex items-center justify-center text-[#2B7A4B]">
                    <Check className="w-4 h-4" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Review Your Order</h2>
                </div>
                <p className="text-sm text-gray-500 mb-6">Review items and delivery details</p>

                <div className="space-y-6 border-t border-gray-100 pt-6">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Shipping Address:</h4>
                    <p className="text-sm text-gray-600">
                      {formData.firstName} {formData.lastName}
                      <br />
                      {formData.address}
                      <br />
                      {formData.apartment && (
                        <>
                          {formData.apartment}
                          <br />
                        </>
                      )}
                      {formData.city}, {formData.state} {formData.zip}
                      <br />
                      Pakistan
                      <br />
                      Phone: {formData.phone}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-[#F8F9F6] rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <span className="font-bold text-gray-900">
                          Rs. {(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-sm font-medium text-gray-900 mb-2">Payment Method:</p>
                    <p className="text-sm text-gray-600 capitalize">{paymentMethod}</p>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={handlePrevStep}
                      className="flex-1 py-3 border border-gray-200 rounded-xl font-medium text-sm hover:bg-gray-50 transition-colors"
                    >
                      Back to Payment
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={isPlacingOrder}
                      className="flex-1 py-3 bg-[#2B7A4B] text-white rounded-xl font-semibold text-sm hover:bg-[#23663e] transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: COMPLETE */}
            {currentStep === 4 && (
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 text-center">
                <div className="w-16 h-16 mx-auto bg-[#2B7A4B]/10 rounded-full flex items-center justify-center text-[#2B7A4B] mb-4">
                  <Check className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
                <p className="text-gray-500 mb-6">
                  Your order has been confirmed. You will receive a confirmation email shortly.
                </p>
                <Link
                  href="/"
                  className="inline-block px-8 py-3 bg-[#2B7A4B] text-white rounded-xl font-semibold hover:bg-[#23663e] transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            )}

            {/* SAFETY BANNER */}
            <div className="mt-6 p-4 bg-[#F8F9F6] rounded-xl border border-gray-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-[#2B7A4B]" />
                <div>
                  <p className="text-[12px] font-bold text-gray-900">SSL Encrypted</p>
                  <p className="text-[10px] text-gray-500">Secure Checkout</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="w-5 h-5 text-[#2B7A4B]" />
                <div>
                  <p className="text-[12px] font-bold text-gray-900">30-Day Returns</p>
                  <p className="text-[10px] text-gray-500">Hassle Free</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Headphones className="w-5 h-5 text-[#2B7A4B]" />
                <div>
                  <p className="text-[12px] font-bold text-gray-900">24/7 Support</p>
                  <p className="text-[10px] text-gray-500">We&apos;re Here</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-[#2B7A4B]" />
                <div>
                  <p className="text-[12px] font-bold text-gray-900">Privacy Protected</p>
                  <p className="text-[10px] text-gray-500">Your data is safe</p>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:w-[380px] flex-shrink-0">

            <div className="bg-[#F8F9F6] rounded-xl p-4 border border-gray-200 flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                <ShieldCheck className="w-5 h-5 text-[#2B7A4B]" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">100% Secure Checkout</p>
                <p className="text-xs text-gray-500">Your data is protected and safe with us.</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#2B7A4B]" />
                  <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
                </div>
                {!isBuyNow && (
                  <Link
                    href="/cart"
                    className="text-sm text-[#2B7A4B] flex items-center gap-1 hover:underline"
                  >
                    <Edit className="w-3 h-3" /> Edit Cart
                  </Link>
                )}
              </div>

              <div className="space-y-4 mb-6 border-b border-gray-100 pb-6">
                {cartItems.length === 0 ? (
                  <p className="text-sm text-gray-500 py-4 text-center">
                    No items. Add something to your cart.
                  </p>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#F8F9F6] rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-bold text-gray-900">
                        Rs. {item.price.toFixed(2)}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>
                    Subtotal ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} items)
                  </span>
                  <span className="font-medium text-gray-900">Rs. {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <div className="flex items-center gap-1">
                    <span>Delivery</span>
                    <Info className="w-3 h-3 text-gray-400 cursor-help" />
                  </div>
                  <span className="font-medium text-[#2B7A4B]">
                    {deliveryCharges === 0 ? 'FREE' : `Rs. ${deliveryCharges.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <div className="flex items-center gap-1">
                    <span>Tax ({taxRate * 100}%)</span>
                    <Info className="w-3 h-3 text-gray-400 cursor-help" />
                  </div>
                  <span className="font-medium text-gray-900">Rs. {tax.toFixed(2)}</span>
                </div>
                {isPromoApplied && (
                  <div className="flex justify-between text-[#2B7A4B]">
                    <span>Promo Discount (10%)</span>
                    <span className="font-medium">-Rs. {discount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200 mb-6">
                <span className="text-xl font-bold text-gray-900">Total</span>
                <div className="text-right">
                  <span className="text-2xl font-bold text-[#2B7A4B]">
                    Rs. {total.toFixed(2)}
                  </span>
                  <span className="text-xs text-gray-400 ml-1">PKR</span>
                </div>
              </div>

              <div className="mb-6">
                <button
                  onClick={() =>
                    document.getElementById('promo-input').classList.toggle('hidden')
                  }
                  className="flex items-center justify-between w-full text-sm font-medium text-gray-700 hover:text-[#2B7A4B] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-lg">🎟️</span> Have a promo code?
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div id="promo-input" className="hidden mt-3 flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter promo code"
                    value={formData.promoCode}
                    onChange={(e) =>
                      setFormData({ ...formData, promoCode: e.target.value })
                    }
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#2B7A4B]"
                  />
                  <button
                    onClick={applyPromoCode}
                    className="px-4 py-2 bg-[#2B7A4B] text-white rounded-lg text-sm font-medium hover:bg-[#23663e] transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <button
                onClick={currentStep === 3 ? handlePlaceOrder : handleNextStep}
                disabled={isPlacingOrder || cartItems.length === 0}
                className="w-full py-4 bg-[#2B7A4B] text-white rounded-xl font-semibold text-base hover:bg-[#23663e] transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPlacingOrder
                  ? 'Placing Order...'
                  : currentStep === 4
                  ? 'Order Placed!'
                  : 'Continue to Payment'}
                {currentStep < 4 && <span className="text-lg">→</span>}
              </button>

              {currentStep > 1 && currentStep < 4 && (
                <button
                  onClick={handlePrevStep}
                  className="w-full mt-3 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to {currentStep === 2 ? 'Shipping' : 'Payment'}
                </button>
              )}
            </div>

            <div className="mt-6 bg-[#f2f8f5] rounded-xl p-5 border border-[#2B7A4B]/10">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Leaf className="w-5 h-5 text-[#2B7A4B]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1A3C34] text-sm">Plant Care Tip</h4>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    Don&apos;t forget! Consistent care and the right light make your plants thrive.
                  </p>
                  <a
                    href="#"
                    className="text-xs font-semibold text-[#2B7A4B] mt-2 inline-block hover:underline"
                  >
                    Learn More →
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ADD ADDRESS MODAL */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Add New Address</h2>
              <button
                onClick={() => setShowAddressModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSaveNewAddress} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                  <input
                    type="text"
                    name="label"
                    value={newAddressForm.label}
                    onChange={handleNewAddressChange}
                    placeholder="e.g. Home, Office"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A4B]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    name="type"
                    value={newAddressForm.type}
                    onChange={handleNewAddressChange}
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
                  value={newAddressForm.fullName}
                  onChange={handleNewAddressChange}
                  placeholder="Enter full name"
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A4B]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 1
                </label>
                <input
                  type="text"
                  name="addressLine1"
                  value={newAddressForm.addressLine1}
                  onChange={handleNewAddressChange}
                  placeholder="Street address"
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A4B]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 2 (Optional)
                </label>
                <input
                  type="text"
                  name="addressLine2"
                  value={newAddressForm.addressLine2}
                  onChange={handleNewAddressChange}
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
                    value={newAddressForm.city}
                    onChange={handleNewAddressChange}
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
                    value={newAddressForm.state}
                    onChange={handleNewAddressChange}
                    placeholder="State"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A4B]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={newAddressForm.postalCode}
                    onChange={handleNewAddressChange}
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
                    value={newAddressForm.country}
                    onChange={handleNewAddressChange}
                    placeholder="Country"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A4B]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={newAddressForm.phone}
                    onChange={handleNewAddressChange}
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
                  checked={newAddressForm.isDefault}
                  onChange={handleNewAddressChange}
                  className="w-4 h-4 text-[#2B7A4B] rounded focus:ring-[#2B7A4B]"
                />
                <label htmlFor="isDefault" className="text-sm text-gray-700 font-medium">
                  Set as default address
                </label>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingAddress}
                  className="flex-1 py-2.5 bg-[#2B7A4B] text-white rounded-lg text-sm font-medium hover:bg-[#23663e] transition-colors disabled:opacity-70"
                >
                  {isSavingAddress ? 'Saving...' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

// ==========================================
// ✅ DEFAULT EXPORT — wraps CheckoutContent in Suspense
// ==========================================
export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 bg-gray-200 rounded-full mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}