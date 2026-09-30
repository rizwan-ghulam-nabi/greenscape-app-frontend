// app/wishlist/page.jsx - FIXED FOR COOKIES
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { 
  Heart, Trash2, ShoppingCart, ArrowRight, 
  Loader2, Plus, Minus, X, Check, Package,
  AlertCircle, Sparkles
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function WishlistPage() {
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [addingToCart, setAddingToCart] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch wishlist
  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(`${API_BASE_URL}/api/wishlist`, {
        withCredentials: true
      });

      if (res.data?.success) {
        setWishlistItems(res.data.items || []);
      }
    } catch (err) {
      console.error('Error fetching wishlist:', err);
      if (err.response?.status === 401) {
        router.push('/login?redirect=/wishlist');
      } else {
        setError('Failed to load wishlist. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Remove from wishlist
  const removeFromWishlist = async (productId) => {
    try {
      setRemovingId(productId);

      const res = await axios.delete(`${API_BASE_URL}/api/wishlist/${productId}`, {
        withCredentials: true
      });

      if (res.data?.success) {
        setWishlistItems(wishlistItems.filter(item => item._id !== productId));
        showSuccessMessage('Item removed from wishlist');
      }
    } catch (err) {
      console.error('Error removing item:', err);
      showSuccessMessage('Failed to remove item', 'error');
    } finally {
      setRemovingId(null);
    }
  };

  // Add to cart
  const addToCart = async (product) => {
    try {
      setAddingToCart(product._id);

      const res = await axios.post(`${API_BASE_URL}/api/cart`, {
        productId: product._id,
        quantity: 1
      }, {
        withCredentials: true
      });

      if (res.data?.success) {
        showSuccessMessage(`${product.name} added to cart!`);
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      showSuccessMessage('Failed to add to cart', 'error');
    } finally {
      setAddingToCart(null);
    }
  };

  // Clear all wishlist
  const clearWishlist = async () => {
    if (!confirm('Are you sure you want to clear your entire wishlist?')) return;

    try {
      const res = await axios.delete(`${API_BASE_URL}/api/wishlist`, {
        withCredentials: true
      });

      if (res.data?.success) {
        setWishlistItems([]);
        showSuccessMessage('Wishlist cleared');
      }
    } catch (err) {
      console.error('Error clearing wishlist:', err);
      showSuccessMessage('Failed to clear wishlist', 'error');
    }
  };

  // Show success message
  const showSuccessMessage = (message, type = 'success') => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setSuccessMessage('');
    }, 3000);
  };

  // Initial load
  useEffect(() => {
    fetchWishlist();
  }, []);

  // Format price
  const formatPrice = (price) => {
    return `$${Number(price || 0).toFixed(2)}`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full border-4 border-rose-200 border-t-rose-500 animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Heart className="w-8 h-8 text-rose-500" />
            </div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md px-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <button
            onClick={fetchWishlist}
            className="px-6 py-3 bg-rose-500 text-white rounded-xl font-medium hover:bg-rose-600 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/30 via-white to-pink-50/30">
      
      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg ${
            successMessage.includes('error') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'
          }`}>
            {successMessage.includes('error') ? (
              <AlertCircle className="w-5 h-5" />
            ) : (
              <Check className="w-5 h-5" />
            )}
            <span className="text-sm font-medium">{successMessage}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-rose-500 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                My Wishlist
              </h1>
              <p className="text-rose-100">
                {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved for later
              </p>
            </div>
            
            {wishlistItems.length > 0 && (
              <button
                onClick={clearWishlist}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-all"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Empty State */}
        {wishlistItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="relative mx-auto w-32 h-32 mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Heart className="w-16 h-16 text-rose-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Save your favorite products and they'll appear here. Start shopping and add items you love!
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-xl font-medium hover:from-rose-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
            >
              <ShoppingCart className="w-5 h-5" />
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            {/* Stats Bar */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Package className="w-4 h-4" />
                <span>{wishlistItems.length} items in your wishlist</span>
              </div>
              <span className="text-sm text-gray-400">
                Last updated just now
              </span>
            </div>

            {/* Wishlist Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistItems.map((item) => (
                <div
                  key={item._id}
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative"
                >
                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromWishlist(item._id)}
                    disabled={removingId === item._id}
                    className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-300 shadow-sm"
                  >
                    {removingId === item._id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                  </button>

                  {/* Product Image */}
                  <Link href={`/product/${item.slug || item._id}`} className="block relative h-48 overflow-hidden">
                    {item.images?.[0] || item.image ? (
                      <img
                        src={item.images?.[0] || item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">
                        <Package className="w-12 h-12 text-rose-300" />
                      </div>
                    )}

                    {/* Discount Badge */}
                    {item.discountPercentage > 0 && (
                      <span className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                        -{item.discountPercentage}%
                      </span>
                    )}

                    {/* Out of Stock Overlay */}
                    {item.stock === 0 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="px-3 py-1 bg-white text-red-600 text-sm font-semibold rounded-full">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </Link>

                  {/* Product Info */}
                  <div className="p-4">
                    {/* Category */}
                    {item.category && (
                      <span className="text-xs text-gray-400 uppercase tracking-wide">
                        {item.category}
                      </span>
                    )}

                    {/* Product Name */}
                    <Link href={`/product/${item.slug || item._id}`}>
                      <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-rose-500 transition-colors">
                        {item.name}
                      </h3>
                    </Link>

                    {/* Rating */}
                    {item.rating && (
                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-3.5 h-3.5 ${
                                star <= Math.round(item.rating)
                                  ? 'text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-xs text-gray-400">({item.reviews?.length || 0})</span>
                      </div>
                    )}

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-lg font-bold text-gray-900">
                        {formatPrice(item.price)}
                      </span>
                      {item.discountPercentage > 0 && (
                        <span className="text-sm text-gray-400 line-through">
                          {formatPrice(item.originalPrice || item.price * 1.2)}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => addToCart(item)}
                        disabled={addingToCart === item._id || item.stock === 0}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-lg text-sm font-medium hover:from-rose-600 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {addingToCart === item._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <ShoppingCart className="w-4 h-4" />
                        )}
                        Add to Cart
                      </button>
                      <Link
                        href={`/product/${item.slug || item._id}`}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="mt-12 flex items-center justify-between bg-white rounded-2xl border border-gray-100 p-6">
              <div>
                <p className="text-gray-600 mb-1">
                  Want to add more items?
                </p>
                <p className="text-sm text-gray-400">
                  Browse our collection and save your favorites
                </p>
              </div>
              <Link
                href="/shop"
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-xl font-medium hover:from-rose-600 hover:to-pink-700 transition-all duration-300"
              >
                Continue Shopping
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}