// app/careers/apply/[id]/page.js
'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Upload, X, Check, Loader2, Briefcase,
  MapPin, Clock, Star, FileText, User, Mail, Phone,
  Globe, MessageSquare, AlertCircle, CheckCircle2,
} from 'lucide-react';
import { getPositionById } from '@/app/lib/careers/jobs';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const MAX_RESUME_MB = 5;

export default function ApplyPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [position, setPosition] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    portfolioUrl: '',
    linkedinUrl: '',
    coverLetter: '',
    resumeUrl: '',    // Cloudinary URL
    resumeName: '',   // original filename
  });

  const [resumePreview, setResumePreview] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef(null);

  // Load position by ID
  useEffect(() => {
    if (!id) return;
    const pos = getPositionById(id);
    if (!pos) {
      setNotFound(true);
    } else {
      setPosition(pos);
    }
  }, [id]);

  // Cloudinary upload
  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size
    if (file.size > MAX_RESUME_MB * 1024 * 1024) {
      setError(`Resume too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Max ${MAX_RESUME_MB} MB.`);
      return;
    }

    // Validate type
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type)) {
      setError('Only PDF, DOC, or DOCX files are accepted.');
      return;
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_RESUME_PRESET;

    if (!cloudName || !uploadPreset) {
      setError('Cloudinary not configured.');
      return;
    }

    setUploadingResume(true);
    setError('');

    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', uploadPreset);
    // fd.append('resource_type', 'raw'); // for PDFs/docs

    try {
      // const res = await fetch(
      //   `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`,
      //   { method: 'POST', body: fd }
      // );

       const res = await fetch(
  `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
  { method: 'POST', body: fd }
);

      const data = await res.json();

      if (data.secure_url) {
        setFormData((prev) => ({
          ...prev,
          resumeUrl: data.secure_url,
          resumeName: file.name,
        }));
        setResumePreview(file.name);
      } else {
        setError('Upload failed. Please try again.');
      }
    } catch (err) {
      setError('Upload failed. Please try again.');
    } finally {
      setUploadingResume(false);
    }
  };

  const removeResume = () => {
    setFormData((prev) => ({ ...prev, resumeUrl: '', resumeName: '' }));
    setResumePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.fullName || !formData.email || !formData.phone) {
      setError('Please fill in name, email, and phone.');
      return;
    }
    if (!formData.resumeUrl) {
      setError('Please upload your resume.');
      return;
    }
    if (!formData.coverLetter || formData.coverLetter.length < 50) {
      setError('Please write a cover letter (at least 50 characters).');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/careers/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          positionId: position.id,
          positionTitle: position.title,
          positionDepartment: position.department,
          ...formData,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit application.');
      }

      setSuccess(true);
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ===== NOT FOUND =====
  if (notFound) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#F8F9F6] px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Position not found
          </h1>
          <p className="text-gray-500 mb-6">
            This job may have been filled or removed.
          </p>
          <Link
            href="/careers"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#2B7A4B] text-white rounded-xl font-semibold hover:bg-[#23663e] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            View All Openings
          </Link>
        </div>
      </div>
    );
  }

  if (!position) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#F8F9F6]">
        <Loader2 className="w-10 h-10 text-[#2B7A4B] animate-spin" />
      </div>
    );
  }

  // ===== SUCCESS SCREEN =====
  if (success) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#F8F9F6] px-4 py-16">
        <div className="text-center max-w-lg bg-white rounded-3xl shadow-lg border border-gray-100 p-10">
          <div className="w-20 h-20 bg-[#2B7A4B]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-[#2B7A4B]" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Application submitted!
          </h1>
          <p className="text-gray-600 mb-2">
            Thank you for applying for{' '}
            <span className="font-semibold text-gray-900">{position.title}</span>.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Our team will review your application and get back to you within
            7 days. Check your inbox at <strong>{formData.email}</strong>.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/careers"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#2B7A4B] text-white rounded-xl font-semibold hover:bg-[#23663e] transition-colors"
            >
              Browse More Roles
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ===== MAIN FORM =====
  return (
    <div className="min-h-screen bg-[#F8F9F6] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back link */}
        <Link
          href="/careers"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#2B7A4B] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Careers
        </Link>

        {/* Position card */}
        <div className="bg-gradient-to-br from-[#1A3C34] via-[#2B7A4B] to-[#3d9b62] rounded-2xl p-6 md:p-8 text-white mb-6 shadow-md">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-[10px] font-bold bg-white/15 backdrop-blur-sm px-2 py-1 rounded-full uppercase tracking-wider">
              {position.department}
            </span>
            <span className="text-[10px] font-bold bg-white/15 backdrop-blur-sm px-2 py-1 rounded-full uppercase tracking-wider">
              {position.type}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-3">
            {position.title}
          </h1>
          <p className="text-white/85 text-sm mb-4">{position.desc}</p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-white/75">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {position.location}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5" />
              {position.experience}
            </span>
          </div>
        </div>

        {/* Two-column layout: form + requirements */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* FORM */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              Apply for this role
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Fill out the form below. Takes about 3 minutes.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    placeholder="e.g. Ahmed Khan"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B7A4B] text-sm"
                    required
                  />
                </div>
              </div>

              {/* Email + Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B7A4B] text-sm"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="+92 300 1234567"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B7A4B] text-sm"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  City
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    placeholder="e.g. Faisalabad"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B7A4B] text-sm"
                  />
                </div>
              </div>

              {/* Portfolio + LinkedIn */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Portfolio / Website
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="url"
                      value={formData.portfolioUrl}
                      onChange={(e) => handleChange('portfolioUrl', e.target.value)}
                      placeholder="https://..."
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B7A4B] text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    LinkedIn Profile
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="url"
                      value={formData.linkedinUrl}
                      onChange={(e) => handleChange('linkedinUrl', e.target.value)}
                      placeholder="https://linkedin.com/in/..."
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B7A4B] text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Resume Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Resume <span className="text-red-500">*</span>
                  <span className="text-xs text-gray-400 font-normal ml-2">
                    PDF, DOC, DOCX · Max {MAX_RESUME_MB} MB
                  </span>
                </label>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleResumeUpload}
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="hidden"
                />

                {resumePreview ? (
                  <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-green-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {resumePreview}
                      </p>
                      <p className="text-xs text-green-700">Uploaded ✓</p>
                    </div>
                    <button
                      type="button"
                      onClick={removeResume}
                      aria-label="Remove resume"
                      className="p-2 hover:bg-white rounded-lg"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingResume}
                    className="w-full flex items-center justify-center gap-3 py-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl hover:border-[#2B7A4B] hover:bg-[#2B7A4B]/5 transition-all"
                  >
                    {uploadingResume ? (
                      <>
                        <Loader2 className="w-5 h-5 text-[#2B7A4B] animate-spin" />
                        <span className="text-sm font-medium text-gray-600">
                          Uploading...
                        </span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-[#2B7A4B]" />
                        <span className="text-sm font-medium text-gray-600">
                          Click to upload resume
                        </span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Cover Letter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Cover Letter <span className="text-red-500">*</span>
                  <span className="text-xs text-gray-400 font-normal ml-2">
                    (min 50 chars)
                  </span>
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <textarea
                    value={formData.coverLetter}
                    onChange={(e) => handleChange('coverLetter', e.target.value)}
                    rows={6}
                    maxLength={2000}
                    placeholder="Why do you want to join GreenScape? What makes you a great fit for this role?"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B7A4B] text-sm resize-y min-h-[140px]"
                    required
                  />
                </div>
                <p className="text-xs text-gray-400 text-right mt-1">
                  {formData.coverLetter.length}/2000
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting || uploadingResume}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#2B7A4B] text-white rounded-xl font-semibold hover:bg-[#23663e] transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Submit Application
                  </>
                )}
              </button>

              <p className="text-xs text-gray-400 text-center">
                By submitting, you agree to our{' '}
                <Link href="/privacy" className="underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </form>
          </div>

          {/* REQUIREMENTS SIDEBAR */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="w-5 h-5 text-[#2B7A4B]" />
                <h3 className="font-bold text-gray-900">Requirements</h3>
              </div>
              <ul className="space-y-3">
                {position.requirements?.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-[#2B7A4B] flex-shrink-0 mt-0.5" strokeWidth={3} />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#F8F9F6] rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-[#2B7A4B]" />
                <h4 className="font-semibold text-gray-900 text-sm">
                  What happens next?
                </h4>
              </div>
              <ol className="space-y-2 text-xs text-gray-600">
                <li className="flex gap-2">
                  <span className="text-[#2B7A4B] font-bold">1.</span>
                  <span>Our team reviews your application within 7 days</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#2B7A4B] font-bold">2.</span>
                  <span>We email you to schedule an intro call</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#2B7A4B] font-bold">3.</span>
                  <span>You meet 2–3 team members</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#2B7A4B] font-bold">4.</span>
                  <span>Offer sent within 5 days of final interview</span>
                </li>
              </ol>
            </div>

            <div className="bg-gradient-to-br from-[#2B7A4B] to-emerald-700 rounded-2xl p-6 text-white">
              <Mail className="w-6 h-6 mb-3 text-green-200" />
              <h4 className="font-bold mb-1 text-sm">Questions?</h4>
              <p className="text-xs text-white/80 mb-3">
                Reach out to our hiring team anytime.
              </p>
              <a
                href="mailto:careers@greenscape.com"
                className="text-xs font-semibold bg-white/15 hover:bg-white/25 transition-colors px-3 py-2 rounded-lg inline-block"
              >
                careers@greenscape.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}