// app/account/page.js
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Leaf, Truck, Clock, CheckCircle, XCircle,
  ChevronRight, User, Settings,
  Heart, MapPin, CreditCard, Bell, Star,
  Gift, LogOut, ShoppingBag, Box,
  ShieldCheck, RotateCcw, Headphones, Package
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function AccountDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('');

  // ✅ Real recommended products state
  const [recommended, setRecommended] = useState([]);
  const [recommendedLoading, setRecommendedLoading] = useState(true);

  // ===== SET GREETING BASED ON TIME =====
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  // ==========================================
  // ✅ FETCH RECOMMENDED PRODUCTS (real API)
  // ==========================================
  const fetchRecommended = async () => {
    try {
      setRecommendedLoading(true);

      // ⚠️ Adjust this base path to match your server.js mounting
      // If server.js has: app.use("/api", productRoutes) → use `/api/public/products`
      // If server.js has: app.use("/", productRoutes) → use `/public/products`
      const BASE = `${API_BASE_URL}/api/public/products`;

      console.log('🌱 Fetching recommended from:', BASE);

      let products = [];

      // 1️⃣ Try FEATURED products first
      try {
        const res = await fetch(`${BASE}/featured`, {
          credentials: 'include',
        });
        console.log('🌱 Featured response status:', res.status);

        if (res.ok) {
          const data = await res.json();
          products = data.products || [];
          console.log('🌱 Featured products:', products.length);
        }
      } catch (e) {
        console.warn('Featured fetch failed:', e.message);
      }

      // 2️⃣ Fallback to latest products
      if (products.length === 0) {
        try {
          const res = await fetch(`${BASE}?limit=4`, {
            credentials: 'include',
          });
          console.log('🌱 Fallback response status:', res.status);

          if (res.ok) {
            const data = await res.json();
            products = data.products || [];
            console.log('🌱 Fallback products:', products.length);
          }
        } catch (e) {
          console.warn('Fallback fetch failed:', e.message);
        }
      }

      setRecommended(products.slice(0, 4));
    } catch (err) {
      console.error('❌ Error fetching recommended products:', err);
    } finally {
      setRecommendedLoading(false);
    }
  };

  // ==========================================
  // ✅ FETCH DASHBOARD DATA (User + Orders)
  // ==========================================
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. Fetch User
        const userRes = await fetch(`${API_BASE_URL}/api/auth/me`, {
          credentials: 'include',
        });

        if (!userRes.ok) {
          router.push('/login');
          return;
        }

        const userData = await userRes.json();
        setUser(userData.user);

        // 2. Fetch Real Orders
        const ordersRes = await fetch(`${API_BASE_URL}/api/orders/my-orders`, {
          credentials: 'include',
        });

        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          console.log('📦 Orders fetched:', ordersData.orders);
          setOrders(ordersData.orders || []);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    fetchRecommended();
  }, [router]);

  // ==========================================
  // ✅ STATS FROM ORDERS (using real model fields)
  // ==========================================
  const totalOrders = orders.length;

  const deliveredOrders = orders.filter(
    (o) => o.orderStatus === 'delivered'
  ).length;

  const inTransitOrders = orders.filter(
    (o) => o.orderStatus === 'shipped' || o.orderStatus === 'processing'
  ).length;

  const pendingOrders = orders.filter(
    (o) => o.orderStatus === 'pending'
  ).length;

  const cancelledOrders = orders.filter(
    (o) => o.orderStatus === 'cancelled'
  ).length;

  // ✅ Uses totalAmount (matches your Order model)
  const totalSpent = orders.reduce(
    (acc, order) => acc + (order.totalAmount || 0),
    0
  );

  // ==========================================
  // ✅ STATUS BADGE CONFIG
  // ==========================================
  const getStatusConfig = (status) => {
    switch (status) {
      case 'delivered':
        return {
          label: 'Delivered',
          color: 'text-green-700 bg-green-50',
          icon: CheckCircle,
        };
      case 'shipped':
        return {
          label: 'Shipped',
          color: 'text-blue-700 bg-blue-50',
          icon: Truck,
        };
      case 'processing':
        return {
          label: 'Processing',
          color: 'text-purple-700 bg-purple-50',
          icon: Package,
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          color: 'text-red-700 bg-red-50',
          icon: XCircle,
        };
      case 'pending':
      default:
        return {
          label: 'Pending',
          color: 'text-yellow-700 bg-yellow-50',
          icon: Clock,
        };
    }
  };

  // ==========================================
  // ✅ HELPERS
  // ==========================================
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return 'N/A';
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // ==========================================
  // ✅ LOGOUT
  // ==========================================
  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (e) {
      console.error('Logout error:', e);
    }
    localStorage.removeItem('authUser');
    window.dispatchEvent(new Event('authChange'));
    router.push('/login');
  };

  // ==========================================
  // ✅ LOADING STATE
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
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6">

        {/* ===== BREADCRUMBS ===== */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-8">
          <span className="text-gray-400">🏠</span>
          <Link href="/" className="hover:text-[#2B7A4B]">Home</Link>
          <span className="text-gray-300">/</span>
          <Link href="/account" className="hover:text-[#2B7A4B]">My Account</Link>
          <span className="text-gray-300">/</span>
          <span className="text-[#2B7A4B] font-medium">Dashboard</span>
        </div>

        {/* ============================================================
            MAIN LAYOUT
        ============================================================ */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">

          {/* ===== MAIN CONTENT ===== */}
          <div className="flex-1 w-full">

            {/* ===== WELCOME HEADER ===== */}
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">
                {greeting}, {user.firstName || 'User'}!
              </h1>
              <Leaf className="w-5 h-5 text-[#2B7A4B]" />
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Here&apos;s what&apos;s happening with your account today.
            </p>

            {/* ===== STATS CARDS ===== */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="w-10 h-10 bg-[#2B7A4B]/10 rounded-full flex items-center justify-center mb-2">
                  <Box className="w-5 h-5 text-[#2B7A4B]" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
                <p className="text-[13px] text-gray-500">Total Orders</p>
                <Link
                  href="/account/orders"
                  className="text-[11px] text-[#2B7A4B] font-medium hover:underline mt-1 inline-block"
                >
                  View all orders →
                </Link>
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="w-10 h-10 bg-[#2B7A4B]/10 rounded-full flex items-center justify-center mb-2">
                  <CheckCircle className="w-5 h-5 text-[#2B7A4B]" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{deliveredOrders}</p>
                <p className="text-[13px] text-gray-500">Delivered</p>
                <p className="text-[11px] text-gray-400">Successfully delivered</p>
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="w-10 h-10 bg-[#2B7A4B]/10 rounded-full flex items-center justify-center mb-2">
                  <Clock className="w-5 h-5 text-[#2B7A4B]" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{inTransitOrders}</p>
                <p className="text-[13px] text-gray-500">In Transit</p>
                <p className="text-[11px] text-gray-400">
                  {pendingOrders} pending · {cancelledOrders} cancelled
                </p>
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="w-10 h-10 bg-[#2B7A4B]/10 rounded-full flex items-center justify-center mb-2">
                  <Gift className="w-5 h-5 text-[#2B7A4B]" />
                </div>
                <p className="text-2xl font-bold text-[#2B7A4B]">
                  Rs. {totalSpent.toLocaleString()}
                </p>
                <p className="text-[13px] text-gray-500">Total Spent</p>
                <p className="text-[11px] text-gray-400">Across all orders</p>
              </div>
            </div>

            {/* ===== RECENT ORDERS ===== */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
                <Link
                  href="/account/orders"
                  className="text-[13px] text-[#2B7A4B] font-medium hover:underline flex items-center gap-1"
                >
                  View All Orders <span className="text-base">→</span>
                </Link>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p>You haven&apos;t placed any orders yet.</p>
                  <Link
                    href="/shop"
                    className="text-[#2B7A4B] font-medium hover:underline mt-2 inline-block"
                  >
                    Start Shopping →
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <div className="min-w-[600px]">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 text-[12px] font-semibold text-gray-500 pb-3 mb-2 border-b border-gray-100">
                      <div className="col-span-3">Order</div>
                      <div className="col-span-3">Date</div>
                      <div className="col-span-3">Items</div>
                      <div className="col-span-2">Status</div>
                      <div className="col-span-1 text-right">Action</div>
                    </div>

                    {/* Order Rows */}
                    <div className="space-y-3">
                      {orders.slice(0, 5).map((order) => {
                        const statusConfig = getStatusConfig(order.orderStatus);
                        const StatusIcon = statusConfig.icon;

                        return (
                          <div
                            key={order._id}
                            className="grid grid-cols-12 gap-4 text-[13px] items-center py-3 border-b border-gray-50 last:border-0"
                          >
                            <div className="col-span-3">
                              <span className="font-medium text-gray-900">
                                #{order.orderNumber || order._id.slice(-6)}
                              </span>
                              {order.freeDeliveryApplied && (
                                <span className="block text-[10px] text-green-600 font-medium mt-0.5">
                                  🎉 Free Delivery
                                </span>
                              )}
                            </div>

                            <div className="col-span-3 text-gray-500">
                              {formatDate(order.createdAt)}
                              <span className="block text-[11px] text-gray-400">
                                {formatTime(order.createdAt)}
                              </span>
                            </div>

                            <div className="col-span-3 flex items-center -space-x-2">
                              {order.items?.slice(0, 3).map((item, i) => (
                                <div
                                  key={i}
                                  className="relative w-8 h-8 rounded-full border-2 border-white bg-[#F8F9F6] overflow-hidden flex-shrink-0"
                                >
                                  <Image
                                    src={item.image || '/products/placeholder.jpg'}
                                    alt={item.name || 'Item'}
                                    fill
                                    className="object-cover"
                                    sizes="32px"
                                  />
                                </div>
                              ))}
                              {order.items?.length > 3 && (
                                <div className="relative w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[9px] font-bold text-gray-600 flex-shrink-0 z-10">
                                  +{order.items.length - 3}
                                </div>
                              )}
                            </div>

                            <div className="col-span-2">
                              <span
                                className={`inline-flex items-center gap-1 text-[11px] font-medium ${statusConfig.color} px-2 py-0.5 rounded-full capitalize`}
                              >
                                <StatusIcon className="w-3 h-3" />
                                {statusConfig.label}
                              </span>
                              <span className="block text-[10px] text-gray-400 mt-0.5">
                                {order.items?.length || 0} items · Rs.{' '}
                                {(order.totalAmount || 0).toLocaleString()}
                              </span>
                            </div>

                            <div className="col-span-1 text-right">
                              <Link
                                href={`/account/orders/${order._id}`}
                                className="inline-flex items-center gap-1 text-[12px] text-[#2B7A4B] font-medium hover:underline border border-gray-200 px-3 py-1 rounded-full"
                              >
                                View
                                <ChevronRight className="w-3 h-3" />
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ===== PROMO BANNERS ===== */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-[#2B7A4B]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Truck className="w-5 h-5 text-[#2B7A4B]" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-[14px]">
                    Free Shipping
                  </h4>
                  <p className="text-[12px] text-gray-500">
                    Free delivery on your first order!
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-[#2B7A4B]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <RotateCcw className="w-5 h-5 text-[#2B7A4B]" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-[14px]">
                    30-Day Returns
                  </h4>
                  <p className="text-[12px] text-gray-500">
                    Hassle-free returns on all eligible items.
                  </p>
                </div>
              </div>
            </div>

            {/* ===== RECOMMENDED FOR YOU — REAL DATA ===== */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-gray-900">
                    Recommended for you
                  </h2>
                  <Leaf className="w-4 h-4 text-[#2B7A4B]" />
                </div>
                <Link
                  href="/shop"
                  className="text-[13px] text-[#2B7A4B] font-medium hover:underline"
                >
                  View All →
                </Link>
              </div>

              {recommendedLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="bg-[#F8F9F6] rounded-xl p-3 border border-gray-100 animate-pulse"
                    >
                      <div className="w-full aspect-square bg-gray-200 rounded-lg mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : recommended.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Leaf className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm">No products available right now.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {recommended.map((product) => {
                    const productId = product._id || product.id;
                    const name = product.name || product.title || 'Untitled';
                    const price = product.discountPrice || product.price || 0;
                    const originalPrice = product.price || 0;
                    const image =
                      product.image ||
                      product.images?.[0] ||
                      product.imageUrl ||
                      '/products/placeholder.jpg';
                    const hasDiscount =
                      product.discountPrice && product.discountPrice < product.price;
                    const discountPercent =
                      product.discount ||
                      (hasDiscount
                        ? Math.round(
                            ((product.price - product.discountPrice) /
                              product.price) *
                              100
                          )
                        : 0);

                    return (
                      <Link
                        key={productId}
                        href={`/product/${productId}`}
                        className="group bg-[#F8F9F6] rounded-xl p-3 border border-gray-100 hover:shadow-md transition-shadow block"
                      >
                        <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-3 bg-gray-100">
                          <Image
                            src={image}
                            alt={name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 50vw, 25vw"
                          />

                          {discountPercent > 0 && (
                            <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                              -{discountPercent}%
                            </span>
                          )}

                          {product.stock === 0 && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <span className="text-white text-[11px] font-medium bg-black/70 px-2 py-1 rounded">
                                Out of Stock
                              </span>
                            </div>
                          )}
                        </div>

                        <h4 className="text-[13px] font-semibold text-gray-900 truncate">
                          {name}
                        </h4>

                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-[14px] font-bold text-[#2B7A4B]">
                            Rs. {price.toLocaleString()}
                          </p>
                          {hasDiscount && (
                            <p className="text-[12px] text-gray-400 line-through">
                              Rs. {originalPrice.toLocaleString()}
                            </p>
                          )}
                        </div>

                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            console.log('Add to cart:', productId);
                          }}
                          className="w-full mt-2 py-1.5 border border-[#2B7A4B] text-[#2B7A4B] text-[12px] font-medium rounded-lg hover:bg-[#2B7A4B] hover:text-white transition-colors"
                        >
                          Add to Cart
                        </button>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* ===== RIGHT COLUMN: SIDEBAR ===== */}
          <div className="lg:w-[320px] flex-shrink-0">

            {/* Premium Member Banner */}
            <div className="bg-[#1A3C34] rounded-2xl p-6 shadow-sm text-white relative overflow-hidden mb-4">
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/5 rounded-full"></div>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-[15px] font-bold">Premium Member</span>
                  </div>
                  <p className="text-[12px] text-white/70">
                    Member since{' '}
                    {user.createdAt ? formatDate(user.createdAt) : 'Recently'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <div className="w-8 h-8 mx-auto bg-white/10 rounded-full flex items-center justify-center mb-1">
                    <Gift className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-[10px] text-white/80">
                    Exclusive<br />Deals
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 mx-auto bg-white/10 rounded-full flex items-center justify-center mb-1">
                    <Truck className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-[10px] text-white/80">
                    Free Shipping<br />On orders over Rs.2000
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 mx-auto bg-white/10 rounded-full flex items-center justify-center mb-1">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-[10px] text-white/80">
                    Priority Support<br />24/7 Assistance
                  </p>
                </div>
              </div>

              <button className="w-full mt-4 py-2.5 bg-white text-[#1A3C34] rounded-lg font-semibold text-[13px] hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                View Membership Benefits <span className="text-base">→</span>
              </button>
            </div>

            {/* Account Shortcuts */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-4">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Account Shortcuts
              </h2>
              <div className="space-y-3">
                <Link
                  href="/account/profile"
                  className="flex items-center justify-between p-3 bg-[#F8F9F6] rounded-xl hover:bg-gray-100 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-[#2B7A4B]" />
                    <span className="text-[14px] font-medium text-gray-700">
                      Update Profile
                    </span>
                  </div>
                  <span className="text-gray-400 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </Link>

                <Link
                  href="/account/orders"
                  className="flex items-center justify-between p-3 bg-[#F8F9F6] rounded-xl hover:bg-gray-100 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="w-4 h-4 text-[#2B7A4B]" />
                    <span className="text-[14px] font-medium text-gray-700">
                      My Orders
                    </span>
                  </div>
                  <span className="text-gray-400 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </Link>

                <Link
                  href="/account/addresses"
                  className="flex items-center justify-between p-3 bg-[#F8F9F6] rounded-xl hover:bg-gray-100 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-[#2B7A4B]" />
                    <span className="text-[14px] font-medium text-gray-700">
                      Manage Addresses
                    </span>
                  </div>
                  <span className="text-gray-400 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </Link>

                <Link
                  href="/account/wishlist"
                  className="flex items-center justify-between p-3 bg-[#F8F9F6] rounded-xl hover:bg-gray-100 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Heart className="w-4 h-4 text-[#2B7A4B]" />
                    <span className="text-[14px] font-medium text-gray-700">
                      My Wishlist
                    </span>
                  </div>
                  <span className="text-gray-400 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </Link>

                <Link
                  href="/account/settings"
                  className="flex items-center justify-between p-3 bg-[#F8F9F6] rounded-xl hover:bg-gray-100 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Settings className="w-4 h-4 text-[#2B7A4B]" />
                    <span className="text-[14px] font-medium text-gray-700">
                      Settings
                    </span>
                  </div>
                  <span className="text-gray-400 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </Link>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-red-200 text-red-600 font-medium rounded-2xl hover:bg-red-50 transition-colors mb-4"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>

            {/* Let's grow together! */}
            <div className="bg-[#F8F9F6] rounded-2xl p-5 border border-gray-200 relative overflow-hidden">
              <div className="absolute -bottom-6 -right-6 w-28 h-28 opacity-10">
                <Leaf className="w-28 h-28 text-[#2B7A4B]" />
              </div>
              <h4 className="text-[16px] font-bold text-[#1A3C34] mb-1">
                Let&apos;s grow together!
              </h4>
              <p className="text-[12px] text-gray-500 mb-4">
                Refer your friends and earn rewards for each successful referral.
              </p>
              <button className="w-full py-2.5 bg-[#1A3C34] text-white text-[13px] font-medium rounded-xl text-center hover:bg-[#14302a] transition-colors">
                Refer Now <span className="ml-1">→</span>
              </button>
            </div>

          </div>
        </div>

        {/* ===== BOTTOM TRUST BANNERS ===== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 border-t border-gray-200 pt-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#2B7A4B]/10 rounded-full flex items-center justify-center text-[#2B7A4B] flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">
                Secure Checkout
              </h4>
              <p className="text-xs text-gray-500">SSL Encrypted</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#2B7A4B]/10 rounded-full flex items-center justify-center text-[#2B7A4B] flex-shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">
                30-Day Returns
              </h4>
              <p className="text-xs text-gray-500">Hassle Free</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#2B7A4B]/10 rounded-full flex items-center justify-center text-[#2B7A4B] flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">
                Free Shipping
              </h4>
              <p className="text-xs text-gray-500">First order free</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#2B7A4B]/10 rounded-full flex items-center justify-center text-[#2B7A4B] flex-shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">
                24/7 Support
              </h4>
              <p className="text-xs text-gray-500">We&apos;re Here</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}