// app/help/page.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  BookOpen,
  Leaf,
  Truck,
  CreditCard,
  RefreshCw,
  ArrowRight,
  ChevronRight,
  HelpCircle,
  MessageCircle,
  Sparkles,
  Package,
  Heart,
  ShieldCheck,
} from 'lucide-react';

// ==========================================
// HELP CATEGORIES
// ==========================================
const helpCategories = [
  {
    icon: Leaf,
    title: 'Plant Care',
    description: 'Watering, sunlight, soil and care tips',
    articles: 15,
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: Truck,
    title: 'Shipping & Delivery',
    description: 'Delivery times, tracking and packaging',
    articles: 12,
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: CreditCard,
    title: 'Payments & Billing',
    description: 'Payment methods, invoices and refunds',
    articles: 8,
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: RefreshCw,
    title: 'Returns & Refunds',
    description: 'Return policy, replacements and exchanges',
    articles: 10,
    color: 'bg-orange-50 text-orange-600',
  },
];

// ==========================================
// POPULAR TOPICS
// ==========================================
const popularTopics = [
  {
    icon: Package,
    iconBg: 'bg-emerald-50 text-emerald-600',
    title: 'How do I track my order?',
    description: 'Learn how to track your plant delivery in real-time.',
    link: '/orders',
  },
  {
    icon: Heart,
    iconBg: 'bg-pink-50 text-pink-600',
    title: 'How to care for my new plant?',
    description: 'Essential tips to keep your plants thriving.',
    link: '/blog',
  },
  {
    icon: RefreshCw,
    iconBg: 'bg-blue-50 text-blue-600',
    title: 'What is your return policy?',
    description: 'Learn about returns, replacements and refunds.',
    link: '/returns',
  },
  {
    icon: CreditCard,
    iconBg: 'bg-purple-50 text-purple-600',
    title: 'What payment methods do you accept?',
    description: 'Cards, UPI, net banking and wallets supported.',
    link: '/payment-methods',
  },
  {
    icon: Truck,
    iconBg: 'bg-cyan-50 text-cyan-600',
    title: 'Do you offer free shipping?',
    description: 'Free delivery on orders above Rs. 2000.',
    link: '/shipping',
  },
  {
    icon: ShieldCheck,
    iconBg: 'bg-yellow-50 text-yellow-600',
    title: 'Is my payment secure?',
    description: 'Learn about our secure payment system.',
    link: '/security',
  },
];

export default function HelpCenterPage() {
  const [query, setQuery] = useState('');

  const filteredTopics = query
    ? popularTopics.filter(
        (t) =>
          t.title.toLowerCase().includes(query.toLowerCase()) ||
          t.description.toLowerCase().includes(query.toLowerCase())
      )
    : popularTopics;

  const filteredCategories = query
    ? helpCategories.filter(
        (c) =>
          c.title.toLowerCase().includes(query.toLowerCase()) ||
          c.description.toLowerCase().includes(query.toLowerCase())
      )
    : helpCategories;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ==========================================
          HERO
      ========================================== */}
      <section className="bg-gradient-to-br from-[#021a12] via-[#0d2818] to-[#2B7A4B] text-white py-16 md:py-20 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-[#4ade80]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-10 w-80 h-80 bg-[#4ade80]/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-[#a7f3d0] border border-[#4ade80]/30 mb-6">
              <HelpCircle className="w-4 h-4" />
              Help Center
            </span>

            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              How can we <span className="text-[#4ade80]">help you?</span>
            </h1>
            <p className="text-[#a7f3d0]/80 text-lg mb-8">
              Find answers, guides and helpful resources to make your plant
              journey easier.
            </p>

            {/* Search */}
            <div className="max-w-2xl mx-auto flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search help articles, guides, or topics..."
                  className="w-full pl-12 pr-4 py-4 bg-white text-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4ade80] text-sm"
                />
              </div>
              <button className="px-6 py-4 bg-[#4ade80] text-[#021a12] font-semibold rounded-xl hover:bg-[#22c55e] transition-colors hidden sm:block">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          HELP CATEGORIES
      ========================================== */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredCategories.length > 0 && (
            <>
              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-[#021a12] mb-3">
                  Browse by Category
                </h2>
                <p className="text-gray-500 max-w-xl mx-auto">
                  Explore help topics organized by what matters most to you.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {filteredCategories.map((cat, idx) => (
                  <button
                    key={idx}
                    className="bg-white rounded-2xl border border-gray-100 p-6 text-left hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl ${cat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <cat.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-[#021a12] mb-1">
                      {cat.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">
                      {cat.description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-[#2B7A4B] group-hover:gap-2 transition-all">
                      {cat.articles} articles
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* ==========================================
              POPULAR TOPICS
          ========================================== */}
          {filteredTopics.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-[#021a12] mb-6 text-center">
                Popular Help Topics
              </h2>

              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-100 max-w-4xl mx-auto">
                {filteredTopics.map((topic, idx) => (
                  <Link
                    key={idx}
                    href={topic.link}
                    className="flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors group"
                  >
                    <div
                      className={`w-11 h-11 rounded-xl ${topic.iconBg} flex items-center justify-center shrink-0`}
                    >
                      <topic.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[#021a12] mb-0.5">
                        {topic.title}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        {topic.description}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#2B7A4B] group-hover:translate-x-1 transition-all shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* No results */}
          {query && filteredCategories.length === 0 && filteredTopics.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center max-w-2xl mx-auto">
              <Search className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-[#021a12] mb-2">
                No results found
              </h3>
              <p className="text-gray-500">
                Try different keywords or browse the categories above.
              </p>
            </div>
          )}

          {/* ==========================================
              STILL NEED HELP CTA
          ========================================== */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8 flex flex-col sm:flex-row items-center gap-6 max-w-4xl mx-auto">
            <div className="w-14 h-14 rounded-full bg-[#f0fdf4] flex items-center justify-center shrink-0">
              <MessageCircle className="w-7 h-7 text-[#2B7A4B]" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-semibold text-[#021a12] text-lg mb-1">
                Still need help?
              </h3>
              <p className="text-sm text-gray-500">
                Can't find what you're looking for? Our support team is here
                to help you grow.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#2B7A4B] text-white font-semibold rounded-xl hover:bg-[#1f5a37] transition-colors shrink-0"
            >
              Contact Us
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}