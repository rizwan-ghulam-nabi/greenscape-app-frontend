// app/wishlist/page.js
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Heart, ShoppingCart, Trash2, ArrowLeft, Leaf,
  Star, Loader2, Share2, Check, ChevronRight,
} from 'lucide-react';
import { addToCart } from '@/app/utils/cart';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// ✅ Cloudinary transform for wishlist card images
const CARD_TRANSFORM = 'w_400,h_400,c_fill,g_auto,q_auto:good,f_auto';

const optimizeImage = (url) => {
  if (!url || typeof url !== 'string') return url;
  if (!url.includes('res.cloudinary.com')) return url;
  if (/\/upload\/[a-z]_/.test(url)) return url;
  return url.replace('/upload/', `/upload/${CARD_TRANSFORM}/`);
};

// ============================================================
// WISHLIST STORAGE HELPERS
// We store an array of product IDs (not full objects) so that
// product data always comes fresh from the API. This way prices,
// stock, and images stay accurate.
// ============================================================
const WISHLIST_KEY = 'greenscape_wishlist';

function getWishlistIds() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function setWishlistIds(ids) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(ids));
    window.dispatchEvent(new Event('wishlistUpdated'));
  } catch {}
}

// ============================================================
// EXPORTED HELPERS — used by other components
// ============================================================
export function addToWishlist(productId) {
  const ids = getWishlistIds();
  if (ids.includes(productId)) return false;
  setWishlistIds([...ids, productId]);
  return true;
}

export function removeFromWishlist(productId) {
  const ids = getWishlistIds();
  setWishlistIds(ids.filter((id) => id !== productId));
}

export function isInWishlist(productId) {
  return getWishlistIds().includes(productId);
}

export function getWishlistCount() {
  return getWishlistIds().length;
}

// ============================================================
// PAGE COMPONENT
// ============================================================
export default function WishlistPage() {
  const router = useRouter();

  const [wishlistIds, setWishlistIds] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [addingAll, setAddingAll] = useState(false);
  const [addedItems, setAddedItems] = useState({});

  // ============================================================
  // INITIAL LOAD — read IDs from localStorage, then fetch products
  // ============================================================
  useEffect(() => {
    const ids = getWishlistIds();
    setWishlistIds(ids);

    if (ids.length === 0) {
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/public/products`);
        if (!res.ok) throw new Error('Failed to load products');

        const data = await res.json();
        const allProducts = data.products || data.data || [];

        // Filter to only the IDs in wishlist
        const wishlistProducts = allProducts.filter((p) =>
          ids.includes(p._id || p.id)
        );

        setProducts(wishlistProducts);
      } catch (err) {
        console.error('Wishlist fetch error:', err);
        setError('Failed to load your wishlist. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ============================================================
  // REMOVE ITEM
  // ============================================================
  const handleRemove = (productId) => {
    removeFromWishlist(productId);
    setWishlistIds((prev) => prev.filter((id) => id !== productId));
    setProducts((prev) => prev.filter((p) => (p._id || p.id) !== productId));
  };

  // ============================================================
  // ADD SINGLE ITEM TO CART
  // ============================================================
  const handleAddToCart = (product) => {
    const productId = product._id || product.id;

    const productToAdd = {
      id: productId,
      name: product.name,
      desc: product.desc || product.description,
      price: product.price,
      originalPrice: product.oldPrice || null,
      image: product.image || product.images?.[0],
      category: product.category,
      stock: product.stock,
    };

    addToCart(productToAdd, 1);
    window.dispatchEvent(new Event('cartUpdated'));

    // Visual feedback
    setAddedItems((prev) => ({ ...prev, [productId]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [productId]: false }));
    }, 1500);
  };

  // ============================================================
  // ADD ALL TO CART
  // ============================================================
  const handleAddAllToCart = () => {
    if (products.length === 0) return;
    setAddingAll(true);

    products.forEach((product) => {
      if (product.stock === 0) return; // skip out-of-stock
      const productToAdd = {
        id: product._id || product.id,
        name: product.name,
        desc: product.desc || product.description,
        price: product.price,
        originalPrice: product.oldPrice || null,
        image: product.image || product.images?.[0],
        category: product.category,
        stock: product.stock,
      };
      addToCart(productToAdd, 1);
    });

    window.dispatchEvent(new Event('cartUpdated'));

    setTimeout(() => {
      setAddingAll(false);
    }, 800);
  };

  // ============================================================
  // SHARE WISHLIST (copy link)
  // ============================================================
  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback for older browsers
        const ta = document.createElement('textarea');
        ta.value = url;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  // ============================================================
  // COMPUTED VALUES
  // ============================================================
  const inStockCount = useMemo(
    () => products.filter((p) => p.stock > 0).length,
    [products]
  );

  const totalValue = useMemo(
    () => products.reduce((sum, p) => sum + (p.price || 0), 0),
    [products]
  );

  // ============================================================
  // LOADING STATE
  // ============================================================
  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#F8F9F6]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-[#2B7A4B] animate-spin" />
          <p className="text-sm text-gray-500">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  // ============================================================
  // EMPTY STATE
  // ============================================================
  if (wishlistIds.length === 0 || products.length === 0) {
    return (
      <div className="w-full min-h-screen bg-[#F8F9F6] pb-20">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-sm text-gray-500 mb-6"
          >
            <Link href="/" className="hover:text-[#2B7A4B]">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            <span className="text-[#2B7A4B] font-medium">Wishlist</span>
          </nav>

          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 rounded-full bg-white shadow-sm flex items-center justify-center mb-6">
              <Heart className="w-12 h-12 text-gray-300" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Your wishlist is empty
            </h1>
            <p className="text-gray-500 mb-8 max-w-md">
              Save your favorite plants and products here to buy them later.
              Tap the heart icon on any product to add it.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#2B7A4B] text-white rounded-xl font-semibold hover:bg-[#23663e] transition-colors shadow-md"
            >
              <Leaf className="w-4 h-4" />
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // MAIN WISHLIST
  // ============================================================
  return (
    <div className="w-full min-h-screen bg-[#F8F9F6] pb-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6">
        {/* ===== BREADCRUMB ===== */}
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-6"
        >
          <Link href="/" className="hover:text-[#2B7A4B]">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
          <span className="text-[#2B7A4B] font-medium">Wishlist</span>
        </nav>

        {/* ===== BACK BUTTON ===== */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#2B7A4B] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </Link>

        {/* ===== HEADER ===== */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#2B7A4B]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Heart className="w-6 h-6 text-[#2B7A4B] fill-[#2B7A4B]" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  My Wishlist
                </h1>
                <p className="text-sm text-gray-500">
                  {products.length} item{products.length !== 1 ? 's' : ''} saved
                  {inStockCount < products.length && (
                    <span className="text-amber-600">
                      {' '}· {products.length - inStockCount} out of stock
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleShare}
                aria-label="Copy wishlist link"
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    Share
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleAddAllToCart}
                disabled={addingAll || inStockCount === 0}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#2B7A4B] text-white rounded-lg text-sm font-semibold hover:bg-[#23663e] transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {addingAll ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    Add All to Cart ({inStockCount})
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Summary bar */}
          <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                Total Items
              </p>
              <p className="text-lg font-bold text-gray-900">
                {products.length}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                Available
              </p>
              <p className="text-lg font-bold text-[#2B7A4B]">
                {inStockCount}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                Total Value
              </p>
              <p className="text-lg font-bold text-gray-900">
                Rs. {totalValue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* ===== ERROR ===== */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* ===== PRODUCTS GRID ===== */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {products.map((product) => {
            const productId = product._id || product.id;
            const isAdded = addedItems[productId];
            const isOutOfStock = product.stock === 0;
            const hasDiscount =
              product.oldPrice && product.oldPrice > product.price;
            const discountPercent = hasDiscount
              ? Math.round(
                  ((product.oldPrice - product.price) / product.oldPrice) * 100
                )
              : 0;

            return (
              <div
                key={productId}
                className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col"
              >
                {/* ===== IMAGE ===== */}
                <div className="relative w-full aspect-square bg-[#F8F9F6] overflow-hidden">
                  <Link
                    href={`/products/${product.slug || productId}`}
                    aria-label={`View ${product.name}`}
                  >
                    <Image
                      src={optimizeImage(
                        product.image ||
                          product.images?.[0] ||
                          '/placeholder-product.jpg'
                      )}
                      alt={product.name || 'Product'}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

                  {/* Discount badge */}
                  {hasDiscount && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow">
                      -{discountPercent}%
                    </div>
                  )}

                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => handleRemove(productId)}
                    aria-label={`Remove ${product.name} from wishlist`}
                    className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-white transition-colors"
                  >
                    <Heart className="w-4 h-4 fill-current text-red-500" />
                  </button>

                  {/* Out of stock overlay */}
                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none">
                      <span className="px-3 py-1 bg-white text-red-600 text-xs font-semibold rounded-full">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                {/* ===== INFO ===== */}
                <div className="p-3 md:p-4 flex-1 flex flex-col">
                  {product.category && (
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                      {product.category}
                    </p>
                  )}

                  <Link
                    href={`/products/${product.slug || productId}`}
                    className="block"
                  >
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mb-1 group-hover:text-[#2B7A4B] transition-colors min-h-[2.5em]">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex text-[#FFB800]" aria-hidden="true">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(product.rating || 0)
                              ? 'fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-gray-400">
                      ({product.numReviews || 0})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mt-auto">
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-lg font-bold text-[#2B7A4B]">
                        Rs. {(product.price || 0).toLocaleString()}
                      </span>
                      {hasDiscount && (
                        <span className="text-xs text-gray-400 line-through">
                          Rs. {product.oldPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Add to cart button */}
                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      disabled={isOutOfStock || isAdded}
                      aria-label={`Add ${product.name} to cart`}
                      className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                        isAdded
                          ? 'bg-green-500 text-white'
                          : isOutOfStock
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-[#2B7A4B] text-white hover:bg-[#23663e]'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Added!
                        </>
                      ) : isOutOfStock ? (
                        <>
                          <ShoppingCart className="w-3.5 h-3.5" />
                          Out of Stock
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-3.5 h-3.5" />
                          Add to Cart
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ===== BOTTOM CTA ===== */}
        <div className="mt-12 bg-gradient-to-r from-[#2B7A4B] to-emerald-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-xl md:text-2xl font-bold mb-2">
            Looking for more green?
          </h3>
          <p className="text-white/80 mb-6 max-w-lg mx-auto text-sm">
            Explore our full collection of plants, tools, and garden essentials.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#2B7A4B] rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-md"
          >
            Browse All Products
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}