// components/PromoBanners.js
'use client';

import { FaArrowRight } from 'react-icons/fa';

export default function PromoBanners() {
  const banners = [
    {
      id: 1,
      title: 'New Arrivals',
      desc: 'Fresh plants & tools just for your garden.',
      buttonText: 'Explore Now',
      image: '/banners/new-arrivals.png', 
    },
    {
      id: 2,
      title: 'Seasonal Sale',
      desc: 'Get up to 40% OFF on selected gardening items.',
      buttonText: 'Shop Sale',
      discount: '40%',
      image: '/banners/seasonal-sale.png',
    },
    {
      id: 3,
      title: 'Garden Essentials',
      desc: 'Everything you need for growing a beautiful garden.',
      buttonText: 'Shop Essentials',
      image: '/banners/garden-essentials.png',
    }
  ];

  return (
    <div className="w-full max-w-[1440px] mx-auto xl:max-w-full py-12 bg-[#F8F9F6]">
      <div className="px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        
        {/* ===== SECTION HEADER ===== */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 italic">
              Special Offers
            </h2>
            <p className="text-sm text-gray-500 mt-1 italic">
              Discover our hand-picked deals just for you
            </p>
          </div>
        </div>
        
        {/* ===== BANNERS GRID ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          
          {banners.map((banner, index) => {
            const overlayColors = [
              'from-[#8fc1b5]/90 via-[#8fc1b5]/50 to-transparent',
              'from-[#2a8c6e]/90 via-[#2a8c6e]/50 to-transparent',
              'from-[#557c68]/90 via-[#557c68]/50 to-transparent'
            ];

            return (
              <div 
                key={banner.id}
                className="relative rounded-2xl overflow-hidden aspect-[2.5/1] sm:aspect-[2/1] shadow-sm hover:shadow-lg transition-all duration-300 group"
              >
                {/* ===== FULL WIDTH BACKGROUND IMAGE ===== */}
                <div className="absolute inset-0 w-full h-full">
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${overlayColors[index]} pointer-events-none`}></div>
                </div>

                {/* ===== TEXT CONTENT (LEFT ALIGNED & ITALIC) ===== */}
                <div className="absolute inset-y-0 left-0 w-full sm:w-[70%] p-4 sm:p-6 lg:p-8 flex flex-col justify-center z-10">
                  
                  {/* Title - Italic */}
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1.5 drop-shadow-sm italic text-left">
                    {banner.title}
                  </h3>

                  {/* Description - Italic */}
                  <p className="text-xs sm:text-sm lg:text-[14px] leading-snug text-white/90 mb-3 sm:mb-4 drop-shadow-sm max-w-[95%] sm:max-w-[90%] line-clamp-2 italic text-left">
                    {banner.desc}
                  </p>

                  {/* CTA Button - Italic */}
                  <button 
                    className="w-fit px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-1.5 sm:gap-2 transition-all duration-300 group-hover:translate-x-1 bg-white text-[#1A3C34] hover:bg-gray-50 shadow-sm italic"
                  >
                    {banner.buttonText}
                    <FaArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </button>

                </div>

              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
}