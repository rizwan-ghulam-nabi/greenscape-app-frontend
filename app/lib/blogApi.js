// app/lib/blogApi.js
import axios from 'axios';

// Use e-commerce backend URL (port 5000)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Get all published blog posts
export const getPublishedPosts = async (page = 1, limit = 9) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/blog`, {
      params: {
        page,
        limit,
        status: 'Published'
      }
    });
    return res.data;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return { posts: [], pagination: { total: 0 } };
  }
};

// ✅ NEW: Get all categories
export const getBlogCategories = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/blog/categories`);
    return res.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return { categories: [] };
  }
};

// Get single post by slug
export const getPostBySlug = async (slug) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/blog/slug/${slug}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
};

// Get related posts
export const getRelatedPosts = async (postId, limit = 3) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/blog/related/${postId}`, {
      params: { limit }
    });
    return res.data;
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return { posts: [] };
  }
};

// Search posts
export const searchPosts = async (query, page = 1, limit = 9) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/blog/search`, {
      params: { q: query, page, limit }
    });
    return res.data;
  } catch (error) {
    console.error('Error searching posts:', error);
    return { posts: [], pagination: { total: 0 } };
  }
};

// Get popular posts
export const getPopularPosts = async (limit = 5) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/blog/popular`, {
      params: { limit }
    });
    return res.data;
  } catch (error) {
    console.error('Error fetching popular posts:', error);
    return { posts: [] };
  }
};