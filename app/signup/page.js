// app/signup/page.js
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Leaf, Mail, Lock, Eye, EyeOff, 
  Check, Heart, ShoppingBag, User, 
  ShieldCheck, Truck, RotateCcw, Headphones,
  Phone, Globe, ChevronDown, Users, X, Loader2
} from 'lucide-react';

export default function SignUpPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Form State (Matches your User.js model EXACTLY)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  // Verification State
  const [step, setStep] = useState(1); // 1 = Register, 2 = Verify Email, 3 = Success
  const [verificationCode, setVerificationCode] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  // Loading & Error States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // ===== PASSWORD STRENGTH LOGIC =====
  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);
  
  const getStrengthText = (score) => {
    if (score === 0) return '';
    if (score <= 2) return 'Weak';
    if (score <= 4) return 'Good';
    return 'Strong';
  };

  const getStrengthColor = (score) => {
    if (score === 0) return 'bg-gray-200';
    if (score <= 2) return 'bg-red-500';
    if (score <= 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  // ===== RESEND COOLDOWN TIMER =====
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // ===== FORM SUBMIT LOGIC =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // 1. Frontend Validation
    if (!formData.firstName || !formData.lastName) {
      setError("Please enter both First Name and Last Name.");
      setLoading(false);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }
    if (!formData.agreeTerms) {
      setError("Please agree to the Terms & Conditions");
      setLoading(false);
      return;
    }

    try {
      // 2. Send data to the backend (Port 5000, /api/auth/register)
      const response = await fetch(`/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          country: formData.country,
          password: formData.password,
        }),
      });

      const data = await response.json();

      // 3. Check for backend errors
      if (!response.ok) {
        const errorMessage = data.error || data.message || 'Something went wrong.';
        throw new Error(errorMessage);
      }

      // 4. Registration successful - Send verification code
      const verifyRes = await fetch(`/api/verification/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          type: 'register'
        }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok) {
        throw new Error(verifyData.error || 'Failed to send verification code');
      }

      // 5. Move to verification step
      setSuccess('Account created! Verification code sent to your email.');
      setStep(2);
      setResendCooldown(60);
      setLoading(false);

    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // ===== VERIFY EMAIL LOGIC =====
  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`/api/verification/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          code: verificationCode
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      setSuccess('Email verified successfully!');
      setStep(3);
      setLoading(false);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login');
      }, 2000);

    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // ===== RESEND VERIFICATION CODE =====
  const handleResend = async () => {
    if (resendCooldown > 0) return;
    
    setError('');
    setIsResending(true);

    try {
      const response = await fetch(`/api/verification/resend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend code');
      }

      setSuccess('New verification code sent to your email!');
      setResendCooldown(60);
      
      // Start countdown
      const interval = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white relative overflow-hidden">
      
      {/* ===== FULL WIDTH BACKGROUND IMAGE ===== */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Image 
          src="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1920&q=80"
          alt="Greenhouse background"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Soft White Fade Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/60 to-transparent"></div>
      </div>

      {/* ===== MAIN CONTENT CONTAINER ===== */}
      <div className="relative z-10 w-full min-h-screen flex flex-col lg:flex-row items-center justify-center px-4 sm:px-6 lg:px-12 xl:px-16 py-12">
        
        {/* ===== LEFT SIDE: TEXT & FEATURES ===== */}
        <div className="w-full lg:w-[45%] flex flex-col justify-center lg:pr-12 xl:pr-16 mb-10 lg:mb-0">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl lg:text-[48px] xl:text-[54px] font-bold text-[#1A3C34] leading-[1.1] mb-4 tracking-tight">
              Create Your <br />Green Account <Leaf className="inline-block w-8 h-8 lg:w-10 lg:h-10 text-[#2B7A4B] ml-2" />
            </h1>
            <p className="text-[17px] lg:text-[19px] text-gray-700 max-w-md leading-relaxed">
              Join GreenScape and be a part of a community that loves greenery.
            </p>
          </div>

          {/* Feature List */}
          <div className="mt-8 space-y-5 max-w-md">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm flex-shrink-0 mt-1">
                <Leaf className="w-5 h-5 text-[#2B7A4B]" />
              </div>
              <div>
                <h4 className="font-semibold text-[#1A3C34] text-[15px]">Wide Range of Plants</h4>
                <p className="text-[14px] text-gray-600 leading-snug">Find the best quality plants, seeds &amp; gardening tools.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm flex-shrink-0 mt-1">
                <Truck className="w-5 h-5 text-[#2B7A4B]" />
              </div>
              <div>
                <h4 className="font-semibold text-[#1A3C34] text-[15px]">Fast &amp; Free Shipping</h4>
                <p className="text-[14px] text-gray-600 leading-snug">Free shipping on orders over 1000Rs.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm flex-shrink-0 mt-1">
                <ShieldCheck className="w-5 h-5 text-[#2B7A4B]" />
              </div>
              <div>
                <h4 className="font-semibold text-[#1A3C34] text-[15px]">30-Day Guarantee</h4>
                <p className="text-[14px] text-gray-600 leading-snug">Love it or get a replacement within 30 days.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm flex-shrink-0 mt-1">
                <Users className="w-5 h-5 text-[#2B7A4B]" />
              </div>
              <div>
                <h4 className="font-semibold text-[#1A3C34] text-[15px]">Community &amp; Support</h4>
                <p className="text-[14px] text-gray-600 leading-snug">Expert guidance &amp; support for your green journey.</p>
              </div>
            </div>
          </div>

          {/* Bottom Trust Cards */}
          <div className="mt-8 grid grid-cols-3 gap-4 bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-100 max-w-lg">
            <div className="text-center">
              <div className="w-8 h-8 mx-auto bg-[#2B7A4B]/10 rounded-full flex items-center justify-center mb-1">
                <Users className="w-4 h-4 text-[#2B7A4B]" />
              </div>
              <p className="text-[11px] font-bold text-[#1A3C34]">50,000+</p>
              <p className="text-[9px] text-gray-500">Happy Gardeners</p>
            </div>
            <div className="text-center border-l border-r border-gray-200 px-2">
              <div className="w-8 h-8 mx-auto bg-[#2B7A4B]/10 rounded-full flex items-center justify-center mb-1">
                <Leaf className="w-4 h-4 text-[#2B7A4B]" />
              </div>
              <p className="text-[11px] font-bold text-[#1A3C34]">1M+</p>
              <p className="text-[9px] text-gray-500">Plants Delivered</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 mx-auto bg-[#2B7A4B]/10 rounded-full flex items-center justify-center mb-1">
                <Globe className="w-4 h-4 text-[#2B7A4B]" />
              </div>
              <p className="text-[11px] font-bold text-[#1A3C34]">30+</p>
              <p className="text-[9px] text-gray-500">Countries Served</p>
            </div>
          </div>
        </div>

        {/* ===== RIGHT SIDE: SIGN UP CARD ===== */}
        <div className="w-full lg:w-[55%] flex justify-center lg:justify-start">
          
          <div className="w-full max-w-[560px] bg-white rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-gray-100">
            
            {/* Step 1: Registration Form */}
            {step === 1 && (
              <>
                {/* Form Header */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-[28px] font-bold text-[#1A3C34]">Sign Up</h2>
                    <Leaf className="w-5 h-5 text-[#2B7A4B]" />
                  </div>
                  <p className="text-[15px] text-gray-500">Create your GreenScape account and start your green journey.</p>
                </div>

                {/* Global Error/Success Messages */}
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                    ⚠️ {error}
                  </div>
                )}
                {success && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg">
                    ✅ {success}
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* ✅ Row 1: First Name + Last Name */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-medium text-gray-700 mb-1">First Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="w-4 h-4 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="w-full pl-9 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#2B7A4B] focus:border-transparent placeholder:text-gray-400"
                          placeholder="Enter your first name"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[13px] font-medium text-gray-700 mb-1">Last Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="w-4 h-4 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="w-full pl-9 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#2B7A4B] focus:border-transparent placeholder:text-gray-400"
                          placeholder="Enter your last name"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Email */}
                  <div>
                    <label className="block text-[13px] font-medium text-gray-700 mb-1">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="w-4 h-4 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-9 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#2B7A4B] focus:border-transparent placeholder:text-gray-400"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  {/* Row 3: Phone + Country */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-medium text-gray-700 mb-1">Phone Number</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="w-4 h-4 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full pl-9 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#2B7A4B] focus:border-transparent placeholder:text-gray-400"
                          placeholder="Enter your phone number"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[13px] font-medium text-gray-700 mb-1">Country</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Globe className="w-4 h-4 text-gray-400" />
                        </div>
                        <select
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          className="w-full pl-9 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#2B7A4B] focus:border-transparent text-gray-700 appearance-none"
                          required
                        >
                          <option value="">Select your country</option>
                          <option value="US">United States</option>
                          <option value="UK">United Kingdom</option>
                          <option value="CA">Canada</option>
                          <option value="AU">Australia</option>
                          <option value="IN">India</option>
                          <option value="PK">Pakistan</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Row 4: Password + Confirm Password */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-medium text-gray-700 mb-1">Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="w-4 h-4 text-gray-400" />
                        </div>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full pl-9 pr-10 py-3 bg-white border border-gray-200 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#2B7A4B] focus:border-transparent placeholder:text-gray-400"
                          placeholder="Create a password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                      </div>
                      {/* Password Strength Meter */}
                      {formData.password.length > 0 && (
                        <div className="mt-2 flex items-center gap-3">
                          <div className="flex-1 flex gap-1 h-1.5">
                            {[1, 2, 3, 4, 5].map((bar) => (
                              <div 
                                key={bar}
                                className={`flex-1 rounded-full transition-colors duration-300 ${
                                  bar <= passwordStrength ? getStrengthColor(passwordStrength) : 'bg-gray-200'
                                }`}
                              />
                            ))}
                          </div>
                          <span className={`text-[11px] font-medium ${passwordStrength <= 2 ? 'text-red-500' : passwordStrength <= 4 ? 'text-yellow-500' : 'text-green-500'}`}>
                            {getStrengthText(passwordStrength)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-[13px] font-medium text-gray-700 mb-1">Confirm Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="w-4 h-4 text-gray-400" />
                        </div>
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="w-full pl-9 pr-10 py-3 bg-white border border-gray-200 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#2B7A4B] focus:border-transparent placeholder:text-gray-400"
                          placeholder="Confirm your password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showConfirmPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Terms Checkbox */}
                  <div className="flex items-start gap-3 pt-1">
                    <label className="flex items-start gap-3 cursor-pointer select-none w-full">
                      <input
                        type="checkbox"
                        name="agreeTerms"
                        checked={formData.agreeTerms}
                        onChange={handleChange}
                        className="hidden"
                      />
                      <div className={`relative flex items-center justify-center w-5 h-5 rounded-[6px] border-2 transition-colors duration-200 mt-0.5 flex-shrink-0 ${
                        formData.agreeTerms ? 'bg-[#2B7A4B] border-[#2B7A4B]' : 'bg-white border-[#1A3C34]/30'
                      }`}>
                        <Check className={`w-3.5 h-3.5 text-white transition-opacity duration-200 ${
                          formData.agreeTerms ? 'opacity-100' : 'opacity-0'
                        }`} />
                      </div>
                      <span className="text-[14px] text-gray-700 leading-relaxed">
                        I agree to the <a href="#" className="text-[#2B7A4B] font-medium hover:underline">Terms &amp; Conditions</a> and <a href="#" className="text-[#2B7A4B] font-medium hover:underline">Privacy Policy</a>
                      </span>
                    </label>
                  </div>

                  {/* Submit Button */}
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
                        Create Account
                      </>
                    )}
                  </button>
                </form>

                {/* Footer Link */}
                <p className="text-center text-[14px] text-gray-600 mt-6">
                  Already have an account?{' '}
                  <Link href="/login" className="text-[#2B7A4B] font-semibold hover:underline">
                    Sign In
                  </Link>
                </p>
              </>
            )}

            {/* Step 2: Verify Email */}
            {step === 2 && (
              <div className="text-center">
                {/* Icon */}
                <div className="w-20 h-20 mx-auto bg-[#2B7A4B]/10 rounded-full flex items-center justify-center mb-6">
                  <Mail className="w-10 h-10 text-[#2B7A4B]" />
                </div>
                
                <h2 className="text-[28px] font-bold text-[#1A3C34] mb-2">Verify Your Email</h2>
                <p className="text-[15px] text-gray-500 mb-6">
                  We've sent a 6-digit verification code to <strong className="text-[#1A3C34]">{formData.email}</strong>
                </p>

                {/* Error/Success Messages */}
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg text-left">
                    ⚠️ {error}
                  </div>
                )}
                {success && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg text-left">
                    ✅ {success}
                  </div>
                )}

                {/* Verification Form */}
                <form onSubmit={handleVerify} className="space-y-4">
                  <div>
                    <label className="block text-[13px] font-medium text-gray-700 mb-2">Enter Verification Code</label>
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-center text-3xl tracking-[0.5em] font-bold focus:outline-none focus:ring-2 focus:ring-[#2B7A4B] focus:border-transparent"
                      placeholder="••••••"
                      maxLength="6"
                      required
                    />
                  </div>

                  {/* Verify Button */}
                  <button
                    type="submit"
                    disabled={loading || verificationCode.length !== 6}
                    className="w-full py-3.5 bg-[#2B7A4B] text-white rounded-xl font-semibold text-[15px] hover:bg-[#23663e] transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Check className="w-5 h-5" />
                        Verify Email
                      </>
                    )}
                  </button>

                  {/* Resend Code */}
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={isResending || resendCooldown > 0}
                      className="text-[14px] text-[#2B7A4B] font-medium hover:underline disabled:opacity-50"
                    >
                      {isResending ? 'Sending...' : resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                    </button>
                  </div>

                  {/* Back Button */}
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-[14px] text-gray-500 hover:text-gray-700 mt-2"
                  >
                    ← Back to registration
                  </button>
                </form>
              </div>
            )}

            {/* Step 3: Success */}
            {step === 3 && (
              <div className="text-center">
                <div className="w-20 h-20 mx-auto bg-[#2B7A4B]/10 rounded-full flex items-center justify-center mb-6">
                  <Check className="w-10 h-10 text-[#2B7A4B]" />
                </div>
                <h2 className="text-[28px] font-bold text-[#1A3C34] mb-2">Email Verified! 🎉</h2>
                <p className="text-[15px] text-gray-500 mb-6">
                  Your email has been verified. Redirecting to login...
                </p>
                <div className="w-12 h-12 mx-auto">
                  <Loader2 className="w-12 h-12 text-[#2B7A4B] animate-spin" />
                </div>
                <p className="text-[14px] text-gray-400 mt-4">
                  <Link href="/login" className="text-[#2B7A4B] font-medium hover:underline">
                    Click here if not redirected
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}