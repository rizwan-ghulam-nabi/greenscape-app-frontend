// app/account/track-order/[orderId]/page.js
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Package, CheckCircle, XCircle, Clock, Truck, MapPin, 
  Phone, Mail, CreditCard, ChevronRight, Leaf, Loader2,
  Download
} from 'lucide-react';
import { generateInvoicePDF } from '@/app/utils/generateInvoice';

const API_BASE_URL = 'http://localhost:5000/api';

export default function TrackOrderPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId;
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // ===== FETCH ORDER DETAILS =====
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
          credentials: 'include',
        });
        
        if (res.status === 401) {
          router.push('/login');
          return;
        }
        
        if (!res.ok) {
          throw new Error('Order not found');
        }
        
        const data = await res.json();
        setOrder(data.order);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (orderId) {
      fetchOrder();
    }
  }, [orderId, router]);
  
  // ===== HELPER FUNCTIONS =====
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const formatCurrency = (amount) => {
    return `Rs. ${(amount || 0).toFixed(2)}`;
  };
  
  // ===== ORDER STATUS STEPS =====
  const getStatusSteps = (currentStatus) => {
    const steps = [
      { 
        id: 'pending', 
        label: 'Order Placed', 
        icon: Clock, 
        description: 'Your order has been placed successfully',
        color: 'bg-yellow-500',
        completedColor: 'bg-yellow-500'
      },
      { 
        id: 'processing', 
        label: 'Processing', 
        icon: Package, 
        description: 'Your order is being processed',
        color: 'bg-orange-500',
        completedColor: 'bg-orange-500'
      },
      { 
        id: 'shipped', 
        label: 'Shipped', 
        icon: Truck, 
        description: 'Your order has been shipped',
        color: 'bg-blue-500',
        completedColor: 'bg-blue-500'
      },
      { 
        id: 'delivered', 
        label: 'Delivered', 
        icon: CheckCircle, 
        description: 'Your order has been delivered',
        color: 'bg-green-500',
        completedColor: 'bg-green-500'
      }
    ];
    
    // If cancelled, show cancelled step
    if (currentStatus === 'cancelled') {
      steps.push({
        id: 'cancelled',
        label: 'Cancelled',
        icon: XCircle,
        description: 'Your order has been cancelled',
        color: 'bg-red-500',
        completedColor: 'bg-red-500'
      });
    }
    
    const currentIndex = steps.findIndex(step => step.id === currentStatus);
    
    return steps.map((step, index) => ({
      ...step,
      isCompleted: index <= currentIndex && currentStatus !== 'cancelled',
      isCurrent: index === currentIndex,
      isCancelled: currentStatus === 'cancelled' && step.id === 'cancelled'
    }));
  };
  
  // ===== TIMELINE PROGRESS =====
  const renderProgressTracker = (status) => {
    const steps = getStatusSteps(status);
    
    return (
      <div className="relative">
        {/* Progress Bar Background */}
        <div className="absolute left-0 right-0 top-8 h-1 bg-gray-200 rounded-full"></div>
        
        {/* Progress Bar (shows progress up to current step) */}
        {status !== 'cancelled' && (
          <div 
            className="absolute left-0 top-8 h-1 bg-[#2B7A4B] rounded-full transition-all duration-500"
            style={{ 
              width: `${(steps.findIndex(s => s.isCurrent) / (steps.length - 1)) * 100}%` 
            }}
          ></div>
        )}
        
        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className="flex flex-col items-center flex-1">
                {/* Circle */}
                <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                  step.isCurrent 
                    ? `${step.color} border-transparent shadow-lg` 
                    : step.isCompleted 
                      ? `bg-white border-[#2B7A4B]` 
                      : 'bg-white border-gray-200'
                }`}>
                  <Icon className={`w-7 h-7 ${
                    step.isCurrent 
                      ? 'text-white' 
                      : step.isCompleted 
                        ? 'text-[#2B7A4B]' 
                        : 'text-gray-400'
                  }`} />
                </div>
                
                {/* Label */}
                <p className={`mt-3 text-sm font-semibold ${
                  step.isCurrent || step.isCompleted 
                    ? 'text-gray-900' 
                    : 'text-gray-400'
                }`}>
                  {step.label}
                </p>
                
                {/* Description */}
                <p className="text-xs text-gray-500 text-center mt-1 px-2">
                  {step.description}
                </p>
                
                {/* Date (if available from statusHistory) */}
                {order.statusHistory && (
                  <p className="text-[10px] text-gray-400 mt-1">
                    {getStatusDate(step.id)}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  const getStatusDate = (statusId) => {
    if (!order?.statusHistory) return '';
    
    const event = order.statusHistory.find(
      e => e.status?.toLowerCase() === statusId
    );
    
    return event ? formatDate(event.changedAt) : '';
  };
  
  // ===== GET PRODUCT NAME & IMAGE =====
  const getProductName = (item) => {
    if (item.product && typeof item.product === 'object') {
      return item.product.name || 'Product';
    }
    return item.name || 'Product';
  };
  
  const getProductImage = (item) => {
    if (item.product && typeof item.product === 'object' && item.product.image) {
      return item.product.image;
    }
    return item.image || null;
  };
  
  // ===== LOADING STATE =====
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9F6]">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-[#2B7A4B] animate-spin" />
          <p className="text-gray-500 mt-4">Loading order details...</p>
        </div>
      </div>
    );
  }
  
  // ===== ERROR STATE =====
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9F6]">
        <div className="text-center bg-white rounded-2xl p-8 shadow-sm max-w-md">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <Link href="/account/orders" className="inline-block px-6 py-2 bg-[#2B7A4B] text-white rounded-lg font-medium">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }
  
  // ===== RENDER =====
  return (
    <div className="min-h-screen bg-[#F8F9F6] pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* ===== BREADCRUMBS ===== */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#2B7A4B]">Home</Link>
          <span className="text-gray-300">/</span>
          <Link href="/orders" className="hover:text-[#2B7A4B]">My Orders</Link>
          <span className="text-gray-300">/</span>
          <span className="text-[#2B7A4B] font-medium">Track Order</span>
        </div>
        
        {/* ===== PAGE HEADER ===== */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-[#2B7A4B]/10 rounded-full flex items-center justify-center">
            <Truck className="w-6 h-6 text-[#2B7A4B]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Track Your Order</h1>
            <p className="text-sm text-gray-500">Order #{order.orderNumber || order._id.slice(-6)}</p>
          </div>
        </div>
        
        {/* ===== ORDER STATUS CARD ===== */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Order Status</h2>
              <p className="text-sm text-gray-500">Last updated: {formatDate(order.updatedAt)}</p>
            </div>
            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
              order.orderStatus === 'delivered' ? 'bg-green-100 text-green-700' :
              order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-700' :
              order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-700' :
              order.orderStatus === 'processing' ? 'bg-orange-100 text-orange-700' :
              'bg-yellow-100 text-yellow-700'
            }`}>
              {order.orderStatus === 'delivered' ? <CheckCircle className="w-4 h-4" /> :
               order.orderStatus === 'cancelled' ? <XCircle className="w-4 h-4" /> :
               <Clock className="w-4 h-4" />}
              {order.orderStatus?.charAt(0).toUpperCase() + order.orderStatus?.slice(1)}
            </span>
          </div>
          
          {/* Progress Tracker */}
          {renderProgressTracker(order.orderStatus)}
        </div>
        
        {/* ===== ORDER DETAILS GRID ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* ===== LEFT: ORDER ITEMS ===== */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-[#2B7A4B]" />
              <h2 className="text-lg font-bold text-gray-900">Order Items</h2>
            </div>
            
            <div className="space-y-3">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                  {getProductImage(item) ? (
                    <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                      <Image 
                        src={getProductImage(item)} 
                        alt={getProductName(item)}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 flex-shrink-0 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{getProductName(item)}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Qty: {item.quantity} × {formatCurrency(item.price)}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Order Summary */}
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery</span>
                <span className="font-medium text-[#2B7A4B]">
                  {order.deliveryCharge === 0 ? 'FREE' : formatCurrency(order.deliveryCharge)}
                </span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="text-gray-900">Total</span>
                <span className="text-[#2B7A4B]">{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </div>
          
          {/* ===== RIGHT: SHIPPING & PAYMENT ===== */}
          <div className="space-y-6">
            
            {/* Shipping Address */}
            {order.shippingAddress && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-[#2B7A4B]" />
                  <h2 className="text-lg font-bold text-gray-900">Shipping Address</h2>
                </div>
                <div className="space-y-1 text-sm text-gray-700">
                  <p className="font-medium">
                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                  </p>
                  <p>{order.shippingAddress.address}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                  <p>{order.shippingAddress.country}</p>
                  <div className="flex items-center gap-2 mt-2 text-gray-500">
                    <Phone className="w-3 h-3" />
                    {order.shippingAddress.phone}
                  </div>
                </div>
              </div>
            )}
            
            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-[#2B7A4B]" />
                <h2 className="text-lg font-bold text-gray-900">Payment</h2>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Method</span>
                <span className="font-medium capitalize">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Status</span>
                <span className={`font-medium ${
                  order.paymentStatus === 'paid' ? 'text-[#2B7A4B]' :
                  order.paymentStatus === 'failed' ? 'text-red-600' : 'text-yellow-600'
                }`}>
                  {order.paymentStatus?.charAt(0).toUpperCase() + order.paymentStatus?.slice(1)}
                </span>
              </div>
            </div>
            
            {/* Estimated Delivery */}
            {order.estimatedDelivery && (
              <div className="bg-[#E8F5E9] rounded-2xl p-6 border border-[#2B7A4B]/10">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="w-5 h-5 text-[#2B7A4B]" />
                  <h2 className="text-lg font-bold text-[#2B7A4B]">Estimated Delivery</h2>
                </div>
                <p className="text-sm text-gray-600">{formatDate(order.estimatedDelivery)}</p>
              </div>
            )}
            
            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              <Link 
                href="/account/orders"
                className="flex-1 px-4 py-2 bg-[#2B7A4B] text-white text-sm font-medium rounded-lg hover:bg-[#24663F] transition-colors text-center"
              >
                Back to Orders
              </Link>

              <button 
  onClick={() => generateInvoicePDF(order)}
  className="flex-1 px-4 py-2 bg-white border border-gray-200 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors text-center inline-flex items-center justify-center gap-2"
>
  <Download className="w-4 h-4" />
  Download Invoice (PDF)
</button>

            </div>
          </div>
        </div>
        
        {/* ===== CUSTOMER SUPPORT CARD ===== */}
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-[#2B7A4B]/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Leaf className="w-5 h-5 text-[#2B7A4B]" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Need Help?</h3>
              <p className="text-sm text-gray-500 mt-1">
                If you have any questions about your order, please contact our customer support team.
              </p>
              <Link 
                href="/contact"
                className="inline-block mt-3 text-[#2B7A4B] font-medium hover:underline"
              >
                Contact Support →
              </Link>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}