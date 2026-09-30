// app/utils/discountApi.js
import axios from 'axios';

// ✅ Force /api prefix (since env doesn't include it)
const BASE = process.env.NEXT_PUBLIC_API_URL;
const API_BASE_URL = BASE.endsWith('/api') ? BASE : `${BASE}/api`;

console.log('🌐 discountApi.js - API_BASE_URL:', API_BASE_URL);

// ==========================================
// ✅ GET DISCOUNT FOR A PRODUCT
// ==========================================
export const getProductDiscount = async (productId) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/discounts/product/${productId}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error('Error fetching product discount:', error);
    return {
      success: false,
      hasDiscount: false,
      discount: null,
      originalPrice: 0,
      finalPrice: 0,
      savings: 0,
    };
  }
};

// ==========================================
// ✅ GET ALL ACTIVE DISCOUNTS
// ==========================================
export const getActiveDiscounts = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/discounts/active`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error('Error fetching active discounts:', error);
    return { success: false, discounts: [] };
  }
};

// ==========================================
// ✅ VALIDATE DISCOUNT CODE
// ==========================================
export const validateDiscountCode = async (code, cartTotal) => {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/discounts/validate`,
      { code, cartTotal },
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    console.error('Error validating discount:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Invalid discount code',
    };
  }
};