// app/blog/page.jsx - COMPLETE REDESIGN
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, ChevronLeft, ChevronRight, Loader2, 
  TrendingUp, Tag, Clock, Eye, ArrowRight, 
  Sparkles, BookOpen, Grid, List, Menu
} from 'lucide-react';
import BlogCard from '@/components/BlogCard';
import { getPublishedPosts, searchPosts, getPopularPosts, getBlogCategories } from "../lib/blogApi.js";

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [featuredPost, setFeaturedPost] = useState(null);

  const postsPerPage = 6;

  // Fetch posts
  const fetchPosts = async (page = 1, search = '', category = 'all') => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: postsPerPage.toString()
      });

      if (search) {
        params.append('search', search);
        setIsSearching(true);
      } else {
        setIsSearching(false);
      }

      if (category && category !== 'all') {
        params.append('category', category);
      }

      const res = await getPublishedPosts(page, postsPerPage);
      
      if (res?.posts) {
        setPosts(res.posts);
        setTotalPages(res.pagination?.totalPages || 1);
        setTotalPosts(res.pagination?.total || res.posts.length);
        
        // Set featured post if first load
        if (page === 1 && res.posts.length > 0 && !featuredPost) {
          setFeaturedPost(res.posts[0]);
        }
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load blog posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch popular posts
  const fetchPopularPosts = async () => {
    const response = await getPopularPosts(5);
    if (response?.posts) {
      setPopularPosts(response.posts);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    const response = await getBlogCategories();
    if (response?.categories) {
      setCategories(response.categories);
    }
  };

  // Initial load
  useEffect(() => {
    fetchPosts();
    fetchPopularPosts();
    fetchCategories();
  }, []);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPosts(1, searchQuery, selectedCategory);
  };

  // Handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    fetchPosts(1, searchQuery, category);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchPosts(page, searchQuery, selectedCategory);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get category color
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

  // Loading state
 // app/blog/page.jsx - FIXED LOADING STATE
if (loading && posts.length === 0) {
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-green-50/30">
      
      {/* ========== HERO SECTION ========== */}
      <section className="relative bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 text-white overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-20 right-20 w-32 h-32 border-4 border-white/10 rounded-full"></div>
        <div className="absolute top-40 left-40 w-20 h-20 border-2 border-white/10 rounded-full"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium">GreenScape Blog</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Growing Knowledge,
              <br />
              <span className="text-green-300">One Article at a Time</span>
            </h1>
            
            <p className="text-lg text-green-100 mb-10 max-w-2xl mx-auto">
              Discover expert tips, plant care guides, and gardening inspiration 
              from our team of passionate horticulturists.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur"></div>
                <div className="relative flex items-center bg-white rounded-2xl shadow-2xl p-2">
                  <Search className="absolute left-4 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for articles..."
                    className="flex-1 pl-12 pr-4 py-3 bg-transparent outline-none text-gray-800"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105"
                  >
                    Search
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        
        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" className="w-full">
            <path d="M0 120L60 105L120 90L180 105L240 75L300 90L360 60L420 75L480 45L540 60L600 30L660 45L720 60L780 45L840 30L900 45L960 60L1020 45L1080 30L1140 45L1200 60L1260 45L1320 30L1380 45L1440 60L1440 120L0 120Z" fill="white" fillOpacity="0.1"/>
            <path d="M0 120L60 110L120 100L180 110L240 85L300 100L360 70L420 85L480 55L540 70L600 40L660 55L720 70L780 55L840 40L900 55L960 70L1020 55L1080 40L1140 55L1200 70L1260 55L1320 40L1380 55L1440 70L1440 120L0 120Z" fill="white" fillOpacity="0.2"/>
          </svg>
        </div>
      </section>

      {/* ========== MAIN CONTENT ========== */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* ===== MAIN POSTS AREA ===== */}
          <div className="lg:col-span-3">
            
            {/* Category Filter Bar */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-green-600" />
                <span className="text-gray-700 font-semibold">Filter by Category:</span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-green-100 text-green-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-green-100 text-green-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Category Chips */}
            <div className="flex flex-wrap gap-2 mb-10">
              <button
                onClick={() => handleCategorySelect('all')}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === 'all'
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/30'
                    : 'bg-white text-gray-600 hover:bg-green-50 border border-gray-200'
                }`}
              >
                All Articles
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => handleCategorySelect(cat.name)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                    selectedCategory === cat.name
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/30'
                      : 'bg-white text-gray-600 hover:bg-green-50 border border-gray-200'
                  }`}
                >
                  {cat.name}
                  <span className="ml-2 text-xs opacity-70">({cat.count})</span>
                </button>
              ))}
            </div>

            {/* Results Info */}
            <div className="flex items-center justify-between mb-8">
              <p className="text-gray-600">
                {isSearching 
                  ? `Found ${totalPosts} results for "${searchQuery}"`
                  : selectedCategory !== 'all'
                    ? `${totalPosts} articles in ${selectedCategory}`
                    : `Showing ${totalPosts} articles`}
              </p>
              <span className="text-sm text-gray-400">
                Page {currentPage} of {totalPages}
              </span>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-20">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-green-200 border-t-green-600 animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-20 bg-white rounded-2xl border border-red-200">
                <div className="text-6xl mb-4">😕</div>
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={() => fetchPosts(currentPage, searchQuery, selectedCategory)}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium hover:from-green-700 hover:to-emerald-700 transition-all"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Posts Grid */}
            {!loading && !error && posts.length > 0 && (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {posts.map((post, index) => (
                    <BlogCard key={post._id} post={post} index={index} />
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {posts.map((post, index) => (
                    <BlogCard key={post._id} post={post} index={index} viewMode="list" />
                  ))}
                </div>
              )
            )}

            {/* No Results */}
            {!loading && !error && posts.length === 0 && (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <div className="text-6xl mb-4">🌱</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No articles found
                </h3>
                <p className="text-gray-600 mb-6">
                  {isSearching 
                    ? 'Try searching with different keywords.'
                    : 'Check back soon for new articles.'}
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    fetchPosts(1, '', 'all');
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium hover:from-green-700 hover:to-emerald-700 transition-all"
                >
                  View All Articles
                </button>
              </div>
            )}

            {/* Pagination */}
            {!loading && !error && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-11 h-11 border rounded-xl text-sm font-semibold transition-all duration-300 ${
                      currentPage === page
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white border-transparent shadow-lg shadow-green-500/30 transform scale-110'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* ===== SIDEBAR ===== */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Popular Posts Widget */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-5">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-white" />
                  <h3 className="text-white font-semibold">Popular Articles</h3>
                </div>
              </div>
              
              <div className="p-5">
                {popularPosts.length > 0 ? (
                  <div className="space-y-4">
                    {popularPosts.map((post, index) => (
                      <Link
                        key={post._id}
                        href={`/blog/${post.slug}`}
                        className="flex gap-3 group p-2 rounded-lg hover:bg-green-50 transition-all duration-300"
                      >
                        <div className="relative">
                          <span className={`w-8 h-8 ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400' : index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700' : 'bg-gray-100'} rounded-lg flex items-center justify-center text-sm font-bold ${index < 3 ? 'text-white' : 'text-gray-500'}`}>
                            {index + 1}
                          </span>
                          {index === 0 && <span className="absolute -top-1 -right-1 text-yellow-400 text-xs">🏆</span>}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-green-600 transition-colors">
                            {post.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                            <Clock className="w-3 h-3" />
                            <span>{formatDate(post.createdAt)}</span>
                            {post.views > 0 && (
                              <>
                                <span>•</span>
                                <Eye className="w-3 h-3" />
                                <span>{post.views} views</span>
                              </>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No popular articles yet.</p>
                )}
              </div>
            </div>

            {/* Categories Widget */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-5">
                <div className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-white" />
                  <h3 className="text-white font-semibold">Categories</h3>
                </div>
              </div>
              
              <div className="p-5">
                {categories.length > 0 ? (
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.name}
                        onClick={() => handleCategorySelect(cat.name)}
                        className="flex items-center justify-between w-full py-2.5 px-3 rounded-lg text-sm text-gray-600 hover:bg-green-50 hover:text-green-700 transition-all duration-300"
                      >
                        <span className="flex items-center gap-2">
                          <span className={`w-2 h-2 ${getCategoryColor(cat.name)} rounded-full`}></span>
                          {cat.name}
                        </span>
                        <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs">
                          {cat.count}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No categories available.</p>
                )}
              </div>
            </div>

            {/* Newsletter Widget */}
            <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <div className="relative">
                <div className="text-4xl mb-3">📬</div>
                <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
                <p className="text-sm text-green-100 mb-4">
                  Get the latest gardening tips and articles delivered to your inbox.
                </p>
                <form className="space-y-2">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-green-200 focus:outline-none focus:border-white/40"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-white text-green-700 rounded-lg text-sm font-semibold hover:bg-green-50 transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="bg-gray-900 text-gray-400 py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-white text-xl font-bold mb-3">GreenScape</h3>
              <p className="text-sm leading-relaxed">
                Your trusted source for plant care tips, gardening guides, and sustainable living inspiration.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="hover:text-green-400 transition-colors">Home</Link></li>
                <li><Link href="/shop" className="hover:text-green-400 transition-colors">Shop</Link></li>
                <li><Link href="/blog" className="hover:text-green-400 transition-colors">Blog</Link></li>
                <li><Link href="/about" className="hover:text-green-400 transition-colors">About Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>Email: support@greenscape.com</li>
                <li>Phone: +1 (555) 123-4567</li>
                <li>Address: 123 Green Street</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2024 GreenScape. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}