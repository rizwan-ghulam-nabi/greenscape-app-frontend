// app/size-guide/page.js
import Link from 'next/link';
import {
  Ruler,
  Flower2,
  Sprout,
  TreePine,
  Package,
  Scale,
  Info,
  CheckCircle2,
  ArrowRight,
  Leaf,
  Home,
  Sun,
  Shovel,
} from 'lucide-react';

export const metadata = {
  title: 'Plant & Pot Size Guide | GreenScape',
  description:
    'Understand plant and pot sizes so you order the perfect fit for your home or office. Includes pot diameter, plant height, and space recommendations.',
};

// ==========================================
// SIZE TIERS
// ==========================================
const SIZES = [
  {
    key: 'small',
    name: 'Small',
    icon: Sprout,
    pot: '10–12 cm',
    height: '15–25 cm',
    weight: '0.3–0.8 kg',
    bestFor: ['Desks', 'Windowsills', 'Kitchen counters', 'Small shelves'],
    examples: 'Succulents, small ferns, herbs, air plants',
    space: 'Fits on any 15×15 cm surface',
    price: 'Rs. 500 – Rs. 1,500',
    color: 'from-green-500 to-emerald-400',
  },
  {
    key: 'medium',
    name: 'Medium',
    icon: Flower2,
    pot: '15–18 cm',
    height: '30–45 cm',
    weight: '1.2–2.5 kg',
    bestFor: ['Side tables', 'Coffee tables', 'Bathrooms', 'Bookshelves'],
    examples: 'Pothos, peace lily, snake plant, ZZ plant',
    space: 'Needs ~25×25 cm of surface',
    price: 'Rs. 1,500 – Rs. 4,000',
    color: 'from-teal-500 to-emerald-500',
  },
  {
    key: 'large',
    name: 'Large',
    icon: TreePine,
    pot: '20–25 cm',
    height: '50–75 cm',
    weight: '3–6 kg',
    bestFor: ['Living rooms', 'Bedrooms', 'Entryways', 'Home offices'],
    examples: 'Monstera, fiddle leaf fig, rubber plant, areca palm',
    space: 'Needs ~40×40 cm of floor or low-surface space',
    price: 'Rs. 4,000 – Rs. 12,000',
    color: 'from-emerald-600 to-green-600',
  },
  {
    key: 'xl',
    name: 'Extra Large',
    icon: Home,
    pot: '30+ cm',
    height: '80–150 cm',
    weight: '8–20 kg',
    bestFor: ['Statement corners', 'Corporate offices', 'Patios', 'Open-plan rooms'],
    examples: 'Large palms, money tree, bird of paradise, tall ficus',
    space: 'Needs ~60×60 cm of floor space and 2 m ceiling',
    price: 'Rs. 12,000 – Rs. 35,000',
    color: 'from-[#1A3C34] to-emerald-800',
  },
];

// ==========================================
// TIPS
// ==========================================
const TIPS = [
  {
    icon: Sun,
    title: 'Mind the Light',
    desc: 'Bigger plants need more light. Make sure the spot you have in mind gets the light the species requires.',
  },
  {
    icon: Ruler,
    title: 'Measure Your Space',
    desc: 'Measure the spot first. Leave 15–20 cm around the plant for healthy growth.',
  },
  {
    icon: Scale,
    title: 'Check the Weight',
    desc: 'Large and XL plants can weigh 10+ kg. Make sure shelves and stands can support them.',
  },
  {
    icon: Shovel,
    title: 'Plan for Repotting',
    desc: 'Plan for a pot 2–4 cm larger than the current one when repotting later. Leave room for growth.',
  },
];

// ==========================================
// POT MATERIAL GUIDE
// ==========================================
const POTS = [
  {
    name: 'Ceramic',
    pros: 'Heavy, elegant, retains moisture well',
    cons: 'Fragile, expensive',
    best: 'Display plants on stable surfaces',
  },
  {
    name: 'Terracotta',
    pros: 'Breathable, drains well, affordable',
    cons: 'Dries out fast, can crack in cold',
    best: 'Succulents, cacti, herbs',
  },
  {
    name: 'Plastic',
    pros: 'Light, cheap, retains moisture',
    cons: 'Less aesthetic, degrades in sun',
    best: 'Indoor plants, budget-friendly setups',
  },
  {
    name: 'Fabric',
    pros: 'Air-prunes roots, breathable',
    cons: 'Dries quickly, less decorative',
    best: 'Vegetables, herbs, healthy root growth',
  },
];

export default function SizeGuidePage() {
  return (
    <div className="min-h-screen bg-[#F8F9F6] pb-20">
      {/* ===== HERO ===== */}
      <section className="relative bg-gradient-to-br from-[#1A3C34] via-[#2B7A4B] to-[#3d9b62] text-white py-20 px-4 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Ruler className="w-4 h-4 text-green-300" />
            <span className="text-sm font-medium">Size Reference</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Plant &amp; Pot
            <br />
            <span className="bg-gradient-to-r from-green-300 to-emerald-200 bg-clip-text text-transparent">
              Size Guide
            </span>
          </h1>

          <p className="text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
            Every plant listing shows its size. Use this guide to visualize exactly
            what you&apos;re getting before you order.
          </p>
        </div>
      </section>

      {/* ===== QUICK COMPARISON TABLE ===== */}
      <section className="max-w-[1200px] mx-auto px-4 -mt-10 relative z-10">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F8F9F6]">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                    Size
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                    Pot Diameter
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                    Plant Height
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                    Best For
                  </th>
                </tr>
              </thead>
              <tbody>
                {SIZES.map((s) => {
                  const Icon = s.icon;
                  return (
                    <tr
                      key={s.key}
                      className="border-t border-gray-100 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center flex-shrink-0`}
                          >
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-sm font-semibold text-gray-900">
                            {s.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {s.pot}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {s.height}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {s.bestFor.slice(0, 2).join(', ')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ===== DETAILED SIZE CARDS ===== */}
      <section className="max-w-[1200px] mx-auto px-4 mt-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Detailed Size Breakdown
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Everything you need to know about each size tier — dimensions, weight,
            examples, and price range.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SIZES.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.key}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div
                  className={`bg-gradient-to-br ${s.color} p-6 text-white relative overflow-hidden`}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="relative flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{s.name}</h3>
                      <p className="text-white/85 text-sm">{s.pot} pot · {s.height}</p>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                  {/* Quick stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#F8F9F6] rounded-xl p-3">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">
                        Weight
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {s.weight}
                      </p>
                    </div>
                    <div className="bg-[#F8F9F6] rounded-xl p-3">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">
                        Price Range
                      </p>
                      <p className="text-sm font-semibold text-[#2B7A4B]">
                        {s.price}
                      </p>
                    </div>
                  </div>

                  {/* Best for */}
                  <div>
                    <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                      Best For
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {s.bestFor.map((item) => (
                        <span
                          key={item}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#2B7A4B]/10 text-[#2B7A4B] text-xs font-medium rounded-full"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Examples */}
                  <div>
                    <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                      Popular Plants
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {s.examples}
                    </p>
                  </div>

                  {/* Space */}
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">
                      <strong className="font-semibold text-gray-700">
                        Space needed:
                      </strong>{' '}
                      {s.space}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== CHOOSING TIPS ===== */}
      <section className="max-w-[1200px] mx-auto px-4 mt-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Tips for Choosing the Right Size
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            A few things to consider before you click &quot;add to cart.&quot;
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TIPS.map((t) => {
            const Icon = t.icon;
            return (
              <div
                key={t.title}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-[#2B7A4B]/10 rounded-full flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-[#2B7A4B]" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{t.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{t.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== POT MATERIAL GUIDE ===== */}
      <section className="max-w-[1200px] mx-auto px-4 mt-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Which Pot Material?
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            The material of your pot affects how often you water and how healthy
            your plant&apos;s roots stay.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F8F9F6]">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                    Material
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                    Pros
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                    Cons
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                    Best For
                  </th>
                </tr>
              </thead>
              <tbody>
                {POTS.map((p) => (
                  <tr
                    key={p.name}
                    className="border-t border-gray-100 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {p.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-green-700">
                      {p.pros}
                    </td>
                    <td className="px-6 py-4 text-sm text-red-600">
                      {p.cons}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {p.best}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ===== MEASUREMENT TIP ===== */}
      <section className="max-w-[1200px] mx-auto px-4 mt-16">
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 bg-[#2B7A4B]/10 text-[#2B7A4B] px-3 py-1.5 rounded-full text-xs font-semibold mb-4">
                <Info className="w-3.5 h-3.5" />
                Measurement Tip
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                How We Measure
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Plant height is measured from the base of the pot to the tallest
                point of the plant. Pot diameter is the outer measurement at the
                rim. All measurements are approximate — natural plants vary in
                shape and size.
              </p>

              <ul className="space-y-3">
                {[
                  'Height measured from pot base to plant tip',
                  'Pot diameter measured at the outer rim',
                  'Weight includes pot + soil + plant',
                  'Ranges reflect natural variation between plants',
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-gray-700"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#2B7A4B] flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right — Visual ruler card */}
            <div className="bg-gradient-to-br from-[#2B7A4B] to-emerald-700 rounded-2xl p-8 text-white text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <Package className="w-16 h-16 mx-auto mb-4 text-green-200" />
                <p className="text-3xl md:text-4xl font-bold mb-2">±10%</p>
                <p className="text-sm text-white/85 max-w-[220px] mx-auto leading-relaxed">
                  Natural size variance you can expect between individual plants of
                  the same listing
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HELP CTA ===== */}
      <section className="max-w-[1200px] mx-auto px-4 mt-20">
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-[#2B7A4B]/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Leaf className="w-6 h-6 text-[#2B7A4B]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                Still not sure which size?
              </h3>
              <p className="text-sm text-gray-500">
                Our plant experts can recommend the perfect size for your space.
              </p>
            </div>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#2B7A4B] text-white rounded-xl font-semibold hover:bg-[#23663e] transition-colors shadow-sm whitespace-nowrap"
          >
            Ask an Expert
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}