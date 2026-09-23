// components/Categories.js
'use client';

import Link from 'next/link';
import { FaLeaf, FaSeedling, FaWater } from 'react-icons/fa';
import {
  GiFlowerPot,
  GiGardeningShears,
  GiFertilizerBag,
  GiLantern,
  GiSpray,
} from 'react-icons/gi';

// ==========================================
// ✅ TITLE CASE HELPER
// Converts "outdoor decor" → "Outdoor Decor"
// Handles small words (and, of, &) staying lowercase
// ==========================================
function toTitleCase(str) {
  if (!str) return '';

  // Words that should stay lowercase (unless at start/end)
  const smallWords = ['and', 'or', 'of', 'the', 'a', 'an', 'in', 'on', 'at', '&'];

  return str
    .toLowerCase()
    .split(' ')
    .map((word, index, arr) => {
      // Keep small words lowercase UNLESS first or last word
      if (smallWords.includes(word) && index !== 0 && index !== arr.length - 1) {
        return word;
      }
      // Capitalize first letter of each significant word
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

// ==========================================
// ✅ CATEGORY DEFINITIONS
// name is what users see (Title Case)
// slug is what matches MongoDB (from slug field)
// ==========================================
const CATEGORIES = [
  {
    name: 'Plants',
    slug: 'plants',
    icon: <FaLeaf className="w-6 h-6 text-[#2B7A4B]" />,
  },
  {
    name: 'Seeds & Bulbs',
    slug: 'seeds-bulbs',
    icon: <FaSeedling className="w-6 h-6 text-[#2B7A4B]" />,
  },
  {
    name: 'Pots & Planters',
    slug: 'pots-planters',
    icon: <GiFlowerPot className="w-6 h-6 text-[#2B7A4B]" />,
  },
  {
    name: 'Gardening Tools',
    slug: 'gardening-tools',
    icon: <GiGardeningShears className="w-6 h-6 text-[#2B7A4B]" />,
  },
  {
    name: 'Watering & Irrigation',
    slug: 'watering-irrigation',
    icon: <FaWater className="w-6 h-6 text-[#2B7A4B]" />,
  },
  {
    name: 'Fertilizers & Soil',
    slug: 'fertilizers-soil',
    icon: <GiFertilizerBag className="w-6 h-6 text-[#2B7A4B]" />,
  },
  {
    name: toTitleCase('outdoor decor'), // ← Auto-converts to "Outdoor Decor"
    slug: 'outdoor-decor',
    icon: <GiLantern className="w-6 h-6 text-[#2B7A4B]" />,
  },
  {
    name: toTitleCase('outdoor care'), // ← Auto-converts to "Outdoor Care"
    slug: 'outdoor-care',
    icon: <GiSpray className="w-6 h-6 text-[#2B7A4B]" />,
  },
];

// ==========================================
// ✅ BUILD URL FROM NAME
// ==========================================
function buildCategoryUrl(categoryName) {
  return `/products?category=${encodeURIComponent(categoryName)}`;
}

export default function Categories() {
  return (
    <div className="w-full max-w-[1440px] mx-auto xl:max-w-full py-12 bg-[#F8F9F6]">
      <div className="px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        {/* ===== HEADER ===== */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Shop by Category
          </h2>
          <Link
            href="/products"
            className="text-[#2B7A4B] text-sm font-semibold hover:underline flex items-center gap-1 transition-colors"
          >
            View All Categories
            <span className="text-lg">→</span>
          </Link>
        </div>

        {/* ===== INFINITE SCROLL CAROUSEL ===== */}
        <div className="relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-[#F8F9F6] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-[#F8F9F6] to-transparent z-10 pointer-events-none"></div>

          <div className="flex overflow-hidden">
            <div className="flex gap-4 lg:gap-5 py-4 animate-scroll-categories w-max">
              {CATEGORIES.map((cat, i) => (
                <CategoryCard key={`a-${i}`} category={cat} />
              ))}
              {CATEGORIES.map((cat, i) => (
                <CategoryCard key={`b-${i}`} category={cat} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scrollCategories {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll-categories {
          animation: scrollCategories 30s linear infinite;
        }
        .animate-scroll-categories:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}

// ==========================================
// ✅ CATEGORY CARD
// ==========================================
function CategoryCard({ category }) {
  // Display title-cased name
  const displayName = toTitleCase(category.name);
  const href = buildCategoryUrl(displayName);

  return (
    <Link
      href={href}
      className="group flex flex-col items-center justify-center gap-3 p-4 sm:p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer min-w-[140px] sm:min-w-[160px] hover:-translate-y-1 hover:translate-x-1"
    >
      <div className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-[#E8F5E9] rounded-full transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
        <div className="absolute inset-1 bg-white rounded-full shadow-sm"></div>
        <div className="relative z-10 flex items-center justify-center w-full h-full">
          {category.icon}
        </div>
      </div>

      <span className="text-[13px] sm:text-sm text-gray-700 font-medium text-center group-hover:text-[#2B7A4B] transition-colors">
        {displayName}
      </span>
    </Link>
  );
}