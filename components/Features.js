'use client';

import { Leaf, Truck, ShieldCheck, ShoppingBag } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: <Leaf className="w-6 h-6 text-[#2B7A4B]" />,
      title: 'Quality You Can Trust',
      desc: 'Premium & durable products'
    },
    {
      icon: <Truck className="w-6 h-6 text-[#2B7A4B]" />,
      title: 'Fast & Free Shipping',
      desc: 'On orders over $79'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#2B7A4B]" />,
      title: '30-Day Plant Guarantee',
      desc: 'Love it or get a replacement'
    },
    {
      icon: <ShoppingBag className="w-6 h-6 text-[#2B7A4B]" />,
      title: 'Secure & Safe Payments',
      desc: '100% secure checkout'
    }
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12 bg-white">
      
      {/* Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 lg:divide-x divide-gray-100">
        
        {features.map((feature, index) => (
          <div 
            key={index} 
            className="flex items-center justify-center sm:justify-start gap-4 px-2 py-4 sm:py-0 sm:px-6 first:pl-0 last:pr-0"
          >
            {/* Icon Wrapper with subtle green glow background */}
            <div className="relative flex-shrink-0">
              {/* Decorative faint green background shape */}
              <div className="absolute inset-0 bg-[#E8F5E9] rounded-full blur-sm opacity-50 transform scale-125"></div>
              <div className="relative w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-100">
                {feature.icon}
              </div>
            </div>

            {/* Text Content */}
            <div className="flex flex-col text-center sm:text-left">
              <h4 className="font-bold text-[15px] sm:text-[16px] text-gray-900 leading-tight">
                {feature.title}
              </h4>
              <p className="text-[13px] sm:text-[14px] text-gray-500 mt-0.5">
                {feature.desc}
              </p>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}