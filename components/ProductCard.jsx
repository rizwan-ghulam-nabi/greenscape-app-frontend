// components/ProductCard.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ShoppingCart, Heart, Zap, Loader2 } from 'lucide-react';
import { getProductDiscount } from '@/app/utils/discountApi';
import { addToCart } from '@/app/utils/cart';

export default function ProductCard({ product, viewMode = 'grid' }) {
  const [discount, setDiscount] = useState(null);
  const [finalPrice, setFinalPrice] = useState(product.price);
  const [savings, setSavings] = useState(0);
  const [loadingDiscount, setLoadingDiscount] = useState(true);
  const [added, setAdded] = useState(false);

  // ✅ Fetch discount
  useEffect(() => {
    const fetchDiscount = async () => {
      const productId = product._id || product.id;
      if (!productId) {
        setLoadingDiscount(false);
        return;
      }

      try {
        setLoadingDiscount(true);
        const data = await getProductDiscount(productId);

        if (data.success && data.hasDiscount) {
          setDiscount(data.discount);
          setFinalPrice(data.finalPrice || product.price);
          setSavings(data.savings || 0);
        }
      } catch (err) {
        console.error('Error fetching discount:', err);
      } finally {
        setLoadingDiscount(false);
      }
    };

    fetchDiscount();
  }, [product._id, product.id, product.price]);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const cartProduct = {
      id: product._id || product.id,
      name: product.name,
      desc: product.desc || product.description,
      price: finalPrice,
      originalPrice: product.price,
      image: product.image || product.images?.[0],
      category: product.category,
      stock: product.stock,
      discount: discount ? {
        code: discount.code,
        name: discount.name,
        value: discount.value,
        type: discount.type,
      } : null,
    };

    addToCart(cartProduct, 1);
    window.dispatchEvent(new Event('cartUpdated'));

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const savingsPercentage = discount
    ? discount.type === 'percentage'
      ? discount.value
      : Math.round((savings / product.price) * 100)
    : 0;

  // ========== LIST VIEW ==========
  if (viewMode === 'list') {
    return (
      <Link
        href={`/products/${product.slug || product._id}`}
        className="relative group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex gap-6 p-4"
      >
        <button className="absolute top-3 right-3 z-10 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors">
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
            src={product.image || '/placeholder-product.jpg'}
            alt={product.name}
            fill
            sizes="200px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        <div className="flex-1 space-y-2">
          <h3 className="text-[15px] font-bold text-gray-900">{product.name}</h3>
          <p className="text-[13px] text-gray-500">{product.desc || product.description}</p>
          <div className="flex items-center gap-1 text-[10px] text-gray-400">
            <div className="flex text-[#FFB800]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating || 0) ? 'fill-current' : 'text-gray-300'}`} />
              ))}
            </div>
            <span>({product.numReviews || 0})</span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              {loadingDiscount ? (
                <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
              ) : discount ? (
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
              ) : (
                <span className="text-[18px] font-bold text-gray-900">
                  Rs. {product.price?.toFixed(2) || '0.00'}
                </span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              className="w-8 h-8 rounded-full bg-[#2B7A4B]/10 text-[#2B7A4B] flex items-center justify-center hover:bg-[#2B7A4B] hover:text-white transition-all"
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
    <div className="relative group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 p-4">
      <button className="absolute top-3 right-3 z-10 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors">
        <Heart className="w-5 h-5" />
      </button>

      <Link href={`/products/${product.slug || product._id}`} className="block">
        {/* Image */}
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
            src={product.image || '/placeholder-product.jpg'}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Out of Stock */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="px-3 py-1 bg-white text-red-600 text-sm font-semibold rounded-full">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-1.5">
          <h3 className="text-[15px] font-bold text-gray-900 truncate">{product.name}</h3>
          <p className="text-[13px] text-gray-500 line-clamp-1">{product.desc || product.description || ''}</p>
          <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-0.5">
            <div className="flex text-[#FFB800]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating || 0) ? 'fill-current' : 'text-gray-300'}`} />
              ))}
            </div>
            <span>({product.numReviews || 0})</span>
          </div>

          {/* Price */}
          <div className="pt-1.5">
            {loadingDiscount ? (
              <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
            ) : discount ? (
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[18px] font-bold text-[#2B7A4B]">
                    Rs. {finalPrice.toFixed(2)}
                  </span>
                  <span className="text-[13px] text-gray-400 line-through">
                    Rs. {product.price?.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="text-red-600 font-bold">Save Rs. {savings.toFixed(2)}</span>
                  {discount.endDate && (
                    <span className="text-orange-500 font-medium">
                      • Ends {new Date(discount.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
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

      {/* Add to Cart */}
      <div className="flex items-center justify-between pt-3">
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold transition-all ${
            added
              ? 'bg-green-100 text-green-700'
              : product.stock === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-[#2B7A4B]/10 text-[#2B7A4B] hover:bg-[#2B7A4B] hover:text-white'
          }`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          {added ? 'Added!' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}