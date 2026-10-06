// // components/Banner.js
// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import Link from 'next/link';
// import Image from 'next/image';
// import axios from 'axios';
// import { ChevronRight, ChevronLeft } from 'lucide-react';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// // ==========================================
// // BUTTON SIZE PRESETS (used when size !== 'Custom')
// // ==========================================
// const BUTTON_SIZE_PRESETS = {
//   Small:  { paddingX: 16, paddingY: 8,  fontSize: 13, minWidth: 100 },
//   Medium: { paddingX: 24, paddingY: 12, fontSize: 15, minWidth: 130 },
//   Large:  { paddingX: 32, paddingY: 16, fontSize: 17, minWidth: 170 },
// };

// const BUTTON_RADIUS_VALUES = {
//   none: 0,
//   sm:   4,
//   md:   8,
//   lg:   12,
//   full: 9999,
// };

// const BADGE_RADIUS_VALUES = {
//   pill:    9999,
//   rounded: 8,
//   square:  0,
// };

// // Reference width used to scale admin px values → viewport units
// const REF_WIDTH = 1440;

// export default function Banner() {
//   const [banners, setBanners] = useState([]);
//   const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isTransitioning, setIsTransitioning] = useState(false);

//   // ==========================================
//   // FETCH BANNERS
//   // ==========================================
//   useEffect(() => {
//     const fetchBanners = async () => {
//       try {
//         const res = await axios.get(`${API_BASE_URL}/api/banners/active`, {
//           withCredentials: true,
//         });

//         const bannerData = Array.isArray(res.data)
//           ? res.data
//           : res.data.banners || res.data.data || [];

//         const activeBanners = bannerData.filter(
//           (b) => b.image && b.isActive !== false
//         );
//         activeBanners.sort((a, b) => (a.order || 0) - (b.order || 0));

//         console.log('✅ Banners loaded:', activeBanners);
//         setBanners(activeBanners);
//       } catch (err) {
//         console.error('❌ Error fetching banners:', err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBanners();
//   }, []);

//   // Auto-rotate
//   useEffect(() => {
//     if (banners.length <= 1) return;
//     const interval = setInterval(() => {
//       setIsTransitioning(true);
//       setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
//       setTimeout(() => setIsTransitioning(false), 500);
//     }, 5000);
//     return () => clearInterval(interval);
//   }, [banners.length]);

//   const nextBanner = useCallback(() => {
//     if (banners.length === 0) return;
//     setIsTransitioning(true);
//     setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
//     setTimeout(() => setIsTransitioning(false), 500);
//   }, [banners.length]);

//   const prevBanner = useCallback(() => {
//     if (banners.length === 0) return;
//     setIsTransitioning(true);
//     setCurrentBannerIndex((prev) => (prev - 1 + banners.length) % banners.length);
//     setTimeout(() => setIsTransitioning(false), 500);
//   }, [banners.length]);

//   const goToBanner = (index) => {
//     setIsTransitioning(true);
//     setCurrentBannerIndex(index);
//     setTimeout(() => setIsTransitioning(false), 500);
//   };

//   // ==========================================
//   // LINK BUILDER
//   // ==========================================
//   const getBannerLink = (banner) => {
//     switch (banner.linkType) {
//       case 'Category': {
//         const categoryName = banner.categoryId?.name;
//         if (categoryName) {
//           return `/products?category=${encodeURIComponent(categoryName)}`;
//         }
//         return '/products';
//       }
//       case 'Product': {
//         const productSlug = banner.productId?.slug;
//         const productId = banner.productId?._id || banner.productId;
//         if (productSlug) return `/products/${productSlug}`;
//         if (productId) return `/products/${productId}`;
//         return '/products';
//       }
//       case 'Custom URL':
//         return banner.customUrl || '/products';
//       default:
//         return '/products';
//     }
//   };

//   // ==========================================
//   // LOADING
//   // ==========================================
//   if (loading) {
//     return (
//       <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-4">
//         <div className="w-full h-[200px] md:h-[300px] lg:h-[400px] bg-gray-100 animate-pulse rounded-2xl" />
//       </div>
//     );
//   }

//   if (error || banners.length === 0) {
//     return null;
//   }

//   const currentBanner = banners[currentBannerIndex];
//   const bannerLink = getBannerLink(currentBanner);

//   // ==========================================
//   // BUTTON CONFIG
//   // ==========================================
//   const btn = currentBanner.button || {};

//   const buttonText      = btn.text || 'Shop Now';
//   const buttonSize      = btn.size || 'Medium';
//   const buttonStyle     = btn.style || 'Solid';
//   const buttonBg        = btn.bgColor || '#0f5a2e';
//   const buttonTextColor = btn.textColor || '#ffffff';
//   const buttonRadiusKey = btn.borderRadius || 'md';
//   const showArrow       = btn.showArrow !== false;

  

//   // ✅ Resolve size — Custom uses width/height scaled with viewport
//   const resolvedSize = (() => {
//     if (buttonSize === 'Custom') {
//       const w = btn.width ?? 160;
//       const h = btn.height ?? 48;
//       return {
//         isCustom: true,
//         width:  `clamp(70px, ${(w / REF_WIDTH) * 100}vw, 400px)`,
//         height: `clamp(32px, ${(h / REF_WIDTH) * 100}vw, 120px)`,
//         fontSize: `clamp(11px, ${(15 / REF_WIDTH) * 100}vw, 22px)`,
//       };
//     }
//     const preset = BUTTON_SIZE_PRESETS[buttonSize] || BUTTON_SIZE_PRESETS.Medium;
//     return {
//       isCustom: false,
//       padding: `${preset.paddingY}px ${preset.paddingX}px`,
//       fontSize: `clamp(11px, ${(preset.fontSize / REF_WIDTH) * 100}vw, 20px)`,
//       minWidth: `${preset.minWidth}px`,
//     };
//   })();

//   const buttonRadiusPx = BUTTON_RADIUS_VALUES[buttonRadiusKey] ?? 8;

//   // Style variants
//   const getButtonStyleObj = () => {
//     const base = {
//       color: buttonTextColor,
//       borderRadius: `${buttonRadiusPx}px`,
//       transition: 'all 0.3s ease',
//     };

//     if (buttonStyle === 'Solid') {
//       return { ...base, backgroundColor: buttonBg, border: 'none' };
//     }
//     if (buttonStyle === 'Outline') {
//       return {
//         ...base,
//         backgroundColor: 'transparent',
//         border: `2px solid ${buttonTextColor}`,
//       };
//     }
//     // Ghost
//     return {
//       ...base,
//       backgroundColor: 'rgba(255,255,255,0.15)',
//       border: 'none',
//       backdropFilter: 'blur(8px)',
//     };
//   };

//   const buttonStyleObj = {
//     ...getButtonStyleObj(),
//     ...(resolvedSize.isCustom
//       ? {
//           width: resolvedSize.width,
//           height: resolvedSize.height,
//           fontSize: resolvedSize.fontSize,
//         }
//       : {
//           padding: resolvedSize.padding,
//           fontSize: resolvedSize.fontSize,
//           minWidth: resolvedSize.minWidth,
//         }),
//   };

//   // ==========================================
//   // ✅ BADGE CONFIG — scales with viewport
//   // ==========================================
//   const bdg = currentBanner.badge || {};
//   const badgeEnabled = bdg.enabled === true && !!bdg.text;

//   const badgeFontSize = `clamp(12px, ${((bdg.fontSize ?? 14) / REF_WIDTH) * 100}vw, 40px)`;
//   const badgePaddingY = `clamp(4px, ${((bdg.paddingY ?? 6)  / REF_WIDTH) * 100}vw, 20px)`;
//   const badgePaddingX = `clamp(6px, ${((bdg.paddingX ?? 14) / REF_WIDTH) * 100}vw, 40px)`;

//   // ✅ Smart transform for badge too
//   const badgeRightEdge  = (bdg.x ?? 82) > 85;
//   const badgeLeftEdge   = (bdg.x ?? 82) < 15;
//   const badgeBottomEdge = (bdg.y ?? 22) > 85;
//   const badgeTopEdge    = (bdg.y ?? 22) < 15;

//   const badgeTransform = [
//     badgeRightEdge ? 'translateX(-100%)' : badgeLeftEdge ? 'translateX(0)' : 'translateX(-50%)',
//     badgeBottomEdge ? 'translateY(-100%)' : badgeTopEdge ? 'translateY(0)' : 'translateY(-50%)',
//   ].join(' ');

//   const badgeStyleObj = {
//     position: 'absolute',
//     left: `${bdg.x ?? 82}%`,
//     top: `${bdg.y ?? 22}%`,
//     transform: badgeTransform,
//     backgroundColor: bdg.bgColor || '#dc2626',
//     color: bdg.textColor || '#FFFFFF',
//     fontSize: badgeFontSize,
//     padding: `${badgePaddingY} ${badgePaddingX}`,
//     borderRadius: `${BADGE_RADIUS_VALUES[bdg.shape] ?? 9999}px`,
//     fontWeight: 'bold',
//     boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
//     zIndex: 15,
//     whiteSpace: 'nowrap',
//   };

//   // ==========================================
//   // OVERLAY — exact opacity
//   // ==========================================
//   const getOverlayStyle = () => {
//     const rawOpacity = Number(currentBanner.overlayOpacity ?? 30);
//     const alpha = Math.max(0, Math.min(1, rawOpacity / 100));

//     if (currentBanner.overlayType === 'Dark') {
//       return `rgba(0,0,0,${alpha})`;
//     }
//     if (currentBanner.overlayType === 'Light') {
//       return `rgba(255,255,255,${alpha})`;
//     }
//     return 'transparent';
//   };

//   return (
//     <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-4">
//       <div className="relative w-full h-[200px] md:h-[300px] lg:h-[400px] rounded-2xl overflow-hidden shadow-lg group">

//         {/* Image */}
//         <div
//           className={`absolute inset-0 transition-opacity duration-500 ${
//             isTransitioning ? 'opacity-0' : 'opacity-100'
//           }`}
//         >
//           <Image
//             src={currentBanner.image}
//             alt={currentBanner.altText || currentBanner.title || 'Banner'}
//             fill
//             sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1440px"
//             className="object-cover object-center"
//             priority={currentBannerIndex === 0}
//             unoptimized
//           />
//         </div>

//         {/* Overlay */}
//         <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: getOverlayStyle() }} />

//         {/* BADGE */}
//         {badgeEnabled && <div style={badgeStyleObj}>{bdg.text}</div>}

//         {/* BUTTON */}
//         <div
//           className="absolute z-10"
//           style={{
//             left: `${buttonX}%`,
//             top: `${buttonY}%`,
//             transform: buttonTransform,
//           }}
//         >
//           <Link
//             href={bannerLink}
//             className="inline-flex items-center justify-center gap-2 font-semibold hover:scale-105 hover:shadow-xl"
//             style={buttonStyleObj}
//           >
//             {buttonText}
//             {showArrow && <ChevronRight className="w-4 h-4" />}
//           </Link>
//         </div>

//         {/* Dots */}
//         {banners.length > 1 && (
//           <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
//             {banners.map((_, index) => (
//               <button
//                 key={index}
//                 onClick={() => goToBanner(index)}
//                 className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
//                   index === currentBannerIndex
//                     ? 'bg-white scale-125 shadow-md'
//                     : 'bg-white/50 hover:bg-white/80'
//                 }`}
//                 aria-label={`Go to banner ${index + 1}`}
//               />
//             ))}
//           </div>
//         )}

//         {/* Arrows */}
//         {banners.length > 1 && (
//           <>
//             <button
//               onClick={prevBanner}
//               className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-sm transition-all hover:scale-110 z-10 opacity-0 group-hover:opacity-100"
//               aria-label="Previous banner"
//             >
//               <ChevronLeft className="w-5 h-5" />
//             </button>
//             <button
//               onClick={nextBanner}
//               className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-sm transition-all hover:scale-110 z-10 opacity-0 group-hover:opacity-100"
//               aria-label="Next banner"
//             >
//               <ChevronRight className="w-5 h-5" />
//             </button>
//           </>
//         )}

//         {/* Counter */}
//         {banners.length > 1 && (
//           <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full z-10">
//             {currentBannerIndex + 1} / {banners.length}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }












//  new version 6/10/2026
// components/Banner.js
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const BUTTON_SIZE_PRESETS = {
  Small:  { paddingX: 16, paddingY: 8,  fontSize: 13, minWidth: 100 },
  Medium: { paddingX: 24, paddingY: 12, fontSize: 15, minWidth: 130 },
  Large:  { paddingX: 32, paddingY: 16, fontSize: 17, minWidth: 170 },
};

const BUTTON_RADIUS_VALUES = { none: 0, sm: 4, md: 8, lg: 12, full: 9999 };
const BADGE_RADIUS_VALUES  = { pill: 9999, rounded: 8, square: 0 };
const REF_WIDTH = 1440;

// ✅ Edge-aware anchor helper
// Returns a translate value that keeps the element fully visible:
//   pos < 45  → anchor LEFT/TOP edge at pos%
//   pos > 55  → anchor RIGHT/BOTTOM edge at pos%
//   else      → center
function edgeAnchor(pos, axis) {
  const t = axis === 'x' ? 'translateX' : 'translateY';
  if (pos < 45) return `${t}(0)`;
  if (pos > 55) return `${t}(-100%)`;
  return `${t}(-50%)`;
}

export default function Banner() {
  const [banners, setBanners] = useState([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/banners/active`, { withCredentials: true });
        const bannerData = Array.isArray(res.data) ? res.data : res.data.banners || res.data.data || [];
        const activeBanners = bannerData.filter(b => b.image && b.isActive !== false);
        activeBanners.sort((a, b) => (a.order || 0) - (b.order || 0));
        console.log('✅ Banners loaded:', activeBanners);
        setBanners(activeBanners);
      } catch (err) {
        console.error('❌ Error fetching banners:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setCurrentBannerIndex(prev => (prev + 1) % banners.length);
      setTimeout(() => setIsTransitioning(false), 500);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const nextBanner = useCallback(() => {
    if (!banners.length) return;
    setIsTransitioning(true);
    setCurrentBannerIndex(prev => (prev + 1) % banners.length);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [banners.length]);

  const prevBanner = useCallback(() => {
    if (!banners.length) return;
    setIsTransitioning(true);
    setCurrentBannerIndex(prev => (prev - 1 + banners.length) % banners.length);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [banners.length]);

  const goToBanner = (index) => {
    setIsTransitioning(true);
    setCurrentBannerIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const getBannerLink = (banner) => {
    switch (banner.linkType) {
      case 'Category': {
        const name = banner.categoryId?.name;
        return name ? `/products?category=${encodeURIComponent(name)}` : '/products';
      }
      case 'Product': {
        const slug = banner.productId?.slug;
        const id = banner.productId?._id || banner.productId;
        return slug ? `/products/${slug}` : id ? `/products/${id}` : '/products';
      }
      case 'Custom URL': return banner.customUrl || '/products';
      default: return '/products';
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-4">
        <div className="w-full h-[200px] md:h-[300px] lg:h-[400px] bg-gray-100 animate-pulse rounded-2xl" />
      </div>
    );
  }

  if (error || banners.length === 0) return null;

  const currentBanner = banners[currentBannerIndex];
  const bannerLink = getBannerLink(currentBanner);

  // BUTTON
  const btn = currentBanner.button || {};
  const buttonText      = btn.text || 'Shop Now';
  const buttonSize      = btn.size || 'Medium';
  const buttonStyle     = btn.style || 'Solid';
  const buttonBg        = btn.bgColor || '#0f5a2e';
  const buttonTextColor = btn.textColor || '#ffffff';
  const buttonRadiusKey = btn.borderRadius || 'md';
  const showArrow       = btn.showArrow !== false;

  const hasXY = typeof btn.x === 'number' && typeof btn.y === 'number';
  const buttonX = hasXY ? btn.x : 50;
  const buttonY = hasXY ? btn.y : 50;

  const buttonTransform = `${edgeAnchor(buttonX, 'x')} ${edgeAnchor(buttonY, 'y')}`;

  const resolvedSize = (() => {
    if (buttonSize === 'Custom') {
      const w = btn.width ?? 160;
      const h = btn.height ?? 48;
      return {
        isCustom: true,
        width:  `clamp(70px, ${(w / REF_WIDTH) * 100}vw, 400px)`,
        height: `clamp(32px, ${(h / REF_WIDTH) * 100}vw, 120px)`,
        fontSize: `clamp(11px, ${(15 / REF_WIDTH) * 100}vw, 22px)`,
      };
    }
    const p = BUTTON_SIZE_PRESETS[buttonSize] || BUTTON_SIZE_PRESETS.Medium;
    return {
      isCustom: false,
      padding: `${p.paddingY}px ${p.paddingX}px`,
      fontSize: `clamp(11px, ${(p.fontSize / REF_WIDTH) * 100}vw, 20px)`,
      minWidth: `${p.minWidth}px`,
    };
  })();

  const buttonRadiusPx = BUTTON_RADIUS_VALUES[buttonRadiusKey] ?? 8;

  const getButtonStyleObj = () => {
    const base = { color: buttonTextColor, borderRadius: `${buttonRadiusPx}px`, transition: 'all 0.3s ease' };
    if (buttonStyle === 'Solid')   return { ...base, backgroundColor: buttonBg, border: 'none' };
    if (buttonStyle === 'Outline') return { ...base, backgroundColor: 'transparent', border: `2px solid ${buttonTextColor}` };
    return { ...base, backgroundColor: 'rgba(255,255,255,0.15)', border: 'none', backdropFilter: 'blur(8px)' };
  };

  const buttonStyleObj = {
    ...getButtonStyleObj(),
    ...(resolvedSize.isCustom
      ? { width: resolvedSize.width, height: resolvedSize.height, fontSize: resolvedSize.fontSize }
      : { padding: resolvedSize.padding, fontSize: resolvedSize.fontSize, minWidth: resolvedSize.minWidth }),
  };

  // BADGE
  const bdg = currentBanner.badge || {};
  const badgeEnabled = bdg.enabled === true && !!bdg.text;
  const bx = bdg.x ?? 82;
  const by = bdg.y ?? 22;

  const badgeTransform = `${edgeAnchor(bx, 'x')} ${edgeAnchor(by, 'y')}`;

  const badgeStyleObj = {
    position: 'absolute',
    left: `${bx}%`,
    top: `${by}%`,
    transform: badgeTransform,
    backgroundColor: bdg.bgColor || '#dc2626',
    color: bdg.textColor || '#FFFFFF',
    fontSize: `clamp(12px, ${((bdg.fontSize ?? 14) / REF_WIDTH) * 100}vw, 40px)`,
    padding: `clamp(4px, ${((bdg.paddingY ?? 6) / REF_WIDTH) * 100}vw, 20px) clamp(6px, ${((bdg.paddingX ?? 14) / REF_WIDTH) * 100}vw, 40px)`,
    borderRadius: `${BADGE_RADIUS_VALUES[bdg.shape] ?? 9999}px`,
    fontWeight: 'bold',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
    zIndex: 15,
    whiteSpace: 'nowrap',
  };

  const getOverlayStyle = () => {
    const alpha = Math.max(0, Math.min(1, Number(currentBanner.overlayOpacity ?? 30) / 100));
    if (currentBanner.overlayType === 'Dark')  return `rgba(0,0,0,${alpha})`;
    if (currentBanner.overlayType === 'Light') return `rgba(255,255,255,${alpha})`;
    return 'transparent';
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-4">
      <div className="relative w-full h-[200px] md:h-[300px] lg:h-[400px] rounded-2xl overflow-hidden shadow-lg group">

        <div className={`absolute inset-0 transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          <Image
            src={currentBanner.image}
            alt={currentBanner.altText || currentBanner.title || 'Banner'}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1440px"
            className="object-cover object-center"
            priority={currentBannerIndex === 0}
            unoptimized
          />
        </div>

        <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: getOverlayStyle() }} />

        {badgeEnabled && <div style={badgeStyleObj}>{bdg.text}</div>}

        <div className="absolute z-10" style={{ left: `${buttonX}%`, top: `${buttonY}%`, transform: buttonTransform }}>
          <Link
            href={bannerLink}
            className="inline-flex items-center justify-center gap-2 font-semibold hover:scale-105 hover:shadow-xl"
            style={buttonStyleObj}
          >
            {buttonText}
            {showArrow && <ChevronRight className="w-4 h-4" />}
          </Link>
        </div>

        {banners.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToBanner(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === currentBannerIndex ? 'bg-white scale-125 shadow-md' : 'bg-white/50 hover:bg-white/80'}`}
                aria-label={`Go to banner ${index + 1}`}
              />
            ))}
          </div>
        )}

        {banners.length > 1 && (
          <>
            <button onClick={prevBanner}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-sm transition-all hover:scale-110 z-10 opacity-0 group-hover:opacity-100"
              aria-label="Previous banner">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={nextBanner}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-sm transition-all hover:scale-110 z-10 opacity-0 group-hover:opacity-100"
              aria-label="Next banner">
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {banners.length > 1 && (
          <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full z-10">
            {currentBannerIndex + 1} / {banners.length}
          </div>
        )}
      </div>
    </div>
  );
}