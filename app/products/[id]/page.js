'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Star, ShoppingCart, Heart, Check, Truck, 
  Plus, Minus, Info, Loader2, ZoomIn 
} from 'lucide-react';

import { addToCart } from '@/app/utils/cart';
import ProductReviews from '../../../components/ProductReviews';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.id;
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('Description');
  const [isWishlist, setIsWishlist] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);
  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        
        // ✅ FIXED URL
        const res = await fetch(`http://localhost:5000/api/public/products/slug/${slug}`);
        
        if (!res.ok) {
          throw new Error('Product not found');
        }
        
        const data = await res.json();
        const productData = data.product || data;
        
        // ✅ DEBUG: Log all image-related fields
        console.log('📦 Product data:', {
          name: productData.name,
          image: productData.image,
          gallery: productData.gallery,
          images: productData.images,
          imageUrl: productData.imageUrl,
          thumbnail: productData.thumbnail,
        });
        
        // ✅ FIX: Get the correct image URL
        const mainImage = productData.image || 
          productData.imageUrl || 
          productData.images?.[0] || 
          '/placeholder-product.jpg';
        
        // ✅ FIX: Get gallery images
        const galleryImages = productData.gallery || 
          (productData.images && Array.isArray(productData.images) ? productData.images : []) || 
          (productData.imageGallery ? productData.imageGallery : []) || 
          [];
        
        console.log('✅ Main image:', mainImage);
        console.log('✅ Gallery images:', galleryImages);
        
        setProduct({
          ...productData,
          image: mainImage,
          gallery: galleryImages
        });
        setSelectedImage(mainImage);

        const storedHistory = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        if (productData) {
          const filteredHistory = storedHistory.filter(item => item._id !== productData._id);
          const updatedHistory = [productData, ...filteredHistory].slice(0, 6);
          localStorage.setItem('recentlyViewed', JSON.stringify(updatedHistory));
          setRecentlyViewed(updatedHistory);
        } else {
          setRecentlyViewed(storedHistory);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;

    const productToAdd = {
      id: product._id,
      name: product.name,
      desc: product.desc,
      price: product.price,
      originalPrice: product.oldPrice || null,
      image: product.image,
      category: product.category,
      tag: product.tag || null,
      stock: product.stock,
    };

    addToCart(productToAdd, quantity);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('cartUpdated'));
      alert(`${quantity} x ${product.name} added to cart!`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-[#2B7A4B] animate-spin" />
          <p className="text-gray-500">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Product Not Found</h1>
          <p className="text-gray-500 mt-2">The product you are looking for does not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white pb-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6">
        
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-6">
          <span className="text-gray-400">🏠</span>
          <span>Home</span>
          <span className="text-gray-300">/</span>
          <span>Plants</span>
          <span className="text-gray-300">/</span>
          <span className="text-[#2B7A4B] font-medium">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12 mb-12">
          
          {/* ===== LEFT COLUMN: IMAGE GALLERY ===== */}
          <div className="flex flex-col gap-4">
            
            {/* Main Image */}
            <div className="relative w-full aspect-square bg-[#F8F9F6] rounded-2xl overflow-hidden">
              {/* Tag */}
              {product.tag && (
                <div className={`absolute top-4 left-4 z-10 ${product.tag === 'Sale' ? 'bg-red-500' : 'bg-[#2B7A4B]'} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                  {product.tag}
                </div>
              )}
              
              {/* Wishlist Button */}
              <button 
                onClick={() => setIsWishlist(!isWishlist)}
                className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Heart className={`w-5 h-5 ${isWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
              </button>
              
              {/* Image */}
              <Image 
                src={selectedImage || product.image || '/placeholder-product.jpg'}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                priority
              />
            </div>

            {/* Thumbnail Gallery (if exists) */}
            {product.gallery && product.gallery.length > 0 && (
              <div className="flex gap-3 mt-4 overflow-x-auto scrollbar-hide">
                {/* Main image as first thumbnail */}
                <button 
                  onClick={() => setSelectedImage(product.image)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedImage === product.image ? 'border-[#2B7A4B]' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Image 
                    src={product.image || '/placeholder-product.jpg'}
                    alt={`${product.name} main`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </button>

                {/* Gallery images */}
                {product.gallery.map((img, index) => (
                  <button 
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                      selectedImage === img ? 'border-[#2B7A4B]' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Image 
                      src={img || '/placeholder-product.jpg'}
                      alt={`${product.name} gallery ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ===== RIGHT COLUMN: PRODUCT DETAILS ===== */}
          <div className="space-y-6">
            
            <div className="flex items-center gap-2 text-sm text-[#2B7A4B] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2B7A4B]"></span>
              Trusted by 50,000+ Gardeners
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{product.name}</h1>
              <p className="text-gray-500 text-base mt-1">{product.desc}</p>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex text-[#FFB800]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating || 0) ? 'fill-current' : 'text-gray-300'}`} />
                  ))}
                </div>
                <span className="text-sm text-gray-500">{product.rating || 0} ({product.numReviews || 0} reviews)</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-gray-900">Rs. {product.price?.toFixed(2) || '0.00'}</span>
              {product.oldPrice && product.oldPrice > product.price && (
                <>
                  <span className="text-lg text-gray-400 line-through">Rs. {product.oldPrice.toFixed(2)}</span>
                  <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded">
                    {Math.round((1 - product.price / product.oldPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-3">Quantity</h4>
              <div className="flex items-center">
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button onClick={() => setQuantity(prev => Math.max(1, prev - 1))} className="p-2 hover:bg-gray-50 text-gray-500 transition-colors">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-medium text-gray-900">{quantity}</span>
                  <button onClick={() => setQuantity(prev => prev + 1)} className="p-2 hover:bg-gray-50 text-gray-500 transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="ml-4 text-sm text-gray-500">{product.stock || 0} items in stock</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button 
                onClick={handleAddToCart}
                className="flex-1 py-3.5 bg-[#2B7A4B] text-white rounded-xl font-semibold text-base hover:bg-[#23663e] transition-colors"
              >
                <span className="flex items-center justify-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </span>
              </button>

              <button className="flex-1 py-3.5 bg-white text-[#1A3C34] border-2 border-[#1A3C34] rounded-xl font-semibold text-base hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <span className="text-lg">⚡</span>
                Buy Now
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="flex border-b border-gray-200 mb-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
            {['Description', 'Specifications', 'Care Guide'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-all duration-200 ${
                  activeTab === tab ? 'border-[#2B7A4B] text-[#2B7A4B]' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

        <div>
          <ProductReviews productId={product._id} />
        </div>

          <div className="text-gray-600 text-sm leading-relaxed space-y-4 py-4">
            <p className="text-base">
              The {product.name} is a stunning plant that adds a lush, exotic touch to any space. 
              Perfect for homes and offices, it&#39;s easy to care for and helps purify the air.
            </p>
            <ul className="space-y-2 pl-4 list-disc">
              <li>Large, glossy leaves with natural splits</li>
              <li>Improves indoor air quality</li>
              <li>Thrives in bright, indirect light</li>
              <li>Easy to grow and maintain</li>
            </ul>
          </div>
        </div>

        {recentlyViewed.length > 0 && (
          <div className="mt-12 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recently Viewed</h2>
              <Link href="/products" className="text-[#2B7A4B] text-sm font-medium hover:underline flex items-center gap-1">
                View All Products <span className="text-lg">→</span>
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {recentlyViewed.map((item) => (
                <Link 
                  key={item._id || item.id}
                  href={`/products/${item.slug || item._id}`}
                  className="group bg-white rounded-xl border border-gray-100 p-3 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                >
                  <div className="relative w-full aspect-square bg-[#F8F9F6] rounded-lg overflow-hidden mb-3">
                    <button className="absolute top-2 right-2 z-10 p-1 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      <Heart className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                    <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900 truncate">{item.name}</h4>
                  <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1">
                    <div className="flex text-[#FFB800]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-2.5 h-2.5 ${i < Math.floor(item.rating || 0) ? 'fill-current' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-bold text-gray-900">Rs. {(item.price || 0).toFixed(2)}</span>
                    <button className="text-[#2B7A4B] hover:text-[#23663e]">
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}