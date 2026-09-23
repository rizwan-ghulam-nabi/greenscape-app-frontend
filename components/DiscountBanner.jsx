// components/DiscountBanner.jsx
'use client';

import { useState, useEffect } from 'react';
import { X, Tag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { getActiveDiscounts } from '@/app/utils/discountApi';

export default function DiscountBanner() {
  const [discount, setDiscount] = useState(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('discount-banner-dismissed');
    if (dismissed) {
      setVisible(false);
      return;
    }

    const fetchDiscount = async () => {
      const data = await getActiveDiscounts();
      if (data.success && data.discounts?.length > 0) {
        const best =
          data.discounts.find((d) => d.appliesTo === 'all_products') ||
          data.discounts[0];
        setDiscount(best);
      }
    };

    fetchDiscount();
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    sessionStorage.setItem('discount-banner-dismissed', 'true');
  };

  if (!visible || !discount) return null;

  return (
    <div className="bg-gradient-to-r from-[#2B7A4B] via-emerald-600 to-[#2B7A4B] text-white py-2.5 px-4 relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 text-sm">
        <Tag className="w-4 h-4 animate-pulse" />
        <span className="font-semibold">
          🎉 {discount.badgeText || `${discount.value}% OFF`} — {discount.name}!
        </span>
        <span className="hidden sm:inline text-white/80">
          Use code{' '}
          <strong className="font-mono bg-white/20 px-2 py-0.5 rounded">
            {discount.code}
          </strong>
        </span>
        <Link href="/shop" className="hidden sm:flex items-center gap-1 hover:underline">
          Shop Now <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
      <button
        onClick={handleDismiss}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded-full"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}