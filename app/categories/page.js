// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import Image from 'next/image';
// import { Search, Leaf, ArrowRight, LayoutGrid, Box, Heart, Loader2 } from 'lucide-react';


// export default function CategoriesPage() {
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');

//   // ===== FETCH CATEGORIES FROM API =====
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await fetch(`/api/categories');
//         if (res.ok) {
//           const data = await res.json();
//           setCategories(data.categories || []);
//         }
//       } catch (error) {
//         console.error('Error fetching categories:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCategories();
//   }, []);

//   // Filter data based on search
//   const filteredCategories = categories.filter((cat) =>
//     cat.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="min-h-screen bg-[#F8F9F6] pb-24 md:pb-10">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10">
        
//         {/* ===== PAGE HEADER ===== */}
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
//           <div>
//             <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3 tracking-tight">
//               Categories <span className="text-3xl">🌿</span>
//             </h1>
//             <p className="text-base text-gray-500 mt-1">Explore our wide range of plant categories</p>
//           </div>
       
//           <div className="relative w-full sm:w-72">
//             <input
//               type="text"
//               placeholder="Search categories..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#2B7A4B] transition-all shadow-sm"
//             />
//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//           </div>
//         </div>

//         {/* ===== LOADING STATE ===== */}
//         {loading && (
//           <div className="flex justify-center py-20">
//             <Loader2 className="w-8 h-8 text-[#2B7A4B] animate-spin" />
//           </div>
//         )}

//         {/* ===== CATEGORIES GRID ===== */}
//         {!loading && (
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//             {filteredCategories.length > 0 ? (
//               filteredCategories.map((category) => (
//                 <Link
//                   key={category._id}
//                   href={`/products?category=${category.slug}`}
//                   className="group bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
//                 >
//                   {/* Background Blob */}
//                   <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-gray-50 opacity-60 group-hover:scale-110 transition-transform duration-500"></div>
                  
//                   {/* Icon */}
//                   <div className="relative text-3xl mb-4 inline-block group-hover:scale-110 transition-transform">
//                     {category.icon?.startsWith('http') ? (
//                       <img src={category.icon} alt={category.name} className="w-8 h-8 object-contain" />
//                     ) : (
//                       category.icon || '🌿'
//                     )}
//                   </div>
                  
//                   {/* Content */}
//                   <div className="text-center relative z-10">
//                     <h3 className="text-[17px] font-bold text-gray-900 leading-tight">{category.name}</h3>
//                     <p className="text-[12px] text-gray-500 mt-1 font-medium">{category.itemCount || 0}+ Items</p>
//                   </div>

//                   <div className="mt-4 text-center relative z-10 opacity-0 group-hover:opacity-100 transition-all duration-300">
//                     <span className="inline-flex items-center gap-2 text-[13px] font-bold text-[#2B7A4B] group-hover:gap-3 transition-all duration-300">
//                       Explore <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
//                     </span>
//                   </div>
//                 </Link>
//               ))
//             ) : (
//               <div className="col-span-full text-center py-12">
//                 <Leaf className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//                 <h3 className="text-lg font-semibold text-gray-900">No categories found</h3>
//                 <p className="text-sm text-gray-500">Try adjusting your search terms.</p>
//               </div>
//             )}
//           </div>
//         )}

//         {/* ===== BOTTOM INFO BANNERS ===== */}
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-12 bg-white rounded-3xl p-4 md:p-6 shadow-sm border border-gray-100">
//           {[
//             { icon: <LayoutGrid className="w-5 h-5 text-[#2B7A4B]" />, title: 'Wide Variety', desc: '1000+ Plants' },
//             { icon: <Box className="w-5 h-5 text-[#2B7A4B]" />, title: 'Fast Delivery', desc: 'At Your Doorstep' },
//             { icon: <span className="text-[#2B7A4B] font-bold text-lg">✓</span>, title: 'Safe Packaging', desc: '100% Secure' },
//             { icon: <Heart className="w-5 h-5 text-[#2B7A4B]" />, title: 'Happy Gardening', desc: "We're Here to Help" }
//           ].map((item, idx) => (
//             <div key={idx} className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-[#2B7A4B]/10 rounded-full flex items-center justify-center flex-shrink-0">{item.icon}</div>
//               <div>
//                 <p className="font-semibold text-gray-900 text-[13px]">{item.title}</p>
//                 <p className="text-[10px] text-gray-500">{item.desc}</p>
//               </div>
//             </div>
//           ))}
//         </div>

//       </div>
//     </div>
//   );
// }






// new version 

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Leaf, ArrowRight, LayoutGrid, Box, Heart, Loader2 } from 'lucide-react';


export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // ===== FETCH CATEGORIES FROM API =====
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data.categories || []);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Filter data based on search
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8F9F6] pb-24 md:pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10">
        
        {/* ===== PAGE HEADER ===== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3 tracking-tight">
              Categories <span className="text-3xl">🌿</span>
            </h1>
            <p className="text-base text-gray-500 mt-1">Explore our wide range of plant categories</p>
          </div>
       
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#2B7A4B] transition-all shadow-sm"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* ===== LOADING STATE ===== */}
        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#2B7A4B] animate-spin" />
          </div>
        )}

        {/* ===== CATEGORIES GRID ===== */}
        {!loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <Link
                  key={category._id}
                  href={`/products?category=${category.slug}`}
                  className="group bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
                >
                  {/* Background Blob */}
                  <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-gray-50 opacity-60 group-hover:scale-110 transition-transform duration-500"></div>
                  
                  {/* Icon */}
                  <div className="relative text-3xl mb-4 inline-block group-hover:scale-110 transition-transform">
                    {category.icon?.startsWith('http') ? (
                      <img src={category.icon} alt={category.name} className="w-8 h-8 object-contain" />
                    ) : (
                      category.icon || '🌿'
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="text-center relative z-10">
                    <h3 className="text-[17px] font-bold text-gray-900 leading-tight">{category.name}</h3>
                    <p className="text-[12px] text-gray-500 mt-1 font-medium">{category.itemCount || 0}+ Items</p>
                  </div>

                  <div className="mt-4 text-center relative z-10 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="inline-flex items-center gap-2 text-[13px] font-bold text-[#2B7A4B] group-hover:gap-3 transition-all duration-300">
                      Explore <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Leaf className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900">No categories found</h3>
                <p className="text-sm text-gray-500">Try adjusting your search terms.</p>
              </div>
            )}
          </div>
        )}

        {/* ===== BOTTOM INFO BANNERS ===== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-12 bg-white rounded-3xl p-4 md:p-6 shadow-sm border border-gray-100">
          {[
            { icon: <LayoutGrid className="w-5 h-5 text-[#2B7A4B]" />, title: 'Wide Variety', desc: '1000+ Plants' },
            { icon: <Box className="w-5 h-5 text-[#2B7A4B]" />, title: 'Fast Delivery', desc: 'At Your Doorstep' },
            { icon: <span className="text-[#2B7A4B] font-bold text-lg">✓</span>, title: 'Safe Packaging', desc: '100% Secure' },
            { icon: <Heart className="w-5 h-5 text-[#2B7A4B]" />, title: 'Happy Gardening', desc: "We're Here to Help" }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#2B7A4B]/10 rounded-full flex items-center justify-center flex-shrink-0">{item.icon}</div>
              <div>
                <p className="font-semibold text-gray-900 text-[13px]">{item.title}</p>
                <p className="text-[10px] text-gray-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}