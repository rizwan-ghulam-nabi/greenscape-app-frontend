// // // app/products/page.js
// // 'use client';

// // import { useState, useEffect } from 'react';
// // import { useSearchParams } from 'next/navigation';
// // import Link from 'next/link';
// // import {
// //   Star, ShoppingCart, Heart, Leaf,
// //   LayoutGrid, List, ChevronDown,
// //   Filter, X, Loader2, ArrowRight
// // } from 'lucide-react';
// // import Image from 'next/image';

// // const API_BASE_URL = '';

// // export default function ProductsPage() {
// //   const searchParams = useSearchParams();
// //   const searchQuery = searchParams.get('search') || '';
// //   const categoryParam = searchParams.get('category') || '';

// //   // ===== STATE =====
// //   const [products, setProducts] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [viewMode, setViewMode] = useState('grid');
// //   const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'All');
// //   const [sortBy, setSortBy] = useState('featured');
// //   const [priceRange, setPriceRange] = useState([0, 100000]);
// //   const [sidebarOpen, setSidebarOpen] = useState(false);

// //   // ===== CATEGORIES STATE (FROM BACKEND) =====
// //   const [categories, setCategories] = useState([]);
// //   const [loadingCategories, setLoadingCategories] = useState(true);

// //   // ===== FETCH CATEGORIES FROM BACKEND =====
// //   useEffect(() => {
// //     const fetchCategories = async () => {
// //       try {
// //         const res = await fetch(`${API_BASE_URL}/api/categories`);
// //         const data = await res.json();
// //         setCategories(data.categories || []);
// //       } catch (error) {
// //         console.error('Error fetching categories:', error);
// //       } finally {
// //         setLoadingCategories(false);
// //       }
// //     };
// //     fetchCategories();
// //   }, []);

// //   // ===== FETCH PRODUCTS FROM BACKEND =====
// //   useEffect(() => {
// //     const fetchProducts = async () => {
// //       try {
// //         setLoading(true);

// //         // ✅ CORRECT URL
// //         let url = `${API_BASE_URL}/api/public/products`;

// //         const params = new URLSearchParams();
// //         if (selectedCategory !== 'All' && selectedCategory !== 'All Products') {
// //           params.append('category', selectedCategory);
// //         }
// //         if (searchQuery) {
// //           params.append('search', searchQuery);
// //         }

// //         // Fetch more products for section display
// //         params.append('limit', '100');

// //         if (params.toString()) {
// //           url += `?${params.toString()}`;
// //         }

// //         console.log('🛒 Fetching products from:', url);

// //         const res = await fetch(url);
// //         if (!res.ok) throw new Error('Failed to fetch products');

// //         const data = await res.json();
// //         setProducts(data.products || []);
// //       } catch (error) {
// //         console.error('Error fetching products:', error);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchProducts();
// //   }, [selectedCategory, searchQuery]);

// //   // ===== CATEGORIES LIST (MERGED: Backend + Static) =====
// //   const allCategories = ['All', ...categories.map(c => c.name)];

// //   // ===== FILTER & SORT LOGIC =====
// //   const filteredProducts = products
// //     .filter((product) => {
// //       const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
// //         product.desc?.toLowerCase().includes(searchQuery.toLowerCase());
// //       const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
// //       return matchesSearch && matchesPrice;
// //     })
// //     .sort((a, b) => {
// //       if (sortBy === 'price-low') return a.price - b.price;
// //       if (sortBy === 'price-high') return b.price - a.price;
// //       if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
// //       return 0;
// //     });

// //   // ===== GROUP PRODUCTS BY CATEGORY =====
// //   const getCategoryProducts = (categoryName) => {
// //     if (categoryName === 'All' || categoryName === 'All Products') {
// //       return filteredProducts;
// //     }
// //     return filteredProducts.filter(product => 
// //       product.category === categoryName || 
// //       product.category?.toLowerCase() === categoryName?.toLowerCase()
// //     );
// //   };

// //   // ===== COLLECTIONS SECTION LAYOUT =====
// //   const getCategorySections = () => {
// //     // If a specific category is selected, show only that section
// //     if (selectedCategory !== 'All' && selectedCategory !== 'All Products') {
// //       return [{ name: selectedCategory, products: getCategoryProducts(selectedCategory) }];
// //     }
    
// //     // Otherwise show all categories as sections
// //     const categoryNames = [...new Set(filteredProducts.map(p => p.category).filter(Boolean))];
    
// //     return categoryNames
// //       .map(cat => ({
// //         name: cat,
// //         products: getCategoryProducts(cat)
// //       }))
// //       .filter(section => section.products.length > 0);
// //   };

// //   const categorySections = getCategorySections();

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center bg-white">
// //         <div className="flex flex-col items-center gap-4">
// //           <Loader2 className="w-12 h-12 text-[#2B7A4B] animate-spin" />
// //           <p className="text-gray-500">Loading products...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="w-full min-h-screen bg-white">
// //       <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6">

// //         {/* ===== BREADCRUMBS ===== */}
// //         <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
// //           <span className="text-gray-400">🏠</span>
// //           <Link href="/" className="hover:text-[#2B7A4B] transition-colors">Home</Link>
// //           <span className="text-gray-300">/</span>
// //           <Link href="/products" className="hover:text-[#2B7A4B] transition-colors">Shop</Link>
// //           <span className="text-gray-300">/</span>
// //           {selectedCategory !== 'All' && selectedCategory !== 'All Products' ? (
// //             <Link
// //               href={`/products?category=${encodeURIComponent(selectedCategory)}`}
// //               className="text-[#2B7A4B] font-medium hover:underline"
// //             >
// //               {selectedCategory}
// //             </Link>
// //           ) : (
// //             <span className="text-[#2B7A4B] font-medium">All Products</span>
// //           )}
// //         </div>

// //         {/* ===== TOP HEADER ===== */}
// //         <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
// //           <div className="flex items-center gap-2">
// //             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
// //               {selectedCategory === 'All' || selectedCategory === 'All Products' ? 'All Products' : selectedCategory}
// //             </h1>
// //             <Leaf className="w-5 h-5 text-[#2B7A4B]" />
// //           </div>

// //           <div className="flex flex-wrap items-center gap-3">
// //             {/* View Toggle */}
// //             <div className="flex items-center bg-gray-100 rounded-lg p-1">
// //               <button
// //                 onClick={() => setViewMode('grid')}
// //                 className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#2B7A4B]' : 'text-gray-500'}`}
// //               >
// //                 <LayoutGrid className="w-5 h-5" />
// //               </button>
// //               <button
// //                 onClick={() => setViewMode('list')}
// //                 className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-[#2B7A4B]' : 'text-gray-500'}`}
// //               >
// //                 <List className="w-5 h-5" />
// //               </button>
// //             </div>

// //             {/* Sort Dropdown */}
// //             <div className="relative">
// //               <select
// //                 value={sortBy}
// //                 onChange={(e) => setSortBy(e.target.value)}
// //                 className="pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2B7A4B]"
// //               >
// //                 <option value="featured">Sort by: Featured</option>
// //                 <option value="price-low">Price: Low to High</option>
// //                 <option value="price-high">Price: High to Low</option>
// //                 <option value="rating">Top Rated</option>
// //               </select>
// //               <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
// //             </div>

// //             {/* Mobile Filter Toggle */}
// //             <button
// //               onClick={() => setSidebarOpen(true)}
// //               className="lg:hidden flex items-center gap-2 px-4 py-2 bg-[#2B7A4B] text-white rounded-lg text-sm font-medium"
// //             >
// //               <Filter className="w-4 h-4" />
// //               Filters
// //             </button>
// //           </div>
// //         </div>

// //         {/* ===== MAIN LAYOUT ===== */}
// //         <div className="flex flex-col lg:flex-row gap-8">

// //           {/* ===== SIDEBAR (Desktop) ===== */}
// //           <div className="hidden lg:block w-[260px] xl:w-[280px] flex-shrink-0">
// //             <div className="sticky top-24">
// //               <div className="flex items-center justify-between mb-4">
// //                 <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
// //                   <Filter className="w-4 h-4" /> Filters
// //                 </h3>
// //                 <button onClick={() => { setSelectedCategory('All'); setPriceRange([0, 100000]); }} className="text-sm text-[#2B7A4B] font-medium hover:underline">
// //                   Clear All
// //                 </button>
// //               </div>

// //               {/* Categories */}
// //               <div className="mb-6 border-b border-gray-100 pb-6">
// //                 <h4 className="text-sm font-bold text-gray-900 mb-3">Categories</h4>
// //                 <div className="space-y-2.5">
// //                   {allCategories.map((cat) => (
// //                     <label key={cat} className="flex items-center justify-between text-sm cursor-pointer group">
// //                       <div className="flex items-center gap-2">
// //                         <input
// //                           type="radio"
// //                           name="category"
// //                           value={cat}
// //                           checked={selectedCategory === cat}
// //                           onChange={() => setSelectedCategory(cat)}
// //                           className="w-4 h-4 accent-[#2B7A4B] cursor-pointer"
// //                         />
// //                         <span className={`${selectedCategory === cat ? 'text-[#2B7A4B] font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>
// //                           {cat}
// //                         </span>
// //                       </div>
// //                     </label>
// //                   ))}
// //                 </div>
// //               </div>

// //               {/* Price Range */}
// //               <div className="mb-6 border-b border-gray-100 pb-6">
// //                 <h4 className="text-sm font-bold text-gray-900 mb-4">Price Range</h4>
// //                 <div className="px-1">
// //                   <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
// //                     <span>Rs. {priceRange[0]}</span>
// //                     <span>Rs. {priceRange[1]}</span>
// //                   </div>
// //                   <input
// //                     type="range"
// //                     min="0" max="100000" step="500"
// //                     value={priceRange[1]}
// //                     onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
// //                     className="w-full accent-[#2B7A4B]"
// //                   />
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           {/* ===== PRODUCTS AREA ===== */}
// //           <div className="flex-1">
// //             <p className="text-sm text-gray-500 mb-6">
// //               Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
// //             </p>

// //             {/* ===== CATEGORIES SECTIONIZED LAYOUT ===== */}
// //             {categorySections.length > 0 ? (
// //               <div className="space-y-12">
// //                 {categorySections.map((section, idx) => (
// //                   <div key={idx} className="mb-10">
// //                     {/* Section Header */}
// //                     <div className="flex items-center justify-between mb-5">
// //                       <div className="flex items-center gap-3">
// //                         <div className="w-10 h-10 bg-[#2B7A4B]/10 rounded-full flex items-center justify-center">
// //                           <Leaf className="w-5 h-5 text-[#2B7A4B]" />
// //                         </div>
// //                         <h2 className="text-xl font-bold text-gray-900">{section.name}</h2>
// //                         <span className="text-sm text-gray-500">({section.products.length})</span>
// //                       </div>
// //                       <Link 
// //                         href={`/products?category=${encodeURIComponent(section.name)}`}
// //                         className="flex items-center gap-1 text-sm text-[#2B7A4B] font-medium hover:underline"
// //                       >
// //                         View All <ArrowRight className="w-4 h-4" />
// //                       </Link>
// //                     </div>

// //                     {/* Products Grid */}
// //                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
// //                       {section.products.slice(0, 8).map((product) => (
// //                         <Link
// //                           key={product._id}
// //                           href={`/products/${product.slug || product._id}`}
// //                           className={`relative group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer ${viewMode === 'list' ? 'flex gap-6 p-4' : 'p-4'}`}
// //                         >
// //                           {/* Wishlist Button */}
// //                           <button className="absolute top-3 right-3 z-10 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors">
// //                             <Heart className="w-5 h-5" />
// //                           </button>

// //                           {/* Image Area */}
// //                           <div className={`relative ${viewMode === 'list' ? 'w-48 h-48 flex-shrink-0' : 'w-full aspect-square'} bg-[#F8F9F6] rounded-lg overflow-hidden mb-4`}>
// //                             <Image
// //                               src={product.image || '/placeholder-product.jpg'}
// //                               alt={product.name}
// //                               fill
// //                               sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
// //                               priority={viewMode === 'list' ? false : true}
// //                               className="object-cover group-hover:scale-105 transition-transform duration-500"
// //                             />
// //                           </div>

// //                           {/* Product Info */}
// //                           <div className={`space-y-1.5 ${viewMode === 'list' ? 'flex-1' : ''}`}>
// //                             <h3 className="text-[15px] font-bold text-gray-900">{product.name}</h3>
// //                             <p className="text-[13px] text-gray-500">{product.desc || product.description || ''}</p>
// //                             <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-0.5">
// //                               <div className="flex text-[#FFB800]">
// //                                 {[...Array(5)].map((_, i) => (
// //                                   <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating || 0) ? 'fill-current' : 'text-gray-300'}`} />
// //                                 ))}
// //                               </div>
// //                               <span className="text-gray-400 text-[11px]">({product.numReviews || 0})</span>
// //                             </div>
// //                             <div className={`flex items-center justify-between pt-1.5 ${viewMode === 'list' ? 'mt-auto' : ''}`}>
// //                               <div>
// //                                 <span className="text-[18px] font-bold text-gray-900">Rs. {product.price?.toFixed(2) || '0.00'}</span>
// //                                 {product.oldPrice && (
// //                                   <span className="ml-2 text-[13px] text-gray-400 line-through">Rs. {product.oldPrice.toFixed(2)}</span>
// //                                 )}
// //                               </div>
// //                               <button className="w-8 h-8 rounded-full bg-[#2B7A4B]/10 text-[#2B7A4B] flex items-center justify-center hover:bg-[#2B7A4B] hover:text-white transition-all duration-200 group-hover:shadow-md">
// //                                 <ShoppingCart className="w-3.5 h-3.5" />
// //                               </button>
// //                             </div>
// //                           </div>
// //                         </Link>
// //                       ))}
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             ) : (
// //               <div className="text-center py-12">
// //                 <Leaf className="w-16 h-16 text-gray-200 mx-auto mb-4" />
// //                 <h3 className="text-lg font-medium text-gray-600">No products found</h3>
// //                 <p className="text-sm text-gray-400">Try adjusting your filters or search.</p>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </div>

// //       {/* ===== MOBILE SIDEBAR OVERLAY ===== */}
// //       {sidebarOpen && (
// //         <div className="fixed inset-0 z-50 lg:hidden">
// //           <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)}></div>
// //           <div className="absolute right-0 top-0 h-full w-[320px] bg-white shadow-2xl p-6 overflow-y-auto">
// //             <div className="flex items-center justify-between mb-6">
// //               <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
// //                 <Filter className="w-4 h-4" /> Filters
// //               </h3>
// //               <button onClick={() => setSidebarOpen(false)} className="p-1 hover:bg-gray-100 rounded-full">
// //                 <X className="w-5 h-5 text-gray-500" />
// //               </button>
// //             </div>

// //             {/* Mobile Filter Content */}
// //             <div className="mb-6 border-b border-gray-100 pb-6">
// //               <h4 className="text-sm font-bold text-gray-900 mb-3">Categories</h4>
// //               <div className="space-y-2.5">
// //                 {allCategories.map((cat) => (
// //                   <label key={cat} className="flex items-center justify-between text-sm cursor-pointer">
// //                     <div className="flex items-center gap-2">
// //                       <input type="radio" name="mobile-category" value={cat} className="w-4 h-4 accent-[#2B7A4B]" />
// //                       <span className="text-gray-600">{cat}</span>
// //                     </div>
// //                   </label>
// //                 ))}
// //               </div>
// //             </div>
            
// //             {/* Mobile Price Range */}
// //             <div className="mb-6 border-b border-gray-100 pb-6">
// //               <h4 className="text-sm font-bold text-gray-900 mb-4">Price Range</h4>
// //               <div className="px-1">
// //                 <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
// //                   <span>Rs. {priceRange[0]}</span>
// //                   <span>Rs. {priceRange[1]}</span>
// //                 </div>
// //                 <input
// //                   type="range"
// //                   min="0" max="100000" step="500"
// //                   value={priceRange[1]}
// //                   onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
// //                   className="w-full accent-[#2B7A4B]"
// //                 />
// //               </div>
// //             </div>

// //             <button onClick={() => setSidebarOpen(false)} className="w-full py-3 bg-[#2B7A4B] text-white rounded-lg font-medium">
// //               Apply Filters
// //             </button>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }






// //  new version date : 10/09/26

// // app/products/page.js
// 'use client';

// import { useState, useEffect } from 'react';
// import { useSearchParams } from 'next/navigation';
// import Link from 'next/link';
// import {
//   Star, ShoppingCart, Heart, Leaf, Zap,
//   LayoutGrid, List, ChevronDown,
//   Filter, X, Loader2, ArrowRight
// } from 'lucide-react';
// import Image from 'next/image';
// import { getProductDiscount } from '@/app/utils/discountApi';
// import { addToCart } from '@/app/utils/cart';

// const API_BASE_URL = '';

// // ==========================================
// // ✅ PRODUCT CARD COMPONENT (with discount)
// // ==========================================
// function ProductCard({ product, viewMode }) {
//   const [discount, setDiscount] = useState(null);
//   const [finalPrice, setFinalPrice] = useState(product.price);
//   const [savings, setSavings] = useState(0);
//   const [loadingDiscount, setLoadingDiscount] = useState(true);
//   const [added, setAdded] = useState(false);

//   // Fetch discount
//   useEffect(() => {
//     const fetchDiscount = async () => {
//       const productId = product._id || product.id;
//       if (!productId) {
//         setLoadingDiscount(false);
//         return;
//       }

//       try {
//         setLoadingDiscount(true);
//         const data = await getProductDiscount(productId);

//         if (data.success && data.hasDiscount) {
//           setDiscount(data.discount);
//           setFinalPrice(data.finalPrice || product.price);
//           setSavings(data.savings || 0);
//         } else {
//           setFinalPrice(product.price);
//         }
//       } catch (err) {
//         console.error('Error fetching discount:', err);
//         setFinalPrice(product.price);
//       } finally {
//         setLoadingDiscount(false);
//       }
//     };

//     fetchDiscount();
//   }, [product._id, product.id, product.price]);

//   // Add to cart
//   const handleAddToCart = (e) => {
//     e.preventDefault();
//     e.stopPropagation();

//     const productToAdd = {
//       id: product._id || product.id,
//       name: product.name,
//       desc: product.desc || product.description,
//       price: finalPrice,
//       originalPrice: product.price,
//       image: product.image || product.images?.[0],
//       category: product.category,
//       stock: product.stock,
//       discount: discount ? {
//         code: discount.code,
//         name: discount.name,
//         value: discount.value,
//         type: discount.type,
//       } : null,
//     };

//     addToCart(productToAdd, 1);
//     window.dispatchEvent(new Event('cartUpdated'));

//     setAdded(true);
//     setTimeout(() => setAdded(false), 1500);
//   };

//   const savingsPercentage = discount
//     ? discount.type === 'percentage'
//       ? discount.value
//       : Math.round((savings / product.price) * 100)
//     : 0;

//   // ========== LIST VIEW ==========
//   if (viewMode === 'list') {
//     return (
//       <Link
//         href={`/products/${product.slug || product._id}`}
//         className="relative group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex gap-6 p-4"
//       >
//         <button
//           onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
//           className="absolute top-3 right-3 z-10 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors"
//         >
//           <Heart className="w-5 h-5" />
//         </button>

//         {/* Image */}
//         <div className="relative w-48 h-48 flex-shrink-0 bg-[#F8F9F6] rounded-lg overflow-hidden">
//           {discount && (
//             <div className="absolute top-2 left-2 z-10">
//               <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-500 text-white text-[10px] font-bold rounded-full shadow">
//                 <Zap className="w-3 h-3" />
//                 {discount.badgeText}
//               </span>
//             </div>
//           )}
//           <Image
//             src={product.image || '/placeholder-product.jpg'}
//             alt={product.name}
//             fill
//             sizes="200px"
//             className="object-cover group-hover:scale-105 transition-transform duration-500"
//           />
//         </div>

//         {/* Info */}
//         <div className="flex-1 space-y-2">
//           <h3 className="text-[15px] font-bold text-gray-900">{product.name}</h3>
//           <p className="text-[13px] text-gray-500">{product.desc || product.description}</p>
//           <div className="flex items-center gap-1 text-[10px] text-gray-400">
//             <div className="flex text-[#FFB800]">
//               {[...Array(5)].map((_, i) => (
//                 <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating || 0) ? 'fill-current' : 'text-gray-300'}`} />
//               ))}
//             </div>
//             <span>({product.numReviews || 0})</span>
//           </div>

//           <div className="flex items-center justify-between pt-2">
//             <div>
//               {loadingDiscount ? (
//                 <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
//               ) : discount ? (
//                 <div className="space-y-0.5">
//                   <div className="flex items-center gap-2">
//                     <span className="text-[18px] font-bold text-[#2B7A4B]">
//                       Rs. {finalPrice.toFixed(2)}
//                     </span>
//                     <span className="text-[13px] text-gray-400 line-through">
//                       Rs. {product.price?.toFixed(2)}
//                     </span>
//                     <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded">
//                       {savingsPercentage}% OFF
//                     </span>
//                   </div>
//                   <span className="text-[10px] text-red-500 font-bold">
//                     Save Rs. {savings.toFixed(2)}
//                   </span>
//                 </div>
//               ) : (
//                 <span className="text-[18px] font-bold text-gray-900">
//                   Rs. {product.price?.toFixed(2) || '0.00'}
//                 </span>
//               )}
//             </div>
//             <button
//               onClick={handleAddToCart}
//               disabled={product.stock === 0}
//               className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
//                 added
//                   ? 'bg-green-500 text-white'
//                   : 'bg-[#2B7A4B]/10 text-[#2B7A4B] hover:bg-[#2B7A4B] hover:text-white'
//               }`}
//             >
//               <ShoppingCart className="w-3.5 h-3.5" />
//             </button>
//           </div>
//         </div>
//       </Link>
//     );
//   }

//   // ========== GRID VIEW ==========
//   return (
//     <div className="relative group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 p-4">
//       <button
//         onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
//         className="absolute top-3 right-3 z-10 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors"
//       >
//         <Heart className="w-5 h-5" />
//       </button>

//       <Link href={`/products/${product.slug || product._id}`} className="block">
//         {/* Image */}
//         <div className="relative w-full aspect-square bg-[#F8F9F6] rounded-lg overflow-hidden mb-4">
//           {discount && (
//             <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
//               <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-500 text-white text-[10px] font-bold rounded-full shadow">
//                 <Zap className="w-3 h-3" />
//                 {discount.badgeText}
//               </span>
//               {savingsPercentage >= 20 && (
//                 <span className="inline-block px-2 py-0.5 bg-yellow-400 text-yellow-900 text-[9px] font-bold rounded-full">
//                   🔥 HOT DEAL
//                 </span>
//               )}
//             </div>
//           )}

//           <Image
//             src={product.image || '/placeholder-product.jpg'}
//             alt={product.name}
//             fill
//             sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//             className="object-cover group-hover:scale-105 transition-transform duration-500"
//           />

//           {product.stock === 0 && (
//             <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
//               <span className="px-3 py-1 bg-white text-red-600 text-sm font-semibold rounded-full">
//                 Out of Stock
//               </span>
//             </div>
//           )}
//         </div>

//         {/* Info */}
//         <div className="space-y-1.5">
//           <h3 className="text-[15px] font-bold text-gray-900 truncate">{product.name}</h3>
//           <p className="text-[13px] text-gray-500 line-clamp-1">{product.desc || product.description || ''}</p>
//           <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-0.5">
//             <div className="flex text-[#FFB800]">
//               {[...Array(5)].map((_, i) => (
//                 <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating || 0) ? 'fill-current' : 'text-gray-300'}`} />
//               ))}
//             </div>
//             <span>({product.numReviews || 0})</span>
//           </div>

//           {/* Price */}
//           <div className="pt-1.5">
//             {loadingDiscount ? (
//               <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
//             ) : discount ? (
//               <div className="space-y-0.5">
//                 <div className="flex items-center gap-2 flex-wrap">
//                   <span className="text-[18px] font-bold text-[#2B7A4B]">
//                     Rs. {finalPrice.toFixed(2)}
//                   </span>
//                   <span className="text-[13px] text-gray-400 line-through">
//                     Rs. {product.price?.toFixed(2)}
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-2 text-[10px]">
//                   <span className="text-red-600 font-bold">Save Rs. {savings.toFixed(2)}</span>
//                   {discount.endDate && (
//                     <span className="text-orange-500 font-medium">
//                       • Ends {new Date(discount.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
//                     </span>
//                   )}
//                 </div>
//               </div>
//             ) : (
//               <span className="text-[18px] font-bold text-gray-900">
//                 Rs. {product.price?.toFixed(2) || '0.00'}
//               </span>
//             )}
//           </div>
//         </div>
//       </Link>

//       {/* Add to Cart */}
//       <div className="flex items-center justify-end pt-3">
//         <button
//           onClick={handleAddToCart}
//           disabled={product.stock === 0}
//           className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
//             added
//               ? 'bg-green-500 text-white'
//               : product.stock === 0
//               ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//               : 'bg-[#2B7A4B]/10 text-[#2B7A4B] hover:bg-[#2B7A4B] hover:text-white'
//           }`}
//         >
//           {added ? '✓' : <ShoppingCart className="w-3.5 h-3.5" />}
//         </button>
//       </div>
//     </div>
//   );
// }

// // ==========================================
// // ✅ MAIN PRODUCTS PAGE
// // ==========================================
// export default function ProductsPage() {
//   const searchParams = useSearchParams();
//   const searchQuery = searchParams.get('search') || '';
//   const categoryParam = searchParams.get('category') || '';

//   // ===== STATE =====
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [viewMode, setViewMode] = useState('grid');
//   const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'All');
//   const [sortBy, setSortBy] = useState('featured');
//   const [priceRange, setPriceRange] = useState([0, 100000]);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [categories, setCategories] = useState([]);

//   // ===== FETCH CATEGORIES =====
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await fetch(`${API_BASE_URL}/api/categories`);
//         const data = await res.json();
//         setCategories(data.categories || []);
//       } catch (error) {
//         console.error('Error fetching categories:', error);
//       }
//     };
//     fetchCategories();
//   }, []);

//   // ===== FETCH PRODUCTS =====
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         setLoading(true);
//         let url = `${API_BASE_URL}/api/public/products`;
//         const params = new URLSearchParams();

//         if (selectedCategory !== 'All' && selectedCategory !== 'All Products') {
//           params.append('category', selectedCategory);
//         }
//         if (searchQuery) {
//           params.append('search', searchQuery);
//         }
//         params.append('limit', '100');

//         if (params.toString()) {
//           url += `?${params.toString()}`;
//         }

//         console.log('🛒 Fetching products from:', url);
//         const res = await fetch(url);
//         if (!res.ok) throw new Error('Failed to fetch products');
//         const data = await res.json();
//         setProducts(data.products || []);
//       } catch (error) {
//         console.error('Error fetching products:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, [selectedCategory, searchQuery]);

//   // ===== FILTER & SORT =====
//   const filteredProducts = products
//     .filter((product) => {
//       const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         product.desc?.toLowerCase().includes(searchQuery.toLowerCase());
//       const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
//       return matchesSearch && matchesPrice;
//     })
//     .sort((a, b) => {
//       if (sortBy === 'price-low') return a.price - b.price;
//       if (sortBy === 'price-high') return b.price - a.price;
//       if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
//       return 0;
//     });

//   // ===== CATEGORIES LIST =====
//   const allCategories = ['All', ...categories.map(c => c.name)];

//   // ===== GROUP BY CATEGORY =====
//   const getCategoryProducts = (categoryName) => {
//     if (categoryName === 'All' || categoryName === 'All Products') {
//       return filteredProducts;
//     }
//     return filteredProducts.filter(product =>
//       product.category === categoryName ||
//       product.category?.toLowerCase() === categoryName?.toLowerCase()
//     );
//   };

//   const getCategorySections = () => {
//     if (selectedCategory !== 'All' && selectedCategory !== 'All Products') {
//       return [{ name: selectedCategory, products: getCategoryProducts(selectedCategory) }];
//     }
//     const categoryNames = [...new Set(filteredProducts.map(p => p.category).filter(Boolean))];
//     return categoryNames
//       .map(cat => ({ name: cat, products: getCategoryProducts(cat) }))
//       .filter(section => section.products.length > 0);
//   };

//   const categorySections = getCategorySections();

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-white">
//         <div className="flex flex-col items-center gap-4">
//           <Loader2 className="w-12 h-12 text-[#2B7A4B] animate-spin" />
//           <p className="text-gray-500">Loading products...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full min-h-screen bg-white">
//       <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6">

//         {/* BREADCRUMBS */}
//         <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
//           <span className="text-gray-400">🏠</span>
//           <Link href="/" className="hover:text-[#2B7A4B]">Home</Link>
//           <span className="text-gray-300">/</span>
//           <Link href="/products" className="hover:text-[#2B7A4B]">Shop</Link>
//           <span className="text-gray-300">/</span>
//           <span className="text-[#2B7A4B] font-medium">
//             {selectedCategory === 'All' || selectedCategory === 'All Products' ? 'All Products' : selectedCategory}
//           </span>
//         </div>

//         {/* HEADER */}
//         <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
//           <div className="flex items-center gap-2">
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
//               {selectedCategory === 'All' || selectedCategory === 'All Products' ? 'All Products' : selectedCategory}
//             </h1>
//             <Leaf className="w-5 h-5 text-[#2B7A4B]" />
//           </div>

//           <div className="flex flex-wrap items-center gap-3">
//             <div className="flex items-center bg-gray-100 rounded-lg p-1">
//               <button
//                 onClick={() => setViewMode('grid')}
//                 className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#2B7A4B]' : 'text-gray-500'}`}
//               >
//                 <LayoutGrid className="w-5 h-5" />
//               </button>
//               <button
//                 onClick={() => setViewMode('list')}
//                 className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-[#2B7A4B]' : 'text-gray-500'}`}
//               >
//                 <List className="w-5 h-5" />
//               </button>
//             </div>

//             <div className="relative">
//               <select
//                 value={sortBy}
//                 onChange={(e) => setSortBy(e.target.value)}
//                 className="pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2B7A4B]"
//               >
//                 <option value="featured">Sort by: Featured</option>
//                 <option value="price-low">Price: Low to High</option>
//                 <option value="price-high">Price: High to Low</option>
//                 <option value="rating">Top Rated</option>
//               </select>
//               <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
//             </div>

//             <button
//               onClick={() => setSidebarOpen(true)}
//               className="lg:hidden flex items-center gap-2 px-4 py-2 bg-[#2B7A4B] text-white rounded-lg text-sm font-medium"
//             >
//               <Filter className="w-4 h-4" />
//               Filters
//             </button>
//           </div>
//         </div>

//         {/* MAIN LAYOUT */}
//         <div className="flex flex-col lg:flex-row gap-8">

//           {/* SIDEBAR */}
//           <div className="hidden lg:block w-[260px] xl:w-[280px] flex-shrink-0">
//             <div className="sticky top-24">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
//                   <Filter className="w-4 h-4" /> Filters
//                 </h3>
//                 <button
//                   onClick={() => { setSelectedCategory('All'); setPriceRange([0, 100000]); }}
//                   className="text-sm text-[#2B7A4B] font-medium hover:underline"
//                 >
//                   Clear All
//                 </button>
//               </div>

//               <div className="mb-6 border-b border-gray-100 pb-6">
//                 <h4 className="text-sm font-bold text-gray-900 mb-3">Categories</h4>
//                 <div className="space-y-2.5">
//                   {allCategories.map((cat) => (
//                     <label key={cat} className="flex items-center justify-between text-sm cursor-pointer group">
//                       <div className="flex items-center gap-2">
//                         <input
//                           type="radio"
//                           name="category"
//                           value={cat}
//                           checked={selectedCategory === cat}
//                           onChange={() => setSelectedCategory(cat)}
//                           className="w-4 h-4 accent-[#2B7A4B] cursor-pointer"
//                         />
//                         <span className={`${selectedCategory === cat ? 'text-[#2B7A4B] font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>
//                           {cat}
//                         </span>
//                       </div>
//                     </label>
//                   ))}
//                 </div>
//               </div>

//               <div className="mb-6 border-b border-gray-100 pb-6">
//                 <h4 className="text-sm font-bold text-gray-900 mb-4">Price Range</h4>
//                 <div className="px-1">
//                   <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
//                     <span>Rs. {priceRange[0]}</span>
//                     <span>Rs. {priceRange[1]}</span>
//                   </div>
//                   <input
//                     type="range"
//                     min="0" max="100000" step="500"
//                     value={priceRange[1]}
//                     onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
//                     className="w-full accent-[#2B7A4B]"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* PRODUCTS AREA */}
//           <div className="flex-1">
//             <p className="text-sm text-gray-500 mb-6">
//               Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
//             </p>

//             {categorySections.length > 0 ? (
//               <div className="space-y-12">
//                 {categorySections.map((section, idx) => (
//                   <div key={idx} className="mb-10">
//                     <div className="flex items-center justify-between mb-5">
//                       <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 bg-[#2B7A4B]/10 rounded-full flex items-center justify-center">
//                           <Leaf className="w-5 h-5 text-[#2B7A4B]" />
//                         </div>
//                         <h2 className="text-xl font-bold text-gray-900">{section.name}</h2>
//                         <span className="text-sm text-gray-500">({section.products.length})</span>
//                       </div>
//                       <Link
//                         href={`/products?category=${encodeURIComponent(section.name)}`}
//                         className="flex items-center gap-1 text-sm text-[#2B7A4B] font-medium hover:underline"
//                       >
//                         View All <ArrowRight className="w-4 h-4" />
//                       </Link>
//                     </div>

//                     {/* ✅ PRODUCTS GRID - Now using ProductCard with discount */}
//                     <div className={`grid gap-5 ${
//                       viewMode === 'list'
//                         ? 'grid-cols-1'
//                         : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
//                     }`}>
//                       {section.products.slice(0, 8).map((product) => (
//                         <ProductCard
//                           key={product._id}
//                           product={product}
//                           viewMode={viewMode}
//                         />
//                       ))}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-12">
//                 <Leaf className="w-16 h-16 text-gray-200 mx-auto mb-4" />
//                 <h3 className="text-lg font-medium text-gray-600">No products found</h3>
//                 <p className="text-sm text-gray-400">Try adjusting your filters or search.</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* MOBILE SIDEBAR */}
//       {sidebarOpen && (
//         <div className="fixed inset-0 z-50 lg:hidden">
//           <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)}></div>
//           <div className="absolute right-0 top-0 h-full w-[320px] bg-white shadow-2xl p-6 overflow-y-auto">
//             <div className="flex items-center justify-between mb-6">
//               <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
//                 <Filter className="w-4 h-4" /> Filters
//               </h3>
//               <button onClick={() => setSidebarOpen(false)} className="p-1 hover:bg-gray-100 rounded-full">
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>

//             <div className="mb-6 border-b border-gray-100 pb-6">
//               <h4 className="text-sm font-bold text-gray-900 mb-3">Categories</h4>
//               <div className="space-y-2.5">
//                 {allCategories.map((cat) => (
//                   <label key={cat} className="flex items-center justify-between text-sm cursor-pointer">
//                     <div className="flex items-center gap-2">
//                       <input
//                         type="radio"
//                         name="mobile-category"
//                         value={cat}
//                         checked={selectedCategory === cat}
//                         onChange={() => setSelectedCategory(cat)}
//                         className="w-4 h-4 accent-[#2B7A4B]"
//                       />
//                       <span className="text-gray-600">{cat}</span>
//                     </div>
//                   </label>
//                 ))}
//               </div>
//             </div>

//             <div className="mb-6 border-b border-gray-100 pb-6">
//               <h4 className="text-sm font-bold text-gray-900 mb-4">Price Range</h4>
//               <div className="px-1">
//                 <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
//                   <span>Rs. {priceRange[0]}</span>
//                   <span>Rs. {priceRange[1]}</span>
//                 </div>
//                 <input
//                   type="range"
//                   min="0" max="100000" step="500"
//                   value={priceRange[1]}
//                   onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
//                   className="w-full accent-[#2B7A4B]"
//                 />
//               </div>
//             </div>

//             <button onClick={() => setSidebarOpen(false)} className="w-full py-3 bg-[#2B7A4B] text-white rounded-lg font-medium">
//               Apply Filters
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }








// new version


// // app/products/page.js
// 'use client';

// import { useState, useEffect, useMemo, memo, Suspense } from 'react';
// import { useSearchParams } from 'next/navigation';
// import Link from 'next/link';
// import {
//   Star, ShoppingCart, Heart, Leaf, Zap,
//   LayoutGrid, List, ChevronDown,
//   Filter, X, Loader2, ArrowRight
// } from 'lucide-react';
// import Image from 'next/image';
// import { getProductDiscount } from '@/app/utils/discountApi';
// import { addToCart } from '@/app/utils/cart';

// const API_BASE_URL = '';

// // ✅ Debounce hook to prevent slider lag
// function useDebounce(value, delay = 300) {
//   const [debounced, setDebounced] = useState(value);
//   useEffect(() => {
//     const timer = setTimeout(() => setDebounced(value), delay);
//     return () => clearTimeout(timer);
//   }, [value, delay]);
//   return debounced;
// }

// // ==========================================
// // ✅ PRODUCT CARD COMPONENT (memoized)
// // ==========================================
// const ProductCard = memo(function ProductCard({ product, viewMode }) {
//   const [discount, setDiscount] = useState(null);
//   const [finalPrice, setFinalPrice] = useState(product.price);
//   const [savings, setSavings] = useState(0);
//   const [loadingDiscount, setLoadingDiscount] = useState(true);
//   const [added, setAdded] = useState(false);

//   useEffect(() => {
//     const fetchDiscount = async () => {
//       const productId = product._id || product.id;
//       if (!productId) {
//         setLoadingDiscount(false);
//         return;
//       }

//       try {
//         setLoadingDiscount(true);
//         const data = await getProductDiscount(productId);

//         if (data.success && data.hasDiscount) {
//           setDiscount(data.discount);
//           setFinalPrice(data.finalPrice || product.price);
//           setSavings(data.savings || 0);
//         } else {
//           setFinalPrice(product.price);
//         }
//       } catch (err) {
//         console.error('Error fetching discount:', err);
//         setFinalPrice(product.price);
//       } finally {
//         setLoadingDiscount(false);
//       }
//     };

//     fetchDiscount();
//   }, [product._id, product.id, product.price]);

//   const handleAddToCart = (e) => {
//     e.preventDefault();
//     e.stopPropagation();

//     const productToAdd = {
//       id: product._id || product.id,
//       name: product.name,
//       desc: product.desc || product.description,
//       price: finalPrice,
//       originalPrice: product.price,
//       image: product.image || product.images?.[0],
//       category: product.category,
//       stock: product.stock,
//       discount: discount ? {
//         code: discount.code,
//         name: discount.name,
//         value: discount.value,
//         type: discount.type,
//       } : null,
//     };

//     addToCart(productToAdd, 1);
//     window.dispatchEvent(new Event('cartUpdated'));

//     setAdded(true);
//     setTimeout(() => setAdded(false), 1500);
//   };

//   const savingsPercentage = discount
//     ? discount.type === 'percentage'
//       ? discount.value
//       : Math.round((savings / product.price) * 100)
//     : 0;

//   // ========== LIST VIEW ==========
//   if (viewMode === 'list') {
//     return (
//       <Link
//         href={`/products/${product.slug || product._id}`}
//         className="relative group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex gap-6 p-4"
//       >
//         <button
//           onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
//           className="absolute top-3 right-3 z-10 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors"
//         >
//           <Heart className="w-5 h-5" />
//         </button>

//         <div className="relative w-48 h-48 flex-shrink-0 bg-[#F8F9F6] rounded-lg overflow-hidden">
//           {discount && (
//             <div className="absolute top-2 left-2 z-10">
//               <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-500 text-white text-[10px] font-bold rounded-full shadow">
//                 <Zap className="w-3 h-3" />
//                 {discount.badgeText}
//               </span>
//             </div>
//           )}
//           <Image
//             src={product.image || '/placeholder-product.jpg'}
//             alt={product.name}
//             fill
//             sizes="200px"
//             className="object-cover group-hover:scale-105 transition-transform duration-500"
//           />
//         </div>

//         <div className="flex-1 space-y-2">
//           <h3 className="text-[15px] font-bold text-gray-900">{product.name}</h3>
//           <p className="text-[13px] text-gray-500">{product.desc || product.description}</p>
//           <div className="flex items-center gap-1 text-[10px] text-gray-400">
//             <div className="flex text-[#FFB800]">
//               {[...Array(5)].map((_, i) => (
//                 <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating || 0) ? 'fill-current' : 'text-gray-300'}`} />
//               ))}
//             </div>
//             <span>({product.numReviews || 0})</span>
//           </div>

//           <div className="flex items-center justify-between pt-2">
//             <div>
//               {loadingDiscount ? (
//                 <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
//               ) : discount ? (
//                 <div className="space-y-0.5">
//                   <div className="flex items-center gap-2">
//                     <span className="text-[18px] font-bold text-[#2B7A4B]">
//                       Rs. {finalPrice.toFixed(2)}
//                     </span>
//                     <span className="text-[13px] text-gray-400 line-through">
//                       Rs. {product.price?.toFixed(2)}
//                     </span>
//                     <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded">
//                       {savingsPercentage}% OFF
//                     </span>
//                   </div>
//                   <span className="text-[10px] text-red-500 font-bold">
//                     Save Rs. {savings.toFixed(2)}
//                   </span>
//                 </div>
//               ) : (
//                 <span className="text-[18px] font-bold text-gray-900">
//                   Rs. {product.price?.toFixed(2) || '0.00'}
//                 </span>
//               )}
//             </div>
//             <button
//               onClick={handleAddToCart}
//               disabled={product.stock === 0}
//               className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
//                 added
//                   ? 'bg-green-500 text-white'
//                   : 'bg-[#2B7A4B]/10 text-[#2B7A4B] hover:bg-[#2B7A4B] hover:text-white'
//               }`}
//             >
//               <ShoppingCart className="w-3.5 h-3.5" />
//             </button>
//           </div>
//         </div>
//       </Link>
//     );
//   }

//   // ========== GRID VIEW ==========
//   return (
//     <div className="relative group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 p-4">
//       <button
//         onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
//         className="absolute top-3 right-3 z-10 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors"
//       >
//         <Heart className="w-5 h-5" />
//       </button>

//       <Link href={`/products/${product.slug || product._id}`} className="block">
//         <div className="relative w-full aspect-square bg-[#F8F9F6] rounded-lg overflow-hidden mb-4">
//           {discount && (
//             <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
//               <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-500 text-white text-[10px] font-bold rounded-full shadow">
//                 <Zap className="w-3 h-3" />
//                 {discount.badgeText}
//               </span>
//               {savingsPercentage >= 20 && (
//                 <span className="inline-block px-2 py-0.5 bg-yellow-400 text-yellow-900 text-[9px] font-bold rounded-full">
//                   🔥 HOT DEAL
//                 </span>
//               )}
//             </div>
//           )}

//           <Image
//             src={product.image || '/placeholder-product.jpg'}
//             alt={product.name}
//             fill
//             sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//             className="object-cover group-hover:scale-105 transition-transform duration-500"
//           />

//           {product.stock === 0 && (
//             <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
//               <span className="px-3 py-1 bg-white text-red-600 text-sm font-semibold rounded-full">
//                 Out of Stock
//               </span>
//             </div>
//           )}
//         </div>

//         <div className="space-y-1.5">
//           <h3 className="text-[15px] font-bold text-gray-900 truncate">{product.name}</h3>
//           <p className="text-[13px] text-gray-500 line-clamp-1">{product.desc || product.description || ''}</p>
//           <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-0.5">
//             <div className="flex text-[#FFB800]">
//               {[...Array(5)].map((_, i) => (
//                 <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating || 0) ? 'fill-current' : 'text-gray-300'}`} />
//               ))}
//             </div>
//             <span>({product.numReviews || 0})</span>
//           </div>

//           <div className="pt-1.5">
//             {loadingDiscount ? (
//               <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
//             ) : discount ? (
//               <div className="space-y-0.5">
//                 <div className="flex items-center gap-2 flex-wrap">
//                   <span className="text-[18px] font-bold text-[#2B7A4B]">
//                     Rs. {finalPrice.toFixed(2)}
//                   </span>
//                   <span className="text-[13px] text-gray-400 line-through">
//                     Rs. {product.price?.toFixed(2)}
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-2 text-[10px]">
//                   <span className="text-red-600 font-bold">Save Rs. {savings.toFixed(2)}</span>
//                   {discount.endDate && (
//                     <span className="text-orange-500 font-medium">
//                       • Ends {new Date(discount.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
//                     </span>
//                   )}
//                 </div>
//               </div>
//             ) : (
//               <span className="text-[18px] font-bold text-gray-900">
//                 Rs. {product.price?.toFixed(2) || '0.00'}
//               </span>
//             )}
//           </div>
//         </div>
//       </Link>

//       <div className="flex items-center justify-end pt-3">
//         <button
//           onClick={handleAddToCart}
//           disabled={product.stock === 0}
//           className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
//             added
//               ? 'bg-green-500 text-white'
//               : product.stock === 0
//               ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//               : 'bg-[#2B7A4B]/10 text-[#2B7A4B] hover:bg-[#2B7A4B] hover:text-white'
//           }`}
//         >
//           {added ? '✓' : <ShoppingCart className="w-3.5 h-3.5" />}
//         </button>
//       </div>
//     </div>
//   );
// });

// // ==========================================
// // ✅ MAIN PRODUCTS CONTENT
// // ==========================================
// function ProductsContent() {
//   const searchParams = useSearchParams();
//   const searchQuery = searchParams.get('search') || '';
//   const categoryParam = searchParams.get('category') || '';

//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [viewMode, setViewMode] = useState('grid');
//   const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'All');
//   const [sortBy, setSortBy] = useState('featured');
//   const [priceRange, setPriceRange] = useState([0, 100000]);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [categories, setCategories] = useState([]);

//   // ✅ Debounced price range — prevents lag while dragging slider
//   const debouncedPriceRange = useDebounce(priceRange, 300);

//   // ===== FETCH CATEGORIES =====
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await fetch(`${API_BASE_URL}/api/categories`);
//         const data = await res.json();
//         setCategories(data.categories || []);
//       } catch (error) {
//         console.error('Error fetching categories:', error);
//       }
//     };
//     fetchCategories();
//   }, []);

//   // ===== FETCH PRODUCTS =====
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         setLoading(true);
//         let url = `${API_BASE_URL}/api/public/products`;
//         const params = new URLSearchParams();

//         if (selectedCategory !== 'All' && selectedCategory !== 'All Products') {
//           params.append('category', selectedCategory);
//         }
//         if (searchQuery) {
//           params.append('search', searchQuery);
//         }
//         params.append('limit', '100');

//         if (params.toString()) {
//           url += `?${params.toString()}`;
//         }

//         console.log('🛒 Fetching products from:', url);
//         const res = await fetch(url);
//         if (!res.ok) throw new Error('Failed to fetch products');
//         const data = await res.json();
//         setProducts(data.products || []);
//       } catch (error) {
//         console.error('Error fetching products:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, [selectedCategory, searchQuery]);

//   // ✅ MEMOIZED FILTER & SORT — only recomputes when deps change
//   const filteredProducts = useMemo(() => {
//     return products
//       .filter((product) => {
//         const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           product.desc?.toLowerCase().includes(searchQuery.toLowerCase());
//         const matchesPrice =
//           product.price >= debouncedPriceRange[0] && product.price <= debouncedPriceRange[1];
//         return matchesSearch && matchesPrice;
//       })
//       .sort((a, b) => {
//         if (sortBy === 'price-low') return a.price - b.price;
//         if (sortBy === 'price-high') return b.price - a.price;
//         if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
//         return 0;
//       });
//   }, [products, searchQuery, debouncedPriceRange, sortBy]);

//   const allCategories = useMemo(
//     () => ['All', ...categories.map((c) => c.name)],
//     [categories]
//   );

//   // ✅ MEMOIZED CATEGORY SECTIONS
//   const categorySections = useMemo(() => {
//     const getCategoryProducts = (categoryName) => {
//       if (categoryName === 'All' || categoryName === 'All Products') return filteredProducts;
//       return filteredProducts.filter(
//         (product) =>
//           product.category === categoryName ||
//           product.category?.toLowerCase() === categoryName?.toLowerCase()
//       );
//     };

//     if (selectedCategory !== 'All' && selectedCategory !== 'All Products') {
//       return [{ name: selectedCategory, products: getCategoryProducts(selectedCategory) }];
//     }
//     const categoryNames = [...new Set(filteredProducts.map((p) => p.category).filter(Boolean))];
//     return categoryNames
//       .map((cat) => ({ name: cat, products: getCategoryProducts(cat) }))
//       .filter((section) => section.products.length > 0);
//   }, [filteredProducts, selectedCategory]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-white">
//         <div className="flex flex-col items-center gap-4">
//           <Loader2 className="w-12 h-12 text-[#2B7A4B] animate-spin" />
//           <p className="text-gray-500">Loading products...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full min-h-screen bg-white">
//       <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6">

//         <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
//           <span className="text-gray-400">🏠</span>
//           <Link href="/" className="hover:text-[#2B7A4B]">Home</Link>
//           <span className="text-gray-300">/</span>
//           <Link href="/products" className="hover:text-[#2B7A4B]">Shop</Link>
//           <span className="text-gray-300">/</span>
//           <span className="text-[#2B7A4B] font-medium">
//             {selectedCategory === 'All' || selectedCategory === 'All Products' ? 'All Products' : selectedCategory}
//           </span>
//         </div>

//         <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
//           <div className="flex items-center gap-2">
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
//               {selectedCategory === 'All' || selectedCategory === 'All Products' ? 'All Products' : selectedCategory}
//             </h1>
//             <Leaf className="w-5 h-5 text-[#2B7A4B]" />
//           </div>

//           <div className="flex flex-wrap items-center gap-3">
//             <div className="flex items-center bg-gray-100 rounded-lg p-1">
//               <button
//                 onClick={() => setViewMode('grid')}
//                 className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#2B7A4B]' : 'text-gray-500'}`}
//               >
//                 <LayoutGrid className="w-5 h-5" />
//               </button>
//               <button
//                 onClick={() => setViewMode('list')}
//                 className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-[#2B7A4B]' : 'text-gray-500'}`}
//               >
//                 <List className="w-5 h-5" />
//               </button>
//             </div>

//             <div className="relative">
//               <select
//                 value={sortBy}
//                 onChange={(e) => setSortBy(e.target.value)}
//                 className="pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2B7A4B]"
//               >
//                 <option value="featured">Sort by: Featured</option>
//                 <option value="price-low">Price: Low to High</option>
//                 <option value="price-high">Price: High to Low</option>
//                 <option value="rating">Top Rated</option>
//               </select>
//               <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
//             </div>

//             <button
//               onClick={() => setSidebarOpen(true)}
//               className="lg:hidden flex items-center gap-2 px-4 py-2 bg-[#2B7A4B] text-white rounded-lg text-sm font-medium"
//             >
//               <Filter className="w-4 h-4" />
//               Filters
//             </button>
//           </div>
//         </div>

//         <div className="flex flex-col lg:flex-row gap-8">

//           {/* SIDEBAR */}
//           <div className="hidden lg:block w-[260px] xl:w-[280px] flex-shrink-0">
//             <div className="sticky top-24">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
//                   <Filter className="w-4 h-4" /> Filters
//                 </h3>
//                 <button
//                   onClick={() => { setSelectedCategory('All'); setPriceRange([0, 100000]); }}
//                   className="text-sm text-[#2B7A4B] font-medium hover:underline"
//                 >
//                   Clear All
//                 </button>
//               </div>

//               <div className="mb-6 border-b border-gray-100 pb-6">
//                 <h4 className="text-sm font-bold text-gray-900 mb-3">Categories</h4>
//                 <div className="space-y-2.5">
//                   {allCategories.map((cat) => (
//                     <label key={cat} className="flex items-center justify-between text-sm cursor-pointer group">
//                       <div className="flex items-center gap-2">
//                         <input
//                           type="radio"
//                           name="category"
//                           value={cat}
//                           checked={selectedCategory === cat}
//                           onChange={() => setSelectedCategory(cat)}
//                           className="w-4 h-4 accent-[#2B7A4B] cursor-pointer"
//                         />
//                         <span className={`${selectedCategory === cat ? 'text-[#2B7A4B] font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>
//                           {cat}
//                         </span>
//                       </div>
//                     </label>
//                   ))}
//                 </div>
//               </div>

//               <div className="mb-6 border-b border-gray-100 pb-6">
//                 <h4 className="text-sm font-bold text-gray-900 mb-4">Price Range</h4>
//                 <div className="px-1">
//                   <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
//                     <span>Rs. {priceRange[0]}</span>
//                     <span>Rs. {priceRange[1]}</span>
//                   </div>
//                   <input
//                     type="range"
//                     min="0" max="100000" step="500"
//                     value={priceRange[1]}
//                     onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
//                     className="w-full accent-[#2B7A4B]"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* PRODUCTS AREA */}
//           <div className="flex-1">
//             <p className="text-sm text-gray-500 mb-6">
//               Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
//             </p>

//             {categorySections.length > 0 ? (
//               <div className="space-y-12">
//                 {categorySections.map((section, idx) => (
//                   <div key={idx} className="mb-10">
//                     <div className="flex items-center justify-between mb-5">
//                       <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 bg-[#2B7A4B]/10 rounded-full flex items-center justify-center">
//                           <Leaf className="w-5 h-5 text-[#2B7A4B]" />
//                         </div>
//                         <h2 className="text-xl font-bold text-gray-900">{section.name}</h2>
//                         <span className="text-sm text-gray-500">({section.products.length})</span>
//                       </div>
//                       <Link
//                         href={`/products?category=${encodeURIComponent(section.name)}`}
//                         className="flex items-center gap-1 text-sm text-[#2B7A4B] font-medium hover:underline"
//                       >
//                         View All <ArrowRight className="w-4 h-4" />
//                       </Link>
//                     </div>

//                     <div className={`grid gap-5 ${
//                       viewMode === 'list'
//                         ? 'grid-cols-1'
//                         : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
//                     }`}>
//                       {section.products.slice(0, 8).map((product) => (
//                         <ProductCard
//                           key={product._id}
//                           product={product}
//                           viewMode={viewMode}
//                         />
//                       ))}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-12">
//                 <Leaf className="w-16 h-16 text-gray-200 mx-auto mb-4" />
//                 <h3 className="text-lg font-medium text-gray-600">No products found</h3>
//                 <p className="text-sm text-gray-400">Try adjusting your filters or search.</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* MOBILE SIDEBAR */}
//       {sidebarOpen && (
//         <div className="fixed inset-0 z-50 lg:hidden">
//           <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)}></div>
//           <div className="absolute right-0 top-0 h-full w-[320px] bg-white shadow-2xl p-6 overflow-y-auto">
//             <div className="flex items-center justify-between mb-6">
//               <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
//                 <Filter className="w-4 h-4" /> Filters
//               </h3>
//               <button onClick={() => setSidebarOpen(false)} className="p-1 hover:bg-gray-100 rounded-full">
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>

//             <div className="mb-6 border-b border-gray-100 pb-6">
//               <h4 className="text-sm font-bold text-gray-900 mb-3">Categories</h4>
//               <div className="space-y-2.5">
//                 {allCategories.map((cat) => (
//                   <label key={cat} className="flex items-center justify-between text-sm cursor-pointer">
//                     <div className="flex items-center gap-2">
//                       <input
//                         type="radio"
//                         name="mobile-category"
//                         value={cat}
//                         checked={selectedCategory === cat}
//                         onChange={() => setSelectedCategory(cat)}
//                         className="w-4 h-4 accent-[#2B7A4B]"
//                       />
//                       <span className="text-gray-600">{cat}</span>
//                     </div>
//                   </label>
//                 ))}
//               </div>
//             </div>

//             <div className="mb-6 border-b border-gray-100 pb-6">
//               <h4 className="text-sm font-bold text-gray-900 mb-4">Price Range</h4>
//               <div className="px-1">
//                 <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
//                   <span>Rs. {priceRange[0]}</span>
//                   <span>Rs. {priceRange[1]}</span>
//                 </div>
//                 <input
//                   type="range"
//                   min="0" max="100000" step="500"
//                   value={priceRange[1]}
//                   onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
//                   className="w-full accent-[#2B7A4B]"
//                 />
//               </div>
//             </div>

//             <button onClick={() => setSidebarOpen(false)} className="w-full py-3 bg-[#2B7A4B] text-white rounded-lg font-medium">
//               Apply Filters
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // ==========================================
// // ✅ DEFAULT EXPORT — wraps ProductsContent in Suspense
// // ==========================================
// export default function ProductsPage() {
//   return (
//     <Suspense
//       fallback={
//         <div className="min-h-screen flex items-center justify-center bg-white">
//           <div className="flex flex-col items-center gap-4">
//             <Loader2 className="w-12 h-12 text-[#2B7A4B] animate-spin" />
//             <p className="text-gray-500">Loading products...</p>
//           </div>
//         </div>
//       }
//     >
//       <ProductsContent />
//     </Suspense>
//   );
// }





// better version for performance
// app/products/page.js
'use client';

import { useState, useEffect, useMemo, memo, Suspense, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Star, ShoppingCart, Heart, Leaf, Zap,
  LayoutGrid, List, ChevronDown,
  Filter, X, Loader2, ArrowRight,
} from 'lucide-react';
import { getProductDiscount } from '@/app/utils/discountApi';
import { addToCart } from '@/app/utils/cart';

const API_BASE_URL = '';

// ✅ FIX: Cloudinary transform for product cards
const CARD_TRANSFORM = 'w_400,h_400,c_fill,g_auto,q_auto:good,f_auto';

const optimizeProductImage = (url, transform = CARD_TRANSFORM) => {
  if (!url || typeof url !== 'string') return url;
  if (!url.includes('res.cloudinary.com')) return url;
  if (/\/upload\/[a-z]_/.test(url)) return url;
  return url.replace('/upload/', `/upload/${transform}/`);
};

// ✅ Debounce hook
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

// ✅ FIX: IntersectionObserver hook — only fetch discount when card is visible
function useInView(ref, options = {}) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current || inView) return;
    const el = ref.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px', ...options }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, inView, options]);

  return inView;
}

// ==========================================
// ✅ PRODUCT CARD (memoized + lazy discount)
// ==========================================
const ProductCard = memo(function ProductCard({ product, viewMode, priority = false }) {
  const cardRef = useRef(null);
  const inView = useInView(cardRef);

  const [discount, setDiscount] = useState(null);
  const [finalPrice, setFinalPrice] = useState(product.price);
  const [savings, setSavings] = useState(0);
  const [loadingDiscount, setLoadingDiscount] = useState(true);
  const [added, setAdded] = useState(false);

  // ✅ FIX: Only fetch discount when card is in view
  useEffect(() => {
    if (!inView) return;

    const productId = product._id || product.id;
    if (!productId) {
      setLoadingDiscount(false);
      return;
    }

    let cancelled = false;

    const fetchDiscount = async () => {
      try {
        setLoadingDiscount(true);
        const data = await getProductDiscount(productId);
        if (cancelled) return;

        if (data.success && data.hasDiscount) {
          setDiscount(data.discount);
          setFinalPrice(data.finalPrice || product.price);
          setSavings(data.savings || 0);
        } else {
          setFinalPrice(product.price);
        }
      } catch {
        if (!cancelled) setFinalPrice(product.price);
      } finally {
        if (!cancelled) setLoadingDiscount(false);
      }
    };

    fetchDiscount();
    return () => {
      cancelled = true;
    };
  }, [inView, product._id, product.id, product.price]);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const productToAdd = {
      id: product._id || product.id,
      name: product.name,
      desc: product.desc || product.description,
      price: finalPrice,
      originalPrice: product.price,
      image: product.image || product.images?.[0],
      category: product.category,
      stock: product.stock,
      discount: discount
        ? {
            code: discount.code,
            name: discount.name,
            value: discount.value,
            type: discount.type,
          }
        : null,
    };

    addToCart(productToAdd, 1);
    window.dispatchEvent(new Event('cartUpdated'));
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const savingsPercentage = discount
    ? discount.type === 'percentage'
      ? discount.value
      : Math.round((savings / product.price) * 100)
    : 0;

  // ✅ FIX: optimized image source
  const optimizedImageSrc = optimizeProductImage(
    product.image || product.images?.[0] || '/placeholder-product.jpg'
  );

  // ========== LIST VIEW ==========
  if (viewMode === 'list') {
    return (
      <Link
        ref={cardRef}
        href={`/products/${product.slug || product._id}`}
        className="relative group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex gap-6 p-4"
      >
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          aria-label={`Add ${product.name} to wishlist`}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors"
        >
          <Heart className="w-5 h-5" />
        </button>

        <div className="relative w-48 h-48 flex-shrink-0 bg-[#F8F9F6] rounded-lg overflow-hidden">
          {discount && (
            <div className="absolute top-2 left-2 z-10">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-500 text-white text-[10px] font-bold rounded-full shadow">
                <Zap className="w-3 h-3" />
                {discount.badgeText}
              </span>
            </div>
          )}
          <Image
            src={optimizedImageSrc}
            alt={product.name || 'Product'}
            fill
            sizes="200px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            priority={priority}
            loading={priority ? 'eager' : 'lazy'}
          />
        </div>

        <div className="flex-1 space-y-2">
          <h3 className="text-[15px] font-bold text-gray-900 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-[13px] text-gray-500 line-clamp-2">
            {product.desc || product.description}
          </p>
          <div className="flex items-center gap-1 text-[10px] text-gray-400">
            <div className="flex text-[#FFB800]" aria-hidden="true">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating || 0) ? 'fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span>({product.numReviews || 0})</span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              {loadingDiscount ? (
                <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
              ) : discount ? (
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[18px] font-bold text-[#2B7A4B]">
                      Rs. {finalPrice.toFixed(2)}
                    </span>
                    <span className="text-[13px] text-gray-400 line-through">
                      Rs. {product.price?.toFixed(2)}
                    </span>
                    <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded">
                      {savingsPercentage}% OFF
                    </span>
                  </div>
                  <span className="text-[10px] text-red-500 font-bold">
                    Save Rs. {savings.toFixed(2)}
                  </span>
                </div>
              ) : (
                <span className="text-[18px] font-bold text-gray-900">
                  Rs. {product.price?.toFixed(2) || '0.00'}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              aria-label={`Add ${product.name} to cart`}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                added
                  ? 'bg-green-500 text-white'
                  : 'bg-[#2B7A4B]/10 text-[#2B7A4B] hover:bg-[#2B7A4B] hover:text-white'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </Link>
    );
  }

  // ========== GRID VIEW ==========
  return (
    <div
      ref={cardRef}
      className="relative group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 p-4 flex flex-col h-full"
    >
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        aria-label={`Add ${product.name} to wishlist`}
        className="absolute top-3 right-3 z-10 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors"
      >
        <Heart className="w-5 h-5" />
      </button>

      <Link href={`/products/${product.slug || product._id}`} className="block flex-1">
        <div className="relative w-full aspect-square bg-[#F8F9F6] rounded-lg overflow-hidden mb-4">
          {discount && (
            <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-500 text-white text-[10px] font-bold rounded-full shadow">
                <Zap className="w-3 h-3" />
                {discount.badgeText}
              </span>
              {savingsPercentage >= 20 && (
                <span className="inline-block px-2 py-0.5 bg-yellow-400 text-yellow-900 text-[9px] font-bold rounded-full">
                  🔥 HOT DEAL
                </span>
              )}
            </div>
          )}

          <Image
            src={optimizedImageSrc}
            alt={product.name || 'Product'}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 300px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            priority={priority}
            loading={priority ? 'eager' : 'lazy'}
          />

          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="px-3 py-1 bg-white text-red-600 text-sm font-semibold rounded-full">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <h3 className="text-[15px] font-bold text-gray-900 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-[13px] text-gray-500 line-clamp-1 min-h-[1.25em]">
            {product.desc || product.description || ''}
          </p>
          <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-0.5">
            <div className="flex text-[#FFB800]" aria-hidden="true">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating || 0) ? 'fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span>({product.numReviews || 0})</span>
          </div>

          <div className="pt-1.5 min-h-[52px]">
            {loadingDiscount ? (
              <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
            ) : discount ? (
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[18px] font-bold text-[#2B7A4B]">
                    Rs. {finalPrice.toFixed(2)}
                  </span>
                  <span className="text-[13px] text-gray-400 line-through">
                    Rs. {product.price?.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="text-red-600 font-bold">
                    Save Rs. {savings.toFixed(2)}
                  </span>
                  {discount.endDate && (
                    <span className="text-orange-500 font-medium">
                      • Ends{' '}
                      {new Date(discount.endDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <span className="text-[18px] font-bold text-gray-900">
                Rs. {product.price?.toFixed(2) || '0.00'}
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="flex items-center justify-end pt-3 mt-auto">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          aria-label={`Add ${product.name} to cart`}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            added
              ? 'bg-green-500 text-white'
              : product.stock === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-[#2B7A4B]/10 text-[#2B7A4B] hover:bg-[#2B7A4B] hover:text-white'
          }`}
        >
          {added ? '✓' : <ShoppingCart className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
});

// ==========================================
// ✅ MAIN PRODUCTS CONTENT
// ==========================================
function ProductsContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'All');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  const debouncedPriceRange = useDebounce(priceRange, 300);

  // ===== FETCH CATEGORIES =====
  useEffect(() => {
    let cancelled = false;
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/categories`);
        const data = await res.json();
        if (!cancelled) setCategories(data.categories || []);
      } catch {
        // silent
      }
    };
    fetchCategories();
    return () => {
      cancelled = true;
    };
  }, []);

  // ===== FETCH PRODUCTS =====
  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        let url = `${API_BASE_URL}/api/public/products`;
        const params = new URLSearchParams();

        if (selectedCategory !== 'All' && selectedCategory !== 'All Products') {
          params.append('category', selectedCategory);
        }
        if (searchQuery) {
          params.append('search', searchQuery);
        }
        params.append('limit', '100');

        if (params.toString()) url += `?${params.toString()}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        if (cancelled) return;
        setProducts(data.products || []);
      } catch {
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProducts();
    return () => {
      cancelled = true;
    };
  }, [selectedCategory, searchQuery]);

  // ✅ MEMOIZED FILTER & SORT
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesSearch =
          !searchQuery ||
          product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.desc?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPrice =
          product.price >= debouncedPriceRange[0] && product.price <= debouncedPriceRange[1];
        return matchesSearch && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        return 0;
      });
  }, [products, searchQuery, debouncedPriceRange, sortBy]);

  const allCategories = useMemo(
    () => ['All', ...categories.map((c) => c.name)],
    [categories]
  );

  const categorySections = useMemo(() => {
    const getCategoryProducts = (categoryName) => {
      if (categoryName === 'All' || categoryName === 'All Products') return filteredProducts;
      return filteredProducts.filter(
        (product) =>
          product.category === categoryName ||
          product.category?.toLowerCase() === categoryName?.toLowerCase()
      );
    };

    if (selectedCategory !== 'All' && selectedCategory !== 'All Products') {
      return [{ name: selectedCategory, products: getCategoryProducts(selectedCategory) }];
    }
    const categoryNames = [
      ...new Set(filteredProducts.map((p) => p.category).filter(Boolean)),
    ];
    return categoryNames
      .map((cat) => ({ name: cat, products: getCategoryProducts(cat) }))
      .filter((section) => section.products.length > 0);
  }, [filteredProducts, selectedCategory]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-[#2B7A4B] animate-spin" />
          <p className="text-gray-500">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6">
        {/* BREADCRUMB */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-sm text-gray-500 mb-6"
        >
          <Link href="/" className="hover:text-[#2B7A4B]">
            Home
          </Link>
          <span className="text-gray-300">/</span>
          <Link href="/products" className="hover:text-[#2B7A4B]">
            Shop
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-[#2B7A4B] font-medium">
            {selectedCategory === 'All' || selectedCategory === 'All Products'
              ? 'All Products'
              : selectedCategory}
          </span>
        </nav>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {selectedCategory === 'All' || selectedCategory === 'All Products'
                ? 'All Products'
                : selectedCategory}
            </h1>
            <Leaf className="w-5 h-5 text-[#2B7A4B]" />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
                aria-pressed={viewMode === 'grid'}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'grid' ? 'bg-white shadow-sm text-[#2B7A4B]' : 'text-gray-500'
                }`}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                aria-label="List view"
                aria-pressed={viewMode === 'list'}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'list' ? 'bg-white shadow-sm text-[#2B7A4B]' : 'text-gray-500'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort products"
                className="pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2B7A4B]"
              >
                <option value="featured">Sort by: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-[#2B7A4B] text-white rounded-lg text-sm font-medium"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* SIDEBAR */}
          <aside className="hidden lg:block w-[260px] xl:w-[280px] flex-shrink-0">
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Filter className="w-4 h-4" /> Filters
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('All');
                    setPriceRange([0, 100000]);
                  }}
                  className="text-sm text-[#2B7A4B] font-medium hover:underline"
                >
                  Clear All
                </button>
              </div>

              <div className="mb-6 border-b border-gray-100 pb-6">
                <h4 className="text-sm font-bold text-gray-900 mb-3">Categories</h4>
                <div className="space-y-2.5">
                  {allCategories.map((cat) => (
                    <label
                      key={cat}
                      className="flex items-center justify-between text-sm cursor-pointer group"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="category"
                          value={cat}
                          checked={selectedCategory === cat}
                          onChange={() => setSelectedCategory(cat)}
                          className="w-4 h-4 accent-[#2B7A4B] cursor-pointer"
                        />
                        <span
                          className={`${
                            selectedCategory === cat
                              ? 'text-[#2B7A4B] font-medium'
                              : 'text-gray-600 group-hover:text-gray-900'
                          }`}
                        >
                          {cat}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6 border-b border-gray-100 pb-6">
                <h4 className="text-sm font-bold text-gray-900 mb-4">Price Range</h4>
                <div className="px-1">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Rs. {priceRange[0]}</span>
                    <span>Rs. {priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    step="500"
                    value={priceRange[1]}
                    aria-label="Maximum price"
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full accent-[#2B7A4B]"
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* PRODUCTS */}
          <div className="flex-1">
            <p className="text-sm text-gray-500 mb-6">
              Showing {filteredProducts.length} product
              {filteredProducts.length !== 1 ? 's' : ''}
            </p>

            {categorySections.length > 0 ? (
              <div className="space-y-12">
                {categorySections.map((section, idx) => (
                  <section key={idx} className="mb-10">
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#2B7A4B]/10 rounded-full flex items-center justify-center">
                          <Leaf className="w-5 h-5 text-[#2B7A4B]" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">{section.name}</h2>
                        <span className="text-sm text-gray-500">
                          ({section.products.length})
                        </span>
                      </div>
                      <Link
                        href={`/products?category=${encodeURIComponent(section.name)}`}
                        className="flex items-center gap-1 text-sm text-[#2B7A4B] font-medium hover:underline"
                      >
                        View All <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>

                    <div
                      className={`grid gap-5 ${
                        viewMode === 'list'
                          ? 'grid-cols-1'
                          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                      }`}
                    >
                      {/* ✅ FIX: pass priority for first few cards per section */}
                      {section.products.slice(0, 8).map((product, cardIdx) => (
                        <ProductCard
                          key={product._id}
                          product={product}
                          viewMode={viewMode}
                          priority={idx === 0 && cardIdx < 4}
                        />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Leaf className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600">No products found</h3>
                <p className="text-sm text-gray-400">Try adjusting your filters or search.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE SIDEBAR */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <aside
            className="absolute right-0 top-0 h-full w-[320px] bg-white shadow-2xl p-6 overflow-y-auto"
            aria-label="Filters"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Filter className="w-4 h-4" /> Filters
              </h3>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close filters"
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="mb-6 border-b border-gray-100 pb-6">
              <h4 className="text-sm font-bold text-gray-900 mb-3">Categories</h4>
              <div className="space-y-2.5">
                {allCategories.map((cat) => (
                  <label
                    key={cat}
                    className="flex items-center justify-between text-sm cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="mobile-category"
                        value={cat}
                        checked={selectedCategory === cat}
                        onChange={() => setSelectedCategory(cat)}
                        className="w-4 h-4 accent-[#2B7A4B]"
                      />
                      <span className="text-gray-600">{cat}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6 border-b border-gray-100 pb-6">
              <h4 className="text-sm font-bold text-gray-900 mb-4">Price Range</h4>
              <div className="px-1">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Rs. {priceRange[0]}</span>
                  <span>Rs. {priceRange[1]}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="500"
                  value={priceRange[1]}
                  aria-label="Maximum price"
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full accent-[#2B7A4B]"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="w-full py-3 bg-[#2B7A4B] text-white rounded-lg font-medium"
            >
              Apply Filters
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}

// ==========================================
// DEFAULT EXPORT
// ==========================================
export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-[#2B7A4B] animate-spin" />
            <p className="text-gray-500">Loading products...</p>
          </div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}