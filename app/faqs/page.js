// app/faqs/page.js
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQS = [
  { q: 'How long does delivery take?', a: 'Standard delivery is 2–5 business days within Pakistan. Remote areas may take up to 7 days. Live plants are shipped within 24 hours of order placement.' },
  { q: 'Do you ship live plants?', a: 'Yes! We specialize in shipping healthy live plants. Each plant is carefully wrapped with moisture-retaining material and packed to survive transit.' },
  { q: 'What if my plant arrives damaged?', a: 'Contact us within 48 hours with photos of the damage. We\'ll send a free replacement or issue a full refund — whichever you prefer.' },
  { q: 'Can I cancel my order?', a: 'Orders can be cancelled within 2 hours of placement by contacting support. Once shipped, you can still return the item under our 30-day guarantee.' },
  { q: 'Do you offer free shipping?', a: 'Yes — free shipping on orders over Rs. 2,000. Orders under that amount have a flat Rs. 599 shipping fee.' },
  { q: 'How do I care for my new plant?', a: 'Each plant ships with a care card tailored to its needs. You can also visit our blog for detailed guides on watering, light, and repotting.' },
  { q: 'What payment methods do you accept?', a: 'We accept Visa, Mastercard, American Express, PayPal, Apple Pay, Google Pay, and Cash on Delivery for select areas.' },
  { q: 'Do you ship internationally?', a: 'Currently we ship within Pakistan only. International shipping is coming soon.' },
  { q: 'How do I track my order?', a: 'Once your order ships, you\'ll receive an email with a tracking link. You can also use our Track Order page.' },
  { q: 'Are the plants safe for pets?', a: 'Many of our plants are pet-safe, but not all. Each product page lists toxicity information. Filter by "Pet Friendly" on the shop page.' },
];

export default function FAQsPage() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="min-h-screen bg-[#F8F9F6] pb-20">
      <section className="bg-gradient-to-br from-[#2B7A4B] to-emerald-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
            <HelpCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Help Center</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Everything you need to know about ordering from GreenScape.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                aria-expanded={openIndex === i}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === i && (
                <div className="px-6 pb-5 text-gray-600 leading-relaxed text-sm">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
          <h3 className="font-bold text-gray-900 mb-2">Still have questions?</h3>
          <p className="text-sm text-gray-500 mb-4">
            Our support team is ready to help.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#2B7A4B] text-white rounded-xl font-medium hover:bg-[#23663e]"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}