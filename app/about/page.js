// app/about/page.js
'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Leaf, Shield, Truck, Award, Users, Heart, 
  Mail, Phone, MapPin,
  Star, ArrowRight, Target, Eye, Sparkles,
  Recycle, Clock, Globe, Package
} from 'lucide-react';

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Custom SVG icons
const FacebookIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const TwitterIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
  </svg>
);

const WhatsAppIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

export default function AboutPage() {
  const mainRef = useRef(null);
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const missionRef = useRef(null);
  const featuresRef = useRef(null);
  const whyChooseRef = useRef(null);
  const testimonialsRef = useRef(null);
  const timelineRef = useRef(null);
  const ctaRef = useRef(null);
  const contactRef = useRef(null);
  const socialRef = useRef(null);

  // ==========================================
  // ✅ REAL STATS STATE
  // ==========================================
  const [realStats, setRealStats] = useState({
    products: 0,
    customers: 0,
    orders: 0,
    cities: 0,
    rating: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // ==========================================
  // ✅ FETCH REAL STATS FROM BACKEND
  // ==========================================
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        console.log('📊 Fetching real stats...');
        
        const baseUrl = API_BASE_URL.endsWith('/api') 
          ? API_BASE_URL 
          : `${API_BASE_URL}/api`;
        
        const res = await fetch(`${baseUrl}/public/stats`);
        const data = await res.json();
        
        console.log('📊 Stats response:', data);
        
        if (data.success) {
          setRealStats(data.stats);
        }
      } catch (err) {
        console.error('❌ Error fetching stats:', err);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // ==========================================
  // GSAP ANIMATIONS
  // ==========================================
  useEffect(() => {
    // Wait for stats to load before animating
    if (statsLoading) return;

    // 1. Hero entrance
    const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });
    
    heroTimeline
      .fromTo(".hero-badge", 
        { opacity: 0, y: -20, scale: 0.8, rotationX: 90 }, 
        { opacity: 1, y: 0, scale: 1, rotationX: 0, duration: 0.8, ease: "back.out(1.7)" }
      )
      .fromTo(".hero-title-word",
        { opacity: 0, y: 50, rotationY: 90, scale: 0.8 },
        { opacity: 1, y: 0, rotationY: 0, scale: 1, duration: 0.8, stagger: 0.1, ease: "back.out(1.7)" }
      )
      .fromTo(".hero-subtitle",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 }
      )
      .fromTo(".hero-cta",
        { opacity: 0, y: 20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.15, ease: "back.out(2)" }
      )
      .fromTo(".hero-particle",
        { scale: 0, opacity: 0, rotation: 360 },
        { scale: 1, opacity: 1, rotation: 0, duration: 0.6, stagger: 0.1, ease: "back.out(2)" }
      );

    // 2. Floating leaves
    gsap.to(".floating-leaf", {
      y: -30,
      x: (index) => index % 2 === 0 ? 20 : -20,
      rotation: (index) => index % 2 === 0 ? 15 : -15,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.3
    });

    // 3. Hero circles parallax
    gsap.to(".hero-circle-1", {
      y: -80,
      rotation: 180,
      scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: 1.5 }
    });

    gsap.to(".hero-circle-2", {
      y: 80,
      rotation: -180,
      scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: 1.5 }
    });

    gsap.to(".hero-circle-3", {
      scale: 1.5,
      opacity: 0.5,
      scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: 1 }
    });

    // 4. Stats animation with counting
    const statsTL = gsap.timeline({
      scrollTrigger: { trigger: statsRef.current, start: "top 80%", end: "top 50%", scrub: 1 }
    });

    statsTL
      .fromTo(".stat-card",
        { opacity: 0, y: 50, scale: 0.8, rotationX: -90 },
        { opacity: 1, y: 0, scale: 1, rotationX: 0, duration: 0.8, stagger: 0.2, ease: "back.out(1.7)" }
      )
      .fromTo(".stat-icon",
        { rotate: -180, scale: 0 },
        { rotate: 0, scale: 1, duration: 0.6, stagger: 0.15, ease: "back.out(2)" }
      );

    // Number counter - with proper handling for decimals
    document.querySelectorAll('.stat-value').forEach((el) => {
      const targetValue = parseFloat(el.getAttribute('data-value')) || 0;
      const isDecimal = el.getAttribute('data-decimal') === 'true';
      
      if (targetValue > 0) {
        gsap.fromTo(el, 
          { innerText: 0 },
          {
            innerText: targetValue,
            duration: 2,
            ease: "power1.out",
            snap: isDecimal ? { innerText: 0.1 } : { innerText: 1 },
            scrollTrigger: { trigger: statsRef.current, start: "top 80%" },
            onUpdate: function() {
              const val = parseFloat(el.innerText) || 0;
              if (isDecimal) {
                el.innerText = val.toFixed(1);
              } else {
                el.innerText = Math.round(val);
              }
            }
          }
        );
      }
    });

    // 5. Mission & Vision
    gsap.fromTo(".mission-card",
      { opacity: 0, x: -100, rotationY: 30, scale: 0.9 },
      { opacity: 1, x: 0, rotationY: 0, scale: 1, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: missionRef.current, start: "top 80%" } }
    );

    gsap.fromTo(".vision-card",
      { opacity: 0, x: 100, rotationY: -30, scale: 0.9 },
      { opacity: 1, x: 0, rotationY: 0, scale: 1, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: missionRef.current, start: "top 80%" } }
    );

    // 6. Features
    gsap.fromTo(".feature-card",
      { opacity: 0, y: 80, rotationY: 90, scale: 0.5 },
      { opacity: 1, y: 0, rotationY: 0, scale: 1, duration: 0.8, ease: "back.out(1.7)", stagger: 0.15,
        scrollTrigger: { trigger: featuresRef.current, start: "top 75%" } }
    );

    // 7. Why Choose
    gsap.fromTo(".why-card",
      { opacity: 0, y: 50, scale: 0.5, rotation: -10 },
      { opacity: 1, y: 0, scale: 1, rotation: 0, duration: 0.8, ease: "bounce.out", stagger: 0.2,
        scrollTrigger: { trigger: whyChooseRef.current, start: "top 75%" } }
    );

    // 8. Testimonials
    gsap.fromTo(".testimonial-card",
      { opacity: 0, x: -40, y: 20, scale: 0.9, rotation: -5 },
      { opacity: 1, x: 0, y: 0, scale: 1, rotation: 0, duration: 0.7, ease: "power3.out", stagger: 0.2,
        scrollTrigger: { trigger: testimonialsRef.current, start: "top 75%" } }
    );

    // 9. Timeline
    gsap.fromTo(".timeline-item",
      { opacity: 0, x: (index) => index % 2 === 0 ? -60 : 60, scale: 0.8 },
      { opacity: 1, x: 0, scale: 1, duration: 0.8, ease: "power3.out", stagger: 0.3,
        scrollTrigger: { trigger: timelineRef.current, start: "top 70%" } }
    );

    gsap.fromTo(".timeline-dot",
      { scale: 0, opacity: 0, rotation: 360 },
      { scale: 1, opacity: 1, rotation: 0, duration: 0.6, ease: "back.out(2)", stagger: 0.2,
        scrollTrigger: { trigger: timelineRef.current, start: "top 70%" } }
    );

    // 10. CTA
    gsap.fromTo(".cta-content",
      { opacity: 0, scale: 0.5, y: 40, rotation: 5 },
      { opacity: 1, scale: 1, y: 0, rotation: 0, duration: 1, ease: "back.out(1.7)",
        scrollTrigger: { trigger: ctaRef.current, start: "top 85%" } }
    );

    // 11. Contact
    gsap.fromTo(".contact-card",
      { opacity: 0, y: 50, scale: 0.9, rotationY: 90 },
      { opacity: 1, y: 0, scale: 1, rotationY: 0, duration: 0.7, ease: "back.out(1.7)", stagger: 0.2,
        scrollTrigger: { trigger: contactRef.current, start: "top 80%" } }
    );

    // 12. Social
    gsap.fromTo(".social-icon",
      { opacity: 0, scale: 0, rotate: 180, y: 30 },
      { opacity: 1, scale: 1, rotate: 0, y: 0, duration: 0.6, ease: "back.out(2)", stagger: 0.15,
        scrollTrigger: { trigger: socialRef.current, start: "top 90%" } }
    );

    // 13. Section titles
    gsap.utils.toArray('.section-title').forEach((title) => {
      gsap.fromTo(title,
        { opacity: 0, y: 30, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: title, start: "top 85%" } }
      );
    });

    gsap.utils.toArray('.section-subtitle').forEach((subtitle) => {
      gsap.fromTo(subtitle,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out",
          scrollTrigger: { trigger: subtitle, start: "top 85%" } }
      );
    });

    // 14. Background pattern
    gsap.to(".bg-pattern", {
      backgroundPosition: "100px 100px",
      duration: 20,
      repeat: -1,
      ease: "none"
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [statsLoading]);

  // ==========================================
  // ✅ BUILD STATS CARDS FROM REAL DATA
  // ==========================================
  const statsCards = [
    { 
      icon: Users, 
      value: realStats.customers, 
      label: 'Happy Customers',
      suffix: '+',
      isDecimal: false
    },
    { 
      icon: Package, 
      value: realStats.products, 
      label: 'Products',
      suffix: '',
      isDecimal: false
    },
    { 
      icon: Globe, 
      value: realStats.cities, 
      label: 'Cities Served',
      suffix: '+',
      isDecimal: false
    },
    { 
      icon: Star, 
      value: realStats.rating, 
      label: 'Average Rating',
      suffix: '/5',
      isDecimal: true
    }
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden" ref={mainRef}>
      
      {/* HERO SECTION */}
      <section ref={heroRef} className="relative bg-gradient-to-br from-[#021a12] via-[#0d2818] to-[#2B7A4B] text-white py-20 md:py-28 overflow-hidden">
        <div className="hero-circle-1 absolute top-10 left-10 w-64 h-64 bg-[#4ade80]/10 rounded-full blur-3xl"></div>
        <div className="hero-circle-2 absolute bottom-10 right-10 w-80 h-80 bg-[#4ade80]/10 rounded-full blur-3xl"></div>
        <div className="hero-circle-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#4ade80]/5 rounded-full blur-2xl"></div>
        
        <div className="bg-pattern absolute inset-0 opacity-10" style={{ 
          backgroundImage: "radial-gradient(circle, #4ade80 1px, transparent 1px)",
          backgroundSize: "50px 50px"
        }}></div>
        
        <div className="floating-leaf absolute top-20 left-20 text-[#4ade80]/30">
          <Leaf className="w-8 h-8" />
        </div>
        <div className="floating-leaf absolute top-40 right-20 text-[#4ade80]/20">
          <Leaf className="w-12 h-12" />
        </div>
        <div className="floating-leaf absolute bottom-20 left-1/3 text-[#4ade80]/25">
          <Leaf className="w-10 h-10" />
        </div>
        <div className="floating-leaf absolute bottom-30 right-1/4 text-[#4ade80]/15">
          <Leaf className="w-14 h-14" />
        </div>
        
        <div className="hero-particle absolute top-20 right-40 w-3 h-3 bg-[#4ade80]/50 rounded-full"></div>
        <div className="hero-particle absolute top-60 left-30 w-4 h-4 bg-[#4ade80]/40 rounded-full"></div>
        <div className="hero-particle absolute bottom-40 right-60 w-2 h-2 bg-[#4ade80]/60 rounded-full"></div>
        <div className="hero-particle absolute bottom-20 left-10 w-3 h-3 bg-[#4ade80]/50 rounded-full"></div>
        <div className="hero-particle absolute top-40 left-60 w-3 h-3 bg-[#4ade80]/30 rounded-full"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <span className="hero-badge inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-[#a7f3d0] border border-[#4ade80]/30 mb-6">
              <Leaf className="w-4 h-4" />
              Our Story
            </span>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="hero-title-word inline-block">Growing</span>{' '}
              <span className="hero-title-word inline-block text-[#4ade80]">Greener,</span><br />
              <span className="hero-title-word inline-block">Living</span>{' '}
              <span className="hero-title-word inline-block text-[#4ade80]">Better</span>
            </h1>
            
            <p className="hero-subtitle text-lg md:text-xl text-[#a7f3d0]/80 max-w-2xl mx-auto mb-8">
              We're on a mission to bring the beauty of nature into every home and make 
              sustainable living accessible to everyone.
            </p>
            
            <div className="hero-cta flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#4ade80] text-[#021a12] font-semibold rounded-xl hover:bg-[#22c55e] transition-colors">
                Shop Now
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors border border-white/20">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          ✅ STATS SECTION - NOW WITH REAL DATA
      ========================================== */}
      <section ref={statsRef} className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statsCards.map((stat, idx) => (
              <div key={idx} className="stat-card text-center">
                <div className="stat-icon w-12 h-12 mx-auto bg-[#f0fdf4] rounded-full flex items-center justify-center mb-3">
                  <stat.icon className="w-6 h-6 text-[#2B7A4B]" />
                </div>
                
                {statsLoading ? (
                  <div className="h-9 w-20 mx-auto bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  <p 
                    className="stat-value text-3xl font-bold text-[#021a12]" 
                    data-value={stat.value}
                    data-decimal={stat.isDecimal}
                  >
                    {stat.isDecimal 
                      ? `${Number(stat.value).toFixed(1)}${stat.suffix}` 
                      : `${stat.value}${stat.suffix}`}
                  </p>
                )}
                
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section ref={missionRef} className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title text-3xl md:text-4xl font-bold text-[#021a12] mb-4">Our Purpose</h2>
            <p className="section-subtitle text-gray-500 max-w-2xl mx-auto">
              Everything we do is guided by our commitment to you and the planet.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="mission-card bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="w-14 h-14 bg-[#f0fdf4] rounded-xl flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-[#2B7A4B]" />
              </div>
              <h2 className="text-2xl font-bold text-[#021a12] mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                To make high-quality, eco-friendly plants and gardening products accessible 
                to everyone while promoting sustainable living practices.
              </p>
            </div>
            
            <div className="vision-card bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="w-14 h-14 bg-[#f0fdf4] rounded-xl flex items-center justify-center mb-6">
                <Eye className="w-7 h-7 text-[#2B7A4B]" />
              </div>
              <h2 className="text-2xl font-bold text-[#021a12] mb-4">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed">
                To be the leading online destination for plant lovers, where every home 
                becomes a sanctuary of green.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE OFFER */}
      <section ref={featuresRef} className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title text-3xl md:text-4xl font-bold text-[#021a12] mb-4">Everything You Need for a Greener Home</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Leaf, title: 'Premium Plants', description: 'Hand-picked, healthy plants from trusted growers.', color: 'bg-emerald-50 text-emerald-600' },
              { icon: Truck, title: 'Fast Delivery', description: 'Free delivery on orders over Rs. 2000.', color: 'bg-blue-50 text-blue-600' },
              { icon: Recycle, title: 'Eco-Friendly Packaging', description: 'We use biodegradable and recyclable packaging.', color: 'bg-green-50 text-green-600' },
              { icon: Shield, title: 'Plant Care Guarantee', description: 'If your plant arrives damaged, we will replace it.', color: 'bg-yellow-50 text-yellow-600' },
              { icon: Award, title: 'Expert Guidance', description: 'Our plant specialists answer your questions.', color: 'bg-purple-50 text-purple-600' },
              { icon: Heart, title: 'Community Support', description: 'Join our community of plant lovers.', color: 'bg-pink-50 text-pink-600' }
            ].map((feature, idx) => (
              <div key={idx} className="feature-card bg-gray-50 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-100">
                <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-[#021a12] mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section ref={whyChooseRef} className="py-16 md:py-20 bg-gradient-to-br from-[#021a12] via-[#0d2818] to-[#2B7A4B] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title text-3xl md:text-4xl font-bold mb-4">Why Choose GreenScape?</h2>
            <p className="section-subtitle text-[#a7f3d0]/80 max-w-2xl mx-auto">
              We go above and beyond to ensure you have the best plant shopping experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Clock, title: '24/7 Support', description: 'Our team is always here to help you.' },
              { icon: Sparkles, title: 'Premium Quality', description: 'Only the healthiest plants make it to you.' },
              { icon: Shield, title: 'Secure Shopping', description: 'Your data and payments are always safe.' },
              { icon: Award, title: 'Best Prices', description: 'Competitive prices without compromising quality.' }
            ].map((item, idx) => (
              <div key={idx} className="why-card bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="w-12 h-12 bg-[#4ade80]/20 rounded-xl flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-[#4ade80]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-[#a7f3d0]/70 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section ref={testimonialsRef} className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title text-3xl md:text-4xl font-bold text-[#021a12] mb-4">What Our Customers Say</h2>
            <p className="section-subtitle text-gray-500 max-w-2xl mx-auto">
              Join thousands of happy plant parents who trust us.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Priya Sharma', location: 'Mumbai', text: 'The plants arrived in perfect condition. The packaging was eco-friendly and the plant is thriving!', rating: 5 },
              { name: 'Rahul Verma', location: 'Delhi', text: 'Amazing quality and fast delivery. Their customer support helped me choose the right plant for my home.', rating: 5 },
              { name: 'Ananya Patel', location: 'Bangalore', text: 'I love the variety of plants available. The care guide included was super helpful for a beginner like me.', rating: 4 }
            ].map((testimonial, idx) => (
              <div key={idx} className="testimonial-card bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#2B7A4B] rounded-full flex items-center justify-center text-white font-semibold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-[#021a12] text-sm">{testimonial.name}</p>
                    <p className="text-gray-400 text-xs">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section ref={timelineRef} className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title text-3xl md:text-4xl font-bold text-[#021a12] mb-4">Our Journey</h2>
            <p className="section-subtitle text-gray-500 max-w-2xl mx-auto">
              From a small nursery to your favorite online plant store.
            </p>
          </div>
          
          <div className="relative">
            {/* Center line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-[#2B7A4B]/20 hidden md:block"></div>
            
            <div className="space-y-12">
              {[
                { year: '2020', title: 'The Beginning', description: 'Started as a small nursery with a passion for plants.' },
                { year: '2021', title: 'Going Online', description: 'Launched our e-commerce platform to reach more plant lovers.' },
                { year: '2022', title: 'Growing Community', description: 'Reached 10,000+ happy customers across the country.' },
                { year: '2023', title: 'Expanding Horizons', description: 'Added eco-friendly products and gardening tools.' }
              ].map((item, idx) => (
                <div key={idx} className={`timeline-item flex flex-col md:flex-row items-center gap-8 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className="flex-1 md:text-right">
                    <div className={`bg-gray-50 rounded-2xl p-6 border border-gray-100 ${idx % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                      <span className="text-[#2B7A4B] font-bold text-sm">{item.year}</span>
                      <h3 className="text-xl font-semibold text-[#021a12] mt-1 mb-2">{item.title}</h3>
                      <p className="text-gray-500 text-sm">{item.description}</p>
                    </div>
                  </div>
                  <div className="timeline-dot w-4 h-4 bg-[#2B7A4B] rounded-full border-4 border-white shadow-lg z-10"></div>
                  <div className="flex-1"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section ref={ctaRef} className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="cta-content bg-gradient-to-br from-[#2B7A4B] to-[#021a12] rounded-3xl p-8 md:p-12 text-center text-white">
            <Leaf className="w-12 h-12 mx-auto mb-6 text-[#4ade80]" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Go Green?</h2>
            <p className="text-[#a7f3d0]/80 max-w-xl mx-auto mb-8">
              Browse our collection of premium plants and start your green journey today.
            </p>
            <Link href="/shop" className="inline-flex items-center gap-2 px-8 py-4 bg-[#4ade80] text-[#021a12] font-semibold rounded-xl hover:bg-[#22c55e] transition-colors">
              Shop Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section ref={contactRef} className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title text-3xl md:text-4xl font-bold text-[#021a12] mb-4">Get in Touch</h2>
            <p className="section-subtitle text-gray-500 max-w-2xl mx-auto">
              Have questions? We'd love to hear from you.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Mail, title: 'Email', info: 'hello@greenscape.com', href: 'mailto:hello@greenscape.com' },
              { icon: Phone, title: 'Phone', info: '+91 98765 43210', href: 'tel:+919876543210' },
              { icon: MapPin, title: 'Address', info: 'Mumbai, Maharashtra, India', href: '#' }
            ].map((item, idx) => (
              <a key={idx} href={item.href} className="contact-card bg-gray-50 rounded-2xl p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-100 block">
                <div className="w-12 h-12 mx-auto bg-[#f0fdf4] rounded-xl flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-[#2B7A4B]" />
                </div>
                <h3 className="text-lg font-semibold text-[#021a12] mb-1">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.info}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL SECTION */}
      <section ref={socialRef} className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-500 mb-6">Follow us on social media</p>
            <div className="flex justify-center gap-4">
              {[
                { icon: FacebookIcon, href: 'https://facebook.com', color: 'hover:bg-blue-600' },
                { icon: InstagramIcon, href: 'https://instagram.com', color: 'hover:bg-pink-600' },
                { icon: TwitterIcon, href: 'https://twitter.com', color: 'hover:bg-sky-500' },
                { icon: WhatsAppIcon, href: 'https://wa.me/919876543210', color: 'hover:bg-green-600' }
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`social-icon w-12 h-12 bg-white rounded-xl flex items-center justify-center text-gray-600 shadow-sm border border-gray-100 transition-all duration-300 ${social.color} hover:text-white hover:shadow-lg hover:-translate-y-1`}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}