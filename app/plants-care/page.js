// app/plants-care/page.js
'use client';

import Link from 'next/link';
import { Leaf, ArrowRight, BookOpen, Droplet, Sun, Sprout, Bug, Scissors } from 'lucide-react';

const GUIDES = [
  { icon: Droplet, title: 'Watering Basics', desc: 'How much, how often, and when to water each plant type.' },
  { icon: Sun, title: 'Light Requirements', desc: 'Understanding direct, indirect, and low-light conditions.' },
  { icon: Sprout, title: 'Repotting Guide', desc: 'When and how to repot without shocking your plants.' },
  { icon: Bug, title: 'Pest Control', desc: 'Identify and treat common plant pests naturally.' },
  { icon: Scissors, title: 'Pruning & Trimming', desc: 'Encourage healthy growth and shape your plants.' },
  { icon: Leaf, title: 'Fertilizing 101', desc: 'Which fertilizers to use and how often.' },
];

export default function PlantsCarePage() {
  return (
    <div className="min-h-screen bg-[#F8F9F6] pb-20">
      <section className="bg-gradient-to-br from-green-600 to-[#2B7A4B] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
            <Leaf className="w-4 h-4" />
            <span className="text-sm font-medium">Plant Care</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Grow with Confidence
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Expert plant care guides to help your green friends thrive.
          </p>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Care Guides</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {GUIDES.map((guide) => (
            <div
              key={guide.title}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-[#2B7A4B]/10 rounded-full flex items-center justify-center mb-4">
                <guide.icon className="w-6 h-6 text-[#2B7A4B]" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{guide.title}</h3>
              <p className="text-sm text-gray-500 mb-4">{guide.desc}</p>
              <Link
                href="/blog"
                className="text-sm font-semibold text-[#2B7A4B] hover:underline flex items-center gap-1"
              >
                Read More <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-[#2B7A4B] to-emerald-600 rounded-2xl p-8 text-white text-center">
          <BookOpen className="w-10 h-10 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Visit Our Blog</h3>
          <p className="text-white/80 mb-6 max-w-xl mx-auto">
            Deep-dive articles with photos, expert tips, and seasonal advice.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#2B7A4B] rounded-xl font-semibold hover:bg-gray-100"
          >
            Read Articles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}