// app/account/membership/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Leaf, Star, Gift, Truck, Headphones, ShieldCheck,
  Check, X, Crown, TrendingUp, Users, Sparkles,
  ArrowLeft, ChevronRight, Percent, Calendar, Award,
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// ==========================================
// ✅ TIER DEFINITIONS
// ==========================================
const TIERS = [
  {
    id: 'bronze',
    name: 'Bronze',
    minOrders: 1,
    maxOrders: 4,
    icon: Award,
    gradient: 'from-amber-700 to-amber-500',
    accent: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    benefits: [
      '5% off on all orders',
      'Free shipping over Rs. 2,000',
      'Standard email support',
      'Members-only seasonal offers',
    ],
  },
  {
    id: 'silver',
    name: 'Silver',
    minOrders: 5,
    maxOrders: 9,
    icon: Star,
    gradient: 'from-gray-400 to-gray-300',
    accent: 'text-gray-700',
    bg: 'bg-gray-50',
    border: 'border-gray-300',
    benefits: [
      '10% off on all orders',
      'Free shipping over Rs. 1,000',
      'Priority email support',
      'Early access to new arrivals',
      'Free plant care guide (digital)',
    ],
  },
  {
    id: 'gold',
    name: 'Gold',
    minOrders: 10,
    maxOrders: Infinity,
    icon: Crown,
    gradient: 'from-yellow-500 to-amber-400',
    accent: 'text-yellow-700',
    bg: 'bg-yellow-50',
    border: 'border-yellow-300',
    benefits: [
      '15% off on all orders',
      'Free shipping on ALL orders',
      'Priority 24/7 support',
      'Early access to new arrivals',
      'Exclusive birthday gift',
      'Free premium plant care kit',
      'Dedicated account manager',
    ],
  },
];

// ==========================================
// ✅ COMPARISON MATRIX
// ==========================================
const COMPARISON = [
  { feature: 'Discount on orders',          bronze: '5%',        silver: '10%',        gold: '15%' },
  { feature: 'Free shipping threshold',     bronze: 'Rs. 2,000', silver: 'Rs. 1,000',  gold: 'Always free' },
  { feature: 'Email support',                bronze: true,        silver: true,         gold: true },
  { feature: 'Priority support',             bronze: false,       silver: true,         gold: true },
  { feature: '24/7 support',                 bronze: false,       silver: false,        gold: true },
  { feature: 'Early access to new arrivals', bronze: false,       silver: true,         gold: true },
  { feature: 'Birthday gift',                bronze: false,       silver: false,        gold: true },
  { feature: 'Free care guide',              bronze: false,       silver: true,         gold: true },
  { feature: 'Dedicated manager',            bronze: false,       silver: false,        gold: true },
];

// ==========================================
// ✅ FAQS
// ==========================================
const FAQS = [
  {
    q: 'How is my membership tier determined?',
    a: 'Your tier is automatically calculated based on the number of completed orders you have placed. Bronze starts at 1 order, Silver at 5, and Gold at 10.',
  },
  {
    q: 'Do I need to pay for membership?',
    a: 'No! Membership is completely free. You earn higher tiers simply by shopping with us.',
  },
  {
    q: 'When do my benefits apply?',
    a: 'Discounts are applied automatically at checkout. Free shipping is applied when your order total meets your tier threshold.',
  },
  {
    q: 'Can I lose my tier?',
    a: 'Your tier is based on your lifetime orders. Once you reach a tier, you keep it — no downgrades.',
  },
  {
    q: 'How do I redeem my birthday gift?',
    a: 'Gold members receive an email with a unique code during their birthday month. Apply it at checkout.',
  },
];

// ==========================================
// ✅ COMPONENT
// ==========================================
export default function MembershipPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTier, setCurrentTier] = useState(TIERS[0]);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [userRes, ordersRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/auth/me`, { credentials: 'include' }),
          fetch(`${API_BASE_URL}/api/orders/my-orders`, { credentials: 'include' }),
        ]);

        if (!userRes.ok) {
          router.push('/login');
          return;
        }

        const userData = await userRes.json();
        setUser(userData.user);

        let ordersArr = [];
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          ordersArr = ordersData.orders || [];
        }
        setOrders(ordersArr);

        // Determine current tier
        const activeOrders = ordersArr.filter((o) => o.orderStatus !== 'cancelled');
        const count = activeOrders.length;
        const tier =
          TIERS.find((t) => count >= t.minOrders && count <= t.maxOrders) || TIERS[0];
        setCurrentTier(tier);
      } catch (err) {
        console.error('Membership load error:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [router]);

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#F8F9F6]">
        <div className="w-12 h-12 border-4 border-[#2B7A4B] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const activeOrders = orders.filter((o) => o.orderStatus !== 'cancelled').length;
  const nextTier = TIERS.find((t) => t.minOrders > activeOrders);
  const ordersToNextTier = nextTier ? nextTier.minOrders - activeOrders : 0;
  const progress = nextTier
    ? Math.min(
        100,
        Math.round(
          ((activeOrders - currentTier.minOrders) /
            (nextTier.minOrders - currentTier.minOrders)) *
            100
        )
      )
    : 100;

  return (
    <div className="w-full min-h-screen bg-[#F8F9F6] pb-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {/* ===== BREADCRUMBS ===== */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#2B7A4B]">
            Home
          </Link>
          <span className="text-gray-300">/</span>
          <Link href="/account" className="hover:text-[#2B7A4B]">
            My Account
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-[#2B7A4B] font-medium">Membership</span>
        </div>

        {/* ===== BACK BUTTON ===== */}
        <Link
          href="/account"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#2B7A4B] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {/* ===== HERO HEADER ===== */}
        <div className="bg-gradient-to-br from-[#1A3C34] via-[#2B7A4B] to-[#3d9b62] rounded-3xl p-6 md:p-10 shadow-lg text-white mb-10 relative overflow-hidden">
          {/* Decorative */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <span className="text-sm font-medium text-white/90">
                GreenScape Membership
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-3 leading-tight">
              You&apos;re a{' '}
              <span className="bg-gradient-to-r from-yellow-300 to-amber-400 bg-clip-text text-transparent">
                {currentTier.name} Member
              </span>
            </h1>
            <p className="text-white/80 max-w-2xl mb-6">
              Enjoy exclusive discounts, free shipping, priority support, and more.
              Your tier grows automatically as you shop.
            </p>

            {/* Current tier badge */}
            <div className="flex flex-wrap items-center gap-4">
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${currentTier.gradient} shadow-lg`}
              >
                <currentTier.icon className="w-4 h-4 text-white" />
                <span className="text-sm font-bold">{currentTier.name}</span>
              </div>
              <span className="text-sm text-white/70">
                {activeOrders} active order{activeOrders !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* ===== PROGRESS TO NEXT TIER ===== */}
        {nextTier ? (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Next tier</p>
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <nextTier.icon className={`w-5 h-5 ${nextTier.accent}`} />
                  {nextTier.name}
                </h3>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-[#2B7A4B]">
                  {ordersToNextTier}
                </p>
                <p className="text-xs text-gray-500">
                  more order{ordersToNextTier !== 1 ? 's' : ''} to unlock
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#2B7A4B] to-emerald-500 rounded-full transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {progress}% complete — keep shopping to level up!
            </p>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-yellow-400 to-amber-500 rounded-2xl p-6 mb-10 text-white flex items-center gap-4">
            <Crown className="w-10 h-10 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-bold">You&apos;re at the top tier!</h3>
              <p className="text-white/90 text-sm">
                Enjoy all Gold member benefits. Thank you for being a loyal customer!
              </p>
            </div>
          </div>
        )}

        {/* ===== TIER CARDS ===== */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Membership Tiers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TIERS.map((tier) => {
              const isCurrent = tier.id === currentTier.id;
              const Icon = tier.icon;
              return (
                <div
                  key={tier.id}
                  className={`relative rounded-2xl border-2 p-6 transition-all ${
                    isCurrent
                      ? `${tier.border} ${tier.bg} shadow-lg scale-[1.02]`
                      : 'border-gray-200 bg-white hover:shadow-md'
                  }`}
                >
                  {isCurrent && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#2B7A4B] text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                      YOUR TIER
                    </span>
                  )}

                  <div
                    className={`w-14 h-14 rounded-full bg-gradient-to-br ${tier.gradient} flex items-center justify-center mb-4 shadow-md`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {tier.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-4">
                    {tier.minOrders === 1 && tier.maxOrders === 4 && '1–4 orders'}
                    {tier.minOrders === 5 && tier.maxOrders === 9 && '5–9 orders'}
                    {tier.minOrders === 10 && '10+ orders'}
                  </p>

                  <ul className="space-y-2.5 mb-6">
                    {tier.benefits.map((benefit, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-gray-700"
                      >
                        <Check
                          className={`w-4 h-4 ${tier.accent} flex-shrink-0 mt-0.5`}
                          strokeWidth={3}
                        />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* ===== COMPARISON TABLE ===== */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-10 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">
              Compare Benefits
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Side-by-side view of what each tier offers
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                    Feature
                  </th>
                  {TIERS.map((tier) => (
                    <th
                      key={tier.id}
                      className={`text-center px-6 py-4 text-sm font-semibold ${
                        tier.id === currentTier.id
                          ? 'text-[#2B7A4B] bg-[#2B7A4B]/5'
                          : 'text-gray-700'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <tier.icon className={`w-4 h-4 ${tier.accent}`} />
                        {tier.name}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr
                    key={i}
                    className="border-t border-gray-100 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {row.feature}
                    </td>
                    {['bronze', 'silver', 'gold'].map((tierId) => {
                      const value = row[tierId];
                      const isCurrent = tierId === currentTier.id;
                      return (
                        <td
                          key={tierId}
                          className={`text-center px-6 py-4 text-sm ${
                            isCurrent ? 'bg-[#2B7A4B]/5' : ''
                          }`}
                        >
                          {value === true ? (
                            <Check className="w-4 h-4 text-[#2B7A4B] mx-auto" strokeWidth={3} />
                          ) : value === false ? (
                            <X className="w-4 h-4 text-gray-300 mx-auto" />
                          ) : (
                            <span className="font-medium text-gray-700">
                              {value}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ===== HOW IT WORKS ===== */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="w-12 h-12 bg-[#2B7A4B]/10 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-[#2B7A4B]" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">1. Shop & earn</h3>
              <p className="text-sm text-gray-600">
                Every completed order counts toward your tier. Canceled orders are not counted.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="w-12 h-12 bg-[#2B7A4B]/10 rounded-full flex items-center justify-center mb-4">
                <Percent className="w-6 h-6 text-[#2B7A4B]" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">2. Unlock discounts</h3>
              <p className="text-sm text-gray-600">
                Discounts apply automatically at checkout — no code needed.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="w-12 h-12 bg-[#2B7A4B]/10 rounded-full flex items-center justify-center mb-4">
                <Gift className="w-6 h-6 text-[#2B7A4B]" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">3. Enjoy rewards</h3>
              <p className="text-sm text-gray-600">
                Free shipping, priority support, birthday gifts, and more.
              </p>
            </div>
          </div>
        </div>

        {/* ===== FAQ ===== */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-10 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {FAQS.map((faq, i) => (
              <div key={i}>
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-900">
                    {faq.q}
                  </span>
                  <ChevronRight
                    className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${
                      openFaq === i ? 'rotate-90' : ''
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-sm text-gray-600 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ===== CTA ===== */}
        <div className="bg-gradient-to-r from-[#2B7A4B] to-emerald-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-2">Ready to level up?</h3>
          <p className="text-white/80 mb-6 max-w-xl mx-auto">
            Keep shopping with GreenScape to unlock even more benefits. Every order
            brings you closer to the next tier.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#2B7A4B] rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-md"
          >
            Start Shopping
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}