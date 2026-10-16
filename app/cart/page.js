'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Trash2, Minus, Plus, ShoppingBag,
  Truck, ShieldCheck, Leaf,
  Star, ShoppingCart,
} from 'lucide-react';

// ===== IMPORT CART HELPERS =====
import { getCart, removeFromCart, clearCart } from '@/app/utils/cart';

// ===== SUGGESTED PRODUCTS (You May Also Like) =====
const SUGGESTED_PRODUCTS = [
  { id: 2, name: 'Fiddle Leaf Fig', desc: 'Indoor Tree', price: 7999, rating: 4.9, reviews: 89, image: '/products/lavender.jpg' },
  { id: 3, name: 'Peace Lily', desc: 'Flowering Plant', price: 2974, originalPrice: 3499, rating: 4.6, reviews: 98, image: '/products/tool-set.jpg', tag: '-15%' },
  { id: 5, name: 'Areca Palm', desc: 'Butterfly Palm', price: 4499, originalPrice: 4999, rating: 4.8, reviews: 76, image: '/products/potting-mix.jpg', tag: '-10%' },
  { id: 7, name: 'Pothos Golden', desc: 'Devils Ivy', price: 1899, rating: 4.7, reviews: 174, image: '/products/watering-can.jpg' },
  { id: 8, name: 'Lavender Plant', desc: 'Fragrant & Hardy', price: 1299, rating: 4.6, reviews: 96, image: '/products/succulent.jpg' },
  { id: 9, name: 'Aloe Vera', desc: 'Medicinal Plant', price: 1499, rating: 4.7, reviews: 112, image: '/products/lavender.jpg' },
];

export default function CartPage() {
  // ===== STATE =====
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('jazzcash');

  // ===== Bot Notification State =====
  const [botNotification, setBotNotification] = useState(null);

  // ===== LOAD CART ON MOUNT =====
  useEffect(() => {
    setCartItems(getCart());

    const handleStorageChange = () => {
      setCartItems(getCart());
    };

    const handleBotAddToCart = (event) => {
      setCartItems(getCart());
      if (event.detail && event.detail.message) {
        setBotNotification(event.detail.message);
        setTimeout(() => setBotNotification(null), 3000);
      }
    };

    const handleBotSearchProducts = (event) => {
      console.log('🔍 Bot searched for:', event.detail?.query);
    };

    const handleBotRemoveFromCart = (event) => {
      setCartItems(getCart());
      if (event.detail && event.detail.message) {
        setBotNotification(event.detail.message);
        setTimeout(() => setBotNotification(null), 3000);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdated', handleStorageChange);
    window.addEventListener('botAddToCart', handleBotAddToCart);
    window.addEventListener('botRemoveFromCart', handleBotRemoveFromCart);
    window.addEventListener('botSearchProducts', handleBotSearchProducts);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleStorageChange);
      window.removeEventListener('botAddToCart', handleBotAddToCart);
      window.removeEventListener('botRemoveFromCart', handleBotRemoveFromCart);
      window.removeEventListener('botSearchProducts', handleBotSearchProducts);
    };
  }, []);

  // ===== CALCULATIONS =====
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const getDeliveryCharges = () => {
    if (subtotal > 7500) return 0;
    if (paymentMethod === 'jazzcash') return 140;
    return 150;
  };

  const deliveryCharges = getDeliveryCharges();

  const getTaxRate = () => {
    if (paymentMethod === 'jazzcash') return 0.014;
    return 0.02;
  };

  const taxRate = getTaxRate();
  const tax = subtotal * taxRate;

  const total = subtotal + deliveryCharges + tax;

  // ===== CART ACTIONS =====
  const updateQuantity = (id, delta) => {
    const updatedCart = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  const removeItem = (id) => {
    const newCart = removeFromCart(id);
    setCartItems(newCart);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  const handleClearCart = () => {
    const newCart = clearCart();
    setCartItems(newCart);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    localStorage.setItem('paymentMethod', method);
  };

  return (
    <div className="w-full min-h-screen bg-[#F8F9F6] pb-20 relative">
      {/* Bot Notification Toast */}
      {botNotification && (
        <div className="fixed top-20 right-4 z-50 bg-[#2B7A4B] text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <span className="text-sm font-medium">{botNotification}</span>
        </div>
      )}

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8">
        {/* BREADCRUMBS */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <span className="text-gray-400">🏠</span>
          <Link href="/" className="hover:text-[#2B7A4B]">
            Home
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-[#2B7A4B] font-medium">Cart</span>
        </div>

        {/* PAGE HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 border-b border-gray-200 pb-4">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
            <span className="text-gray-500 text-lg font-medium">
              ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} Items)
            </span>
            <Leaf className="w-5 h-5 text-[#2B7A4B] mb-1" />
          </div>
          <p className="text-sm text-gray-500 mt-2 sm:mt-0 flex items-center gap-2">
            Almost there! Your green friends are waiting for you. 🌱
          </p>
        </div>

        {/* MAIN LAYOUT */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT: CART ITEMS */}
          <div className="flex-1">
            <div className="hidden md:grid grid-cols-12 gap-4 text-xs font-semibold text-gray-500 uppercase border-b border-gray-200 pb-3 mb-4">
              <div className="col-span-5">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-3 text-center">Quantity</div>
              <div className="col-span-1 text-right">Total</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>

            {cartItems.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-500 mb-4">
                  Looks like you haven&lsquo;t added anything to your cart yet.
                </p>
                <Link
                  href="/products"
                  className="inline-block px-6 py-3 bg-[#2B7A4B] text-white rounded-lg font-medium hover:bg-[#23663e] transition-colors"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      {/* Image & Name */}
                      <div className="md:col-span-5 flex items-center gap-4">
                        <div className="w-20 h-20 flex-shrink-0 bg-[#F8F9F6] rounded-lg overflow-hidden border border-gray-100">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{item.name}</h3>
                          <p className="text-xs text-gray-500">{item.desc}</p>
                          <div className="flex items-center gap-2 mt-1 text-xs">
                            {item.tag && (
                              <span className="bg-[#2B7A4B]/10 text-[#2B7A4B] px-2 py-0.5 rounded font-medium">
                                {item.tag}
                              </span>
                            )}
                            {item.originalPrice && (
                              <span className="text-red-500 font-medium bg-red-50 px-2 py-0.5 rounded">
                                {Math.round((1 - item.price / item.originalPrice) * 100)}% OFF
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-xs text-[#2B7A4B]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#2B7A4B]" />
                            In Stock
                          </div>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="md:col-span-2 text-center">
                        <div className="font-bold text-gray-900">
                          Rs. {item.price.toFixed(2)}
                        </div>
                        {item.originalPrice && (
                          <div className="text-xs text-gray-400 line-through">
                            Rs. {item.originalPrice.toFixed(2)}
                          </div>
                        )}
                      </div>

                      {/* Quantity */}
                      <div className="md:col-span-3 flex items-center justify-center">
                        <div className="flex items-center border border-gray-200 rounded-lg bg-white">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-2 hover:bg-gray-50 text-gray-500 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center font-medium text-gray-900 text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-2 hover:bg-gray-50 text-gray-500 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="md:col-span-1 text-right font-bold text-gray-900">
                        Rs. {(item.price * item.quantity).toFixed(2)}
                      </div>

                      {/* Actions */}
                      <div className="md:col-span-1 flex items-center justify-end gap-2">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors hover:bg-red-50 rounded-full"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={handleClearCart}
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition-colors mt-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear Cart
                </button>
              </div>
            )}
          </div>

          {/* RIGHT: ORDER SUMMARY */}
          <div className="lg:w-[380px] flex-shrink-0">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
                <ShoppingBag className="w-5 h-5 text-[#2B7A4B]" />
                <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
              </div>

              {/* PAYMENT METHOD SELECTION */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Payment Method
                </label>
                <div className="space-y-2">
                  <button
                    onClick={() => handlePaymentMethodChange('jazzcash')}
                    className={`w-full flex items-center justify-between p-3 border rounded-lg transition-colors ${
                      paymentMethod === 'jazzcash'
                        ? 'border-[#2B7A4B] bg-[#2B7A4B]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 bg-green-500 rounded flex items-center justify-center text-[8px] text-white font-bold">
                        JC
                      </span>
                      <span className="text-sm font-medium">JazzCash</span>
                    </div>
                    <span className="text-xs text-gray-500">1.4% Tax</span>
                  </button>

                  <button
                    onClick={() => handlePaymentMethodChange('cod')}
                    className={`w-full flex items-center justify-between p-3 border rounded-lg transition-colors ${
                      paymentMethod === 'cod'
                        ? 'border-[#2B7A4B] bg-[#2B7A4B]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">💵</span>
                      <span className="text-sm font-medium">Cash on Delivery</span>
                    </div>
                    <span className="text-xs text-gray-500">2% Tax</span>
                  </button>
                </div>
              </div>

              {/* Breakdown */}
              <div className="space-y-3 text-sm mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} items)</span>
                  <span className="font-medium text-gray-900">Rs. {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charges</span>
                  <span className="font-medium text-[#2B7A4B]">
                    {deliveryCharges === 0 ? 'FREE' : `Rs. ${deliveryCharges.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <div className="flex items-center gap-1">
                    <span>Tax ({taxRate * 100}%)</span>
                  </div>
                  <span className="font-medium text-gray-900">Rs. {tax.toFixed(2)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200 mb-6">
                <span className="text-xl font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-[#2B7A4B]">Rs. {total.toFixed(2)}</span>
              </div>

              {/* PROCEED TO CHECKOUT */}
              <Link
                href={`/checkout?paymentMethod=${paymentMethod}`}
                className="w-full py-3.5 bg-[#2B7A4B] text-white rounded-xl font-semibold text-base hover:bg-[#23663e] transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                Proceed to Checkout
              </Link>

              {/* Free Shipping Message */}
              {subtotal < 7500 && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg text-xs text-[#2B7A4B] flex items-center gap-2">
                  <Truck className="w-4 h-4 flex-shrink-0" />
                  <span>
                    Add Rs. {(7500 - subtotal).toFixed(2)} more to unlock free shipping!
                  </span>
                </div>
              )}

              {/* Delivery Info */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs text-blue-700">
                <p className="font-medium">💡 Delivery Charges:</p>
                <ul className="mt-1 space-y-1">
                  <li>• Free delivery on orders over Rs. 7,500</li>
                  <li>• JazzCash: Rs. 140 delivery, 1.4% tax</li>
                  <li>• COD: Rs. 150 delivery, 2% tax</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* SUPPORT BANNERS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-[#2B7A4B]/10 rounded-full flex items-center justify-center text-[#2B7A4B] flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Secure Checkout</h4>
              <p className="text-xs text-gray-500">SSL Encrypted</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-[#2B7A4B]/10 rounded-full flex items-center justify-center text-[#2B7A4B] flex-shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">30-Day Returns</h4>
              <p className="text-xs text-gray-500">Hassle Free</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-[#2B7A4B]/10 rounded-full flex items-center justify-center text-[#2B7A4B] flex-shrink-0">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">100% Satisfaction</h4>
              <p className="text-xs text-gray-500">Guaranteed</p>
            </div>
          </div>
        </div>

        {/* YOU MAY ALSO LIKE */}
        {cartItems.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">You May Also Like</h2>
              <Link
                href="/products"
                className="text-[#2B7A4B] text-sm font-medium hover:underline flex items-center gap-1"
              >
                View All Plants <span className="text-lg">→</span>
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {SUGGESTED_PRODUCTS.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="group bg-white rounded-xl border border-gray-100 p-3 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                >
                  <div className="relative w-full aspect-square bg-[#F8F9F6] rounded-lg overflow-hidden mb-3">
                    {product.tag && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded z-10">
                        {product.tag}
                      </div>
                    )}
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900 truncate">{product.name}</h4>
                  <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1">
                    <div className="flex text-[#FFB800]">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-2.5 h-2.5 ${
                            i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-gray-400">({product.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div>
                      <span className="text-sm font-bold text-gray-900">
                        Rs. {product.price.toFixed(2)}
                      </span>
                      {product.originalPrice && (
                        <span className="ml-1 text-xs text-gray-400 line-through">
                          Rs. {product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <button className="text-[#2B7A4B] hover:text-[#23663e] transition-colors">
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}