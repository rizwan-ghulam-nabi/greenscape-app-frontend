// app/refund-policy/page.js
import Link from 'next/link';
import {
  RotateCcw,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Wallet,
  CreditCard,
  Mail,
  ArrowRight,
  ShieldCheck,
  Leaf,
  FileText,
  Truck,
} from 'lucide-react';

export const metadata = {
  title: 'Refund Policy | GreenScape',
  description:
    'Our 30-day return and refund policy. Learn what\'s eligible, how to request a refund, and how long it takes.',
};

// ==========================================
// HIGHLIGHTS
// ==========================================
const HIGHLIGHTS = [
  {
    icon: Clock,
    title: '30-Day Window',
    desc: 'Request a return within 30 days of delivery for most items.',
  },
  {
    icon: RotateCcw,
    title: 'Free Returns',
    desc: 'We cover return shipping when the issue is on our end.',
  },
  {
    icon: Wallet,
    title: 'Fast Refunds',
    desc: 'Processed within 5–7 business days after we receive the item.',
  },
  {
    icon: ShieldCheck,
    title: 'No-Risk Shopping',
    desc: 'Live plants have a separate 7-day health guarantee.',
  },
];

// ==========================================
// ELIGIBILITY
// ==========================================
const ELIGIBLE = [
  'Item is unused and in original packaging (non-living products)',
  'Live plant shows health issues within 7 days of delivery',
  'Received wrong item or size',
  'Item arrived damaged or defective',
  'Product significantly different from description',
];

const NOT_ELIGIBLE = [
  'Gift cards and digital products',
  'Personalized or custom-engraved items',
  'Clearance items marked "final sale"',
  'Perishable items after 7 days from delivery',
  'Damage caused by misuse or neglect',
];

// ==========================================
// PROCESS STEPS
// ==========================================
const STEPS = [
  {
    icon: Mail,
    title: 'Request a Return',
    desc: 'Email support@greenscape.com with your order number and reason for return. Attach photos for damaged or wrong items.',
  },
  {
    icon: FileText,
    title: 'Get Approval',
    desc: 'We review your request within 24 hours and reply with return instructions and a shipping label (if applicable).',
  },
  {
    icon: Truck,
    title: 'Ship It Back',
    desc: 'Pack the item securely and drop it at the courier. For our errors, return shipping is free.',
  },
  {
    icon: Wallet,
    title: 'Get Refunded',
    desc: 'Once we receive and inspect the return, your refund is processed within 5–7 business days.',
  },
];

// ==========================================
// FAQS
// ==========================================
const FAQS = [
  {
    q: 'How long does a refund take?',
    a: 'Once we receive and inspect your return, refunds process within 5–7 business days. Bank transfers may take an additional 2–3 days depending on your provider.',
  },
  {
    q: 'Who pays for return shipping?',
    a: 'If the return is due to our error (wrong, damaged, or defective item), we cover return shipping. For change-of-mind returns, the customer covers shipping.',
  },
  {
    q: 'Can I return a live plant?',
    a: 'Live plants have a 7-day health guarantee instead of the standard 30-day return. If a plant arrives unhealthy, we send a free replacement or refund — no return required.',
  },
  {
    q: 'Can I exchange instead of refund?',
    a: 'Yes. We offer exchanges for a different size, color, or model of the same product value. Just mention "exchange" in your return email.',
  },
  {
    q: 'What if my refund is late?',
    a: 'If you haven\'t received your refund within 10 business days, email support@greenscape.com with your order number and we\'ll investigate immediately.',
  },
  {
    q: 'Do you refund the original shipping cost?',
    a: 'Yes, for returns due to our error. For change-of-mind returns, we refund the product price only — not the original shipping fee.',
  },
];

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F8F9F6] pb-20">
      {/* ===== HERO ===== */}
      <section className="relative bg-gradient-to-br from-[#1A3C34] via-[#2B7A4B] to-[#3d9b62] text-white py-20 px-4 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <RotateCcw className="w-4 h-4 text-green-300" />
            <span className="text-sm font-medium">Easy Returns</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Refund Policy
          </h1>

          <p className="text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
            Shop risk-free. If something isn&apos;t right, we&apos;ll make it right —
            with a fast, hassle-free refund or exchange.
          </p>
        </div>
      </section>

      {/* ===== HIGHLIGHTS ===== */}
      <section className="max-w-[1200px] mx-auto px-4 -mt-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {HIGHLIGHTS.map((h) => {
            const Icon = h.icon;
            return (
              <div
                key={h.title}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-[#2B7A4B]/10 rounded-full flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-[#2B7A4B]" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{h.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{h.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== ELIGIBILITY ===== */}
      <section className="max-w-[1200px] mx-auto px-4 mt-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            What&apos;s Eligible
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Clear rules, no fine print. Here&apos;s what we cover and what we
            don&apos;t.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ELIGIBLE */}
          <div className="bg-white rounded-2xl p-6 md:p-8 border-2 border-green-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Eligible for Refund
              </h3>
            </div>
            <ul className="space-y-3">
              {ELIGIBLE.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm text-gray-700"
                >
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-1" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* NOT ELIGIBLE */}
          <div className="bg-white rounded-2xl p-6 md:p-8 border-2 border-red-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Not Eligible
              </h3>
            </div>
            <ul className="space-y-3">
              {NOT_ELIGIBLE.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm text-gray-700"
                >
                  <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-1" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Live Plant Note */}
        <div className="mt-6 p-5 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-3">
          <Leaf className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800 leading-relaxed">
            <strong className="font-semibold">Special note for live plants:</strong>{' '}
            Live plants have a 7-day health guarantee instead of the 30-day return
            window. If a plant arrives unhealthy, we ship a free replacement or
            issue a full refund —{' '}
            <Link
              href="/plant-guarantee"
              className="underline font-medium hover:text-blue-900"
            >
              no return required
            </Link>
            .
          </p>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="max-w-[1200px] mx-auto px-4 mt-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            How to Request a Refund
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Four simple steps. Most refunds are approved the same day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="absolute -top-3 left-6 bg-[#2B7A4B] text-white text-xs font-bold w-8 h-8 rounded-full flex items-center justify-center shadow-md">
                  {i + 1}
                </div>

                <div className="w-12 h-12 bg-[#2B7A4B]/10 rounded-2xl flex items-center justify-center mb-4 mt-2">
                  <Icon className="w-6 h-6 text-[#2B7A4B]" />
                </div>

                <h3 className="text-base font-bold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== REFUND METHOD ===== */}
      <section className="max-w-[1200px] mx-auto px-4 mt-20">
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[#2B7A4B]/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Wallet className="w-6 h-6 text-[#2B7A4B]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              How Refunds Are Issued
            </h2>
          </div>

          <p className="text-gray-600 leading-relaxed mb-8">
            Refunds are always sent back to the original payment method. Here&apos;s
            what to expect based on how you paid:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#F8F9F6] rounded-2xl p-6">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                <CreditCard className="w-5 h-5 text-[#2B7A4B]" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                Card Payments
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Refunded to the same card. Processing: 5–7 business days.
                Depending on your bank, it may take up to 10 days to appear.
              </p>
            </div>

            <div className="bg-[#F8F9F6] rounded-2xl p-6">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                <Wallet className="w-5 h-5 text-[#2B7A4B]" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                Cash on Delivery
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Refunded via bank transfer or store credit — your choice.
                Processing: 5–7 business days after approval.
              </p>
            </div>

            <div className="bg-[#F8F9F6] rounded-2xl p-6">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                <Package className="w-5 h-5 text-[#2B7A4B]" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                Store Credit
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Optionally choose store credit and get 5% bonus value. Credit
                appears in your account instantly.
              </p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 leading-relaxed">
              <strong className="font-semibold">Important:</strong> Refunds are
              always sent back to the original payment method — we can&apos;t send
              them to a different card or account.
            </p>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="max-w-3xl mx-auto px-4 mt-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Common Questions
          </h2>
          <p className="text-gray-500">
            Everything you need to know about refunds.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <details
              key={i}
              className="group bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <summary className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer font-medium text-gray-900 hover:bg-gray-50 transition-colors list-none">
                <span>{faq.q}</span>
                <span className="text-gray-400 group-open:rotate-180 transition-transform duration-200 flex-shrink-0">
                  ▾
                </span>
              </summary>
              <div className="px-6 pb-5 text-gray-600 leading-relaxed text-sm">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="max-w-[1200px] mx-auto px-4 mt-20">
        <div className="relative bg-gradient-to-br from-[#2B7A4B] to-emerald-700 rounded-3xl p-8 md:p-12 text-white text-center overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative max-w-2xl mx-auto">
            <RotateCcw className="w-12 h-12 mx-auto mb-4 text-green-200" />
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Shop without worry
            </h2>
            <p className="text-white/85 mb-8 leading-relaxed">
              Every order is protected by our 30-day refund policy. If something
              isn&apos;t right, we&apos;ll fix it.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-[#2B7A4B] rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-md"
              >
                Start Shopping
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-transparent border-2 border-white/70 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}