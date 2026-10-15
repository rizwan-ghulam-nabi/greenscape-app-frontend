// app/how-it-works/page.js
import Link from 'next/link';
import { ShoppingCart, Package, Truck, Sprout, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'How It Works | GreenScape',
  description: 'Learn how GreenScape delivers fresh plants straight to your door.',
};

const STEPS = [
  {
    icon: ShoppingCart,
    title: 'Browse & Order',
    desc: 'Pick from our curated collection of plants, tools, and garden essentials. Add to cart and checkout in minutes.',
  },
  {
    icon: Package,
    title: 'We Prepare Carefully',
    desc: 'Our horticulturists hand-select each plant, wrap the roots, and package with protective materials to survive transit.',
  },
  {
    icon: Truck,
    title: 'Fast, Safe Delivery',
    desc: 'Orders ship within 24 hours. Live plants arrive in 2–5 business days, fresh and ready to grow.',
  },
  {
    icon: Sprout,
    title: 'Grow & Thrive',
    desc: 'Follow the care card included with each plant. If anything goes wrong, our 30-day guarantee has you covered.',
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#F8F9F6] pb-20">
      <section className="bg-gradient-to-br from-[#2B7A4B] to-emerald-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            From our greenhouse to your home — here&apos;s the journey.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="space-y-6">
          {STEPS.map((step, i) => (
            <div
              key={step.title}
              className="flex gap-6 bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm"
            >
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-[#2B7A4B] text-white rounded-2xl flex items-center justify-center">
                  <step.icon className="w-7 h-7" />
                </div>
              </div>
              <div>
                <div className="text-xs text-[#2B7A4B] font-bold uppercase tracking-wider mb-1">
                  Step {i + 1}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#2B7A4B] text-white rounded-xl font-semibold hover:bg-[#23663e] shadow-md"
          >
            Start Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}