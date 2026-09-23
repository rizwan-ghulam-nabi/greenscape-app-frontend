'use client';

import Link from 'next/link';
import { Star, ShoppingCart, Leaf, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { addToCart } from '@/app/utils/cart';
import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:5000';

export default function BestSellers() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // ✅ CORRECT URL: /api/public/products/bestsellers
        const res = await fetch(`${API_BASE_URL}/api/public/products/bestsellers`);
        
        if (!res.ok) throw new Error('Failed to fetch products');
        
        const data = await res.json();
        setProducts(data.products || []);
        
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();

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

    addToCart(productToAdd, 1);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-[1440px] mx-auto py-12 bg-[#F8F9F6]">
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 text-[#2B7A4B] animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-[1440px] mx-auto py-12 bg-[#F8F9F6]">
        <div className="text-center py-12">
          <p className="text-gray-500">Failed to load products. Please try again.</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="w-full max-w-[1440px] mx-auto py-12 bg-[#F8F9F6]">
        <div className="text-center py-12">
          <Leaf className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No products available yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1440px] mx-auto xl:max-w-full py-12 bg-[#F8F9F6]">
      <div className="px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Shop Best Sellers
            </h2>
            <Leaf className="w-5 h-5 text-[#2B7A4B]" />
          </div>
          <Link 
            href="/products"
            className="text-[#2B7A4B] text-sm font-semibold hover:underline flex items-center gap-1 transition-colors"
          >
            View All Products
            <span className="text-lg">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 lg:gap-5">
          {products.map((product) => (
            <Link 
              key={product._id} 
              href={`/products/${product.slug || product._id}`}
              className="group bg-white rounded-xl p-4 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.1)] transition-all duration-300 cursor-pointer"
            >
              <div className="relative w-full aspect-square bg-[#F8F9F6] rounded-lg overflow-hidden mb-4">
                {product.isBestSeller && (
                  <div className="absolute top-2 left-2 bg-[#2B7A4B] text-white text-[10px] font-bold px-2.5 py-1 rounded-md z-10 shadow-sm uppercase tracking-wide">
                    Bestseller
                  </div>
                )}
                {product.oldPrice && product.oldPrice > product.price && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-md z-10 shadow-sm uppercase tracking-wide">
                    Sale
                  </div>
                )}
              <Image
             src={product.image || '/placeholder-product.jpg'}
        alt={product.name}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-500"
           />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-[15px] font-bold text-gray-900">
                  {product.name}
                </h3>
                <p className="text-[13px] text-gray-500">
                  {product.shortDesc || product.desc || ''}
                </p>
                <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-0.5">
                  <div className="flex text-[#FFB800]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating || 0) ? 'fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="text-gray-400 text-[11px]">({product.numReviews || 0})</span>
                </div>
                <div className="flex items-center justify-between pt-1.5">
                  <div>
                    <span className="text-[18px] font-bold text-gray-900">
                      Rs. {product.price?.toFixed(2) || '0.00'}
                    </span>
                    {product.oldPrice && (
                      <span className="ml-1 text-xs text-gray-400 line-through">
                        Rs. {product.oldPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={(e) => handleAddToCart(e, product)}
                    className="w-8 h-8 rounded-full border border-gray-200 text-[#2B7A4B] flex items-center justify-center hover:bg-[#2B7A4B] hover:text-white transition-all duration-200 group-hover:shadow-md"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}