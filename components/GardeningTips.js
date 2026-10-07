// 'use client';

// import { ArrowRight, Check, MessageCircle } from 'lucide-react';

// export default function GardeningTips() {
//   const blogPosts = [
//     {
//       id: 1,
//       image: '/blog/plant-care.png',
//       tag: 'Plant Care',
//       title: '10 Easy Plants for Beginners',
//       desc: 'Perfect low-maintenance plants to start your green journey.'
//     },
//     {
//       id: 2,
//       image: '/blog/tips-tricks.png',
//       tag: 'Tips & Tricks',
//       title: 'How to Keep Your Plants Healthy',
//       desc: 'Expert tips to ensure your plants thrive all year round.'
//     },
//     {
//       id: 3,
//       image: '/blog/seasonal-guide.png',
//       tag: 'Seasonal Guide',
//       title: 'Spring Gardening Checklist',
//       desc: 'Everything you need to do in your garden this spring.'
//     },
//     {
//       id: 4,
//       image: '/blog/diy-garden.png',
//       tag: 'DIY Garden',
//       title: 'DIY Planters You Can Make at Home',
//       desc: 'Creative and easy DIY planter ideas using simple materials.'
//     }
//   ];

//   return (
//     <div className="w-full max-w-[1440px] mx-auto xl:max-w-full py-12 bg-[#F8F9F6]">
//       <div className="px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        
//         {/* ===== SECTION HEADER ===== */}
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
//             Gardening Tips & Inspiration
//           </h2>
//           <a 
//             href="#" 
//             className="text-[#2B7A4B] text-sm font-semibold hover:underline flex items-center gap-1 transition-colors"
//           >
//             View All Posts
//             <span className="text-lg">→</span>
//           </a>
//         </div>

//         {/* ==================================================
//             RESPONSIVE FLEX ROW 
//         ================================================== */}
//         <div className="flex flex-col sm:flex-row sm:flex-wrap lg:flex-nowrap gap-5 lg:gap-6">
          
//           {/* ===== BLOG CARDS (4 Items) ===== */}
//           {blogPosts.map((post) => (
//             <div 
//               key={post.id}
//               className="flex-1 min-w-[260px] sm:min-w-[250px] lg:min-w-0 bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group"
//             >
//               <div className="relative w-full h-[220px] sm:h-[240px] lg:h-[260px] overflow-hidden">
//                 <img
//                   src={post.image}
//                   alt={post.title}
//                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                 />
//                 <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-md text-[11px] font-semibold text-[#2B7A4B] shadow-sm">
//                   {post.tag}
//                 </div>
//               </div>

//               <div className="p-6 sm:p-7">
//                 <h3 className="text-[18px] sm:text-[19px] font-bold text-gray-900 mb-2.5 leading-snug">
//                   {post.title}
//                 </h3>
//                 <p className="text-[14px] sm:text-[15px] text-gray-500 leading-relaxed mb-5">
//                   {post.desc}
//                 </p>
//                 <a 
//                   href="#" 
//                   className="inline-flex items-center gap-1.5 text-[#2B7A4B] text-sm font-semibold hover:gap-2.5 transition-all duration-300"
//                 >
//                   Read More
//                   <ArrowRight className="w-4 h-4" />
//                 </a>
//               </div>
//             </div>
//           ))}

//           {/* ============================================
//               RIGHT SIDE: CHAT WITH EXPERT CARD 
//               (NOW WITH FULL BACKGROUND IMAGE)
//           ============================================ */}
//           <div className="flex-1 min-w-[260px] sm:min-w-[250px] lg:min-w-0 rounded-xl shadow-sm border border-[#2B7A4B]/5 overflow-hidden relative">
            
//             {/* ===== FULL BACKGROUND IMAGE ===== */}
//             <div className="absolute inset-0 w-full h-full z-0">
//               <img 
//                 src="/blog/expert-plant.png" 
//                 alt="Expert Background"
//                 className="w-full h-full object-cover"
//               />
              
//               {/* 
//                 ==========================================
//                 DARK GRADIENT OVERLAY 
//                 This makes the white text 100% readable 
//                 while keeping the beautiful plant visible.
//               ========================================== */}
//               <div className="absolute inset-0 bg-gradient-to-b from-[#1A3C34]/80 to-[#1A3C34]/95 z-0"></div>
//             </div>

//             {/* ===== CONTENT ON TOP OF IMAGE ===== */}
//             <div className="relative z-10 flex flex-col h-full p-7 sm:p-8">
//               <h3 className="text-2xl sm:text-[26px] font-bold text-white mb-2.5 drop-shadow-md">
//                 Need Help Choosing?
//               </h3>
//               <p className="text-[15px] sm:text-[16px] text-gray-100/90 mb-5 drop-shadow-sm">
//                 Our plant experts are here for you!
//               </p>

//               {/* Checklist (White text) */}
//               <ul className="space-y-3 mb-7 flex-1">
//                 <li className="flex items-center gap-2.5 text-[14px] sm:text-[15px] text-gray-100">
//                   <Check className="w-4 h-4 text-[#8fc1b5] flex-shrink-0" strokeWidth={3} />
//                   <span>Plant Recommendations</span>
//                 </li>
//                 <li className="flex items-center gap-2.5 text-[14px] sm:text-[15px] text-gray-100">
//                   <Check className="w-4 h-4 text-[#8fc1b5] flex-shrink-0" strokeWidth={3} />
//                   <span>Care Guidance</span>
//                 </li>
//                 <li className="flex items-center gap-2.5 text-[14px] sm:text-[15px] text-gray-100">
//                   <Check className="w-4 h-4 text-[#8fc1b5] flex-shrink-0" strokeWidth={3} />
//                   <span>Order Support</span>
//                 </li>
//               </ul>

//               {/* CTA Button (Same Green, White Text) */}
//               <button className="w-full py-3.5 bg-[#2B7A4B] text-white rounded-lg font-semibold text-[15px] flex items-center justify-center gap-2 hover:bg-[#23663e] transition-all duration-300 shadow-lg hover:shadow-xl">
//                 <MessageCircle className="w-4 h-4" />
//                 Chat with Expert
//               </button>
//             </div>

//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }






// new version 

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Check, MessageCircle } from 'lucide-react';
import { getPublishedPosts } from '@/app/lib/blogApi';   // ← adjust path if needed

export default function GardeningTips() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchPosts = async () => {
      try {
        const data = await getPublishedPosts(1, 4);
        if (cancelled) return;
        setBlogPosts(data?.posts || []);
      } catch (err) {
        console.error('❌ Blog fetch error:', err);
        if (!cancelled) setBlogPosts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchPosts();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-[1440px] mx-auto xl:max-w-full py-12 bg-[#F8F9F6]">
        <div className="px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="h-8 w-72 bg-gray-200 animate-pulse rounded mb-6" />
          <div className="flex flex-col sm:flex-row sm:flex-wrap lg:flex-nowrap gap-5 lg:gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex-1 min-w-[260px] sm:min-w-[250px] lg:min-w-0 bg-white rounded-xl overflow-hidden shadow-sm">
                <div className="w-full h-[220px] sm:h-[240px] lg:h-[260px] bg-gray-100 animate-pulse" />
                <div className="p-6 sm:p-7 space-y-3">
                  <div className="h-5 bg-gray-100 animate-pulse rounded w-3/4" />
                  <div className="h-4 bg-gray-100 animate-pulse rounded w-full" />
                  <div className="h-4 bg-gray-100 animate-pulse rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (blogPosts.length === 0) return null;

  return (
    <div className="w-full max-w-[1440px] mx-auto xl:max-w-full py-12 bg-[#F8F9F6]">
      <div className="px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Gardening Tips &amp; Inspiration
          </h2>
          <Link href="/blog" className="text-[#2B7A4B] text-sm font-semibold hover:underline flex items-center gap-1 transition-colors">
            View All Posts <span className="text-lg">→</span>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row sm:flex-wrap lg:flex-nowrap gap-5 lg:gap-6">

          {blogPosts.slice(0, 4).map((post) => (
            <Link
              key={post._id}
              href={`/blog/${post.slug}`}
              className="flex-1 min-w-[260px] sm:min-w-[250px] lg:min-w-0 bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group block"
            >
              <div className="relative w-full h-[220px] sm:h-[240px] lg:h-[260px] overflow-hidden">
                {post.image ? (
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200" />
                )}
                {post.category && (
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-md text-[11px] font-semibold text-[#2B7A4B] shadow-sm">
                    {post.category}
                  </div>
                )}
              </div>
              <div className="p-6 sm:p-7">
                <h3 className="text-[18px] sm:text-[19px] font-bold text-gray-900 mb-2.5 leading-snug line-clamp-2 group-hover:text-[#2B7A4B] transition-colors">
                  {post.title}
                </h3>
                <p className="text-[14px] sm:text-[15px] text-gray-500 leading-relaxed mb-5 line-clamp-3">
                  {post.excerpt}
                </p>
                <span className="inline-flex items-center gap-1.5 text-[#2B7A4B] text-sm font-semibold group-hover:gap-2.5 transition-all duration-300">
                  Read More <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}

          {/* Chat with Expert card — same as before */}
          <div className="flex-1 min-w-[260px] sm:min-w-[250px] lg:min-w-0 rounded-xl shadow-sm border border-[#2B7A4B]/5 overflow-hidden relative">
            <div className="absolute inset-0 w-full h-full z-0">
              <Image src="/blog/expert-plant.png" alt="Expert Background" fill sizes="25vw" className="object-cover" unoptimized />
              <div className="absolute inset-0 bg-gradient-to-b from-[#1A3C34]/80 to-[#1A3C34]/95 z-0" />
            </div>
            <div className="relative z-10 flex flex-col h-full p-7 sm:p-8">
              <h3 className="text-2xl sm:text-[26px] font-bold text-white mb-2.5 drop-shadow-md">
                Need Help Choosing?
              </h3>
              <p className="text-[15px] sm:text-[16px] text-gray-100/90 mb-5 drop-shadow-sm">
                Our plant experts are here for you!
              </p>
              <ul className="space-y-3 mb-7 flex-1">
                <li className="flex items-center gap-2.5 text-[14px] sm:text-[15px] text-gray-100">
                  <Check className="w-4 h-4 text-[#8fc1b5] flex-shrink-0" strokeWidth={3} />
                  <span>Plant Recommendations</span>
                </li>
                <li className="flex items-center gap-2.5 text-[14px] sm:text-[15px] text-gray-100">
                  <Check className="w-4 h-4 text-[#8fc1b5] flex-shrink-0" strokeWidth={3} />
                  <span>Care Guidance</span>
                </li>
                <li className="flex items-center gap-2.5 text-[14px] sm:text-[15px] text-gray-100">
                  <Check className="w-4 h-4 text-[#8fc1b5] flex-shrink-0" strokeWidth={3} />
                  <span>Order Support</span>
                </li>
              </ul>
              <button className="w-full py-3.5 bg-[#2B7A4B] text-white rounded-lg font-semibold text-[15px] flex items-center justify-center gap-2 hover:bg-[#23663e] transition-all duration-300 shadow-lg hover:shadow-xl">
                <MessageCircle className="w-4 h-4" />
                Chat with Expert
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}