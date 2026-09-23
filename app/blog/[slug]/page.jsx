// app/blog/[slug]/page.jsx - COMPLETE FIXED
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Calendar, Clock, Eye, Share2, 
  Heart, Bookmark, Tag, User, ChevronRight,
  Loader2, MessageCircle, Link2, Home,
  ExternalLink, Globe, Mail, Copy, Check,
  BookOpen
} from 'lucide-react';
import { FacebookIcon, TwitterIcon, LinkedinIcon, InstagramIcon } from '@/components/SocialIcons';
import { getPostBySlug, getRelatedPosts, getPopularPosts } from '../../lib/blogApi';
import BlogCard from '@/components/BlogCard';

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug;

  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [commentName, setCommentName] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [copied, setCopied] = useState(false);

  // Fetch post
  const fetchPost = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getPostBySlug(slug);
      
      if (response?.post) {
        setPost(response.post);
        document.title = `${response.post.title} | GreenScape Blog`;
        
        // Fetch related posts
        const relatedResponse = await getRelatedPosts(response.post._id, 3);
        if (relatedResponse?.posts) {
          setRelatedPosts(relatedResponse.posts);
        }
      } else {
        setError('Post not found');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load blog post.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch popular posts
  const fetchPopularPosts = async () => {
    const response = await getPopularPosts(4);
    if (response?.posts) {
      setPopularPosts(response.posts);
    }
  };

  // Load post on slug change
  useEffect(() => {
    if (slug) {
      fetchPost();
      fetchPopularPosts();
    }
  }, [slug]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Calculate reading time
  const getReadingTime = (content) => {
    if (!content) return '2 min read';
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  // Handle share
  const handleShare = async (platform = 'copy') => {
    const url = window.location.href;
    const title = post.title;

    try {
      switch (platform) {
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
          break;
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
          break;
        case 'linkedin':
          window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
          break;
        case 'copy':
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
          break;
        default:
          if (navigator.share) {
            await navigator.share({
              title: title,
              text: post.excerpt,
              url: url
            });
          } else {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }
      }
      setShowShareMenu(false);
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  // Handle comment submission
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    
    if (!commentName.trim() || !commentText.trim()) {
      return;
    }

    const newComment = {
      id: Date.now(),
      name: commentName,
      email: commentEmail,
      text: commentText,
      date: new Date().toISOString()
    };

    setComments([...comments, newComment]);
    setCommentText('');
    setCommentName('');
    setCommentEmail('');
    
    alert('Comment posted successfully!');
  };

// Loading state - FIXED GARDEN BOOK
if (loading ) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <div className="text-center">
        <div className="relative mx-auto w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-green-200 border-t-green-600 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <p className="mt-4 text-gray-600 font-medium">Loading articles...</p>
      </div>
    </div>
  );
}
 

  // Error state
  if (error || !post) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md px-4">
          <div className="text-6xl mb-4">📚</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {error || 'Post not found'}
          </h1>
          <p className="text-gray-600 mb-8">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium hover:from-green-700 hover:to-emerald-700 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-green-50/30">
      
      {/* ========== BREADCRUMB ========== */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="flex items-center gap-1 hover:text-green-600 transition-colors">
              <Home className="w-3.5 h-3.5" />
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            <Link href="/blog" className="hover:text-green-600 transition-colors">
              Blog
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            <span className="text-gray-900 font-medium line-clamp-1">
              {post.title}
            </span>
          </nav>
        </div>
      </div>

      {/* ========== ARTICLE HEADER ========== */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Category */}
          {post.category && (
            <div className="mb-4">
              <span className="px-4 py-1.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-semibold rounded-full shadow-lg">
                {post.category}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-lg text-gray-600 font-medium mb-8 border-l-4 border-green-500 pl-4 italic">
            {post.excerpt}
          </p>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            {/* Author */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-white">
                  {post.author?.firstName?.[0] || 'A'}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {post.author?.firstName || 'Admin'} {post.author?.lastName || ''}
                </p>
                <p className="text-xs text-gray-400">Author</p>
              </div>
            </div>

            <span className="text-gray-300">|</span>

            {/* Date */}
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post.createdAt)}</span>
            </div>

            <span className="text-gray-300">|</span>

            {/* Reading Time */}
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{getReadingTime(post.content)}</span>
            </div>

            {post.views > 0 && (
              <>
                <span className="text-gray-300">|</span>
                <div className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  <span>{post.views} views</span>
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-100">
            {/* Like Button */}
            <button
              onClick={() => setLiked(!liked)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                liked ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-gray-50 text-gray-600 border border-gray-200'
              }`}
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
              {liked ? 'Liked' : 'Like'}
            </button>

            {/* Bookmark Button */}
            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                bookmarked ? 'bg-yellow-50 text-yellow-600 border border-yellow-200' : 'bg-gray-50 text-gray-600 border border-gray-200'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
              {bookmarked ? 'Bookmarked' : 'Bookmark'}
            </button>

            {/* Share Button */}
            <div className="relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 transition-all duration-300"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>

              {/* DECENT SHARE DROPDOWN */}
        {showShareMenu && (
  <div className="absolute top-12 right-0 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-50 min-w-[300px]">
    <div className="text-sm font-semibold text-gray-500 mb-3 px-2">
      Share this article
    </div>
    <div className="space-y-1">
      <button
        onClick={() => handleShare('facebook')}
        className="flex items-center gap-3 w-full px-3 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-all duration-300 group"
      >
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300">
          <FacebookIcon className="w-5 h-5" />
        </div>
        <span className="font-medium text-base">Facebook</span>
      </button>
      <button
        onClick={() => handleShare('twitter')}
        className="flex items-center gap-3 w-full px-3 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-400 rounded-xl transition-all duration-300 group"
      >
        <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300">
          <TwitterIcon className="w-5 h-5" />
        </div>
        <span className="font-medium text-base">Twitter</span>
      </button>
      <button
        onClick={() => handleShare('linkedin')}
        className="flex items-center gap-3 w-full px-3 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-all duration-300 group"
      >
        <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300">
          <LinkedinIcon className="w-5 h-5" />
        </div>
        <span className="font-medium text-base">LinkedIn</span>
      </button>
      <div className="border-t border-gray-100 my-2"></div>
      <button
        onClick={() => handleShare('copy')}
        className="flex items-center gap-3 w-full px-3 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-all duration-300 group"
      >
        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-gray-200 group-hover:scale-110 transition-all duration-300">
          {copied ? <Check className="w-5 h-5 text-green-600" /> : <Link2 className="w-5 h-5 text-gray-600" />}
        </div>
        <span className="font-medium text-base">{copied ? 'Copied!' : 'Copy Link'}</span>
      </button>
    </div>
  </div>
)}    
  

            </div>
          </div>
        </div>
      </header>

      {/* ========== FEATURED IMAGE ========== */}
      {post.image && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </div>
      )}

      {/* ========== ARTICLE CONTENT ========== */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 md:p-12">
          {/* Content */}
          <div className="prose prose-lg max-w-none">
            {post.content.split('\n').map((paragraph, index) => (
              <p key={index} className="text-gray-700 mb-6 leading-relaxed text-lg">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="w-5 h-5 text-green-600" />
                <h3 className="text-sm font-semibold text-gray-900">Tags:</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${tag}`}
                    className="px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm hover:bg-green-100 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Share Section */}
          <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Found this helpful? Share with others!
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleShare('facebook')}
                className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center hover:bg-blue-100 hover:scale-110 transition-all duration-300"
              >
                <FacebookIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleShare('twitter')}
                className="w-10 h-10 bg-blue-50 text-blue-400 rounded-full flex items-center justify-center hover:bg-blue-100 hover:scale-110 transition-all duration-300"
              >
                <TwitterIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleShare('linkedin')}
                className="w-10 h-10 bg-blue-50 text-blue-700 rounded-full flex items-center justify-center hover:bg-blue-100 hover:scale-110 transition-all duration-300"
              >
                <LinkedinIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleShare('copy')}
                className="w-10 h-10 bg-gray-50 text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-100 hover:scale-110 transition-all duration-300"
              >
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Link2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Author Bio */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 p-6 mt-8 flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-2xl font-bold text-white">
              {post.author?.firstName?.[0] || 'A'}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {post.author?.firstName || 'Admin'} {post.author?.lastName || ''}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Plant enthusiast and gardening expert at GreenScape. Sharing tips and knowledge to help you grow beautiful plants.
            </p>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-8">
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4"
          >
            <MessageCircle className="w-5 h-5 text-green-600" />
            Comments ({comments.length})
          </button>

          {showComments && (
            <>
              {/* Comment Form */}
              <form onSubmit={handleCommentSubmit} className="mb-6 bg-gray-50 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                  Leave a Comment
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <input
                    type="text"
                    value={commentName}
                    onChange={(e) => setCommentName(e.target.value)}
                    placeholder="Your Name *"
                    className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                  <input
                    type="email"
                    value={commentEmail}
                    onChange={(e) => setCommentEmail(e.target.value)}
                    placeholder="Your Email"
                    className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write your comment... *"
                  rows="3"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 mb-3"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg text-sm font-medium hover:from-green-700 hover:to-emerald-700 transition-all"
                >
                  Post Comment
                </button>
              </form>

              {/* Comments List */}
              {comments.length > 0 ? (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3 bg-gray-50 rounded-xl p-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-white">
                          {comment.name[0].toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-semibold text-gray-900">{comment.name}</p>
                          <span className="text-xs text-gray-400">
                            • {formatDate(comment.date)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No comments yet. Be the first to comment!</p>
              )}
            </>
          )}
        </div>
      </main>

      {/* ========== RELATED POSTS ========== */}
      {relatedPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Related Articles
            </h2>
            <Link
              href="/blog"
              className="text-sm font-medium text-green-600 hover:text-green-700 flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <BlogCard key={relatedPost._id} post={relatedPost} />
            ))}
          </div>
        </section>
      )}

      {/* ========== POPULAR POSTS ========== */}
      {popularPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative">
              <h2 className="text-2xl font-bold text-white mb-6">
                Popular Articles
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {popularPosts.map((popularPost, index) => (
                  <Link
                    key={popularPost._id}
                    href={`/blog/${popularPost.slug}`}
                    className="group bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all duration-300"
                  >
                    <span className="text-3xl font-bold text-white/30 group-hover:text-white/50 transition-colors">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-sm font-medium text-white mt-2 line-clamp-2">
                      {popularPost.title}
                    </h3>
                    <p className="text-xs text-green-200 mt-2">
                      {formatDate(popularPost.createdAt)}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========== BACK TO BLOG ========== */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all articles
        </Link>
      </div>
    </div>
  );
}