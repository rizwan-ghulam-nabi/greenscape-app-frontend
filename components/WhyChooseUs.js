'use client';

import { 
  Star, 
  Leaf, 
  Globe, 
  Award, 
  ShieldCheck, 
  Headphones 
} from 'lucide-react';

export default function WhyChooseUs() {
  const stats = [
    {
      icon: <Star className="w-7 h-7 text-[#2B7A4B]" strokeWidth={1.8} />,
      value: '50,000+',
      label: 'Happy Gardeners'
    },
    {
      icon: <Leaf className="w-7 h-7 text-[#2B7A4B]" strokeWidth={1.8} />,
      value: '1M+',
      label: 'Plants Delivered'
    },
    {
      icon: <Globe className="w-7 h-7 text-[#2B7A4B]" strokeWidth={1.8} />,
      value: '30+',
      label: 'Countries Served'
    },
    {
      icon: <Award className="w-7 h-7 text-[#2B7A4B]" strokeWidth={1.8} />,
      value: '4.9',
      label: 'Average Rating',
      suffix: <span className="inline-flex text-[#FFB800] ml-1"><Star className="w-4 h-4 fill-current" /></span>
    },
    {
      icon: <ShieldCheck className="w-7 h-7 text-[#2B7A4B]" strokeWidth={1.8} />,
      value: '100%',
      label: 'Secure Payments'
    },
    {
      icon: <Headphones className="w-7 h-7 text-[#2B7A4B]" strokeWidth={1.8} />,
      value: '24/7',
      label: 'Customer Support'
    }
  ];

  return (
    <div className="w-full max-w-[1440px] mx-auto xl:max-w-full py-12 bg-[#F8F9F6]">
      <div className="px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        
        {/* ===== HEADER ===== */}
        <div className="flex items-center gap-2 mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Why Gardeners <span className='text-green-700'> Love GreenScape</span>
          </h2>
          <span className="text-[#2B7A4B]">
            <Leaf className="w-6 h-6" strokeWidth={2.5} />
          </span>
        </div>

        {/* ===== STATS CARD ===== */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 lg:p-10 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)]">
          
          {/* Responsive Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-y-8 sm:gap-y-8 lg:gap-y-0 gap-x-4">
            
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="flex flex-col items-center text-center group"
              >
                {/* Icon with subtle hover effect */}
                <div className="mb-2.5 transition-transform duration-300 group-hover:scale-110">
                  {stat.icon}
                </div>

                {/* Value */}
                <div className="flex items-center justify-center">
                  <span className="text-[18px] sm:text-[20px] lg:text-[22px] font-bold text-gray-900">
                    {stat.value}
                  </span>
                  {stat.suffix && stat.suffix}
                </div>

                {/* Label */}
                <span className="text-[13px] sm:text-[14px] text-gray-500 mt-0.5">
                  {stat.label}
                </span>
              </div>
            ))}

          </div>
        </div>

      </div>
    </div>
  );
}