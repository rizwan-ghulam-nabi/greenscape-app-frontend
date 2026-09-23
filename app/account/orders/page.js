// app/orders/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Leaf, Truck, Clock, CheckCircle, XCircle, 
  ChevronRight, ChevronDown, ShoppingBag, Package, MapPin, CreditCard, Gift,
  Download
} from 'lucide-react';
import { generateInvoicePDF } from '@/app/utils/generateInvoice';

const API_BASE_URL = 'http://localhost:5000/api';

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('All Orders');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [showFirstOrderBanner, setShowFirstOrderBanner] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/orders/my-orders`, {
          credentials: 'include',
        });

        if (res.status === 401) {
          router.push('/login');
          return;
        }

        const data = await res.json();
        setOrders(data.orders || []);
        
        // Check if user has no orders (first-time customer)
        if (data.orders && data.orders.length === 0) {
          setShowFirstOrderBanner(true);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

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

  const getStatusConfig = (status) => {
    const map = {
      'delivered': { color: 'text-[#2B7A4B]', bg: 'bg-[#2B7A4B]/10', icon: <CheckCircle className="w-3 h-3" /> },
      'shipped': { color: 'text-blue-600', bg: 'bg-blue-50', icon: <Truck className="w-3 h-3" /> },
      'processing': { color: 'text-orange-500', bg: 'bg-orange-50', icon: <Clock className="w-3 h-3" /> },
      'cancelled': { color: 'text-red-500', bg: 'bg-red-50', icon: <XCircle className="w-3 h-3" /> },
      'pending': { color: 'text-yellow-500', bg: 'bg-yellow-50', icon: <Clock className="w-3 h-3" /> },
    };
    return map[status?.toLowerCase()] || map['pending'];
  };

  const getPaymentStatusConfig = (status) => {
    const map = {
      'paid': { color: 'text-[#2B7A4B]', bg: 'bg-[#2B7A4B]/10', icon: <CheckCircle className="w-3 h-3" /> },
      'pending': { color: 'text-yellow-600', bg: 'bg-yellow-100', icon: <Clock className="w-3 h-3" /> },
      'failed': { color: 'text-red-500', bg: 'bg-red-50', icon: <XCircle className="w-3 h-3" /> },
      'refunded': { color: 'text-blue-500', bg: 'bg-blue-50', icon: <CheckCircle className="w-3 h-3" /> },
    };
    return map[status?.toLowerCase()] || map['pending'];
  };

  const filteredOrders = filter === 'All Orders' 
    ? orders 
    : orders.filter(o => o.orderStatus === filter.toLowerCase());

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Get product name from populated item
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-[#2B7A4B] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#F8F9F6] pb-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          <div className="flex-1">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              
              {/* First Order Free Delivery Banner */}
              {showFirstOrderBanner && (
                <div className="mb-6 bg-gradient-to-r from-[#2B7A4B] to-[#1a5c35] p-4 rounded-xl text-white">
                  <div className="flex items-center gap-3">
                    <Gift className="w-8 h-8" />
                    <div>
                      <h3 className="font-bold text-lg">Welcome Offer! 🎉</h3>
                      <p className="text-sm opacity-90">Your first order gets FREE delivery. Start shopping now!</p>
                    </div>
                    <Link 
                      href="/products"
                      className="ml-auto px-4 py-2 bg-white text-[#2B7A4B] text-sm font-bold rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      Shop Now
                    </Link>
                  </div>
                </div>
              )}

              {/* Header & Filter */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
                <div className="flex items-center gap-2 mb-4 sm:mb-0">
                  <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
                  <Leaf className="w-5 h-5 text-[#2B7A4B]" />
                </div>
                <div className="relative">
                  <select 
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2B7A4B]"
                  >
                    <option value="All Orders">All Orders</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Processing">Processing</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <p className="text-sm text-gray-500 mb-6">Track, view and manage your orders all in one place.</p>

              <div className="space-y-6">
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <ShoppingBag className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    <p className="mb-4">No orders found.</p>
                    <Link 
                      href="/products"
                      className="text-[#2B7A4B] font-medium hover:underline"
                    >
                      Start Shopping →
                    </Link>
                  </div>
                ) : (
                  filteredOrders.map((order) => {
                    const statusConfig = getStatusConfig(order.orderStatus);
                    const paymentConfig = getPaymentStatusConfig(order.paymentStatus);
                    const isExpanded = expandedOrder === order._id;

                    return (
                      <div key={order._id} className="bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow overflow-hidden">
                        
                        {/* Free Delivery Badge */}
                        {order.freeDeliveryApplied && (
                          <div className="bg-[#2B7A4B]/5 px-4 py-2 flex items-center gap-2 text-[#2B7A4B] text-xs font-semibold">
                            <Gift className="w-4 h-4" />
                            Free delivery applied on your first order! 🎉
                          </div>
                        )}

                        {/* Order Summary Header - Clickable */}
                        <div 
                          className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() => toggleOrderDetails(order._id)}
                        >
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                            {/* Order Number & Date */}
                            <div className="md:col-span-4">
                              <div className="flex items-center gap-2">
                                <span className="text-[15px] font-bold text-gray-900">{order.orderNumber}</span>
                                <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                {order.items?.length || 0} items • {formatDate(order.createdAt)}
                              </p>
                            </div>
                            
                            {/* Order Status (Only ONE badge here) */}
                            <div className="md:col-span-2">
                              <span className={`text-[12px] font-bold ${statusConfig.color} ${statusConfig.bg} px-2 py-1 rounded-full inline-flex items-center gap-1`}>
                                {statusConfig.icon} {order.orderStatus || 'Pending'}
                              </span>
                            </div>

                            {/* Total Amount */}
                            <div className="md:col-span-2 text-left md:text-right">
                              <span className="text-[15px] font-bold text-gray-900">{formatCurrency(order.totalAmount)}</span>
                              {order.deliveryCharge === 0 && (
                                <p className="text-[11px] text-[#2B7A4B] font-medium">Free Delivery</p>
                              )}
                            </div>

                            {/* View Details */}
                            <div className="md:col-span-4 text-right">
                              <span className="text-xs text-gray-500">View Details</span>
                            </div>
                          </div>
                        </div>

                        {/* Expanded Order Details */}
                        {isExpanded && (
                          <div className="border-t border-gray-100 bg-gray-50/50 p-4 md:p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              {/* Items Section */}
                              <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                  <Package className="w-4 h-4 text-[#2B7A4B]" />
                                  Order Items
                                </h3>
                                
                                <div className="space-y-3">
                                  {order.items && order.items.length > 0 ? (
                                    order.items.map((item, idx) => (
                                      <div key={idx} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-100">
                                        {getProductImage(item) && (
                                          <div className="relative w-16 h-16 flex-shrink-0">
                                            <Image 
                                              src={getProductImage(item)} 
                                              alt={getProductName(item)}
                                              fill
                                              className="object-cover rounded-lg"
                                            />
                                          </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm font-medium text-gray-900 truncate">{getProductName(item)}</p>
                                          <p className="text-xs text-gray-500 mt-1">
                                            Qty: {item.quantity} × {formatCurrency(item.price)}
                                          </p>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-900">
                                          {formatCurrency(item.price * item.quantity)}
                                        </span>
                                      </div>
                                    ))
                                  ) : (
                                    <p className="text-sm text-gray-500">No items found.</p>
                                  )}
                                </div>

                                {/* Order Summary */}
                                <div className="bg-white p-4 rounded-lg border border-gray-100">
                                  <h4 className="text-xs font-semibold text-gray-900 uppercase mb-3">Order Summary</h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Subtotal</span>
                                      <span className="font-medium">{formatCurrency(order.subtotal || (order.totalAmount - (order.deliveryCharge || 0)))}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Delivery Charge</span>
                                      {order.deliveryCharge === 0 ? (
                                        <span className="font-medium text-[#2B7A4B]">
                                          FREE
                                          {order.isFirstOrder && (
                                            <span className="ml-1 text-xs bg-[#2B7A4B]/10 text-[#2B7A4B] px-1.5 py-0.5 rounded">
                                              First Order
                                            </span>
                                          )}
                                        </span>
                                      ) : (
                                        <span className="font-medium">{formatCurrency(order.deliveryCharge)}</span>
                                      )}
                                    </div>
                                    {order.deliveryCharge === 0 && (
                                      <div className="flex justify-between text-[#2B7A4B] text-xs">
                                        <span className="flex items-center gap-1">
                                          <Gift className="w-3 h-3" />
                                          First Order Discount
                                        </span>
                                        <span>- {formatCurrency(500)}</span>
                                      </div>
                                    )}
                                    <div className="border-t border-gray-100 pt-2 flex justify-between">
                                      <span className="font-semibold text-gray-900">Total</span>
                                      <span className="font-bold text-[#2B7A4B]">{formatCurrency(order.totalAmount)}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Shipping & Payment Details */}
                              <div className="space-y-4">
                                {/* Payment Status */}
                                <div className="bg-white p-4 rounded-lg border border-gray-100">
                                  <h4 className="text-xs font-semibold text-gray-900 uppercase mb-3">Payment Status</h4>
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <span className="text-gray-600">Payment Method</span>
                                      <span className="font-medium capitalize">{order.paymentMethod}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="text-gray-600">Payment Status</span>
                                      <span className={`text-[12px] font-bold ${paymentConfig.color} ${paymentConfig.bg} px-2 py-1 rounded-full inline-flex items-center gap-1`}>
                                        {paymentConfig.icon} {order.paymentStatus || 'Pending'}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Shipping Address */}
                                {order.shippingAddress && (
                                  <div className="bg-white p-4 rounded-lg border border-gray-100">
                                    <h4 className="text-xs font-semibold text-gray-900 uppercase mb-3 flex items-center gap-2">
                                      <MapPin className="w-4 h-4 text-[#2B7A4B]" />
                                      Shipping Address
                                    </h4>
                                    <div className="text-sm text-gray-700 space-y-1">
                                      <p className="font-medium">
                                        {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                                      </p>
                                      <p>{order.shippingAddress.address}</p>
                                      <p>
                                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                                      </p>
                                      <p>{order.shippingAddress.country}</p>
                                      <p className="text-gray-500">Phone: {order.shippingAddress.phone}</p>
                                    </div>
                                  </div>
                                )}

                                {/* Status History Timeline */}
                                {order.statusHistory && order.statusHistory.length > 0 && (
                                  <div className="bg-white p-4 rounded-lg border border-gray-100">
                                    <h4 className="text-xs font-semibold text-gray-900 uppercase mb-3">Order Timeline</h4>
                                    <div className="space-y-3">
                                      {[...order.statusHistory].sort((a, b) => new Date(b.changedAt) - new Date(a.changedAt)).map((event, idx) => (
                                        <div key={idx} className="flex items-start gap-3">
                                          <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${idx === 0 ? 'bg-[#2B7A4B]' : 'bg-gray-300'}`}></div>
                                          <div>
                                            <p className="text-sm font-medium text-gray-900 capitalize">{event.status}</p>
                                            <p className="text-xs text-gray-500">{formatDate(event.changedAt)}</p>
                                            {event.note && (
                                              <p className="text-xs text-gray-600 mt-1">{event.note}</p>
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-2">
                                  {/* Track Order - Available for all active statuses */}
                                  {['pending', 'processing', 'shipped', 'delivered'].includes(order.orderStatus) && (
                                    <Link 
                                      href={`/account/track-order/${order._id}`}
                                      className="px-4 py-2 bg-[#2B7A4B] text-white text-sm font-medium rounded-lg hover:bg-[#24663F] transition-colors inline-flex items-center gap-2"
                                    >
                                      <Truck className="w-4 h-4" />
                                      Track Order
                                    </Link>
                                  )}

                                  {/* Shop Again - Only for cancelled orders */}
                                  {order.orderStatus === 'cancelled' && (
                                    <Link 
                                      href="/products"
                                      className="px-4 py-2 bg-[#2B7A4B] text-white text-sm font-medium rounded-lg hover:bg-[#24663F] transition-colors"
                                    >
                                      Shop Again
                                    </Link>
                                  )}

                                  {/* Rate Products - Only for delivered orders */}
                                  {order.orderStatus === 'delivered' && (
                                    <Link 
                                      href="/products"
                                      className="px-4 py-2 bg-[#2B7A4B] text-white text-sm font-medium rounded-lg hover:bg-[#24663F] transition-colors"
                                    >
                                      Rate Products
                                    </Link>
                                  )}

                                  {/* Download Invoice - Always available */}
                                  <button 
      onClick={() => generateInvoicePDF(order)}
      className="px-4 py-2 bg-white border border-gray-200 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
    >
      <Download className="w-4 h-4" />
      Download Invoice
    </button>

                                  {/* Cancel Order - Only for pending orders */}
                                  {order.orderStatus === 'pending' && (
                                    <button className="px-4 py-2 bg-white border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors">
                                      Cancel Order
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}