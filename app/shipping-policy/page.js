// app/shipping-policy/page.js
import Link from 'next/link';
import {
  Truck,
  Package,
  Clock,
  MapPin,
  Leaf,
  ShieldCheck,
  Snowflake,
  Sun,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Wallet,
  CreditCard,
  Phone,
} from 'lucide-react';

export const metadata = {
  title: 'Shipping Policy | GreenScape',
  description:
    'Delivery times, shipping rates, live plant handling, and order processing details for GreenScape orders across Pakistan.',
};

// ==========================================
// DELIVERY ZONES
// ==========================================
const ZONES = [
  {
    zone: 'Karachi',
    time: '1–2 business days',
    cost: 'Rs. 299',
    free: 'Free over Rs. 2,000',
    icon: MapPin,
  },
  {
    zone: 'Lahore, Islamabad, Rawalpindi',
    time: '2–3 business days',
    cost: 'Rs. 449',
    free: 'Free over Rs. 2,000',
    icon: MapPin,
  },
  {
    zone: 'Other major cities',
    time: '3–5 business days',
    cost: 'Rs. 599',
    free: 'Free over Rs. 2,000',
    icon: MapPin,
  },
  {
    zone: 'Remote areas',
    time: 'Up to 7 business days',
    cost: 'Rs. 799',
    free: 'Not eligible',
    icon: MapPin,
  },
];

// ==========================================
// HIGHLIGHTS
// ==========================================
const HIGHLIGHTS = [
  {
    icon: Truck,
    title: 'Free Shipping',
    desc: 'On every order over Rs. 2,000 — delivered anywhere in Pakistan.',
  },
  {
    icon: Clock,
    title: 'Same-Day Dispatch',
    desc: 'Orders placed before 12 PM PKT ship the same business day.',
  },
  {
    icon: Package,
    title: 'Safe Packaging',
    desc: 'Live plants shipped with moisture wraps and shock protection.',
  },
  {
    icon: ShieldCheck,
    title: 'Insured Delivery',
    desc: 'Lost or damaged in transit? We replace it, no questions asked.',
  },
];

// ==========================================
// SEASONAL CARE
// ==========================================
const SEASONAL = [
  {
    icon: Snowflake,
    season: 'Winter (Dec–Feb)',
    care: 'Heat packs added at no extra cost for orders to cold regions. Plants shipped with extra insulation.',
  },
  {
    icon: Sun,
    season: 'Summer (May–Aug)',
    care: 'Cold packs and breathable packaging used to protect plants from heat stress during transit.',
  },
  {
    icon: Leaf,
    season: 'Monsoon (Jul–Sep)',
    care: 'Waterproof outer packaging and drainage-safe inner wraps for high-humidity conditions.',
  },
];

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F8F9F6] pb-20">
      {/* ===== HERO ===== */}
      <section className="relative bg-gradient-to-br from-[#1A3C34] via-[#2B7A4B] to-[#3d9b62] text-white py-20 px-4 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Truck className="w-4 h-4 text-green-300" />
            <span className="text-sm font-medium">Delivery Information</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Shipping Policy
          </h1>

          <p className="text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
            Fast, safe, and tracked delivery across Pakistan. Every plant handled with
            care — from our greenhouse to your doorstep.
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

      {/* ===== DELIVERY ZONES ===== */}
      <section className="max-w-[1200px] mx-auto px-4 mt-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Delivery Times &amp; Rates
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Transparent pricing across Pakistan. Free shipping on every order over
            Rs. 2,000.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F8F9F6]">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                    Zone
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                    Delivery Time
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                    Shipping Cost
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                    Free Shipping
                  </th>
                </tr>
              </thead>
              <tbody>
                {ZONES.map((z) => (
                  <tr
                    key={z.zone}
                    className="border-t border-gray-100 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 flex items-center gap-2">
                      <z.icon className="w-4 h-4 text-[#2B7A4B] flex-shrink-0" />
                      <span>{z.zone}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{z.time}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{z.cost}</td>
                    <td className="px-6 py-4 text-sm">
                      {z.free === 'Not eligible' ? (
                        <span className="text-gray-400">{z.free}</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[#2B7A4B] font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {z.free}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Note */}
        <div className="mt-6 p-5 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800 leading-relaxed">
            <strong className="font-semibold">Not sure which zone you&apos;re in?</strong>{' '}
            The exact shipping cost and delivery estimate appear at checkout after you
            enter your address. No surprises.
          </p>
        </div>
      </section>

      {/* ===== ORDER PROCESSING ===== */}
      <section className="max-w-[1200px] mx-auto px-4 mt-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Order Processing
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            From checkout to dispatch — how we handle your order.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Clock,
              title: 'Same-Day Dispatch',
              desc: 'Orders placed before 12:00 PM PKT ship the same business day. Orders placed after 12 PM ship the next business day.',
            },
            {
              icon: Package,
              title: 'Careful Packing',
              desc: 'Live plants are hand-picked, root-wrapped, and packed with shock-absorbing materials. Every box includes a care card.',
            },
            {
              icon: Truck,
              title: 'Tracked Delivery',
              desc: 'You receive a tracking link via email and SMS as soon as your order leaves our facility. Track anytime from your account.',
            },
          ].map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="relative bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="absolute -top-3 left-6 bg-[#2B7A4B] text-white text-xs font-bold w-8 h-8 rounded-full flex items-center justify-center shadow-md">
                  {i + 1}
                </div>

                <div className="w-14 h-14 bg-[#2B7A4B]/10 rounded-2xl flex items-center justify-center mb-5 mt-2">
                  <Icon className="w-7 h-7 text-[#2B7A4B]" />
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== PACKAGING ===== */}
      <section className="max-w-[1200px] mx-auto px-4 mt-20">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left — Content */}
            <div className="p-8 md:p-12">
              <div className="inline-flex items-center gap-2 bg-[#2B7A4B]/10 text-[#2B7A4B] px-3 py-1.5 rounded-full text-xs font-semibold mb-4">
                <Leaf className="w-3.5 h-3.5" />
                Live Plant Handling
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Packed to Thrive
              </h2>

              <p className="text-gray-600 leading-relaxed mb-6">
                Live plants need more than a cardboard box. We&apos;ve spent years
                perfecting our packaging to survive the roughest courier routes —
                without harming the plant or the environment.
              </p>

              <ul className="space-y-3">
                {[
                  'Moisture-retaining root wraps',
                  'Breathable inner containers',
                  'Shock-absorbing outer packaging',
                  'Recyclable, plastic-free materials',
                  'Species-specific care card included',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-[#2B7A4B] flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right — Visual */}
            <div className="bg-gradient-to-br from-[#2B7A4B] to-emerald-700 p-8 md:p-12 flex items-center justify-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

              <div className="relative text-center text-white">
                <Package className="w-20 h-20 mx-auto mb-4 text-green-200" />
                <p className="text-3xl md:text-4xl font-bold mb-2">98.7%</p>
                <p className="text-sm text-white/85 max-w-[200px] mx-auto leading-relaxed">
                  of live plants arrive healthy using our packaging system
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SEASONAL HANDLING ===== */}
      <section className="max-w-[1200px] mx-auto px-4 mt-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Seasonal Handling
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            We adapt our packaging to the weather so your plants arrive healthy
            year-round.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SEASONAL.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.season}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-[#2B7A4B]/10 rounded-full flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-[#2B7A4B]" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{s.season}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.care}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== PAYMENT METHODS ===== */}
      <section className="max-w-[1200px] mx-auto px-4 mt-20">
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Payment on Delivery
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-[#2B7A4B]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-5 h-5 text-[#2B7A4B]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">
                  Card Payments
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Visa, Mastercard, Amex, and PayPal accepted online.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-[#2B7A4B]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Wallet className="w-5 h-5 text-[#2B7A4B]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">
                  Cash on Delivery
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Available on orders under Rs. 20,000 for most cities.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-[#2B7A4B]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-[#2B7A4B]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">
                  Bank Transfer
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  For bulk or corporate orders — contact us for details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== DELIVERY ISSUES ===== */}
      <section className="max-w-[1200px] mx-auto px-4 mt-20">
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[#2B7A4B]/10 rounded-full flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6 text-[#2B7A4B]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Lost or Damaged in Transit?
            </h2>
          </div>

          <p className="text-gray-600 leading-relaxed mb-6">
            We know couriers aren&apos;t always gentle. If your package arrives
            damaged, lost, or the plant isn&apos;t healthy — we&apos;ll fix it fast.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#F8F9F6] rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">
                If your order is lost
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-2">
                  <span className="text-[#2B7A4B] font-bold">•</span>
                  <span>Contact us within 7 days of the expected delivery date</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#2B7A4B] font-bold">•</span>
                  <span>We investigate with the courier (usually resolves same day)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#2B7A4B] font-bold">•</span>
                  <span>If it can&apos;t be found, we ship a replacement or refund you</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#F8F9F6] rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">
                If your plant arrives damaged
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-2">
                  <span className="text-[#2B7A4B] font-bold">•</span>
                  <span>Take photos of the plant and packaging</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#2B7A4B] font-bold">•</span>
                  <span>Email support@greenscape.com within 48 hours of delivery</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#2B7A4B] font-bold">•</span>
                  <span>We replace or refund — your choice</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#2B7A4B] text-white rounded-xl font-semibold hover:bg-[#23663e] transition-colors"
            >
              Contact Support
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/plant-guarantee"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-[#2B7A4B] text-[#2B7A4B] rounded-xl font-semibold hover:bg-green-50 transition-colors"
            >
              Read Our Guarantee
            </Link>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="max-w-[1200px] mx-auto px-4 mt-20">
        <div className="relative bg-gradient-to-br from-[#2B7A4B] to-emerald-700 rounded-3xl p-8 md:p-12 text-white text-center overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative max-w-2xl mx-auto">
            <Truck className="w-12 h-12 mx-auto mb-4 text-green-200" />
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Ready to order?
            </h2>
            <p className="text-white/85 mb-8 leading-relaxed">
              Free shipping on orders over Rs. 2,000. Delivered anywhere in
              Pakistan with tracking included.
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
                href="/track-order"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-transparent border-2 border-white/70 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors"
              >
                Track an Order
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}