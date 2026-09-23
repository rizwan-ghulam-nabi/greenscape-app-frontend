'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image'; 
import gsap from 'gsap';

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideRef = useRef(null);

  const slides = [
    {
      id: 1,
      image: '/hero-section/hero1.jpg',
      tag: 'Trusted by 50,000+ Gardeners',
      title: 'Everything Your Garden Needs',
      subtitle: 'All in One Place',
      description: 'Premium plants, high-quality tools & outdoor essentials for a greener, happier lifestyle.',
      cta: 'Shop Now',
      discount: '40',
    },
    {
      id: 2,
      image: '/hero-section/hero2.jpg',
      tag: 'New Arrivals Weekly',
      title: 'Fresh Hanging Plants',
      subtitle: 'For Your Home & Patio',
      description: 'Discover our stunning collection of hanging plants to elevate your indoor and outdoor spaces.',
      cta: 'View Collection',
      discount: '20',
    },
    {
      id: 3,
      image: '/hero-section/hero3.jpg',
      tag: 'Grow Your Own Food',
      title: 'Premium Vegetable Seeds',
      subtitle: 'Start Your Garden Today',
      description: 'High-quality organic seeds for tomatoes, peppers, cucumbers, and more.',
      cta: 'Shop Seeds',
      discount: '15',
    },
    {
      id: 4,
      image: '/hero-section/hero4.jpg',
      tag: 'Expert Gardeners Love Us',
      title: 'Premium Gardening Tools',
      subtitle: 'Built to Last a Lifetime',
      description: 'Ergonomic, durable tools designed by gardeners, for gardeners.',
      cta: 'Shop Tools',
      discount: '10',
    }
  ];

  // ===== AUTO-PLAY SLIDER =====
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // ===== GSAP ANIMATION ON SLIDE CHANGE =====
  useEffect(() => {
    if (slideRef.current) {
      const items = slideRef.current.querySelectorAll('.animate-item');
      gsap.killTweensOf(items);
      gsap.set(items, { opacity: 0, y: 30 });
      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.1,
        delay: 0.1
      });
    }
  }, [currentSlide]);

  // ===== NAVIGATION HANDLERS =====
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative w-full mt-1 mb-8 overflow-hidden">
      
      <div 
        ref={slideRef}
        className="relative w-full max-w-[1440px] mx-auto 
                   aspect-[4/3] sm:aspect-[16/7] lg:aspect-[21/9] xl:aspect-[22/9] 
                   rounded-3xl xl:rounded-none overflow-hidden shadow-xl xl:shadow-none bg-[#f2f6f0]"
      >
        
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-[1200ms] ease-in-out ${
              index === currentSlide 
                ? 'opacity-100 scale-100 z-10' 
                : 'opacity-0 scale-95 z-0'
            }`}
          >
            {/* ===== BACKGROUND IMAGE ===== */}
            <div className="absolute inset-0 w-full h-full">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={index === 0}
                decoding="async"
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
              />

              {/* ===== GRADIENT OVERLAYS FOR TEXT READABILITY ===== */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent pointer-events-none"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none"></div>
            </div>

            {/* ===== CONTENT TEXT ===== */}
            <div className="absolute inset-0 flex items-center pl-[clamp(1rem,5vw,6rem)] pr-[clamp(1rem,4vw,4rem)] z-20">
              <div className="max-w-[clamp(20rem,60vw,70rem)] flex flex-col justify-center">
                
                {/* ===== TAG BADGE ===== */}
                <div className="bg-white/90 backdrop-blur-sm text-[#2B7A4B] text-[clamp(0.55rem,0.9vw,1rem)] font-semibold px-[clamp(0.5rem,1.2vw,1.5rem)] py-[clamp(0.15rem,0.4vw,0.6rem)] rounded-full inline-flex items-center w-fit mb-[clamp(0.25rem,0.5vw,0.75rem)] animate-item shadow-sm border border-gray-100/50">
                  <span className="w-[clamp(0.3rem,0.4vw,0.5rem)] h-[clamp(0.3rem,0.4vw,0.5rem)] rounded-full bg-[#2B7A4B] mr-[clamp(0.2rem,0.3vw,0.4rem)] animate-pulse"></span>
                  {slide.tag}
                </div>

                {/* ===== MAIN TITLE ===== */}
                <h1 className="text-[clamp(1.2rem,5vw,5rem)] font-extrabold text-white leading-[1.1] mb-[clamp(0.1rem,0.2vw,0.25rem)] animate-item tracking-tight drop-shadow-sm">
                  {slide.title}
                </h1>

                {/* ===== SUBTITLE ===== */}
                <h2 className="text-[clamp(0.9rem,3.5vw,3.5rem)] font-bold italic text-white/90 mb-[clamp(0.2rem,0.4vw,0.5rem)] animate-item drop-shadow-sm">
                  {slide.subtitle}
                </h2>

                {/* ===== DESCRIPTION ===== */}
                <p className="text-[clamp(0.7rem,1.2vw,1.2rem)] text-white/80 max-w-[clamp(15rem,40vw,40rem)] leading-relaxed mb-[clamp(0.5rem,1vw,1.5rem)] animate-item">
                  {slide.description}
                </p>

                {/* ===== BUTTONS ===== */}
                <div className="flex flex-wrap gap-[clamp(0.4rem,0.8vw,1rem)] animate-item">
                  <button className="bg-white text-[#1A3C34] px-[clamp(0.8rem,2vw,2.5rem)] py-[clamp(0.4rem,0.8vw,1rem)] rounded-full font-bold text-[clamp(0.65rem,1vw,1.1rem)] hover:bg-gray-50 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 group">
                    {slide.cta}
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </button>
                  <button className="bg-transparent border-2 border-white text-white px-[clamp(0.8rem,2vw,2.5rem)] py-[clamp(0.4rem,0.8vw,1rem)] rounded-full font-bold text-[clamp(0.65rem,1vw,1.1rem)] hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
                    Explore Categories
                  </button>
                </div>
              </div>
            </div>

            {/* ===== DISCOUNT BADGE ===== */}
            <div className="absolute top-[clamp(0.5rem,2vw,2.5rem)] right-[clamp(0.5rem,2vw,2.5rem)] z-20 animate-item flex flex-col items-center justify-center w-[clamp(3rem,10vw,8rem)] h-[clamp(3rem,10vw,8rem)] rounded-full bg-white/90 backdrop-blur-md shadow-xl border border-white/50">
              <span className="text-[clamp(0.35rem,0.7vw,0.75rem)] text-[#1A3C34] font-bold uppercase tracking-wider">Up to</span>
              <span className="text-[clamp(1.5rem,4.5vw,3.5rem)] font-extrabold text-[#1A3C34] leading-none mt-[clamp(0.05rem,0.2vw,0.2rem)]">{slide.discount}%</span>
              <span className="text-[clamp(0.3rem,0.6vw,0.7rem)] text-[#1A3C34] font-bold">OFF</span>
              <span className="text-[clamp(0.25rem,0.4vw,0.5rem)] text-gray-500 mt-[clamp(0.05rem,0.1vw,0.15rem)] uppercase font-medium">On Selected Items</span>
            </div>

          </div>
        ))}

        {/* ===== NAVIGATION ARROWS ===== */}
        <button 
          onClick={prevSlide}
          className="absolute left-[clamp(0.5rem,2vw,2.5rem)] top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-700 p-[clamp(0.3rem,0.6vw,0.8rem)] rounded-full shadow-lg z-30 transition-all duration-200 hover:scale-105 hover:shadow-xl"
        >
          <ChevronLeft className="w-[clamp(0.8rem,1.2vw,1.5rem)] h-[clamp(0.8rem,1.2vw,1.5rem)]" />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-[clamp(0.5rem,2vw,2.5rem)] top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-700 p-[clamp(0.3rem,0.6vw,0.8rem)] rounded-full shadow-lg z-30 transition-all duration-200 hover:scale-105 hover:shadow-xl"
        >
          <ChevronRight className="w-[clamp(0.8rem,1.2vw,1.5rem)] h-[clamp(0.8rem,1.2vw,1.5rem)]" />
        </button>

        {/* ===== PAGINATION DOTS ===== */}
        <div className="absolute bottom-[clamp(0.5rem,1.5vw,2rem)] left-1/2 -translate-x-1/2 flex gap-[clamp(0.2rem,0.5vw,0.75rem)] z-30">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white w-[clamp(0.4rem,0.6vw,0.8rem)] h-[clamp(0.4rem,0.6vw,0.8rem)] scale-110' 
                  : 'bg-white/40 w-[clamp(0.3rem,0.5vw,0.6rem)] h-[clamp(0.3rem,0.5vw,0.6rem)] hover:bg-white/70'
              }`}
            />
          ))}
        </div>

      </div>
    </div>
  );
}