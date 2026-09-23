'use client';

import { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, ChevronDown, Search, Check, Loader2, Sparkles, Clock, Mic, ShoppingCart, Trash2, MapPin, Package } from 'lucide-react';
import Image from 'next/image';
import { addToCart, removeFromCart, clearCart, getCart } from '@/app/utils/cart';
import gsap from 'gsap';

// ==========================================
// ✅ N8N WEBHOOK URL (ONLY FOR AI RESPONSES)
// ==========================================
const N8N_WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;

// ==========================================
// ✅ BACKEND API URL
// ==========================================
const API_BASE_URL = 'http://localhost:5000/api';

// ==========================================
// ✅ FALLBACK PRODUCTS (If API fails)
// ==========================================
const FALLBACK_PRODUCTS = [
  { id: 'p1', name: 'Money Plant', desc: 'Indoor Low Maintenance Plant', price: 1999, image: '/products/money-plant.jpg', category: 'Indoor Plants', stock: 50 },
  { id: 'p2', name: 'Snake Plant', desc: 'Air Purifying Plant', price: 2499, image: '/products/snake-plant.jpg', category: 'Indoor Plants', stock: 40 },
  { id: 'p3', name: 'Peace Lily', desc: 'Flowering Indoor Plant', price: 2999, image: '/products/peace-lily.jpg', category: 'Indoor Plants', stock: 35 },
  { id: 'p4', name: 'Fiddle Leaf Fig', desc: 'Indoor Tree', price: 7999, image: '/products/fiddle-leaf.jpg', category: 'Indoor Plants', stock: 15 },
  { id: 'p5', name: 'Aloe Vera', desc: 'Medicinal Plant', price: 1499, image: '/products/aloe-vera.jpg', category: 'Succulents', stock: 60 },
  { id: 'p6', name: 'Lavender Plant', desc: 'Fragrant & Hardy', price: 1299, image: '/products/lavender.jpg', category: 'Outdoor Plants', stock: 45 },
  { id: 'p7', name: 'Pothos Golden', desc: 'Devils Ivy', price: 1899, image: '/products/pothos.jpg', category: 'Indoor Plants', stock: 55 },
  { id: 'p8', name: 'Areca Palm', desc: 'Butterfly Palm', price: 4499, image: '/products/areca-palm.jpg', category: 'Indoor Plants', stock: 20 },
  { id: 'p9', name: 'Succulent Assortment', desc: 'Mini Succulent Pack', price: 2499, image: '/products/succulent.jpg', category: 'Succulents', stock: 30 },
  { id: 'p10', name: 'Fertilizer Organic', desc: 'Plant Food 500ml', price: 999, image: '/products/fertilizer.jpg', category: 'Accessories', stock: 100 },
  { id: 'p11', name: 'Watering Can', desc: '1L Indoor Watering', price: 1599, image: '/products/watering-can.jpg', category: 'Accessories', stock: 25 },
  { id: 'p12', name: 'Potting Mix', desc: 'Organic Soil 5L', price: 1199, image: '/products/potting-mix.jpg', category: 'Accessories', stock: 80 },
];

// ==========================================
// ✅ AGENTS
// ==========================================
const agents = [
  { id: 1, name: 'GreenBot Assistant', desc: 'Your gardening companion', icon: '🤖', color: 'bg-green-600', gradient: 'from-green-600 to-emerald-500', isDefault: true },
  { id: 2, name: 'Shopping Assistant', desc: 'Find & buy plants', icon: '🛍️', color: 'bg-purple-500', gradient: 'from-purple-500 to-pink-400', isDefault: false },
  { id: 3, name: 'Order Tracker', desc: 'Track your orders', icon: '📦', color: 'bg-orange-500', gradient: 'from-orange-500 to-amber-400', isDefault: false },
  { id: 4, name: 'Plant Care Expert', desc: 'Plant care tips', icon: '🌿', color: 'bg-green-500', gradient: 'from-green-500 to-lime-400', isDefault: false },
];

// Quick replies
const quickReplies = [
  "Show best selling plants",
  "Add Money Plant to cart",
  "Add Snake Plant to cart",
  "Remove Money Plant from cart",
  "Show my cart",
  "Show my orders",
  "Track my order",
  "Show my addresses",
  "Clear cart",
  "Place my order"
];

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(agents[0]);
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: `Hello! I'm ${agents[0].name}. How can I help you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchAgent, setSearchAgent] = useState('');
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const widgetRef = useRef(null);
  const buttonRef = useRef(null);

  // Voice recognition states
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);

  // ==========================================
  // ✅ GSAP ANIMATIONS
  // ==========================================
  useEffect(() => {
    if (!isOpen && widgetRef.current) {
      gsap.fromTo(widgetRef.current, 
        { scale: 0.8, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" }
      );
    }
  }, [isOpen]);

  useEffect(() => {
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out",
        paused: true,
        onComplete: () => gsap.to(buttonRef.current, { scale: 1, duration: 0.3 })
      });
    }
  }, []);

  // Animate new messages
  useEffect(() => {
    if (messages.length > 0 && messagesEndRef.current) {
      const lastMessage = messagesEndRef.current.parentElement;
      if (lastMessage) {
        gsap.fromTo(lastMessage,
          { opacity: 0, y: 20, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "power2.out" }
        );
      }
    }
  }, [messages]);

  // Animate typing indicator
  useEffect(() => {
    if (isLoading) {
      gsap.fromTo(".typing-dot",
        { y: 0, opacity: 0.5 },
        { y: -5, opacity: 1, duration: 0.4, repeat: -1, yoyo: true, stagger: 0.1 }
      );
    }
  }, [isLoading]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  // Check voice support
  useEffect(() => {
    if (typeof window !== 'undefined' && !('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setVoiceSupported(false);
    }
  }, []);

  // ✅ FETCH REAL PRODUCTS FROM BACKEND
  const fetchProducts = async () => {
    try {
      setIsLoadingProducts(true);
      
      const endpoints = [
        `${API_BASE_URL}/public/products`,
        `${API_BASE_URL}/public/products/featured`,
        `${API_BASE_URL}/public/products/bestsellers`,
      ];
      
      for (const endpoint of endpoints) {
        try {
          const res = await fetch(endpoint, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });
          
          if (res.ok) {
            const data = await res.json();
            const productsData = data.products || data.data || data;
            
            if (Array.isArray(productsData) && productsData.length > 0) {
              console.log('📦 Products loaded from:', endpoint);
              setProducts(productsData);
              return;
            }
          }
        } catch (e) {
          console.warn(`Failed to fetch from ${endpoint}:`, e.message);
        }
      }
      
      console.log('📦 Using fallback products');
      setProducts(FALLBACK_PRODUCTS);
      
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      setProducts(FALLBACK_PRODUCTS);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Load products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // ==========================================
  // ✅ GET USER CONTEXT (FROM COOKIE)
  // ==========================================
  const getUserContext = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        const user = data.user;
        
        return {
          user: {
            id: user?._id || user?.id,
            firstName: user?.firstName,
            lastName: user?.lastName,
            email: user?.email,
            phone: user?.phone,
            isAdmin: user?.isAdmin,
            role: user?.role,
          },
        };
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  };

  // ==========================================
  // ✅ GET DEFAULT ADDRESS (FROM BACKEND)
  // ==========================================
  const getDefaultAddress = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/addresses`, {
        credentials: 'include',
      });
      
      if (res.ok) {
        const data = await res.json();
        const addresses = data.addresses || data || [];
        
        const defaultAddr = addresses.find(addr => addr.isDefault === true);
        const selectedAddress = defaultAddr || addresses[0] || null;
        
        if (selectedAddress) {
          console.log('✅ Using address:', selectedAddress.label || 'Default');
          return selectedAddress;
        }
      }
      
      console.log('❌ No address found');
      return null;
    } catch (error) {
      console.error('❌ Error fetching addresses:', error);
      return null;
    }
  };

  // ==========================================
  // ✅ GET ADDRESSES (LIST)
  // ==========================================
  const getAddresses = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/addresses`, {
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        return data.addresses || data || [];
      }
      
      return [];
    } catch (error) {
      console.error('❌ Error fetching addresses:', error);
      return [];
    }
  };

  // ==========================================
  // ✅ GET ORDERS (LIST)
  // ==========================================
  const getOrders = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/my-orders`, {
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        return data.orders || [];
      }
      
      return [];
    } catch (error) {
      console.error('❌ Error fetching orders:', error);
      return [];
    }
  };

  // ==========================================
  // ✅ GET ORDER BY ID
  // ==========================================
  const getOrderById = async (orderId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/my-orders`, {
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        const orders = data.orders || [];
        
        const order = orders.find(o => 
          o._id === orderId || 
          o.orderNumber === orderId ||
          o.orderNumber?.toLowerCase().includes(orderId.toLowerCase()) ||
          o._id?.toString().includes(orderId)
        );
        
        return order || null;
      }
      
      return null;
    } catch (error) {
      console.error('❌ Error fetching order:', error);
      return null;
    }
  };

  // ==========================================
  // ✅ FIND PRODUCT IN REAL DATABASE (ADD)
  // ==========================================
  const findProductToAdd = (message) => {
    const lower = message.toLowerCase();
    
    for (const product of products) {
      const name = (product.name || '').toLowerCase();
      const desc = (product.desc || '').toLowerCase();
      const shortName = name.split(' ')[0];
      
      if (lower.includes(name) || lower.includes(shortName) || lower.includes(desc)) {
        return {
          id: product._id || product.id || product.name,
          name: product.name,
          desc: product.desc || '',
          price: product.price,
          image: product.image,
          category: product.category,
          stock: product.stock || 10
        };
      }
    }
    
    return null;
  };

  // ==========================================
  // ✅ FIND PRODUCT TO REMOVE FROM CART
  // ==========================================
  const findProductToRemove = (message) => {
    const lower = message.toLowerCase();
    const cart = getCart();
    
    for (const product of products) {
      const name = (product.name || '').toLowerCase();
      const shortName = name.split(' ')[0];
      
      if (lower.includes(name) || lower.includes(shortName)) {
        const cartItem = cart.find(item => 
          item.name.toLowerCase().includes(name) || 
          item.name.toLowerCase().includes(shortName)
        );
        if (cartItem) {
          return cartItem.id;
        }
      }
    }
    
    if (cart.length > 0) {
      return cart[0].id;
    }
    
    return null;
  };

  // ==========================================
  // ✅ SMART COMMAND DETECTION
  // ==========================================
  const detectCommand = (message) => {
    const lower = message.toLowerCase().trim();
    
    // ===== TRACK ORDER BY ID =====
    const orderIdMatch = lower.match(/gs-\d{8}-\d{4}/i) || lower.match(/[a-f0-9]{24}/i);
    
    if (orderIdMatch) {
      return { type: 'TRACK_ORDER', orderId: orderIdMatch[0] };
    }
    
    // ===== ADD TO CART =====
    if (lower.includes('add') && (lower.includes('cart') || lower.includes('buy') || lower.includes('purchase'))) {
      return { type: 'ADD_TO_CART' };
    }
    
    // ===== REMOVE FROM CART =====
    if (lower.includes('remove') || lower.includes('delete')) {
      return { type: 'REMOVE_FROM_CART' };
    }
    
    // ===== CLEAR CART =====
    if (lower.includes('clear cart') || lower.includes('empty cart')) {
      return { type: 'CLEAR_CART' };
    }
    
    // ===== SHOW CART =====
    if (lower.includes('show cart') || lower.includes('view cart') || lower.includes('my cart') || lower.includes('cart items')) {
      return { type: 'SHOW_CART' };
    }
    
    // ===== CHECKOUT =====
    if (lower.includes('checkout') || lower.includes('place order') || lower.includes('buy now') || lower.includes('order now')) {
      return { type: 'CHECKOUT' };
    }
    
    // ===== SHOW ADDRESSES =====
    if (lower.includes('show address') || lower.includes('my address') || lower.includes('view address') || lower.includes('addresses')) {
      return { type: 'SHOW_ADDRESSES' };
    }
    
    // ===== SHOW ORDERS =====
    if (lower.includes('show order') || lower.includes('my order') || lower.includes('view order') || lower.includes('orders')) {
      return { type: 'SHOW_ORDERS' };
    }
    
    // ===== TRACK ORDER =====
    if (lower.includes('track order') || lower.includes('order status') || lower.includes('where is my order')) {
      return { type: 'TRACK_ORDER' };
    }
    
    // ===== SEARCH PRODUCTS =====
    if (lower.includes('show') || lower.includes('find') || lower.includes('search') || lower.includes('looking for') || lower.includes('best selling') || lower.includes('available') || lower.includes('products')) {
      return { type: 'SEARCH_PRODUCTS' };
    }
    
    const product = findProductToAdd(lower);
    if (product) {
      return { type: 'PRODUCT_DETAILS', product };
    }
    
    return { type: 'AI_RESPONSE' };
  };

  // ==========================================
  // ✅ HANDLE COMMANDS (NO AI NEEDED - FAST)
  // ==========================================
  const handleCommand = async (command, message) => {
    const lower = message.toLowerCase();
    
    // ===== TRACK ORDER BY ID =====
    if (command.type === 'TRACK_ORDER' && command.orderId) {
      const order = await getOrderById(command.orderId);
      
      if (!order) {
        return { 
          text: `❌ Order "${command.orderId}" not found. Please check the ID and try again.`, 
          type: 'TEXT' 
        };
      }
      
      return {
        text: `📦 Order Details:`,
        type: 'ORDER_DETAILS',
        order: order
      };
    }
    
    // ===== TRACK ORDER (General - Show latest) =====
    if (command.type === 'TRACK_ORDER') {
      const orders = await getOrders();
      
      if (orders.length === 0) {
        return { text: '📦 You have no orders yet.', type: 'TEXT' };
      }
      
      const latestOrder = orders[0];
      return {
        text: `📦 Your Latest Order:`,
        type: 'ORDER_DETAILS',
        order: latestOrder
      };
    }
    
    // ===== SHOW ALL ORDERS =====
    if (command.type === 'SHOW_ORDERS') {
      const orders = await getOrders();
      
      if (orders.length === 0) {
        return { text: '📦 You have no orders yet. Place your first order!', type: 'TEXT' };
      }
      
      return {
        text: '📦 Your Orders:',
        type: 'ORDER_LIST',
        orders: orders
      };
    }
    
    // ===== SHOW ADDRESSES =====
    if (command.type === 'SHOW_ADDRESSES') {
      const addresses = await getAddresses();
      
      if (addresses.length === 0) {
        return { text: '📭 You have no saved addresses. Use "Add address" to create one.', type: 'TEXT' };
      }
      
      return {
        text: '📍 Your Saved Addresses:',
        type: 'ADDRESS_LIST',
        addresses: addresses
      };
    }
    
    // ===== ADD TO CART =====
    if (command.type === 'ADD_TO_CART') {
      const product = findProductToAdd(lower);
      if (product) {
        addToCart(product, 1);
        window.dispatchEvent(new Event('cartUpdated'));
        window.dispatchEvent(new CustomEvent('botAddToCart', { 
          detail: { product, quantity: 1, message: `✅ Added ${product.name} to cart!` } 
        }));
        
        gsap.fromTo(".add-to-cart-success",
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" }
        );
        
        return {
          text: `✅ Added ${product.name} to cart!`,
          type: 'ADD_SUCCESS',
          product
        };
      }
      return {
        text: "I couldn't find that product. Here are our available products:",
        type: 'PRODUCT_LIST',
        products: products.slice(0, 5)
      };
    }
    
    // ===== REMOVE FROM CART =====
    if (command.type === 'REMOVE_FROM_CART') {
      const productId = findProductToRemove(lower);
      
      if (productId) {
        const cart = getCart();
        const itemToRemove = cart.find(item => item.id === productId);
        const itemName = itemToRemove ? itemToRemove.name : 'Product';
        
        removeFromCart(productId);
        window.dispatchEvent(new Event('cartUpdated'));
        window.dispatchEvent(new CustomEvent('botRemoveFromCart', { 
          detail: { id: productId, message: `🗑️ Removed ${itemName} from cart!` } 
        }));
        
        return {
          text: `🗑️ Removed ${itemName} from cart!`,
          type: 'REMOVE_SUCCESS'
        };
      }
      
      return { text: '🛒 Your cart is empty! Nothing to remove.', type: 'TEXT' };
    }
    
    // ===== CLEAR CART =====
    if (command.type === 'CLEAR_CART') {
      clearCart();
      window.dispatchEvent(new Event('cartUpdated'));
      window.dispatchEvent(new CustomEvent('botAddToCart', { 
        detail: { message: '🗑️ Cart cleared!' } 
      }));
      return { text: '🗑️ Cart cleared!', type: 'TEXT' };
    }
    
    // ===== SHOW CART =====
    if (command.type === 'SHOW_CART') {
      const cart = getCart();
      if (cart.length === 0) {
        return { text: '🛒 Your cart is empty! Add some plants! 🌱', type: 'TEXT' };
      }
      
      return {
        text: '🛒 Your Cart:',
        type: 'CART_ITEMS',
        items: cart
      };
    }
    
    // ===== CHECKOUT =====
    if (command.type === 'CHECKOUT') {
      const cart = getCart();
      if (cart.length === 0) {
        return { text: '🛒 Your cart is empty! Add some plants first! 🌱', type: 'TEXT' };
      }
      
      return {
        text: '💳 Review Your Order:',
        type: 'CHECKOUT_REVIEW',
        items: cart
      };
    }
    
    // ===== PRODUCT DETAILS =====
    if (command.type === 'PRODUCT_DETAILS' && command.product) {
      const p = command.product;
      return {
        text: `🌿 ${p.name}`,
        type: 'PRODUCT_DETAIL',
        product: p
      };
    }
    
    // ===== SEARCH PRODUCTS =====
    if (command.type === 'SEARCH_PRODUCTS') {
      if (products.length === 0) {
        return { text: '📦 Loading products...', type: 'TEXT' };
      }
      
      return {
        text: '🌿 Available Plants:',
        type: 'PRODUCT_LIST',
        products: products.slice(0, 6)
      };
    }
    
    return null;
  };

  // ==========================================
  // ✅ HANDLE PLACE ORDER (USES DEFAULT ADDRESS)
  // ==========================================
  const handlePlaceOrder = async (cartItems) => {
    const context = await getUserContext();
    
    if (!context) {
      return "🔒 Please login to place your order!";
    }

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 7500 ? 0 : 599;
    const total = subtotal + shipping;

    const orderNumber = `GS-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    try {
      const defaultAddress = await getDefaultAddress();

      const shippingAddress = defaultAddress ? {
        firstName: defaultAddress.fullName?.split(' ')[0] || context.user?.firstName || 'Guest',
        lastName: defaultAddress.fullName?.split(' ')[1] || context.user?.lastName || 'User',
        email: context.user?.email || 'guest@example.com',
        phone: defaultAddress.phone || context.user?.phone || '03001234567',
        address: defaultAddress.addressLine1 || '123 Main Street',
        city: defaultAddress.city || 'Karachi',
        state: defaultAddress.state || 'Sindh',
        zip: defaultAddress.postalCode || '74000',
        country: defaultAddress.country || 'Pakistan',
      } : {
        firstName: context.user?.firstName || 'Guest',
        lastName: context.user?.lastName || 'User',
        email: context.user?.email || 'guest@example.com',
        phone: context.user?.phone || '03001234567',
        address: context.user?.address || '123 Main Street',
        city: context.user?.city || 'Karachi',
        state: context.user?.state || 'Sindh',
        zip: context.user?.zip || '74000',
        country: 'Pakistan',
      };

      const orderResponse = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          orderNumber,
          items: cartItems.map(item => ({
            product: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
          shippingAddress,
          paymentMethod: 'credit',
          totalAmount: total,
        }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.error || 'Failed to place order');
      }

      const orderData = await orderResponse.json();
      
      clearCart();
      window.dispatchEvent(new Event('cartUpdated'));
      
      return `✅ Order Placed Successfully!\n\n📝 Order ID: ${orderData._id}\n📄 Order Number: ${orderData.orderNumber || orderNumber}\n💰 Total: Rs. ${total.toFixed(2)}\n📦 Shipping to: ${shippingAddress.firstName} ${shippingAddress.lastName}\n📍 ${shippingAddress.city}, ${shippingAddress.country}\n\nThank you for shopping with GreenScape! 🌿`;
    } catch (error) {
      console.error('❌ Order Error:', error);
      return `❌ Failed to place order: ${error.message}`;
    }
  };

  // ==========================================
  // ✅ RENDER PRODUCT CARD IN CHAT
  // ==========================================
  const renderProductCard = (product) => {
    return (
      <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm mb-2 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
            {product.image ? (
              <Image 
                src={product.image} 
                alt={product.name} 
                width={64} 
                height={64}
                unoptimized
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl">🌿</div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 text-sm truncate">{product.name}</h4>
            <p className="text-xs text-gray-500 line-clamp-1">{product.desc || product.description}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-bold text-[#2B7A4B]">Rs. {typeof product.price === 'number' ? product.price.toFixed(2) : product.price}</span>
              {product.stock > 0 ? (
                <span className="text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full">In Stock</span>
              ) : (
                <span className="text-[10px] text-red-500 bg-red-50 px-2 py-0.5 rounded-full">Out of Stock</span>
              )}
            </div>
          </div>
          
          <button
            onClick={() => {
              addToCart(product, 1);
              window.dispatchEvent(new Event('cartUpdated'));
              window.dispatchEvent(new CustomEvent('botAddToCart', { 
                detail: { product, quantity: 1, message: `✅ Added ${product.name} to cart!` } 
              }));
              setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: `✅ Added ${product.name} to cart!`,
                type: 'ADD_SUCCESS',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }]);
            }}
            className="w-8 h-8 bg-[#2B7A4B] text-white rounded-lg flex items-center justify-center hover:bg-[#23663e] transition-colors hover:scale-110 flex-shrink-0"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  // ==========================================
  // ✅ RENDER CART ITEM CARD
  // ==========================================
  const renderCartItemCard = (item) => {
    return (
      <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm mb-2 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
            {item.image ? (
              <Image 
                src={item.image} 
                alt={item.name} 
                width={64} 
                height={64}
                unoptimized
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl">🌿</div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 text-sm truncate">{item.name}</h4>
            <p className="text-xs text-gray-500 line-clamp-1">{item.desc}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-bold text-[#2B7A4B]">Rs. {(item.price * item.quantity).toFixed(2)}</span>
              <span className="text-xs text-gray-400">(Rs. {item.price} x {item.quantity})</span>
            </div>
          </div>
          
          <button
            onClick={() => {
              removeFromCart(item.id);
              window.dispatchEvent(new Event('cartUpdated'));
              window.dispatchEvent(new CustomEvent('botRemoveFromCart', { 
                detail: { id: item.id, message: `🗑️ Removed ${item.name} from cart!` } 
              }));
              
              const updatedCart = getCart();
              setMessages(prev => {
                const newMessages = [...prev];
                if (newMessages[newMessages.length - 1].type === 'CART_ITEMS') {
                  newMessages[newMessages.length - 1] = {
                    ...newMessages[newMessages.length - 1],
                    items: updatedCart,
                    content: updatedCart.length === 0 ? '🛒 Your cart is empty!' : '🛒 Your Cart:'
                  };
                }
                return newMessages;
              });
            }}
            className="w-8 h-8 bg-red-50 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-100 transition-colors hover:scale-110 flex-shrink-0"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  // ==========================================
  // ✅ RENDER CART TOTAL
  // ==========================================
  const renderCartTotal = (cart) => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 7500 ? 0 : 599;
    const total = subtotal + shipping;
    
    return (
      <div className="bg-[#F8F9F6] rounded-xl p-3 border border-gray-100 mt-2">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-semibold text-gray-900">Rs. {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Shipping</span>
          <span className="font-semibold text-[#2B7A4B]">{shipping === 0 ? 'FREE' : `Rs. ${shipping.toFixed(2)}`}</span>
        </div>
        <div className="flex justify-between text-sm font-bold pt-2 border-t border-gray-200 mt-2">
          <span className="text-gray-900">Total</span>
          <span className="text-[#2B7A4B]">Rs. {total.toFixed(2)}</span>
        </div>
      </div>
    );
  };

  // ==========================================
  // ✅ RENDER ADDRESS CARD
  // ==========================================
  const renderAddressCard = (address) => {
    return (
      <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#2B7A4B]/10 rounded-full flex items-center justify-center text-[#2B7A4B]">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 text-sm">{address.label || 'Address'}</h4>
            <p className="text-xs text-gray-500 truncate">{address.fullName}</p>
            <p className="text-xs text-gray-500 truncate">{address.addressLine1}, {address.city}</p>
            <p className="text-xs text-gray-500 truncate">{address.country}</p>
            {address.isDefault && (
              <span className="text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Default</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // ✅ RENDER ORDER CARD
  // ==========================================
  const renderOrderCard = (order) => {
    return (
      <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm mb-2">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-900 text-sm">Order #{order.orderNumber}</h4>
            <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
            {order.orderStatus}
          </span>
        </div>
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-500">{order.items?.length || 0} items</span>
          <span className="text-sm font-bold text-[#2B7A4B]">Rs. {order.totalAmount?.toFixed(2)}</span>
        </div>
      </div>
    );
  };

  // ==========================================
  // ✅ RENDER ORDER DETAILS
  // ==========================================
  const renderOrderDetails = (order) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-700',
      processing: 'bg-blue-100 text-blue-700',
      shipped: 'bg-purple-100 text-purple-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700'
    };
    
    return (
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm mb-2">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="font-bold text-gray-900">Order #{order.orderNumber}</h4>
            <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusColors[order.orderStatus] || 'bg-gray-100 text-gray-700'}`}>
            {order.orderStatus}
          </span>
        </div>
        
        <div className="space-y-2 mb-3">
          {order.items?.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              {item.image && (
                <Image 
                  src={item.image} 
                  alt={item.name} 
                  width={40} 
                  height={40}
                  unoptimized
                  className="w-10 h-10 rounded-lg object-cover"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                <p className="text-xs text-gray-500">Qty: {item.quantity} × Rs. {item.price?.toFixed(2)}</p>
              </div>
              <span className="text-sm font-bold text-gray-900">Rs. {(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        
        {order.shippingAddress && (
          <div className="mb-3 pt-3 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-700 mb-1">Shipping To:</p>
            <p className="text-xs text-gray-500">
              {order.shippingAddress.firstName} {order.shippingAddress.lastName}
            </p>
            <p className="text-xs text-gray-500">
              {order.shippingAddress.address}, {order.shippingAddress.city}
            </p>
            <p className="text-xs text-gray-500">
              {order.shippingAddress.country} - {order.shippingAddress.zip}
            </p>
          </div>
        )}
        
        <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-900">Total</span>
          <span className="text-lg font-bold text-[#2B7A4B]">Rs. {order.totalAmount?.toFixed(2)}</span>
        </div>
        
        {order.statusHistory?.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-700 mb-2">Order Timeline:</p>
            <div className="space-y-1.5">
              {order.statusHistory.slice().reverse().map((history, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 rounded-full bg-[#2B7A4B]"></div>
                  <span className="text-gray-700 capitalize">{history.status}</span>
                  <span className="text-gray-400 ml-auto">{new Date(history.changedAt).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ==========================================
  // ✅ HANDLE SEND (SMART ROUTING)
  // ==========================================
  const handleSend = async (text) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMessage = { 
      role: 'user', 
      content: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setShowQuickReplies(false);
    setIsLoading(true);
    setUnreadCount(0);

    const command = detectCommand(messageText);
    console.log('🎯 Command detected:', command.type, command.orderId || '');

    const commandResponse = await handleCommand(command, messageText);
    if (commandResponse) {
      setIsLoading(false);
      
      const botMessage = { 
        role: 'assistant', 
        content: commandResponse.text,
        type: commandResponse.type,
        product: commandResponse.product,
        products: commandResponse.products,
        items: commandResponse.items,
        addresses: commandResponse.addresses,
        orders: commandResponse.orders,
        order: commandResponse.order,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      if (commandResponse.type === 'CART_ITEMS' && commandResponse.items) {
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: 'Cart Summary',
            type: 'CART_TOTAL',
            items: commandResponse.items,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]);
        }, 300);
      }
      
      speakResponse(commandResponse.text);
      return;
    }

    const context = await getUserContext();
    
    try {
      console.log('📤 Sending to n8n:', N8N_WEBHOOK_URL);
      
      const res = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: messageText,
          sessionId: context?.user?.id || 'guest',
          agent: selectedAgent.name,
          userId: context?.user?.id || null,
          userEmail: context?.user?.email || null,
          cart: getCart(),
        }),
      });

      let data;
      try {
        data = await res.json();
        console.log('📥 Response:', data);
      } catch (e) {
        data = { output: 'Sorry, I had trouble processing that. Please try again.' };
      }

      const responseText = Array.isArray(data) 
        ? data[0]?.output || data[0]?.response || data[0]?.message 
        : data.output || data.response || data.message || 'No response';

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: responseText,
        type: 'TEXT',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      
      speakResponse(responseText);
      setIsLoading(false);
    } catch (error) {
      console.error('❌ Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I am having trouble connecting. Please try again.',
        type: 'TEXT',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setIsLoading(false);
    }
  };

  // Voice recognition
  const startVoiceRecognition = () => {
    if (!voiceSupported) {
      alert('Voice recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log('🎤 Recognized:', transcript);
      setInput(transcript);
      setIsListening(false);
      
      setTimeout(() => {
        handleSend(transcript);
      }, 500);
    };

    recognition.onerror = (event) => {
      console.error('Voice error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // Text to speech
  const speakResponse = (text) => {
    if (!window.speechSynthesis) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const filteredAgents = agents.filter(agent => 
    agent.name.toLowerCase().includes(searchAgent.toLowerCase())
  );

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
    
    if (!isOpen) {
      setUnreadCount(0);
      gsap.fromTo(widgetRef.current,
        { scale: 0.8, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" }
      );
    }
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleButtonClick}
        className={`fixed bottom-6 right-6 z-[100] w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
          isOpen 
            ? 'bg-red-500 text-white' 
            : 'bg-gradient-to-r from-[#1A3C34] to-[#2B7A4B] text-white'
        }`}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Bot className="w-6 h-6" />}
        {!isOpen && (
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white animate-pulse"></span>
        )}
        {!isOpen && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          ref={widgetRef}
          className="fixed bottom-20 right-4 z-[100] w-[calc(100vw-2rem)] max-w-[380px] h-[80vh] max-h-[650px] min-h-[350px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-gray-100 sm:right-6 sm:bottom-24 sm:w-[380px] sm:max-w-[380px]"
        >
          
          <div className="bg-gradient-to-r from-[#1A3C34] to-[#2B7A4B] text-white p-4 flex items-center justify-between cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center sm:w-12 sm:h-12">
                <Bot className="w-5 h-5 text-white sm:w-6 sm:h-6" />
                <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-[#1A3C34]"></span>
              </div>
              <div>
                <p className="text-[10px] text-green-300 uppercase tracking-wider font-semibold">AI Agent</p>
                <h3 className="text-base font-bold flex items-center gap-2 sm:text-lg">
                  {selectedAgent.name}
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300 sm:w-4 sm:h-4" />
                </h3>
                <p className="text-xs text-white/70">{selectedAgent.desc}</p>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform sm:w-5 sm:h-5 ${isExpanded ? 'rotate-180' : ''}`} />
          </div>

          {isExpanded && (
            <div className="absolute top-0 left-0 right-0 bg-white z-10 h-full p-4 overflow-y-auto chat-scroll">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Choose an Agent</h3>
                  <p className="text-sm text-gray-500">Select a specialist to help you</p>
                </div>
                <button onClick={() => setIsExpanded(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search agents..."
                  value={searchAgent}
                  onChange={(e) => setSearchAgent(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                {filteredAgents.map((agent) => (
                  <div
                    key={agent.id}
                    onClick={() => {
                      setSelectedAgent(agent);
                      setIsExpanded(false);
                      setShowQuickReplies(true);
                    }}
                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                      selectedAgent.id === agent.id 
                        ? 'bg-green-50 border-2 border-green-200' 
                        : 'border-2 border-transparent hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${agent.gradient} flex items-center justify-center text-white text-lg shadow-md sm:w-12 sm:h-12 sm:text-xl`}>
                        {agent.icon}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 flex items-center gap-2">
                          {agent.name}
                          {agent.isDefault && (
                            <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Default</span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500">{agent.desc}</p>
                      </div>
                    </div>
                    {selectedAgent.id === agent.id ? (
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white">
                        <Check className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-gray-200"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ✅ FIXED: Chat Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 bg-[#F8F9F6] chat-scroll">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[95%] ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  <div
                    className={`inline-block p-3 rounded-2xl text-sm shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-gradient-to-r from-[#1A3C34] to-[#2B7A4B] text-white rounded-br-md' 
                        : 'bg-white text-gray-800 rounded-bl-md border border-gray-100'
                    }`}
                  >
                    {msg.content}
                  </div>
                  
                  {msg.type === 'PRODUCT_LIST' && msg.products && (
                    <div className="mt-2 space-y-2">
                      {msg.products.map((product, i) => (
                        <div key={i}>{renderProductCard(product)}</div>
                      ))}
                    </div>
                  )}
                  
                  {msg.type === 'PRODUCT_DETAIL' && msg.product && (
                    <div className="mt-2">
                      {renderProductCard(msg.product)}
                      <p className="text-xs text-gray-500 mt-2">Want to add it to your cart? Just say "Add {msg.product.name} to cart"</p>
                    </div>
                  )}
                  
                  {msg.type === 'CART_ITEMS' && msg.items && (
                    <div className="mt-2 space-y-2">
                      {msg.items.map((item, i) => (
                        <div key={i}>{renderCartItemCard(item)}</div>
                      ))}
                    </div>
                  )}
                  
                  {msg.type === 'CART_TOTAL' && msg.items && (
                    <div className="mt-2">{renderCartTotal(msg.items)}</div>
                  )}
                  
                  {msg.type === 'ADD_SUCCESS' && msg.product && (
                    <div className="mt-2 flex items-center gap-2 bg-green-50 p-2 rounded-lg">
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-xs text-green-700">{msg.product.name} added to cart!</span>
                    </div>
                  )}
                  
                  {msg.type === 'ADDRESS_LIST' && msg.addresses && (
                    <div className="mt-2 space-y-2">
                      {msg.addresses.map((address, i) => (
                        <div key={i}>{renderAddressCard(address)}</div>
                      ))}
                    </div>
                  )}
                  
                  {msg.type === 'ORDER_LIST' && msg.orders && (
                    <div className="mt-2 space-y-2">
                      {msg.orders.map((order, i) => (
                        <div key={i}>{renderOrderCard(order)}</div>
                      ))}
                    </div>
                  )}
                  
                  {msg.type === 'ORDER_DETAILS' && msg.order && (
                    <div className="mt-2">
                      {renderOrderDetails(msg.order)}
                    </div>
                  )}
                  
                  {msg.type === 'CHECKOUT_REVIEW' && msg.items && (
                    <div className="mt-2 space-y-2">
                      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                        <h4 className="font-bold text-gray-900 mb-3">📋 Order Summary</h4>
                        {msg.items.map((item, i) => (
                          <div key={i} className="flex items-center gap-2 mb-2">
                            <span className="text-sm text-gray-600">{item.name} x {item.quantity}</span>
                            <span className="text-sm font-bold text-gray-900 ml-auto">Rs. {(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                        
                        <div className="border-t border-gray-100 mt-3 pt-3">
                          <div className="flex justify-between text-sm font-bold">
                            <span className="text-gray-900">Total</span>
                            <span className="text-[#2B7A4B]">
                              Rs. {msg.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
                            </span>
                          </div>
                        </div>
                        
                        <button
                          onClick={async () => {
                            setIsLoading(true);
                            const result = await handlePlaceOrder(msg.items);
                            setIsLoading(false);
                            setMessages(prev => [...prev, {
                              role: 'assistant',
                              content: result,
                              type: 'TEXT',
                              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            }]);
                          }}
                          disabled={isLoading}
                          className="w-full mt-4 py-3 bg-[#2B7A4B] text-white rounded-xl font-semibold hover:bg-[#23663e] transition-colors disabled:opacity-50"
                        >
                          {isLoading ? 'Processing...' : '✅ Confirm & Place Order'}
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-white p-3 rounded-2xl rounded-bl-md shadow-sm border border-gray-100 flex items-center gap-3">
                  <div className="flex space-x-1">
                    <div className="typing-dot w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="typing-dot w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="typing-dot w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-xs text-gray-500">Thinking...</span>
                </div>
              </div>
            )}
            
            {showQuickReplies && !isLoading && (
              <div className="flex flex-wrap gap-2 mb-4">
                {quickReplies.map((reply, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(reply)}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-full text-xs text-gray-600 hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-all hover:scale-105"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t border-gray-100 bg-white">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type or tap mic to speak..."
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 sm:py-3"
              />
              
              <button
                onClick={startVoiceRecognition}
                disabled={isListening}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isListening 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                title="Voice input"
              >
                <Mic className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 bg-gradient-to-r from-[#1A3C34] to-[#2B7A4B] text-white rounded-full flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 sm:w-11 sm:h-11"
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
            <p className="text-[10px] text-gray-400 text-center mt-2">
              Powered by GreenScape AI • {voiceSupported ? 'Tap mic to speak' : 'Voice not supported'}
            </p>
          </div>
        </div>
      )}
    </>
  );
}