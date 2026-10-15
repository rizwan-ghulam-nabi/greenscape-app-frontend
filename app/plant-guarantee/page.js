// app/plant-guarantee/page.js
import Link from 'next/link';
import {
  ShieldCheck,
  Check,
  X,
  Leaf,
  Camera,
  Mail,
  RefreshCw,
  Clock,
  Package,
  Heart,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

export const metadata = {
  title: '30-Day Plant Guarantee | GreenScape',
  description:
    'Every plant we ship is guaranteed to arrive healthy. Learn what\'s covered, what\'s not, and how to claim your replacement or refund.',
};

// ==========================================
// GUARANTEE PROMISES
// ==========================================
const PROMISES = [
  {
    icon: Package,
    title: 'Arrives Healthy',
    desc: 'Every plant is inspected before shipping and packed with protective materials to survive transit.',
  },
  {
    icon: Clock,
    title: '30-Day Coverage',
    desc: 'If your plant dies within 30 days under normal care, we replace it — no questions asked.',
  },
  {
    icon: RefreshCw,
    title: 'Free Replacement',
    desc: 'Damaged or wrong plant? We ship a free replacement immediately, no return required.',
  },
  {
    icon: Heart,
    title: 'Real Human Support',
    desc: 'Talk to actual gardeners, not bots. We reply within 24 hours, every day.',
  },
];

// ==========================================
// WHAT'S COVERED
// ==========================================
const COVERED = [
  'Plant arrives dead, damaged, or diseased',
  'Plant dies within 30 days under normal care',
  'Wrong plant or size delivered',
  'Packaging failure resulting in plant damage',
  'Plant lost in transit',
  'Plant significantly smaller than listed',
];

// ==========================================
// WHAT'S NOT COVERED
// ==========================================
const NOT_COVERED = [
  'Damage from neglect (no watering, wrong light)',
  'Overwatering or underwatering after delivery',
  'Extreme weather damage after arrival',
  'Normal seasonal dieback for deciduous plants',
  'Damage during customer repotting',
  'Pest infestation arising after delivery',
];

// ==========================================
// HOW TO CLAIM
// ==========================================
const STEPS = [
  {
    icon: Camera,
    title: 'Take Photos',
    desc: 'Photograph the plant, pot, and packaging. Clear photos help us resolve it fast.',
  },
  {
    icon: Mail,
    title: 'Email Us',
    desc: 'Send the photos and your order number to support@greenscape.com within 30 days of delivery.',
  },
  {
    icon: ShieldCheck,
    title: 'We Fix It',
    desc: 'Within 24 hours, we\'ll arrange a free replacement or full refund — your choice.',
  },
];

// ==========================================
// FAQS
// ==========================================
const FAQS = [
  {
    q: 'How long do I have to file a claim?',
    a: 'You have 30 days from the delivery date to file a claim for any reason covered under this guarantee. For damaged-in-transit issues, please contact us within 48 hours of delivery.',
  },
  {
    q: 'Do I need to return the damaged plant?',
    a: 'No. We don\'t require returns for plant replacements. Just send us photos and we\'ll ship a replacement or issue a refund.',
  },
  {
    q: 'What counts as "normal care"?',
    a: 'Watering appropriately, providing the right light for the plant species, and keeping it in a reasonable temperature range. Every plant ships with a care card tailored to its needs.',
  },
  {
    q: 'Can I get a refund instead of a replacement?',
    a: 'Yes. Your choice — replacement or refund, whichever you prefer. Refunds process within 5–7 business days.',
  },
  {
    q: 'Does the guarantee cover plants I repot?',
    a: 'Our guarantee covers plants that die under normal care. Damage during repotting isn\'t covered, but we\'re happy to offer guidance if you message us before repotting.',
  },
  {
    q: 'What about gift orders?',
    a: 'The guarantee travels with the plant. If you\'re the recipient of a gift, contact us with the order number and we\'ll assist you directly.',
  },
];

export default function PlantGuaranteePage() {
  return (
    <div className="min-h-screen bg-[#F8F9F6] pb-20">
      {/* ===== HERO ===== */}
      <section className="relative bg-gradient-to-br from-[#1A3C34] via-[#2B7A4B] to-[#3d9b62] text-white py-20 px-4 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <ShieldCheck className="w-4 h-4 text-green-300" />
            <span className="text-sm font-medium">Our Promise</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            30-Day Plant
            <br />
            <span className="bg-gradient-to-r from-green-300 to-emerald-200 bg-clip-text text-transparent">
              Guarantee
            </span>
          </h1>

          <p className="text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
            Every plant we ship is guaranteed to arrive healthy and stay healthy for 30 days.
            If it doesn&apos;t, we&apos;ll make it right — free replacement or full refund.
          </p>
        </div>
      </section>

      {/* ===== PROMISES ===== */}
      <section className="max-w-[1200px] mx-auto px-4 -mt-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PROMISES.map((promise) => {
            const Icon = promise.icon;
            return (
              <div
                key={promise.title}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-[#2B7A4B]/10 rounded-full flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-[#2B7A4B]" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{promise.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{promise.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== WHAT'S COVERED / NOT COVERED ===== */}
      <section className="max-w-[1200px] mx-auto px-4 mt-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            What&apos;s Covered
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Simple, clear terms. No fine print, no hidden exceptions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* COVERED */}
          <div className="bg-white rounded-2xl p-6 md:p-8 border-2 border-green-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-5 h-5 text-green-600" strokeWidth={3} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">We&apos;ve Got You</h3>
            </div>
            <ul className="space-y-3">
              {COVERED.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm text-gray-700"
                >
                  <Check
                    className="w-4 h-4 text-green-600 flex-shrink-0 mt-1"
                    strokeWidth={3}
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* NOT COVERED */}
          <div className="bg-white rounded-2xl p-6 md:p-8 border-2 border-red-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <X className="w-5 h-5 text-red-500" strokeWidth={3} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">What&apos;s Not Covered</h3>
            </div>
            <ul className="space-y-3">
              {NOT_COVERED.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm text-gray-700"
                >
                  <X
                    className="w-4 h-4 text-red-500 flex-shrink-0 mt-1"
                    strokeWidth={3}
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Note */}
        <div className="mt-6 p-5 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800 leading-relaxed">
            <strong className="font-semibold">Not sure if your plant is covered?</strong>{' '}
            Just ask us. We take a commonsense approach — if you gave the plant reasonable
            care and something went wrong, we&apos;ll help.
          </p>
        </div>
      </section>

      {/* ===== HOW TO CLAIM ===== */}
      <section className="max-w-[1200px] mx-auto px-4 mt-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            How to Claim
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Three simple steps. Most claims are resolved the same day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="relative bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Step number */}
                <div className="absolute -top-3 left-6 bg-[#2B7A4B] text-white text-xs font-bold w-8 h-8 rounded-full flex items-center justify-center shadow-md">
                  {i + 1}
                </div>

                <div className="w-14 h-14 bg-[#2B7A4B]/10 rounded-2xl flex items-center justify-center mb-5 mt-2">
                  <Icon className="w-7 h-7 text-[#2B7A4B]" />
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">
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

      {/* ===== FAQ ===== */}
      <section className="max-w-3xl mx-auto px-4 mt-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Common Questions
          </h2>
          <p className="text-gray-500">
            Everything you need to know about our guarantee.
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
            <Leaf className="w-12 h-12 mx-auto mb-4 text-green-200" />
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Shop with confidence
            </h2>
            <p className="text-white/85 mb-8 leading-relaxed">
              Every order is protected by our 30-day guarantee. Start your green
              journey today — we&apos;ve got your back.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-[#2B7A4B] rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-md"
              >
                Browse Plants
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-transparent border-2 border-white/70 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors"
              >
                Talk to Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRUST BADGES ===== */}
      <section className="max-w-[1200px] mx-auto px-4 mt-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Trusted by 50,000+', sub: 'Happy Gardeners' },
            { label: '4.9 / 5', sub: 'Average Rating' },
            { label: 'Free Shipping', sub: 'Orders over Rs. 2,000' },
            { label: '24-Hour', sub: 'Support Response' },
          ].map((badge) => (
            <div
              key={badge.label}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center"
            >
              <p className="text-lg font-bold text-[#2B7A4B] mb-1">
                {badge.label}
              </p>
              <p className="text-xs text-gray-500">{badge.sub}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

