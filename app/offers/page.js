// app/offers/page.js
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Tag, Loader2, ArrowRight, Percent, Gift, Zap } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const CARD_TRANSFORM = 'w_400,h_400,c_fill,g_auto,q_auto:good,f_auto';

const optimizeImage = (url) => {
  if (!url || typeof url !== 'string') return url;
  if (!url.includes('res.cloudinary.com')) return url;
  if (/\/upload\/[a-z]_/.test(url)) return url;
  return url.replace('/upload/', `/upload/${CARD_TRANSFORM}/`);
};

export default function OffersPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/public/products`);
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        const all = data.products || data.data || [];
        // Show only discounted products
        const discounted = all.filter((p) => p.oldPrice && p.oldPrice > p.price);
        setProducts(discounted);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9F6] pb-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#2B7A4B] to-emerald-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
            <Tag className="w-4 h-4" />
            <span className="text-sm font-medium">Limited Time Offers</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Deals &amp; Discounts
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Save big on your favorite plants, tools, and garden essentials.
          </p>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="w-12 h-12 bg-[#2B7A4B]/10 rounded-full flex items-center justify-center mb-4">
              <Percent className="w-6 h-6 text-[#2B7A4B]" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Up to 40% OFF</h3>
            <p className="text-sm text-gray-500">On selected plants and gardening tools.</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="w-12 h-12 bg-[#2B7A4B]/10 rounded-full flex items-center justify-center mb-4">
              <Gift className="w-6 h-6 text-[#2B7A4B]" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Free Shipping</h3>
            <p className="text-sm text-gray-500">On orders over Rs. 2,000.</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="w-12 h-12 bg-[#2B7A4B]/10 rounded-full flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-[#2B7A4B]" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Flash Sales</h3>
            <p className="text-sm text-gray-500">New deals added every week.</p>
          </div>
        </div>

        {/* Products */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Active Deals {products.length > 0 && `(${products.length})`}
          </h2>
          <Link
            href="/products"
            className="text-sm text-[#2B7A4B] font-semibold hover:underline flex items-center gap-1"
          >
            View All Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-[#2B7A4B] animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No active deals right now
            </h3>
            <p className="text-gray-500 mb-6">Check back soon for new offers.</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#2B7A4B] text-white rounded-xl font-medium hover:bg-[#23663e]"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((product) => {
              const discount = Math.round(
                ((product.oldPrice - product.price) / product.oldPrice) * 100
              );
              return (
                <Link
                  key={product._id}
                  href={`/products/${product.slug || product._id}`}
                  className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
                >
                  <div className="relative w-full aspect-square bg-[#F8F9F6] overflow-hidden">
                    <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                      -{discount}%
                    </div>
                    <Image
                      src={optimizeImage(product.image || '/placeholder-product.jpg')}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-3 md:p-4 flex-1 flex flex-col">
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mb-2 min-h-[2.5em] group-hover:text-[#2B7A4B] transition-colors">
                      {product.name}
                    </h3>
                    <div className="mt-auto">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-[#2B7A4B]">
                          Rs. {product.price?.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-400 line-through">
                          Rs. {product.oldPrice?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}