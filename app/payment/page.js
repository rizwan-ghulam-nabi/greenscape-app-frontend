// app/payment/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  CreditCard, Smartphone, Banknote, Lock, Shield, 
  CheckCircle, XCircle, Loader2, ArrowLeft, ChevronRight,
  Wallet, AlertCircle, Package, Truck, MapPin
} from 'lucide-react';

// ==========================================
// ✅ BACKEND API URL
// ==========================================
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get order details from URL params
  const orderId = searchParams.get('orderId');
  const amount = parseFloat(searchParams.get('amount') || '0');
  const orderNumber = searchParams.get('orderNumber');

  const [paymentMethod, setPaymentMethod] = useState('jazzcash');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // 'success', 'failed', 'pending'
  const [error, setError] = useState(null);
  const [transactionId, setTransactionId] = useState(null);

  // Payment methods
  const paymentMethods = [
    {
      id: 'jazzcash',
      name: 'JazzCash',
      desc: 'Pay with JazzCash wallet',
      icon: Smartphone,
      color: 'bg-red-500',
    },
    {
      id: 'credit',
      name: 'Credit / Debit Card',
      desc: 'Visa, Mastercard, etc.',
      icon: CreditCard,
      color: 'bg-blue-500',
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      desc: 'Pay when you receive',
      icon: Banknote,
      color: 'bg-green-500',
    },
  ];

  // Fetch order details
  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/my-orders`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        const orders = data.orders || [];
        const order = orders.find(o => o._id === orderId || o.orderNumber === orderNumber);
        return order;
      }
      return null;
    } catch (error) {
      console.error('Error fetching order:', error);
      return null;
    }
  };

  // Process JazzCash payment
  const processJazzCashPayment = async (orderDetails) => {
    try {
      const userContext = await getUserContext();
      
      const response = await fetch(`${API_BASE_URL}/payment/process-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          amount: orderDetails.totalAmount || amount,
          orderId: orderDetails._id || orderId,
          customerName: userContext?.firstName || 'Guest',
          customerEmail: userContext?.email || 'guest@example.com',
          customerMobile: userContext?.phone || '03001234567',
          customerAddress: orderDetails?.shippingAddress?.address || 'Pakistan',
        }),
      });

      const data = await response.json();

      if (data.success) {
        return {
          success: true,
          transactionId: data.transactionId,
          message: data.message,
        };
      } else {
        return {
          success: false,
          error: data.error || 'Payment failed',
        };
      }
    } catch (error) {
      console.error('❌ JazzCash payment error:', error);
      return {
        success: false,
        error: 'Unable to process payment. Please try again.',
      };
    }
  };

  // Get user context
  const getUserContext = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        return data.user;
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  // Handle payment
  const handlePayment = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const orderDetails = await fetchOrderDetails();

      if (!orderDetails && !amount) {
        throw new Error('Order details not found');
      }

      if (paymentMethod === 'jazzcash') {
        const result = await processJazzCashPayment(orderDetails);
        
        if (result.success) {
          setTransactionId(result.transactionId);
          setPaymentStatus('success');
        } else {
          setError(result.error);
          setPaymentStatus('failed');
        }
      } else if (paymentMethod === 'credit') {
        // For now, simulate credit card payment
        // TODO: Integrate with payment gateway
        setTransactionId(`CARD-${Date.now()}`);
        setPaymentStatus('success');
      } else if (paymentMethod === 'cod') {
        // Cash on Delivery
        setTransactionId(null);
        setPaymentStatus('success');
      }

    } catch (error) {
      console.error('❌ Payment error:', error);
      setError(error.message || 'Payment failed');
      setPaymentStatus('failed');
    } finally {
      setIsProcessing(false);
    }
  };

  // Success screen
  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful! 🎉</h1>
          <p className="text-gray-600 mb-6">
            Your order has been placed successfully.
          </p>

          {transactionId && (
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-xs text-gray-500 mb-1">Transaction ID</p>
              <p className="font-mono text-sm font-bold text-gray-900 break-all">{transactionId}</p>
            </div>
          )}

          {amount > 0 && (
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-xs text-gray-500 mb-1">Amount Paid</p>
              <p className="text-2xl font-bold text-[#2B7A4B]">Rs. {amount.toFixed(2)}</p>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={() => router.push('/orders')}
              className="w-full py-3 bg-[#2B7A4B] text-white rounded-xl font-semibold hover:bg-[#23663e] transition-colors"
            >
              View My Orders
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full py-3 border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Failed screen
  if (paymentStatus === 'failed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-6">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h1>
          <p className="text-gray-600 mb-4">{error || 'Something went wrong. Please try again.'}</p>

          <div className="space-y-3">
            <button
              onClick={() => setPaymentStatus(null)}
              className="w-full py-3 bg-[#2B7A4B] text-white rounded-xl font-semibold hover:bg-[#23663e] transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push('/cart')}
              className="w-full py-3 border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Back to Cart
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main payment page
  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* ===== HEADER ===== */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold text-gray-900">Secure Checkout</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-600" />
            <span className="text-sm text-gray-500">SSL Encrypted</span>
          </div>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[
            { label: 'Cart', icon: ShoppingBagIcon },
            { label: 'Checkout', icon: MapPinIcon },
            { label: 'Payment', icon: CreditCardIcon },
            { label: 'Confirmation', icon: CheckCircleIcon },
          ].map((step, idx) => (
            <div key={idx} className="flex items-center">
              <div className={`flex flex-col items-center ${idx === 2 ? 'text-[#2B7A4B]' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  idx === 2 ? 'bg-[#2B7A4B] text-white' : idx < 2 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  {idx < 2 ? <CheckIcon className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                </div>
                <span className="text-xs mt-2 font-medium">{step.label}</span>
              </div>
              {idx < 3 && <div className={`w-12 h-0.5 mx-2 ${idx < 2 ? 'bg-green-500' : 'bg-gray-200'}`}></div>}
            </div>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 mb-6">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* ===== LEFT: PAYMENT METHODS ===== */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Payment Methods */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Select Payment Method</h2>
              
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === method.id
                        ? 'border-[#2B7A4B] bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl ${method.color} flex items-center justify-center text-white`}>
                      <method.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-gray-900">{method.name}</p>
                      <p className="text-xs text-gray-500">{method.desc}</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 ${
                      paymentMethod === method.id ? 'border-[#2B7A4B] bg-[#2B7A4B]' : 'border-gray-300'
                    }`}>
                      {paymentMethod === method.id && (
                        <div className="w-full h-full flex items-center justify-center">
                          <CheckIcon className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* JazzCash Mobile Number Input (if JazzCash selected) */}
            {paymentMethod === 'jazzcash' && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">JazzCash Mobile Number</h2>
                <div className="flex gap-2">
                  <div className="flex items-center bg-gray-50 rounded-xl px-3 border border-gray-200">
                    <span className="text-gray-500 font-semibold">+92</span>
                  </div>
                  <input
                    type="tel"
                    placeholder="3001234567"
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-lg font-semibold tracking-wider focus:outline-none focus:ring-2 focus:ring-[#2B7A4B]"
                    maxLength={10}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  You'll receive a payment request on your JazzCash mobile number.
                </p>
              </div>
            )}

            {/* Credit Card Input (if Credit selected) */}
            {paymentMethod === 'credit' && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Card Details</h2>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-lg tracking-wider focus:outline-none focus:ring-2 focus:ring-[#2B7A4B]"
                      maxLength={19}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B7A4B]"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                      <input
                        type="password"
                        placeholder="•••"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B7A4B]"
                        maxLength={3}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ===== RIGHT: ORDER SUMMARY ===== */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sticky top-4">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Order Number</span>
                  <span className="font-semibold text-gray-900">{orderNumber || '—'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Items</span>
                  <span className="font-semibold text-gray-900">{searchParams.get('items') || 1}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-900">Rs. {(amount * 0.9).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-[#2B7A4B]">{amount > 7500 ? 'FREE' : 'Rs. 599'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold text-gray-900">Rs. {(amount * 0.1).toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-[#2B7A4B]">Rs. {amount.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={isProcessing || !amount}
                className="w-full py-3.5 bg-[#2B7A4B] text-white rounded-xl font-bold hover:bg-[#23663e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Pay Rs. {amount.toFixed(2)}
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 mt-4">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-xs text-gray-500">Payments are 100% secure</span>
              </div>

              {/* Payment Logos */}
              <div className="flex items-center justify-center gap-3 mt-4">
                <div className="px-3 py-1.5 bg-red-500 rounded-lg text-white text-xs font-bold">JazzCash</div>
                <div className="px-3 py-1.5 bg-blue-500 rounded-lg text-white text-xs font-bold">VISA</div>
                <div className="px-3 py-1.5 bg-gray-800 rounded-lg text-white text-xs font-bold">Mastercard</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper components for icons
function ShoppingBagIcon({ className }) {
  return <ShoppingBag className={className} />;
}

function MapPinIcon({ className }) {
  return <MapPin className={className} />;
}

function CreditCardIcon({ className }) {
  return <CreditCard className={className} />;
}

function CheckCircleIcon({ className }) {
  return <CheckCircle className={className} />;
}

function CheckIcon({ className }) {
  return <CheckCircle className={className} />;
}