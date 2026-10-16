// app/careers/page.js
import Link from 'next/link';
import {
  Briefcase,
  Heart,
  Users,
  Sparkles,
  Leaf,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sprout,
  Globe,
  Coffee,
  GraduationCap,
  Stethoscope,
  Home,
  Send,
  Star,
} from 'lucide-react';
import { POSITIONS } from '../lib/careers/jobs';

export const metadata = {
  title: 'Careers | GreenScape',
  description:
    'Join the GreenScape team and help make gardening accessible to everyone. Grow your career while growing plants.',
};

// ==========================================
// CORE VALUES
// ==========================================
const VALUES = [
  {
    icon: Sprout,
    title: 'Plant-First Thinking',
    desc: "Every decision starts with what's best for the plants we ship and the customers who love them.",
  },
  {
    icon: Users,
    title: 'Small Team, Real Impact',
    desc: "We're lean on purpose. Every person owns their work and sees their ideas ship within weeks.",
  },
  {
    icon: GraduationCap,
    title: 'Learn Constantly',
    desc: "Whether you're a horticulturist or engineer, we invest in your growth — courses, conferences, and mentorship.",
  },
  {
    icon: Heart,
    title: 'Care Beyond Work',
    desc: "Healthy work-life balance isn't a perk here — it's how we operate. We ship better when we rest well.",
  },
];

// ==========================================
// PERKS
// ==========================================
const PERKS = [
  { icon: Home, title: 'Remote-Friendly', desc: 'Work from home or our Faisalabad office — your choice.' },
  { icon: Clock, title: 'Flexible Hours', desc: 'Core hours 11 AM–4 PM. Rest of your schedule is yours.' },
  { icon: Stethoscope, title: 'Health Coverage', desc: 'Medical insurance for you and your immediate family.' },
  { icon: GraduationCap, title: 'Learning Budget', desc: 'Rs. 50,000/year for courses, books, and conferences.' },
  { icon: Leaf, title: 'Free Plants', desc: 'Monthly plant credits to fill your home with green.' },
  { icon: Coffee, title: 'Quarterly Retreats', desc: 'Team offsites twice a year — work and play combined.' },
];

// ==========================================
// HIRING PROCESS
// ==========================================
const PROCESS = [
  { icon: Send, title: 'Apply', desc: "Send your resume and a short note about why you'd love to work with us." },
  { icon: Star, title: 'Intro Call', desc: 'A 30-minute chat to understand each other. No trick questions.' },
  { icon: Users, title: 'Team Interview', desc: 'Meet 2–3 team members. We value practical skills over trivia.' },
  { icon: Briefcase, title: 'Offer', desc: 'We make a decision within 5 working days of the final interview.' },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-[#F8F9F6] pb-20">
      {/* ===== HERO ===== */}
      <section className="relative bg-gradient-to-br from-[#1A3C34] via-[#2B7A4B] to-[#3d9b62] text-white py-20 px-4 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Briefcase className="w-4 h-4 text-green-300" />
            <span className="text-sm font-medium">We&apos;re Hiring</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Grow Your Career
            <br />
            <span className="bg-gradient-to-r from-green-300 to-emerald-200 bg-clip-text text-transparent">
              with GreenScape
            </span>
          </h1>

          <p className="text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
            We&apos;re a small team of plant lovers on a mission to make gardening
            accessible to every home in Pakistan. If that sounds like your kind
            of work, we&apos;d love to meet you.
          </p>
        </div>
      </section>

      {/* ===== QUICK STATS ===== */}
      <section className="max-w-[1200px] mx-auto px-4 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6 md:p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '25+', label: 'Team Members' },
              { value: String(POSITIONS.length), label: 'Open Roles' },
              { value: '3', label: 'Departments' },
              { value: '100%', label: 'Remote-Friendly' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-[#2B7A4B] mb-1">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500 uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== VALUES ===== */}
      <section className="max-w-[1200px] mx-auto px-4 mt-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Our Values</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            The principles that guide how we work, hire, and grow together.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {VALUES.map((v) => {
            const Icon = v.icon;
            return (
              <div
                key={v.title}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-[#2B7A4B]/10 rounded-full flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-[#2B7A4B]" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== OPEN POSITIONS ===== */}
      <section className="max-w-[1200px] mx-auto px-4 mt-20">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[#2B7A4B]/10 text-[#2B7A4B] px-3 py-1.5 rounded-full text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            {POSITIONS.length} Open Positions
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Current Openings
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Don&apos;t see a perfect fit? Send us your resume anyway — we&apos;re always
            happy to hear from talented people.
          </p>
        </div>

        <div className="space-y-4">
          {POSITIONS.map((pos) => (
            <div
              key={pos.id}
              className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#2B7A4B]/30 transition-all overflow-hidden"
            >
              <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                <div className="w-14 h-14 bg-[#2B7A4B]/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-7 h-7 text-[#2B7A4B]" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 group-hover:text-[#2B7A4B] transition-colors">
                      {pos.title}
                    </h3>
                    <span className="text-[10px] font-bold bg-[#2B7A4B]/10 text-[#2B7A4B] px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {pos.department}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{pos.desc}</p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {pos.location}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {pos.type}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5" />
                      {pos.experience}
                    </span>
                  </div>
                </div>

                {/* ✅ FIX: Apply Now routes to /careers/apply/[id] */}
                <Link
                  href={`/careers/apply/${pos.id}`}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#2B7A4B] text-white rounded-xl font-semibold text-sm hover:bg-[#23663e] transition-colors flex-shrink-0 shadow-sm"
                >
                  Apply Now
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== PERKS ===== */}
      <section className="max-w-[1200px] mx-auto px-4 mt-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Perks &amp; Benefits
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Because great work starts with great care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PERKS.map((perk) => {
            const Icon = perk.icon;
            return (
              <div
                key={perk.title}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-[#2B7A4B]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-[#2B7A4B]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1 text-sm">
                      {perk.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {perk.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== HIRING PROCESS ===== */}
      <section className="max-w-[1200px] mx-auto px-4 mt-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Our Hiring Process
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Simple, transparent, and respectful of your time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {PROCESS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
              >
                <div className="absolute -top-3 left-6 bg-[#2B7A4B] text-white text-xs font-bold w-8 h-8 rounded-full flex items-center justify-center shadow-md">
                  {i + 1}
                </div>

                <div className="w-12 h-12 bg-[#2B7A4B]/10 rounded-2xl flex items-center justify-center mb-4 mt-2">
                  <Icon className="w-6 h-6 text-[#2B7A4B]" />
                </div>

                <h3 className="font-bold text-gray-900 mb-1.5">{step.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== OPEN APPLICATION CTA ===== */}
      <section className="max-w-[1200px] mx-auto px-4 mt-20">
        <div className="relative bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-12 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#2B7A4B]/10 text-[#2B7A4B] px-3 py-1.5 rounded-full text-xs font-semibold mb-4">
                <Mail className="w-3.5 h-3.5" />
                Open Application
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Don&apos;t see your role?
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                We&apos;re always looking for talented people who care about plants
                and customers. Send us your resume and tell us what you&apos;d love
                to work on at GreenScape.
              </p>

              <ul className="space-y-3 mb-6">
                {[
                  'We reply to every application within 7 days',
                  'No automated rejections — a real human reads every email',
                  'We keep your resume on file for future openings',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-[#2B7A4B] flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <a
                href="mailto:careers@greenscape.com?subject=Open Application"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#2B7A4B] text-white rounded-xl font-semibold hover:bg-[#23663e] transition-colors shadow-md"
              >
                <Mail className="w-4 h-4" />
                Send Open Application
              </a>
            </div>

            <div className="bg-gradient-to-br from-[#2B7A4B] to-emerald-700 rounded-2xl p-8 text-white text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <Leaf className="w-16 h-16 mx-auto mb-4 text-green-200" />
                <p className="text-2xl font-bold mb-2">careers@greenscape.com</p>
                <p className="text-sm text-white/85">
                  Straight to our hiring team. No ATS, no auto-rejection.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CLOSING CTA ===== */}
      <section className="max-w-[1200px] mx-auto px-4 mt-20">
        <div className="relative bg-gradient-to-br from-[#1A3C34] via-[#2B7A4B] to-emerald-700 rounded-3xl p-8 md:p-12 text-white text-center overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative max-w-2xl mx-auto">
            <Globe className="w-12 h-12 mx-auto mb-4 text-green-200" />
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Let&apos;s grow together 🌱
            </h2>
            <p className="text-white/85 mb-8 leading-relaxed">
              Every plant we ship and every order we fulfill starts with our
              team. Come build something meaningful with us.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="mailto:careers@greenscape.com"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-[#2B7A4B] rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-md"
              >
                <Mail className="w-4 h-4" />
                Contact Careers
              </a>
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-transparent border-2 border-white/70 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors"
              >
                Learn About Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}