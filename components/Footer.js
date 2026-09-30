'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
// ==========================================
// SWITCHING TO FEATHER ICONS FROM REACT-ICONS
// They are thin, clean, elegant, and 100% guaranteed to exist!
// ==========================================
import { 
  FiFacebook, 
  FiInstagram, 
  FiTwitter, 
  FiYoutube, 
  FiArrowUp 
} from 'react-icons/fi';

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // Check if user is logged in
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
          withCredentials: true
        });
        
        if (res.data?.success) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.log('User not logged in:', error.message);
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  // Show "Back to Top" button after scrolling down
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {}, {
        withCredentials: true
      });

      if (res.data?.success || res.status === 200) {
        // Clear any local storage if exists
        localStorage.removeItem('user');
        localStorage.removeItem('cart');
        
        // Show success message
        alert('You have been logged out successfully!');
        
        // Refresh the page
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Error logging out:', error);
      // Even if the API fails, clear the session
      window.location.href = '/';
    }
  };

  return (
    <footer className="w-full bg-[#0f3a2b] text-white mt-12 relative overflow-hidden rounded-2xl">
      
      {/* Inner max-width container to prevent horizontal scroll on big screens */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-12 sm:py-16">
        
        {/* ===== MAIN GRID / FLEX LAYOUT ===== */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-8">
          
          {/* ===== COLUMN 1: Brand Info (Left) ===== */}
          <div className="lg:w-[22%] flex-shrink-0 space-y-4">
            <div className="flex items-center gap-2">
            
              <div>
                <h3 className="text-xl font-bold tracking-tight">
                    <img src='/logo.png' alt='logo' className='w-22 text-center  '/>
                </h3>
                <p className="text-[10px] text-green-200/70 -mt-0.5">Grow. Nurture. Thrive.</p>
              </div>
            </div>
            
            <p className="text-[13px] text-green-100/80 leading-relaxed max-w-xs">
              Your trusted online store for premium plants, tools, and outdoor essentials. Everything you need for a beautiful garden.
            </p>

            {/* 
              ==========================================
              CLEAN, THIN FEATHER SOCIAL ICONS
              Exactly matches your UI style!
              ==========================================
            */}
            <div className="flex gap-3 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110">
                <FiFacebook className="w-5 h-5 text-white stroke-[1.5]" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110">
                <FiInstagram className="w-5 h-5 text-white stroke-[1.5]" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110">
                <FiTwitter className="w-5 h-5 text-white stroke-[1.5]" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110">
                <FiYoutube className="w-5 h-5 text-white stroke-[1.5]" />
              </a>
            </div>
          </div>

          {/* ===== COLUMN 2: Shop ===== */}
          <div className="flex-1 min-w-[120px]">
            <h4 className="font-semibold text-[15px] mb-4 text-white">Shop</h4>
            <ul className="space-y-2.5 text-[13px] text-green-100/80">
              <li><a href="#" className="hover:text-white transition-colors">All Products</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Plants</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Seeds & Bulbs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Gardening Tools</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pots & Planters</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Fertilizers & Soil</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Deals & Offers</a></li>
            </ul>
          </div>

          {/* ===== COLUMN 3: Company ===== */}
          <div className="flex-1 min-w-[120px]">
            <h4 className="font-semibold text-[15px] mb-4 text-white">Company</h4>
            <ul className="space-y-2.5 text-[13px] text-green-100/80">
              <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="/blog" className="hover:text-white transition-colors">Our Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Plant Guarantee</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* ===== COLUMN 4: Customer Service ===== */}
          <div className="flex-1 min-w-[120px]">
            <h4 className="font-semibold text-[15px] mb-4 text-white">Customer Service</h4>
            <ul className="space-y-2.5 text-[13px] text-green-100/80">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Shipping Info</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Returns & Refunds</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Track Your Order</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Size Guide</a></li>
            </ul>
          </div>

          {/* ===== COLUMN 5: My Account (ONLY VISIBLE WHEN LOGGED IN) ===== */}
          {isLoggedIn && (
            <div className="flex-1 min-w-[120px]">
              <h4 className="font-semibold text-[15px] mb-4 text-white">My Account</h4>
              <ul className="space-y-2.5 text-[13px] text-green-100/80">
                <li><Link href="/account/profile" className="hover:text-white transition-colors">Profile</Link></li>
                <li><Link href="/account/orders" className="hover:text-white transition-colors">My Orders</Link></li>
                <li><Link href="/wishlist" className="hover:text-white transition-colors">Wishlist</Link></li>
                <li><Link href="/account/addresses" className="hover:text-white transition-colors">Address Book</Link></li>
                <li>
                  <button 
                    onClick={handleLogout}
                    className="hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}

          {/* ===== COLUMN 6: We Accept & Apps ===== */}
          <div className="lg:w-[18%] flex-shrink-0 space-y-6 pt-2 lg:pt-0">
            
            {/* Payment Methods */}
            <div>
              <h4 className="font-semibold text-[15px] mb-3 text-white">We Accept</h4>
              <div className="flex flex-wrap gap-2">
                {/* Visa */}
                <div className="w-10 h-6 bg-white rounded flex items-center justify-center">
                  <span className="text-[8px] font-bold text-blue-600">VISA</span>
                </div>
                {/* Mastercard */}
                <div className="w-10 h-6 bg-white rounded flex items-center justify-center">
                  <span className="text-[8px] font-bold text-red-600">MC</span>
                </div>
                {/* Amex */}
                <div className="w-10 h-6 bg-white rounded flex items-center justify-center">
                  <span className="text-[8px] font-bold text-blue-400">AMEX</span>
                </div>
                {/* PayPal */}
                <div className="w-10 h-6 bg-white rounded flex items-center justify-center">
                  <span className="text-[8px] font-bold text-blue-800">Pay</span>
                </div>
                {/* Apple Pay */}
                <div className="w-10 h-6 bg-black rounded flex items-center justify-center">
                  <span className="text-[6px] font-bold text-white"> Pay</span>
                </div>
                {/* Google Pay */}
                <div className="w-10 h-6 bg-white rounded flex items-center justify-center">
                  <span className="text-[5px] font-bold text-gray-800">G Pay</span>
                </div>
              </div>
            </div>

            {/* Download Apps */}
            <div>
              <h4 className="font-semibold text-[15px] mb-3 text-white">Download Our App</h4>
              <div className="flex flex-wrap gap-2">
                {/* Google Play */}
                <div className="px-3 py-1.5 bg-black rounded-lg flex items-center gap-1.5 border border-white/20 hover:bg-gray-900 transition-colors cursor-pointer">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white"><path d="M3.6 2.6C3.2 2.9 3 3.4 3 4v16c0 .6.2 1.1.6 1.4l9.6-9.4L3.6 2.6z"/><path d="M15 9.8L5.2 3.2l-1.6 1.6 8.4 8.2 3-3.2z"/><path d="M22 11.4L17.6 9l-3.6 3.6 3.6 3.6 4.4-2.4c.8-.4.8-1.6 0-2z"/><path d="M5.2 20.8l9.8-6.6-3-3.2-8.4 8.2 1.6 1.6z"/></svg>
                  <span className="text-[8px] text-white font-medium">Google Play</span>
                </div>
                {/* App Store */}
                <div className="px-3 py-1.5 bg-black rounded-lg flex items-center gap-1.5 border border-white/20 hover:bg-gray-900 transition-colors cursor-pointer">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white"><path d="M17.5 2.5c-.8 0-1.8.7-2.4 1.9-.5.9-1.1 2.4-.7 3.9 1.9-.1 3.4-1.5 3.8-3.4.1-.1.1-.3.1-.4-.1-.1-.1-.1-.2-.1-.2-.1-.4-.1-.6-.1z"/><path d="M20.8 12.8c-.5-1.8-2.1-3-4-3-1.1 0-2.2.4-3.1 1.1-.9-.7-2-1.1-3.1-1.1-1.9 0-3.5 1.2-4 3-.2.5-.3 1.1-.3 1.6 0 2.7 1.8 5.3 4.2 7.2.9.7 2 1.1 3.1 1.1 1.1 0 2.2-.4 3.1-1.1.9.7 2 1.1 3.1 1.1 1.1 0 2.2-.4 3.1-1.1 2.4-1.9 4.2-4.5 4.2-7.2 0-.5-.1-1.1-.3-1.6z"/></svg>
                  <span className="text-[8px] text-white font-medium">App Store</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ===== BOTTOM BAR (Copyright + Legal) ===== */}
        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-green-100/60 text-center sm:text-left">
            &copy; 2026 GreenScape. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12px] text-green-100/60">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
            <a href="#" className="hover:text-white transition-colors">Shipping Policy</a>
            <a href="#" className="hover:text-white transition-colors">Refund Policy</a>
          </div>
        </div>

      </div>

      {/* ===== BACK TO TOP BUTTON (BOTTOM LEFT) ===== */}
      <button 
        onClick={scrollToTop}
        className={`fixed bottom-6 left-6 w-10 h-10 bg-gray-500 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl z-50 ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        <FiArrowUp className="w-5 h-5 text-[#0f3a2b]" />
      </button>

    </footer>
  );
}