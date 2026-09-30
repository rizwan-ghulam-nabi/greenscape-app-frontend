// app/verify-email/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Mail, Check, Loader2, RefreshCw, 
  ShieldCheck, Leaf, ArrowLeft, XCircle
} from 'lucide-react';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get('email') || '';
  
  const [email, setEmail] = useState(emailFromUrl);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  // Auto-fill email from URL if available
  useEffect(() => {
    if (emailFromUrl) {
      setEmail(emailFromUrl);
    }
  }, [emailFromUrl]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendCooldown]);

  // ===== SEND VERIFICATION CODE =====
  const sendVerificationCode = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/verification/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, type: 'register' }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send verification code');
      }

      setSuccess(`Verification code sent to ${email}`);
      setResendCooldown(60);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ===== VERIFY EMAIL =====
  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (code.length !== 6) {
      setError('Please enter the 6-digit verification code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/verification/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      setSuccess('Email verified successfully!');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login');
      }, 2000);

    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // ===== RESEND CODE =====
  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return;
    
    setError('');
    setIsResending(true);

    try {
      const response = await fetch(`/api/verification/resend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend code');
      }

      setSuccess('New verification code sent to your email!');
      setResendCooldown(60);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white relative overflow-hidden">
      
      {/* ===== BACKGROUND IMAGE ===== */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Image 
          src="https://images.unsplash.com/photo-1520412099556-4024751c3834?w=1920&q=80"
          alt="Green leaves background"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/70 to-transparent"></div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="relative z-10 w-full min-h-screen flex items-center justify-center px-4 sm:px-6 py-12">
        
        <div className="w-full max-w-[480px]">
          
          {/* Brand Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <span className="text-3xl font-extrabold text-[#2B7A4B] tracking-tight">Green</span>
              <span className="text-3xl font-extrabold text-gray-800 tracking-tight">Scape</span>
            </Link>
            <p className="text-[11px] text-gray-500 mt-1">Grow. Nurture. Thrive.</p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-gray-100">
            
            {/* Success State */}
            {success && !loading && (
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto bg-[#2B7A4B]/10 rounded-full flex items-center justify-center mb-4">
                  <Check className="w-8 h-8 text-[#2B7A4B]" />
                </div>
                <p className="text-[15px] text-green-600 font-medium">{success}</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <span className="text-[14px] text-red-600">{error}</span>
                </div>
              </div>
            )}

            {/* Icon */}
            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto bg-[#2B7A4B]/10 rounded-full flex items-center justify-center">
                <Mail className="w-10 h-10 text-[#2B7A4B]" />
              </div>
              <h1 className="text-[24px] font-bold text-[#1A3C34] mt-4">Verify Your Email</h1>
              <p className="text-[14px] text-gray-500 mt-2">
                Enter the 6-digit code we sent to your email address
              </p>
            </div>

            {/* Email Display */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-[14px] text-gray-700 font-medium">{email || 'your@email.com'}</span>
                </div>
                <button
                  onClick={() => setIsEditingEmail(!isEditingEmail)}
                  className="text-[12px] text-[#2B7A4B] font-medium hover:underline"
                >
                  {isEditingEmail ? 'Save' : 'Edit'}
                </button>
              </div>

              {/* Edit Email Input */}
              {isEditingEmail && (
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-3 px-4 py-2 bg-white border border-gray-200 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#2B7A4B]"
                  placeholder="Enter your email"
                />
              )}
            </div>

            {/* Verification Form */}
            <form onSubmit={handleVerify} className="space-y-4">
              
              {/* Code Input */}
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-2">Verification Code</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-center text-3xl tracking-[0.5em] font-bold focus:outline-none focus:ring-2 focus:ring-[#2B7A4B] focus:border-transparent"
                  placeholder="••••••"
                  maxLength="6"
                  required
                />
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className="w-full py-3.5 bg-[#2B7A4B] text-white rounded-xl font-semibold text-[15px] hover:bg-[#23663e] transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Verify Email
                  </>
                )}
              </button>

              {/* Resend Code */}
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isResending || resendCooldown > 0}
                  className="inline-flex items-center gap-2 text-[14px] text-[#2B7A4B] font-medium hover:underline disabled:opacity-50"
                >
                  {isResending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : resendCooldown > 0 ? (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      Resend in {resendCooldown}s
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      Resend Code
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Links */}
            <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
              <Link 
                href="/login" 
                className="flex items-center justify-center gap-2 text-[14px] text-gray-600 hover:text-[#2B7A4B] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
              
              <div className="text-center text-[13px] text-gray-500">
                Didn't receive the code?{' '}
                <span className="text-[#2B7A4B] font-medium">Check your spam folder</span>
              </div>
            </div>
          </div>

          {/* Trust Badge */}
          <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-100 flex items-center justify-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#2B7A4B]" />
            <p className="text-[13px] text-gray-600">
              Your email verification is secure and encrypted
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}