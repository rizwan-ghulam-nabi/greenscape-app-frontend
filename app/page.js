// import { Suspense, lazy } from 'react';

// // ===== LAZY LOADED COMPONENTS =====
// const Banner = lazy(() => import('@/components/Banner'));
// const BestSellers = lazy(() => import('@/components/BestSellers'));
// const Categories = lazy(() => import('@/components/Categories'));
// const Features = lazy(() => import('@/components/Features'));
// const GardeningTips = lazy(() => import('@/components/GardeningTips'));
// const HeroCarousel = lazy(() => import('@/components/HeroCarousel'));
// const Newsletter = lazy(() => import('@/components/Newsletter'));
// const PromoBanners = lazy(() => import('@/components/PromoBanners'));
// const TrustedBrands = lazy(() => import('@/components/TrustedBrands'));
// const WhyChooseUs = lazy(() => import('@/components/WhyChooseUs'));

// // ===== LOADING COMPONENTS =====
// const HeroCarouselLoader = () => (
//   <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] bg-gray-100 animate-pulse"></div>
// );

// const FeaturesLoader = () => (
//   <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8">
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//       {[...Array(3)].map((_, i) => (
//         <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse"></div>
//       ))}
//     </div>
//   </div>
// );

// const CategoriesLoader = () => (
//   <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8">
//     <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
//       {[...Array(6)].map((_, i) => (
//         <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse"></div>
//       ))}
//     </div>
//   </div>
// );

// const BannerLoader = () => (
//   <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-4">
//     <div className="w-full h-[200px] md:h-[300px] lg:h-[400px] bg-gray-100 animate-pulse rounded-2xl"></div>
//   </div>
// );

// const BestSellersLoader = () => (
//   <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8">
//     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//       {[...Array(4)].map((_, i) => (
//         <div key={i} className="h-80 bg-gray-100 rounded-xl animate-pulse"></div>
//       ))}
//     </div>
//   </div>
// );

// const PromoBannersLoader = () => (
//   <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8">
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//       {[...Array(3)].map((_, i) => (
//         <div key={i} className="h-48 bg-gray-100 rounded-xl animate-pulse"></div>
//       ))}
//     </div>
//   </div>
// );

// const WhyChooseUsLoader = () => (
//   <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8">
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//       {[...Array(4)].map((_, i) => (
//         <div key={i} className="h-40 bg-gray-100 rounded-xl animate-pulse"></div>
//       ))}
//     </div>
//   </div>
// );

// const GardeningTipsLoader = () => (
//   <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8">
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//       {[...Array(3)].map((_, i) => (
//         <div key={i} className="h-64 bg-gray-100 rounded-xl animate-pulse"></div>
//       ))}
//     </div>
//   </div>
// );

// const TrustedBrandsLoader = () => (
//   <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8">
//     <div className="flex justify-center items-center gap-8">
//       {[...Array(6)].map((_, i) => (
//         <div key={i} className="w-32 h-12 bg-gray-100 rounded-lg animate-pulse"></div>
//       ))}
//     </div>
//   </div>
// );

// const NewsletterLoader = () => (
//   <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-12">
//     <div className="w-full h-40 bg-gray-100 rounded-xl animate-pulse"></div>
//   </div>
// );

// export default function Home() {
//   return (
//     <div className="min-h-screen bg-[#F8F9F6] font-sans">
   
//       <Suspense fallback={<HeroCarouselLoader />}>
//         <HeroCarousel />
//       </Suspense>
      
//       <Suspense fallback={<FeaturesLoader />}>
//         <Features />
//       </Suspense>
      
//       <Suspense fallback={<CategoriesLoader />}>
//         <Categories />
//       </Suspense>
      
//       <Suspense fallback={<BannerLoader />}>
//         <Banner />
//       </Suspense>
      
//       <Suspense fallback={<BestSellersLoader />}>
//         <BestSellers />
//       </Suspense>
      
//       <Suspense fallback={<PromoBannersLoader />}>
//         <PromoBanners />
//       </Suspense>
      
//       <Suspense fallback={<WhyChooseUsLoader />}>
//         <WhyChooseUs />
//       </Suspense>
      
//       <Suspense fallback={<GardeningTipsLoader />}>
//         <GardeningTips />
//       </Suspense>
      
//       <Suspense fallback={<TrustedBrandsLoader />}>
//         <TrustedBrands />
//       </Suspense>
      
//       <Suspense fallback={<NewsletterLoader />}>
//         <Newsletter />
//       </Suspense>
    
//     </div>
//   );
// }





//  for better version for perfomance 
// app/page.js
import dynamic from 'next/dynamic';

// ===== ABOVE-THE-FOLD (no lazy — instant render) =====
import HeroCarousel from '@/components/HeroCarousel';
import Features from '@/components/Features';

// ===== BELOW-THE-FOLD (lazy-load with next/dynamic) =====
// ✅ FIX: next/dynamic instead of React.lazy — proper Next.js code splitting
const Categories = dynamic(() => import('@/components/Categories'), {
  loading: () => <CategoriesLoader />,
});

const Banner = dynamic(() => import('@/components/Banner'), {
  loading: () => <BannerLoader />,
});

const BestSellers = dynamic(() => import('@/components/BestSellers'), {
  loading: () => <BestSellersLoader />,
});

const PromoBanners = dynamic(() => import('@/components/PromoBanners'), {
  loading: () => <PromoBannersLoader />,
});

const WhyChooseUs = dynamic(() => import('@/components/WhyChooseUs'), {
  loading: () => <WhyChooseUsLoader />,
});

const GardeningTips = dynamic(() => import('@/components/GardeningTips'), {
  loading: () => <GardeningTipsLoader />,
});

const TrustedBrands = dynamic(() => import('@/components/TrustedBrands'), {
  loading: () => <TrustedBrandsLoader />,
});

const Newsletter = dynamic(() => import('@/components/Newsletter'), {
  loading: () => <NewsletterLoader />,
});

// ===== SKELETON LOADERS =====
// ✅ FIX: removed `animate-pulse` on all loaders to reduce CPU
// Real components will fade in and replace these quickly.

const CategoriesLoader = () => (
  <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8">
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-32 bg-gray-100 rounded-xl" />
      ))}
    </div>
  </div>
);

const BannerLoader = () => (
  <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-4">
    {/* ✅ FIX: aspect-ratio matches real Banner (was h-[400px], now aspect-[3.25/1]) */}
    <div className="w-full aspect-[3.25/1] max-h-[500px] bg-gray-100 rounded-2xl" />
  </div>
);

const BestSellersLoader = () => (
  <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-80 bg-gray-100 rounded-xl" />
      ))}
    </div>
  </div>
);

const PromoBannersLoader = () => (
  <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="aspect-[2.5/1] bg-gray-100 rounded-xl" />
      ))}
    </div>
  </div>
);

const WhyChooseUsLoader = () => (
  <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-40 bg-gray-100 rounded-xl" />
      ))}
    </div>
  </div>
);

const GardeningTipsLoader = () => (
  <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-64 bg-gray-100 rounded-xl" />
      ))}
    </div>
  </div>
);

const TrustedBrandsLoader = () => (
  <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8">
    <div className="flex justify-center items-center gap-8">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="w-32 h-12 bg-gray-100 rounded-lg" />
      ))}
    </div>
  </div>
);

const NewsletterLoader = () => (
  <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-12">
    <div className="w-full h-40 bg-gray-100 rounded-xl" />
  </div>
);

// ==========================================
// PAGE
// ==========================================
export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8F9F6] font-sans">
      {/* ✅ ABOVE THE FOLD — render immediately, no lazy */}
      <HeroCarousel />
      <Features />

      {/* ✅ BELOW THE FOLD — lazy-loaded with next/dynamic */}
      <Categories />
      <Banner />
      <BestSellers />
      <PromoBanners />
      <WhyChooseUs />
      <GardeningTips />
      <TrustedBrands />
      <Newsletter />
    </div>
  );
}