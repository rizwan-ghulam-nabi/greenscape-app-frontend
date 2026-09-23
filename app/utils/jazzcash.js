// app/utils/jazzcash.js
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ==========================================
// ✅ PROCESS JAZZCASH PAYMENT (USES BACKEND)
// ==========================================
export const processJazzCashPayment = async (orderDetails) => {
  try {
    const {
      amount,
      orderId,
      customerName,
      customerEmail,
      customerMobile,
      customerAddress,
    } = orderDetails;

    // Call backend to initiate payment
    const response = await axios.post(`${API_BASE_URL}/jazzcash/pay`, {
      amount,
      orderId,
      customerName,
      customerEmail,
      customerMobile,
      customerAddress,
    }, {
      withCredentials: true,
    });

    const data = response.data;

    if (data.success) {
      return {
        success: true,
        transactionId: data.transactionId,
        message: data.message,
        amount: data.amount,
        orderId: data.orderId,
        raw: data.raw,
      };
    } else {
      return {
        success: false,
        error: data.error || 'Payment failed',
        raw: data,
      };
    }

  } catch (error) {
    console.error('❌ JazzCash payment error:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Unable to process payment. Please try again.',
    };
  }
};

// ==========================================
// ✅ VERIFY PAYMENT STATUS
// ==========================================
export const verifyJazzCashPayment = async (transactionRef) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/jazzcash/verify`, {
      transactionRef,
    }, {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error('❌ Verification error:', error);
    return null;
  }
};