// app/login/page.js
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Leaf, Mail, Lock, Eye, EyeOff, 
  Check, Heart, ShoppingBag, 
  ShieldCheck, Truck, RotateCcw, Headphones,
  Loader2, XCircle, MailWarning
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [unverifiedEmail, setUnverifiedEmail] = useState('');

  // ===== LOGIN HANDLER =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Call your backend login API
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // ✅ CRUCIAL: Tells backend to set the httpOnly cookie
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid email or password');
      }

      // ✅ STEP 1: Check if email is verified
      if (!data.user.emailVerified) {
        setUnverifiedEmail(email);
        setError('Email not verified. Please verify your email to continue.');
        
        // ✅ Redirect to verify email page - NO CODE SENT HERE
        setTimeout(() => {
          router.push(`/verify-email?email=${encodeURIComponent(email)}`);
        }, 2000);
        return;
      }

      // ✅ STEP 2: Save user data to localStorage
      localStorage.setItem('authUser', JSON.stringify(data.user));

      // ✅ STEP 3: Trigger a custom event so the Header updates instantly
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('authChange'));
      }

      // ✅ STEP 4: Redirect to the home page after successful login
      router.push('/');

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white relative overflow-hidden">
      <div className="absolute inset-0 w-full h-full z-0">
        <Image 
          src="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1920&q=80"
          alt="Greenhouse background"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/60 to-transparent"></div>
      </div>

      <div className="relative z-10 w-full min-h-screen flex flex-col lg:flex-row items-center justify-center px-4 sm:px-6 lg:px-12 xl:px-16 py-12">
        
        {/* LEFT SIDE */}
        <div className="w-full lg:w-[50%] flex flex-col justify-center lg:pr-12 xl:pr-16 mb-10 lg:mb-0">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl lg:text-[54px] font-bold text-[#1A3C34] leading-[1.1] mb-4 tracking-tight">
              Welcome Back <Leaf className="inline-block w-8 h-8 lg:w-10 lg:h-10 text-[#2B7A4B] ml-2" />
            </h1>
            <p className="text-[17px] lg:text-[19px] text-gray-700 max-w-md leading-relaxed">
              Sign in to your GreenScape account and continue your green journey.
            </p>
          </div>

          <div className="mt-8 space-y-5 max-w-md">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm flex-shrink-0 mt-1">
                <Leaf className="w-5 h-5 text-[#2B7A4B]" />
              </div>
              <div>
                <h4 className="font-semibold text-[#1A3C34] text-[15px]">Personalized Experience</h4>
                <p className="text-[14px] text-gray-600 leading-snug">Get plant recommendations tailored just for you.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm flex-shrink-0 mt-1">
                <ShoppingBag className="w-5 h-5 text-[#2B7A4B]" />
              </div>
              <div>
                <h4 className="font-semibold text-[#1A3C34] text-[15px]">Easy & Fast Checkout</h4>
                <p className="text-[14px] text-gray-600 leading-snug">Save your details and enjoy a smooth checkout.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm flex-shrink-0 mt-1">
                <Heart className="w-5 h-5 text-[#2B7A4B]" />
              </div>
              <div>
                <h4 className="font-semibold text-[#1A3C34] text-[15px]">Wishlist & Collections</h4>
                <p className="text-[14px] text-gray-600 leading-snug">Save your favorite plants and access them any time.</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: SIGN IN CARD */}
        <div className="w-full lg:w-[50%] flex justify-center lg:justify-start">
          <div className="w-full max-w-[480px] bg-white rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-gray-100">
            
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-[28px] font-bold text-[#1A3C34]">Sign In</h2>
                <Leaf className="w-5 h-5 text-[#2B7A4B]" />
              </div>
              <p className="text-[15px] text-gray-500">Welcome back! Please enter your details.</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                <div className="flex items-start gap-2">
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
                {unverifiedEmail && (
                  <div className="mt-2 text-[13px] text-gray-500">
                    <Link href={`/verify-email?email=${encodeURIComponent(unverifiedEmail)}`} className="text-[#2B7A4B] font-medium hover:underline">
                      Click here to verify your email
                    </Link>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[14px] font-medium text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3.5 bg-white border border-gray-200 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#2B7A4B] focus:border-transparent placeholder:text-gray-400"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[14px] font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3.5 bg-white border border-gray-200 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#2B7A4B] focus:border-transparent placeholder:text-gray-400"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 accent-[#2B7A4B] rounded border-gray-300 focus:ring-[#2B7A4B]"
                  />
                  <span className="text-[14px] font-medium text-gray-700">Remember me</span>
                </label>
                <a href="#" className="text-[14px] font-medium text-[#2B7A4B] hover:underline">
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#2B7A4B] text-white rounded-xl font-semibold text-[15px] hover:bg-[#23663e] transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Leaf className="w-5 h-5" />
                    Sign In
                  </>
                )}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-[13px]">
                <span className="px-4 bg-white text-gray-500">or continue with</span>
              </div>
            </div>
            

            <div className="space-y-3">
              <button className="w-full flex items-center justify-center gap-3 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span className="text-[14px] font-medium text-gray-700">Continue with Google</span>
              </button>

              <button className="w-full flex items-center justify-center gap-3 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M17.5 2c-1.2 0-2.3.4-3.1 1.2-.6.6-1 1.4-1.1 2.3h2.5c.1-.5.4-1 .8-1.4.5-.5 1.1-.8 1.8-.8s1.3.3 1.8.8c.4.4.7.9.8 1.4h2.5c-.1-.9-.5-1.7-1.1-2.3-.8-.8-1.9-1.2-3.1-1.2z" fill="#000" />
                  <path d="M19 5H12v2h7c1.1 0 2 .9 2 2s-.9 2-2 2h-7v2h7c2.2 0 4-1.8 4-4s-1.8-4-4-4z" fill="#000" />
                  <path d="M5 10h14c1.1 0 2 .9 2 2s-.9 2-2 2H5c-1.1 0-2-.9-2-2s.9-2-2-2z" fill="#000" />
                  <path d="M12 12H5c-1.1 0-2 .9-2 2s.9 2 2 2h7v-4z" fill="#000" />
                </svg>
                <span className="text-[14px] font-medium text-gray-700">Continue with Apple</span>
              </button>

              <button className="w-full flex items-center justify-center gap-3 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5 fill-[#1877F2]" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="text-[14px] font-medium text-gray-700">Continue with Facebook</span>
              </button>
            </div>

            <p className="text-center text-[14px] text-gray-600 mt-6">
              Don&lsquo;t have an account?{' '}
              <Link href="/signup" className="text-[#2B7A4B] font-semibold hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}