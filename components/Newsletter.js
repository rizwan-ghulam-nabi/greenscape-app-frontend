'use client';

import { Check } from 'lucide-react';

export default function Newsletter() {
  return (
    <div className="w-full max-w-[1440px] mx-auto xl:max-w-full py-12 bg-[#F8F9F6]">
      <div className="px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        
        {/* ===== MAIN CARD ===== */}
        <div className="relative w-full bg-gradient-to-br from-[#e8f5e9] via-[#f1f8f4] to-[#dcfce7] rounded-[24px] overflow-hidden shadow-sm border border-[#2B7A4B]/10 min-h-[180px] sm:min-h-[200px] md:min-h-[220px] flex items-center justify-between">
          
          {/* ===== LEFT IMAGE (Plants) ===== */}
          <div className="absolute bottom-0 left-0 w-[22%] sm:w-[20%] h-[85%] hidden sm:block z-0">
            <img 
              src="/newsletter/left-plants.png" 
              alt="Potted Plants"
              className="w-full h-full object-contain object-left-bottom"
            />
            {/* Soft fade to blend into the background */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#e8f5e9]/60 pointer-events-none"></div>
          </div>

          {/* ===== CENTER CONTENT (Form) ===== */}
          <div className="relative z-10 w-full md:w-[70%] mx-auto px-6 sm:px-10 py-8 sm:py-10 flex flex-col items-center text-center">
            
            {/* Header */}
            <h3 className="text-2xl sm:text-3xl font-bold text-[#1A3C34] mb-2">
              Join Our Gardening Community
            </h3>
            <p className="text-[14px] sm:text-[15px] text-[#1A3C34]/80 mb-5 max-w-md mx-auto">
              Get plant care tips, exclusive offers & new arrivals straight to your inbox.
            </p>

            {/* Input & Button */}
            <form 
              className="flex flex-col sm:flex-row w-full max-w-md gap-3"
              onSubmit={(e) => e.preventDefault()}
            >
              <input 
                type="email" 
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg bg-white border border-gray-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#2B7A4B] placeholder:text-gray-400 shadow-sm"
                required
              />
              <button 
                type="submit"
                className="px-6 py-3 bg-[#2B7A4B] text-white rounded-lg font-semibold text-[14px] hover:bg-[#23663e] transition-all duration-300 shadow-md hover:shadow-lg whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>

            {/* Trust Badges (Checkmarks) */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-4 text-[13px] text-[#1A3C34]/70">
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#2B7A4B]" strokeWidth={3} />
                <span>No spam, ever.</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#2B7A4B]" strokeWidth={3} />
                <span>Unsubscribe anytime</span>
              </div>
            </div>

          </div>

          {/* ===== RIGHT IMAGE (Watering Can) ===== */}
          <div className="absolute bottom-0 right-0 w-[22%] sm:w-[20%] h-[85%] hidden sm:block z-0">
            <img 
              src="/newsletter/right-watering-can.png" 
              alt="Watering Can"
              className="w-full h-full object-contain object-right-bottom"
            />
            {/* Soft fade to blend into the background */}
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#dcfce7]/60 pointer-events-none"></div>
          </div>

        </div>
      </div>
    </div>
  );
}

