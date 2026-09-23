// app/components/ProductReviews.jsx
'use client';

import { useEffect, useState } from 'react';
import { Star, ThumbsUp, User, CheckCircle, Loader2, X, Leaf } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function ProductReviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [breakdown, setBreakdown] = useState({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({ rating: 5, title: '', comment: '' });
  const [hoverRating, setHoverRating] = useState(0);

  // ==========================================
  // ✅ Fetch reviews (public)
  // ==========================================
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/reviews/product/${productId}`, {
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        console.log('📥 Reviews fetched:', data.reviews);
        setReviews(data.reviews || []);
        setAverageRating(data.averageRating || 0);
        setBreakdown(data.breakdown || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // ✅ Check if user can review
  // ==========================================
  const checkReviewPermission = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/reviews/can-review/${productId}`, {
        credentials: 'include',
      });

      if (res.status === 401) {
        setCanReview(false);
        setHasReviewed(false);
        return;
      }

      const data = await res.json();
      if (data.success) {
        setHasReviewed(data.hasReviewed);
        setCanReview(data.canReview);
        setHasPurchased(data.hasPurchased);
      }
    } catch (err) {
      console.error('Error checking review permission:', err);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchReviews();
      checkReviewPermission();
    }
  }, [productId]);

  // ==========================================
  // ✅ Submit review
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.comment.trim()) {
      setError('Please write a comment');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(`${API_BASE_URL}/api/reviews/product/${productId}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.status === 401) {
        throw new Error('Please login to write a review');
      }

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit review');
      }

      setSuccess('Review submitted! It will appear after admin approval. 🎉');
      setFormData({ rating: 5, title: '', comment: '' });
      setShowForm(false);
      setHasReviewed(true);
      setCanReview(false);
      await fetchReviews();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

 const handleHelpful = async (reviewId) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/reviews/${reviewId}/helpful`, {
      method: 'PUT',
      credentials: 'include',
    });

    const data = await res.json();

    // ❌ Not logged in
    if (res.status === 401) {
      alert('Please login to mark reviews as helpful');
      return;
    }

    // ❌ Already marked
    if (res.status === 400 && data.alreadyMarked) {
      alert('You have already marked this review as helpful');
      return;
    }

    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to mark helpful');
    }

    // ✅ Update the count
    setReviews((prev) =>
      prev.map((r) =>
        r._id === reviewId
          ? { ...r, helpful: data.helpful, hasUserMarked: true }
          : r
      )
    );
  } catch (err) {
    console.error(err);
    alert(err.message || 'Something went wrong');
  }
};

  const totalReviews = reviews.length;

  return (
    <div className="mt-12 border-t border-gray-200 pt-10">
      <h2 className="text-2xl font-bold text-[#021a12] mb-6">Customer Reviews</h2>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 bg-gray-50 rounded-2xl p-6">
        <div className="text-center md:border-r border-gray-200">
          <div className="text-5xl font-bold text-[#021a12] mb-2">
            {averageRating.toFixed(1)}
          </div>
          <div className="flex justify-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i <= Math.round(averageRating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500">
            Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="md:col-span-2 space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = breakdown[star] || 0;
            const pct = totalReviews ? (count / totalReviews) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-3 text-sm">
                <span className="w-8 text-gray-600">{star} ★</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-10 text-right text-gray-500">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* WRITE REVIEW */}
      <div className="mb-8">
        {!showForm && canReview && !hasReviewed && (
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-[#2B7A4B] text-white font-semibold rounded-xl hover:bg-[#1f5a37] transition-colors"
          >
            ✍️ Write a Review
          </button>
        )}

        {hasReviewed && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 text-sm">
            ✅ You have already reviewed this product. Thank you!
          </div>
        )}

        {!hasReviewed && !canReview && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 rounded-xl p-4 text-sm">
            🔐 Please <a href="/login" className="underline font-semibold">login</a> to write a review.
          </div>
        )}

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-[#021a12]">Write Your Review</h3>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Rating *
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <button
                    key={i}
                    type="button"
                    onMouseEnter={() => setHoverRating(i)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setFormData((f) => ({ ...f, rating: i }))}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        i <= (hoverRating || formData.rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title (optional)
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Beautiful plant!"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B7A4B]"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review *
              </label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData((f) => ({ ...f, comment: e.target.value }))}
                rows={4}
                placeholder="Share your experience with this product..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B7A4B] resize-none"
                required
              />
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#2B7A4B] text-white font-semibold rounded-xl hover:bg-[#1f5a37] transition-colors disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Review'
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {success && (
          <div className="mt-4 bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 text-sm">
            {success}
          </div>
        )}
      </div>

      {/* REVIEWS LIST */}
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-6 h-6 animate-spin text-[#2B7A4B]" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-2xl">
          <Star className="w-10 h-10 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No reviews yet. Be the first to review!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-11 h-11 bg-[#2B7A4B] rounded-full flex items-center justify-center text-white font-semibold shrink-0">
                  {review.name?.charAt(0)?.toUpperCase() || <User className="w-5 h-5" />}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Name + Verified badge */}
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-semibold text-[#021a12]">{review.name}</span>
                    {review.isVerifiedPurchase && (
                      <span className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                        <CheckCircle className="w-3 h-3" />
                        Verified Purchase
                      </span>
                    )}
                  </div>

                  {/* Rating + Date */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i <= review.rating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  {/* Title */}
                  {review.title && (
                    <h4 className="font-semibold text-[#021a12] mb-1">{review.title}</h4>
                  )}

                  {/* Comment */}
                  <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>

                  {/* ✅ ADMIN REPLY — visible to customers */}
                  {review.adminReply && review.adminReply.trim() !== '' && (
                    <div className="mt-3 bg-[#f0fdf4] border-l-4 border-[#2B7A4B] rounded-r-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Leaf className="w-3.5 h-3.5 text-[#2B7A4B]" />
                        <span className="text-xs font-semibold text-[#2B7A4B]">
                          GreenScape Response
                        </span>
                        {review.adminRepliedAt && (
                          <span className="text-[10px] text-gray-400">
                            · {new Date(review.adminRepliedAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {review.adminReply}
                      </p>
                    </div>
                  )}

                  {/* Helpful button */}
                  <button
                    onClick={() => handleHelpful(review._id)}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#2B7A4B] transition-colors"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    Helpful ({review.helpful || 0})
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}