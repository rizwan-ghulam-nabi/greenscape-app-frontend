// app/blog/[slug]/page.jsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, ArrowRight, Calendar, Clock, Eye, Share2,
  Heart, Bookmark, Tag, ChevronRight,
  MessageCircle, Link2, Home,
  Mail, Check, BookOpen, X
} from 'lucide-react';
import { FacebookIcon, TwitterIcon, LinkedinIcon } from '@/components/SocialIcons';
import { getPostBySlug, getRelatedPosts, getPopularPosts } from '../../lib/blogApi';
import BlogCard from '@/components/BlogCard';

// ============================================================
// LOCALSTORAGE HELPERS
// ============================================================
const LIKED_KEY = 'greenscape_liked_posts';
const BOOKMARKED_KEY = 'greenscape_bookmarked_posts';

function getStored(key) {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(key);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function setStored(key, arr) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(arr));
  } catch {}
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug;

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

  const shareMenuRef = useRef(null);

  // ============================================================
  // RESTORE LIKE / BOOKMARK FROM LOCALSTORAGE
  // ============================================================
  useEffect(() => {
    if (!slug) return;
    setLiked(getStored(LIKED_KEY).includes(slug));
    setBookmarked(getStored(BOOKMARKED_KEY).includes(slug));
  }, [slug]);

  // ============================================================
  // FETCH POST + POPULAR POSTS
  // ============================================================
  useEffect(() => {
    if (!slug) return;

    let cancelled = false;

    const load = async () => {
      try {
        const [postRes, popularRes] = await Promise.all([
          getPostBySlug(slug),
          getPopularPosts(4),
        ]);

        if (cancelled) return;

        if (postRes?.post) {
          setPost(postRes.post);
          if (typeof document !== 'undefined') {
            document.title = `${postRes.post.title} | GreenScape Blog`;
          }
          getRelatedPosts(postRes.post._id, 3).then((r) => {
            if (!cancelled && r?.posts) setRelatedPosts(r.posts);
          });
        } else {
          setError('Post not found');
        }

        if (popularRes?.posts) setPopularPosts(popularRes.posts);
      } catch (err) {
        if (cancelled) return;
        console.error('Error loading post:', err);
        setError('Failed to load blog post.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [slug]);

  // ============================================================
  // CLOSE SHARE MENU ON OUTSIDE CLICK / ESC
  // ============================================================
  useEffect(() => {
    if (!showShareMenu) return;
    const onClick = (e) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(e.target)) {
        setShowShareMenu(false);
      }
    };
    const onEsc = (e) => e.key === 'Escape' && setShowShareMenu(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, [showShareMenu]);

  // ============================================================
  // HELPERS
  // ============================================================
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric',
    });
  };

  const getReadingTime = (content) => {
    if (!content) return '2 min read';
    const words = content.split(/\s+/).length;
    return `${Math.ceil(words / 200)} min read`;
  };

  const toggleLike = () => {
    if (!slug) return;
    const arr = getStored(LIKED_KEY);
    const next = liked
      ? arr.filter((s) => s !== slug)
      : [...new Set([...arr, slug])];
    setStored(LIKED_KEY, next);
    setLiked(!liked);
  };

  const toggleBookmark = () => {
    if (!slug) return;
    const arr = getStored(BOOKMARKED_KEY);
    const next = bookmarked
      ? arr.filter((s) => s !== slug)
      : [...new Set([...arr, slug])];
    setStored(BOOKMARKED_KEY, next);
    setBookmarked(!bookmarked);
  };

  const fallbackCopy = useCallback((text, cb) => {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      cb && cb();
    } catch (e) {
      console.warn('Copy failed:', e);
    }
  }, []);

  // ============================================================
  // SHARE
  // ============================================================
  const handleShare = (platform) => {
    if (!post) return;

    const url = typeof window !== 'undefined' ? window.location.href : '';
    const title = post.title || '';
    const text = `${title} — read more at GreenScape`;

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${text} ${url}`)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      reddit: `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
      email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${text}\n\n${url}`)}`,
    };

    if (platform === 'copy') {
      const done = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(url).then(done).catch(() => fallbackCopy(url, done));
      } else {
        fallbackCopy(url, done);
      }
      setShowShareMenu(false);
      return;
    }

    if (platform === 'native') {
      if (navigator.share) {
        navigator.share({ title, text, url }).catch(() => {});
      } else {
        fallbackCopy(url, () => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
      }
      setShowShareMenu(false);
      return;
    }

    const target = shareUrls[platform];
    if (!target) {
      setShowShareMenu(false);
      return;
    }

    const w = window.open(target, '_blank', 'noopener,noreferrer');
    if (!w || w.closed || typeof w.closed === 'undefined') {
      window.location.href = target;
    }
    setShowShareMenu(false);
  };

  // ============================================================
  // COMMENTS
  // ============================================================
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentName.trim() || !commentText.trim()) return;
    const newComment = {
      id: Date.now(),
      name: commentName,
      email: commentEmail,
      text: commentText,
      date: new Date().toISOString(),
    };
    setComments([...comments, newComment]);
    setCommentText('');
    setCommentName('');
    setCommentEmail('');
    alert('Comment posted successfully!');
  };

  // ============================================================
  // LOADING / ERROR
  // ============================================================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="text-center">
          <div className="relative mx-auto w-20 h-20">
            <div className="absolute inset-0 rounded-full border-4 border-green-200 border-t-green-600 animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md px-4">
          <div className="text-6xl mb-4">📚</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{error || 'Post not found'}</h1>
          <p className="text-gray-600 mb-8">
            The article you&rsquo;re looking for doesn&rsquo;t exist or has been removed.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium hover:from-green-700 hover:to-emerald-700 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const nativeShareAvailable =
    typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-green-50/30">

      {/* BREADCRUMB */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="flex items-center gap-1 hover:text-green-600">
              <Home className="w-3.5 h-3.5" /> Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            <Link href="/blog" className="hover:text-green-600">Blog</Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            <span className="text-gray-900 font-medium line-clamp-1">{post.title}</span>
          </nav>
        </div>
      </div>

      {/* HEADER */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {post.category && (
            <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-semibold rounded-full shadow-lg mb-4">
              {post.category}
            </span>
          )}
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>
          <p className="text-lg text-gray-600 font-medium mb-8 border-l-4 border-green-500 pl-4 italic">
            {post.excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-white">{post.author?.firstName?.[0] || 'A'}</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {post.author?.firstName || 'Admin'} {post.author?.lastName || ''}
                </p>
                <p className="text-xs text-gray-400">Author</p>
              </div>
            </div>
            <span className="text-gray-300">|</span>
            <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /><span>{formatDate(post.createdAt)}</span></div>
            <span className="text-gray-300">|</span>
            <div className="flex items-center gap-1.5"><Clock className="w-4 h-4" /><span>{getReadingTime(post.content)}</span></div>
            {post.views > 0 && (
              <>
                <span className="text-gray-300">|</span>
                <div className="flex items-center gap-1.5"><Eye className="w-4 h-4" /><span>{post.views} views</span></div>
              </>
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-100">
            <button
              onClick={toggleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 ${
                liked ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-gray-50 text-gray-600 border border-gray-200'
              }`}
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
              {liked ? 'Liked' : 'Like'}
            </button>

            <button
              onClick={toggleBookmark}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 ${
                bookmarked ? 'bg-yellow-50 text-yellow-600 border border-yellow-200' : 'bg-gray-50 text-gray-600 border border-gray-200'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
              {bookmarked ? 'Bookmarked' : 'Bookmark'}
            </button>

            <div className="relative" ref={shareMenuRef}>
              <button
                onClick={() => setShowShareMenu((v) => !v)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 transition-all duration-300"
                aria-haspopup="menu"
                aria-expanded={showShareMenu}
              >
                <Share2 className="w-4 h-4" /> Share
              </button>

              {showShareMenu && (
                <div className="absolute top-12 right-0 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-50 min-w-[320px]">
                  <div className="flex items-center justify-between mb-3 px-2">
                    <div className="text-sm font-semibold text-gray-500">Share this article</div>
                    <button
                      onClick={() => setShowShareMenu(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                      aria-label="Close"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <button onClick={() => handleShare('facebook')} className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-all group">
                      <span className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-all">
                        <FacebookIcon className="w-4 h-4" />
                      </span>
                      <span className="font-medium">Facebook</span>
                    </button>

                    <button onClick={() => handleShare('twitter')} className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 rounded-xl transition-all group">
                      <span className="w-9 h-9 bg-blue-400 rounded-full flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-all">
                        <TwitterIcon className="w-4 h-4" />
                      </span>
                      <span className="font-medium">Twitter / X</span>
                    </button>

                    <button onClick={() => handleShare('whatsapp')} className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-xl transition-all group">
                      <span className="w-9 h-9 bg-green-500 rounded-full flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-all">
                        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                          <path d="M20.5 3.5A11.9 11.9 0 0012 0C5.4 0 0 5.4 0 12c0 2.1.5 4.2 1.6 6L0 24l6.2-1.6A11.9 11.9 0 0012 24c6.6 0 12-5.4 12-12 0-3.2-1.2-6.2-3.5-8.5zM12 22a10 10 0 01-5.1-1.4l-.3-.2-3.7 1 1-3.6-.2-.4A10 10 0 012 12C2 6.5 6.5 2 12 2c2.7 0 5.2 1 7 2.9A9.9 9.9 0 0122 12c0 5.5-4.5 10-10 10zm5.5-7.5c-.3-.2-1.8-.9-2-1-.3-.1-.5-.1-.7.2-.2.3-.8 1-.9 1.2-.2.2-.4.2-.6.1-.3-.2-1.3-.5-2.5-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.2.3-.4.5-.5.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.2-.7-1.7-.9-2.3-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4z"/>
                        </svg>
                      </span>
                      <span className="font-medium">WhatsApp</span>
                    </button>

                    <button onClick={() => handleShare('linkedin')} className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-all group">
                      <span className="w-9 h-9 bg-blue-700 rounded-full flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-all">
                        <LinkedinIcon className="w-4 h-4" />
                      </span>
                      <span className="font-medium">LinkedIn</span>
                    </button>

                    <button onClick={() => handleShare('email')} className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-700 rounded-xl transition-all group">
                      <span className="w-9 h-9 bg-amber-500 rounded-full flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-all">
                        <Mail className="w-4 h-4" />
                      </span>
                      <span className="font-medium">Email</span>
                    </button>

                    <div className="border-t border-gray-100 my-2" />

                    {nativeShareAvailable && (
                      <button onClick={() => handleShare('native')} className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-all group">
                        <span className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200">
                          <Share2 className="w-4 h-4 text-gray-600" />
                        </span>
                        <span className="font-medium">More options…</span>
                      </button>
                    )}

                    <button onClick={() => handleShare('copy')} className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-all group">
                      <span className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200">
                        {copied ? <Check className="w-4 h-4 text-green-600" /> : <Link2 className="w-4 h-4 text-gray-600" />}
                      </span>
                      <span className="font-medium">{copied ? 'Copied!' : 'Copy Link'}</span>
                    </button>
                  </div>

                  <p className="mt-3 px-2 text-[11px] text-gray-400 leading-relaxed">
                    Tip: If Facebook/Twitter asks you to log in, that&rsquo;s normal — they require an account to share. Log in once and it stays logged in.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* IMAGE */}
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

      {/* CONTENT */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 md:p-12">
          <div className="prose prose-lg max-w-none">
            {post.content.split('\n').map((p, i) => (
              <p key={i} className="text-gray-700 mb-6 leading-relaxed text-lg">{p}</p>
            ))}
          </div>

          {post.tags?.length > 0 && (
            <div className="mt-10 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="w-5 h-5 text-green-600" />
                <h3 className="text-sm font-semibold text-gray-900">Tags:</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Link key={tag} href={`/blog?tag=${tag}`} className="px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm hover:bg-green-100">
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between flex-wrap gap-3">
            <div className="text-sm text-gray-500">Found this helpful? Share with others!</div>
            <div className="flex gap-2">
              <button onClick={() => handleShare('facebook')} className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center hover:bg-blue-100 hover:scale-110 transition-all">
                <FacebookIcon className="w-4 h-4" />
              </button>
              <button onClick={() => handleShare('twitter')} className="w-10 h-10 bg-blue-50 text-blue-400 rounded-full flex items-center justify-center hover:bg-blue-100 hover:scale-110 transition-all">
                <TwitterIcon className="w-4 h-4" />
              </button>
              <button onClick={() => handleShare('linkedin')} className="w-10 h-10 bg-blue-50 text-blue-700 rounded-full flex items-center justify-center hover:bg-blue-100 hover:scale-110 transition-all">
                <LinkedinIcon className="w-4 h-4" />
              </button>
              <button onClick={() => handleShare('copy')} className="w-10 h-10 bg-gray-50 text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-100 hover:scale-110 transition-all">
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Link2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* AUTHOR BIO */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 p-6 mt-8 flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-2xl font-bold text-white">{post.author?.firstName?.[0] || 'A'}</span>
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

        {/* COMMENTS */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-8">
          <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
            <MessageCircle className="w-5 h-5 text-green-600" /> Comments ({comments.length})
          </button>

          {showComments && (
            <>
              <form onSubmit={handleCommentSubmit} className="mb-6 bg-gray-50 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Leave a Comment</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <input type="text" value={commentName} onChange={(e) => setCommentName(e.target.value)} placeholder="Your Name *" className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" required />
                  <input type="email" value={commentEmail} onChange={(e) => setCommentEmail(e.target.value)} placeholder="Your Email" className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Write your comment... *" rows="3" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 mb-3" required />
                <button type="submit" className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg text-sm font-medium hover:from-green-700 hover:to-emerald-700">
                  Post Comment
                </button>
              </form>

              {comments.length > 0 ? (
                <div className="space-y-4">
                  {comments.map((c) => (
                    <div key={c.id} className="flex gap-3 bg-gray-50 rounded-xl p-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-white">{c.name[0].toUpperCase()}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-semibold text-gray-900">{c.name}</p>
                          <span className="text-xs text-gray-400">• {formatDate(c.date)}</span>
                        </div>
                        <p className="text-sm text-gray-600">{c.text}</p>
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

      {/* RELATED */}
      {relatedPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Related Articles</h2>
            <Link href="/blog" className="text-sm font-medium text-green-600 hover:text-green-700 flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedPosts.map((rp) => (
              <BlogCard key={rp._id} post={rp} />
            ))}
          </div>
        </section>
      )}

      {/* POPULAR */}
      {popularPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative">
              <h2 className="text-2xl font-bold text-white mb-6">Popular Articles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {popularPosts.map((pp, i) => (
                  <Link key={pp._id} href={`/blog/${pp.slug}`} className="group bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all">
                    <span className="text-3xl font-bold text-white/30 group-hover:text-white/50">{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="text-sm font-medium text-white mt-2 line-clamp-2">{pp.title}</h3>
                    <p className="text-xs text-green-200 mt-2">{formatDate(pp.createdAt)}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <Link href="/blog" className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to all articles
        </Link>
      </div>
    </div>
  );
}