// components/BlogCard.jsx - COMPACT VERSION
'use client';

import Link from 'next/link';
import { Calendar, Eye, ArrowRight, Clock } from 'lucide-react';

export default function BlogCard({ post, index = 0, viewMode = 'grid' }) {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getReadingTime = (content) => {
    if (!content) return '2 min read';
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Plant Care': 'bg-green-500',
      'Indoor Plants': 'bg-teal-500',
      'Outdoor Plants': 'bg-lime-500',
      'Gardening Tips': 'bg-emerald-500',
      'DIY & Decor': 'bg-amber-500',
      'Succulents': 'bg-purple-500',
      'Fertilizers & Soil': 'bg-orange-500',
      'Pest Control': 'bg-red-500',
      'Seasonal Care': 'bg-blue-500',
      'Sustainable Living': 'bg-cyan-500',
    };
    return colors[category] || 'bg-green-500';
  };

  // List view layout
  if (viewMode === 'list') {
    return (
      <article className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col md:flex-row">
        {/* Image - Smaller */}
        <Link href={`/blog/${post.slug}`} className="relative md:w-56 md:h-auto h-40 overflow-hidden flex-shrink-0">
          {post.image ? (
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center">
              <span className="text-4xl">🌿</span>
            </div>
          )}
          
          {/* Category Badge */}
          {post.category && (
            <div className="absolute top-2 left-2">
              <span className={`px-2 py-0.5 ${getCategoryColor(post.category)} text-white text-xs font-semibold rounded-full`}>
                {post.category}
              </span>
            </div>
          )}
        </Link>

        {/* Content - More compact */}
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex-1">
            <h2 className="text-base font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-green-600 transition-colors">
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </h2>
            
            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
              {post.excerpt}
            </p>
          </div>

          {/* Footer - Compact */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(post.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {getReadingTime(post.content)}
              </span>
              {post.views > 0 && (
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {post.views}
                </span>
              )}
            </div>

            <Link
              href={`/blog/${post.slug}`}
              className="text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
            >
              Read More
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  // Grid view layout - Compact
  return (
    <article className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      
      {/* Image - Smaller */}
      <Link href={`/blog/${post.slug}`} className="block relative h-48 overflow-hidden">
        {post.image ? (
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center">
            <span className="text-5xl">🌿</span>
          </div>
        )}

        {/* Category Badge */}
        {post.category && (
          <div className="absolute top-2 left-2">
            <span className={`px-2 py-0.5 ${getCategoryColor(post.category)} text-white text-xs font-semibold rounded-full`}>
              {post.category}
            </span>
          </div>
        )}
      </Link>

      {/* Content - Compact */}
      <div className="p-4">
        <h2 className="text-base font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-green-600 transition-colors">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h2>
        
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {post.excerpt}
        </p>

        {/* Footer - Compact */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(post.createdAt)}
            </span>
          </div>

          <Link
            href={`/blog/${post.slug}`}
            className="text-xs text-green-600 hover:text-green-700 font-semibold flex items-center gap-1"
          >
            Read More
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </article>
  );
}