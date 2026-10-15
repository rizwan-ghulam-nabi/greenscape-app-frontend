// app/new-arrivals/page.js
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Gift, Loader2, ArrowRight, Sparkles } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const CARD_TRANSFORM = 'w_400,h_400,c_fill,g_auto,q_auto:good,f_auto';

const optimizeImage = (url) => {
  if (!url || typeof url !== 'string') return url;
  if (!url.includes('res.cloudinary.com')) return url;
  if (/\/upload\/[a-z]_/.test(url)) return url;
  return url.replace('/upload/', `/upload/${CARD_TRANSFORM}/`);
};

export default function NewArrivalsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/public/products`);
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        const all = data.products || data.data || [];
        // Sort by newest first (assuming createdAt exists)
        const sorted = [...all].sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
        setProducts(sorted.slice(0, 24));
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
      <section className="bg-gradient-to-br from-emerald-600 to-[#2B7A4B] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Fresh In</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">New Arrivals</h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            The latest plants, tools, and garden essentials added to our store.
          </p>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Just Landed {products.length > 0 && `(${products.length})`}
          </h2>
          <Link
            href="/products"
            className="text-sm text-[#2B7A4B] font-semibold hover:underline flex items-center gap-1"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-[#2B7A4B] animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No new arrivals yet
            </h3>
            <p className="text-gray-500 mb-6">Check back soon.</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#2B7A4B] text-white rounded-xl font-medium hover:bg-[#23663e]"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((product) => (
              <Link
                key={product._id}
                href={`/products/${product.slug || product._id}`}
                className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
              >
                <div className="relative w-full aspect-square bg-[#F8F9F6] overflow-hidden">
                  <div className="absolute top-2 left-2 z-10 bg-[#2B7A4B] text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> NEW
                  </div>
                  <Image
                    src={optimizeImage(product.image || '/placeholder-product.jpg')}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-3 md:p-4">
                  <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mb-2 min-h-[2.5em] group-hover:text-[#2B7A4B] transition-colors">
                    {product.name}
                  </h3>
                  <span className="text-lg font-bold text-[#2B7A4B]">
                    Rs. {product.price?.toLocaleString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}