// components/Footer.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import Image from 'next/image';
import { FiArrowUp } from 'react-icons/fi';
import {
  SiFacebook,
  SiInstagram,
  SiX,
  SiYoutube,
} from 'react-icons/si';
import {
  SiVisa,
  SiMastercard,
  SiAmericanexpress,
  SiPaypal,
  SiApplepay,
  SiGooglepay,
} from 'react-icons/si';
import { FaGooglePlay, FaApple } from 'react-icons/fa';

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ===== CHECK LOGIN STATUS =====
  useEffect(() => {
    let cancelled = false;

    const checkLoginStatus = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
          { withCredentials: true }
        );
        if (cancelled) return;
        setIsLoggedIn(res.data?.success === true);
      } catch {
        if (!cancelled) setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
    return () => {
      cancelled = true;
    };
  }, []);

  // ===== SCROLL LISTENER =====
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setShowScrollTop(window.scrollY > 400);
        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
    } catch {
      // silent
    } finally {
      try {
        localStorage.removeItem('user');
        localStorage.removeItem('cart');
      } catch {}
      window.location.href = '/';
    }
  };

  return (
    <footer className="w-full bg-[#0f3a2b] text-white mt-12 relative overflow-hidden rounded-2xl">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-12 sm:py-16">
        {/* ===== MAIN GRID ===== */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-8">
          {/* ===== COLUMN 1: Brand Info ===== */}
          <div className="lg:w-[22%] flex-shrink-0 space-y-4">
            <div className="flex items-center gap-2">
              <div>
                <h3 className="text-xl font-bold tracking-tight">
                  <Image
                    src="/logo.png"
                    alt="GreenScape"
                    width={88}
                    height={32}
                    className="h-8 w-auto"
                  />
                </h3>
                <p className="text-[10px] text-green-200/70 -mt-0.5">
                  Grow. Nurture. Thrive.
                </p>
              </div>
            </div>

            <p className="text-[13px] text-green-100/80 leading-relaxed max-w-xs">
              Your trusted online store for premium plants, tools, and outdoor essentials.
              Everything you need for a beautiful garden.
            </p>

            {/* ===== SOCIAL ICONS — Official Brand Logos ===== */}
            <div className="flex gap-3 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Facebook"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
              >
                <SiFacebook className="w-5 h-5 text-white group-hover:text-[#1877F2] transition-colors" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Instagram"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
              >
                <SiInstagram className="w-5 h-5 text-white group-hover:text-[#E4405F] transition-colors" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on X"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
              >
                <SiX className="w-5 h-5 text-white group-hover:text-white transition-colors" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Subscribe on YouTube"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
              >
                <SiYoutube className="w-5 h-5 text-white group-hover:text-[#FF0000] transition-colors" />
              </a>
            </div>
          </div>

          {/* ===== COLUMN 2: Shop ===== */}
          <div className="flex-1 min-w-[120px]">
            <h4 className="font-semibold text-[15px] mb-4 text-white">Shop</h4>
            <ul className="space-y-2.5 text-[13px] text-green-100/80">
              <li>
                <Link href="/products" prefetch={false} className="hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products?category=Plants" prefetch={false} className="hover:text-white transition-colors">
                  Plants
                </Link>
              </li>
              <li>
                <Link href="/products?category=Seeds%20%26%20Bulbs" prefetch={false} className="hover:text-white transition-colors">
                  Seeds &amp; Bulbs
                </Link>
              </li>
              <li>
                <Link href="/products?category=Gardening%20Tools" prefetch={false} className="hover:text-white transition-colors">
                  Gardening Tools
                </Link>
              </li>
              <li>
                <Link href="/products?category=Pots%20%26%20Planters" prefetch={false} className="hover:text-white transition-colors">
                  Pots &amp; Planters
                </Link>
              </li>
              <li>
                <Link href="/products?category=Fertilizers%20%26%20Soil" prefetch={false} className="hover:text-white transition-colors">
                  Fertilizers &amp; Soil
                </Link>
              </li>
              <li>
                <Link href="/offers" prefetch={false} className="hover:text-white transition-colors">
                  Deals &amp; Offers
                </Link>
              </li>
            </ul>
          </div>

          {/* ===== COLUMN 3: Company ===== */}
          <div className="flex-1 min-w-[120px]">
            <h4 className="font-semibold text-[15px] mb-4 text-white">Company</h4>
            <ul className="space-y-2.5 text-[13px] text-green-100/80">
              <li><Link href="/about" prefetch={false} className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/how-it-works" prefetch={false} className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href="/blog" prefetch={false} className="hover:text-white transition-colors">Our Blog</Link></li>
              <li><Link href="/plant-guarantee" prefetch={false} className="hover:text-white transition-colors">Plant Guarantee</Link></li>
              <li><Link href="/careers" prefetch={false} className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="/contact" prefetch={false} className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* ===== COLUMN 4: Customer Service ===== */}
          <div className="flex-1 min-w-[120px]">
            <h4 className="font-semibold text-[15px] mb-4 text-white">Customer Service</h4>
            <ul className="space-y-2.5 text-[13px] text-green-100/80">
              <li><Link href="/help" prefetch={false} className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="/shipping-policy" prefetch={false} className="hover:text-white transition-colors">Shipping Info</Link></li>
              <li><Link href="/refund-policy" prefetch={false} className="hover:text-white transition-colors">Returns &amp; Refunds</Link></li>
              <li><Link href="/account/track-order" prefetch={false} className="hover:text-white transition-colors">Track Your Order</Link></li>
              <li><Link href="/faqs" prefetch={false} className="hover:text-white transition-colors">FAQs</Link></li>
              <li><Link href="/size-guide" prefetch={false} className="hover:text-white transition-colors">Size Guide</Link></li>
            </ul>
          </div>

          {/* ===== COLUMN 5: My Account ===== */}
          {isLoggedIn && (
            <div className="flex-1 min-w-[120px]">
              <h4 className="font-semibold text-[15px] mb-4 text-white">My Account</h4>
              <ul className="space-y-2.5 text-[13px] text-green-100/80">
                <li><Link href="/account/profile" prefetch={false} className="hover:text-white transition-colors">Profile</Link></li>
                <li><Link href="/account/orders" prefetch={false} className="hover:text-white transition-colors">My Orders</Link></li>
                <li><Link href="/wishlist" prefetch={false} className="hover:text-white transition-colors">Wishlist</Link></li>
                <li><Link href="/account/addresses" prefetch={false} className="hover:text-white transition-colors">Address Book</Link></li>
                <li>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <FiArrowUp className="w-3.5 h-3.5 rotate-90" />
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}

          {/* ===== COLUMN 6: Payments & Apps ===== */}
          <div className="lg:w-[20%] flex-shrink-0 space-y-6 pt-2 lg:pt-0">
            {/* ===== PAYMENT METHODS — Official Brand Logos ===== */}
            <div>
              <h4 className="font-semibold text-[15px] mb-3 text-white">We Accept</h4>
              <div className="flex flex-wrap gap-2">
                {/* Visa */}
                <div
                  className="w-12 h-8 bg-white rounded flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
                  title="Visa"
                >
                  <SiVisa className="w-8 h-8 text-[#1A1F71]" />
                </div>

                {/* Mastercard */}
                <div
                  className="w-12 h-8 bg-white rounded flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
                  title="Mastercard"
                >
                  <SiMastercard className="w-7 h-7 text-[#EB001B]" />
                </div>

                {/* American Express */}
                <div
                  className="w-12 h-8 bg-white rounded flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
                  title="American Express"
                >
                  <SiAmericanexpress className="w-8 h-8 text-[#006FCF]" />
                </div>

                {/* PayPal */}
                <div
                  className="w-12 h-8 bg-white rounded flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
                  title="PayPal"
                >
                  <SiPaypal className="w-7 h-7 text-[#003087]" />
                </div>

                {/* Apple Pay */}
                <div
                  className="w-12 h-8 bg-black rounded flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
                  title="Apple Pay"
                >
                  <SiApplepay className="w-7 h-7 text-white" />
                </div>

                {/* Google Pay */}
                <div
                  className="w-12 h-8 bg-white rounded flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
                  title="Google Pay"
                >
                  <SiGooglepay className="w-8 h-8 text-[#5F6368]" />
                </div>
              </div>
            </div>

            {/* ===== DOWNLOAD APPS ===== */}
            <div>
              <h4 className="font-semibold text-[15px] mb-3 text-white">Download Our App</h4>
              <div className="flex flex-col gap-2">
                {/* Google Play */}
                <a
                  href="#"
                  className="inline-flex items-center gap-3 px-4 py-2 bg-black rounded-lg border border-white/20 hover:bg-gray-900 transition-colors"
                >
                  <FaGooglePlay className="w-5 h-5 text-white flex-shrink-0" />
                  <div className="flex flex-col items-start leading-tight">
                    <span className="text-[9px] text-gray-400 uppercase tracking-wider">
                      Get it on
                    </span>
                    <span className="text-[13px] text-white font-semibold">
                      Google Play
                    </span>
                  </div>
                </a>

                {/* App Store */}
                <a
                  href="#"
                  className="inline-flex items-center gap-3 px-4 py-2 bg-black rounded-lg border border-white/20 hover:bg-gray-900 transition-colors"
                >
                  <FaApple className="w-5 h-5 text-white flex-shrink-0" />
                  <div className="flex flex-col items-start leading-tight">
                    <span className="text-[9px] text-gray-400 uppercase tracking-wider">
                      Download on the
                    </span>
                    <span className="text-[13px] text-white font-semibold">
                      App Store
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ===== BOTTOM BAR ===== */}
        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-green-100/60 text-center sm:text-left">
            &copy; 2026 GreenScape. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12px] text-green-100/60">
            <Link href="/privacy" prefetch={false} className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" prefetch={false} className="hover:text-white transition-colors">Terms &amp; Conditions</Link>
            <Link href="/shipping-policy" prefetch={false} className="hover:text-white transition-colors">Shipping Policy</Link>
            <Link href="/refund-policy" prefetch={false} className="hover:text-white transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>

      {/* ===== BACK TO TOP ===== */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Back to top"
        className={`fixed bottom-6 left-6 w-10 h-10 bg-[#2B7A4B] rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl z-50 ${
          showScrollTop
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        <FiArrowUp className="w-5 h-5 text-white" />
      </button>
    </footer>
  );
}