// components/TrustedBrands.js
'use client';

export default function TrustedBrands() {
  // Brand names with styled text
  const brands = [
    { name: 'Miracle-Gro', style: 'font-serif font-bold text-2xl text-[#2B7A4B]' },
    { name: 'FISKARS', style: 'font-sans font-black text-2xl text-[#1A1A1A] tracking-wider' },
    { name: 'Scotts', style: 'font-sans font-bold text-2xl text-[#2B7A4B] italic' },
    { name: 'GARDENA', style: 'font-sans font-bold text-2xl text-[#F97316]' },
    { name: 'BURPEE', style: 'font-sans font-black text-2xl text-[#D32F2F] tracking-wide' },
    { name: 'Espoma', style: 'font-serif font-bold text-2xl text-[#2B7A4B] italic' },
    { name: 'Proven Winners', style: 'font-sans font-bold text-xl text-[#1A1A1A]' },
    { name: 'Vigoro', style: 'font-sans font-black text-2xl text-[#D32F2F] italic' },
  ];

  // Duplicate brands for infinite scroll
  const duplicatedBrands = [...brands, ...brands];

  return (
    <div className="w-full max-w-[1440px] mx-auto xl:max-w-full py-12 bg-white">
      <div className="px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        
        {/* ===== HEADER ===== */}
        <div className="flex items-center gap-2 mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Trusted by Top Brands
          </h2>
        </div>

        {/* ===== INFINITE SCROLL LOGO STRIP ===== */}
        <div className="relative overflow-hidden">
          {/* Gradient Fades */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

          {/* Scrolling Container */}
          <div className="flex overflow-hidden">
            {/* Animated Track - Starts at -50% and moves to 0 for LEFT TO RIGHT */}
            <div className="flex gap-12 sm:gap-16 lg:gap-20 items-center py-4 animate-scroll-brands-left w-max">
              {/* First copy */}
              {brands.map((brand, index) => (
                <BrandLogo key={`first-${index}`} brand={brand} />
              ))}
              {/* Second copy - Makes loop seamless */}
              {brands.map((brand, index) => (
                <BrandLogo key={`second-${index}`} brand={brand} />
              ))}
            </div>
          </div>
        </div>

      </div>

      <style jsx>{`
        @keyframes scrollBrandsLeft {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
        .animate-scroll-brands-left {
          animation: scrollBrandsLeft 30s linear infinite;
        }
        .animate-scroll-brands-left:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}

// Brand Logo Component
function BrandLogo({ brand }) {
  return (
    <div className="flex-shrink-0 group flex items-center justify-center cursor-pointer">
      <div className="transition-all duration-300 group-hover:scale-110 group-hover:opacity-80">
        <span className={brand.style}>
          {brand.name}
        </span>
      </div>
    </div>
  );
}