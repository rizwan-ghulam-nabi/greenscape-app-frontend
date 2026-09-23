// app/components/UserSidePanel.jsx
'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  X, Home, ShoppingBag, LayoutDashboard, Leaf, Sparkles, Gift,
  Box, Heart, MapPin, User, CreditCard, Settings,
  HelpCircle, Phone, Info, LogOut, Check, Menu, Loader2
} from 'lucide-react';

export default function UserSidePanel() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true); 
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // ===== NEW: State for real categories =====
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // ===== NEW: State for real user stats =====
  const [orderCount, setOrderCount] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [memberStatus, setMemberStatus] = useState('New');

  // Auto-close on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch Real User Data
  const fetchUser = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/me', {
        credentials: 'include', 
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        
        // Fetch order stats
        const ordersRes = await fetch('http://localhost:5000/api/orders/my-orders', {
          credentials: 'include',
        });
        
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          const orders = ordersData.orders || [];
          
          // Calculate real order count (exclude cancelled)
          const activeOrders = orders.filter(o => o.orderStatus !== 'cancelled');
          setOrderCount(activeOrders.length);
          
          // Calculate total spent
          const total = activeOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
          setTotalSpent(total);
          
          // Determine member status based on order count
          if (activeOrders.length >= 10) {
            setMemberStatus('Gold');
          } else if (activeOrders.length >= 5) {
            setMemberStatus('Silver');
          } else if (activeOrders.length >= 1) {
            setMemberStatus('Bronze');
          } else {
            setMemberStatus('New');
          }
        }

        // Fetch wishlist count
        const wishlistRes = await fetch('http://localhost:5000/api/wishlist', {
          credentials: 'include',
        });
        
        if (wishlistRes.ok) {
          const wishlistData = await wishlistRes.json();
          const wishlistItems = wishlistData.items || wishlistData.wishlist || [];
          setWishlistCount(wishlistItems.length);
        }
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // ===== NEW: FETCH CATEGORIES FROM API =====
  const fetchCategories = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchCategories();

    // Listen for auth changes and profile image updates
    const handleAuthChange = () => fetchUser();
    window.addEventListener('authChange', handleAuthChange);
    window.addEventListener('profileImageUpdated', handleAuthChange);
    window.addEventListener('cartUpdated', handleAuthChange);
    window.addEventListener('orderPlaced', handleAuthChange);

    return () => {
      window.removeEventListener('authChange', handleAuthChange);
      window.removeEventListener('profileImageUpdated', handleAuthChange);
      window.removeEventListener('cartUpdated', handleAuthChange);
      window.removeEventListener('orderPlaced', handleAuthChange);
    };
  }, []);

  // Logout Handler
  const handleLogout = async () => {
    await fetch('http://localhost:5000/api/auth/logout', { 
      method: 'POST', 
      credentials: 'include' 
    });
    setIsOpen(false);
    router.push('/login');
  };

  const mainLinks = [
    { label: 'Home', icon: <Home className="w-5 h-5" />, href: '/' },
    { label: 'Shop', icon: <ShoppingBag className="w-5 h-5" />, href: '/products' },
    { label: 'Plants Care', icon: <Leaf className="w-5 h-5" />, href: '/plants-care' },
    { label: 'Offers', icon: <Sparkles className="w-5 h-5" />, href: '/offers' },
    { label: 'New Arrivals', icon: <Gift className="w-5 h-5" />, href: '/new-arrivals' },
  ];

  const accountLinks = [
    { label: 'My Orders', icon: <Box className="w-5 h-5" />, href: '/account/orders' },
    { label: 'Wishlist', icon: <Heart className="w-5 h-5" />, href: '/wishlist', badge: wishlistCount > 0 ? wishlistCount.toString() : null },
    { label: 'My Addresses', icon: <MapPin className="w-5 h-5" />, href: '/account/addresses' },
    { label: 'Profile Information', icon: <User className="w-5 h-5" />, href: '/account/profile' },
    { label: 'Payment Methods', icon: <CreditCard className="w-5 h-5" />, href: '/account/payments' },
    { label: 'Account Details', icon: <Settings className="w-5 h-5" />, href: '/account/' },
  ];

  const supportLinks = [
    { label: 'Help Center', icon: <HelpCircle className="w-5 h-5" />, href: '/help' },
    { label: 'Contact Us', icon: <Phone className="w-5 h-5" />, href: '/contact' },
    { label: 'About Us', icon: <Info className="w-5 h-5" />, href: '/about' },
    { label: 'Settings', icon: <Settings className="w-5 h-5" />, href: '/account/settings' },
  ];

  if (loading) {
    return (
      <div className="h-screen w-[320px] bg-white flex items-center justify-center border-r border-gray-200">
        <Loader2 className="w-8 h-8 text-[#2B7A4B] animate-spin" />
      </div>
    );
  }

  return (
    <div className={`
      h-screen border-r border-white/10 transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-2xl relative
      ${isOpen ? 'w-[320px]' : 'w-[75px]'}
      flex flex-col overflow-hidden
      rounded-3xl
    `}>
      
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/side-panel/side-panel.png" 
          alt="Background Nature" 
          fill
          className="object-cover object-left"
          sizes="(max-width: 768px) 100vw, 320px"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-black/60"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#021a12]/95 to-transparent"></div>
      </div>

      {/* ===== 1. TOP LOGO & TOGGLE ===== */}
      <div className={`
        relative z-10 flex items-center justify-between px-4 py-6 border-b border-white/10 bg-white/5 backdrop-blur-sm shrink-0 transition-all duration-300
        ${isOpen ? 'px-5' : 'px-2 justify-center'}
      `}>
        <div className={`flex items-center gap-2 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
          <div>
            <h1 className="text-xl font-bold text-white leading-tight tracking-tight drop-shadow-sm flex items-center">
              <img src='/logo.png' alt='GreenScape Logo' className="h-8 w-auto mr-2" />
            </h1>
            <p className="text-[9px] text-gray-300 tracking-wider mt-0.5">Live Green, Live Better</p>
          </div>
        </div>
        
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 backdrop-blur-md
            ${isOpen 
              ? 'bg-white/20 text-white hover:bg-[#2B7A4B] hover:text-white hover:scale-110 hover:shadow-[0_0_20px_rgba(43,122,75,0.6)]' 
              : 'bg-[#2B7A4B]/80 text-white hover:bg-[#2B7A4B] hover:scale-110 hover:shadow-[0_0_25px_rgba(43,122,75,0.8)]'
            }
          `}
        >
          {isOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
        </button>
      </div>

      {/* ===== 2. USER PROFILE CARD ===== */}
      <div className="px-4 pt-4 pb-2 shrink-0 relative z-10">
        {user && (
          <div className={`
            bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-3 border border-white/20 transition-all duration-300
            ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}
          `}>
            <div className="flex items-center gap-3">
              {user.profileImage ? (
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 shadow-md border-2 border-white/50">
                  <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#2B7A4B] flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-md border-2 border-white/50">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="font-semibold text-gray-900 text-[14px] truncate">{user.firstName} {user.lastName}</p>
                  <span className="flex items-center gap-0.5 text-[8px] text-[#2B7A4B] bg-[#2B7A4B]/10 px-1.5 py-0.5 rounded-full shrink-0">
                    <Check className="w-2.5 h-2.5" /> 
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ===== 3. STATS CARD - REAL DATA ===== */}
      <div className={`px-4 transition-all duration-300 relative z-10 ${isOpen ? 'opacity-100 max-h-40' : 'opacity-0 max-h-0 overflow-hidden'}`}>
        <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-2 mb-2">
          <div className="grid grid-cols-4 gap-0 text-center">
            {/* Real Order Count */}
            <div className="border-r border-gray-200/50 last:border-0 px-1">
              <div className="w-6 h-6 rounded-full bg-gray-50/80 flex items-center justify-center mx-auto mb-1">
                <Box className="w-3 h-3 text-gray-700" />
              </div>
              <span className="text-xs font-bold text-gray-900 block">{orderCount}</span>
              <span className="text-[8px] text-gray-500 uppercase tracking-wider">Orders</span>
            </div>
            
            {/* Real Total Spent */}
            <div className="border-r border-gray-200/50 last:border-0 px-1">
              <div className="w-6 h-6 rounded-full bg-gray-50/80 flex items-center justify-center mx-auto mb-1">
                <CreditCard className="w-3 h-3 text-gray-700" />
              </div>
              <span className="text-[9px] font-bold text-gray-900 block leading-tight">
                {totalSpent >= 1000 ? `PKR ${(totalSpent/1000).toFixed(1)}k` : `PKR ${totalSpent}`}
              </span>
              <span className="text-[8px] text-gray-500 uppercase tracking-wider">Spent</span>
            </div>
            
            {/* Real Wishlist Count */}
            <div className="border-r border-gray-200/50 last:border-0 px-1">
              <div className="w-6 h-6 rounded-full bg-gray-50/80 flex items-center justify-center mx-auto mb-1">
                <Heart className="w-3 h-3 text-gray-700" />
              </div>
              <span className="text-xs font-bold text-gray-900 block">{wishlistCount}</span>
              <span className="text-[8px] text-gray-500 uppercase tracking-wider">Wishlist</span>
            </div>
            
            {/* Real Member Status */}
            <div className="px-1">
              <div className="w-6 h-6 rounded-full bg-gray-50/80 flex items-center justify-center mx-auto mb-1">
                <User className="w-3 h-3 text-gray-700" />
              </div>
              <span className="text-[9px] font-bold text-gray-900 block leading-tight">{memberStatus}</span>
              <span className="text-[8px] text-gray-500 uppercase tracking-wider">Member</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== 4. NAVIGATION ===== */}
      <div className={`flex-1 overflow-y-auto scrollbar-hide px-3 pb-4 space-y-4 transition-all duration-300 relative z-10 ${isOpen ? 'opacity-100' : 'opacity-100'}`}>
        
        {/* MAIN */}
        <div>
          <p className={`text-[9px] font-bold text-gray-300 uppercase tracking-wider mb-2 px-1 transition-all duration-300 drop-shadow-md ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>Main</p>
          <div className="space-y-1">
            {mainLinks.map((link) => (
              <Link key={link.label} href={link.href} className="group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-white/80 hover:bg-white/20 hover:text-white">
                <span className="text-white/70 group-hover:text-white transition-colors shrink-0">{link.icon}</span>
                <span className={`text-[14px] font-medium whitespace-nowrap transition-all duration-300 ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}`}>{link.label}</span>
                <span className={`text-gray-400/50 text-xs ml-auto transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>›</span>
              </Link>
            ))}
          </div>
        </div>

        {/* ===== DYNAMIC CATEGORIES FROM API (FIXED: Uses category.name) ===== */}
        <div>
          <p className={`text-[9px] font-bold text-gray-300 uppercase tracking-wider mb-2 px-1 transition-all duration-300 drop-shadow-md ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>Categories</p>
          <div className="space-y-1">
            {loadingCategories ? (
              <div className="px-3 py-2.5 text-gray-400 text-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading...
              </div>
            ) : (
              categories.slice(0, 6).map((category) => (
                <Link
                  key={category._id}
                  href={`/products?category=${encodeURIComponent(category.name)}`}  // ✅ FIXED: Use category.name
                  className="group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-white/80 hover:bg-white/20 hover:text-white"
                >
                  <span className="text-white/70 group-hover:text-white transition-colors shrink-0 text-lg">
                    {category.icon?.startsWith('http') ? (
                      <img src={category.icon} alt={category.name} className="w-5 h-5 object-contain" />
                    ) : (
                      category.icon || '🌿'
                    )}
                  </span>
                  <span className={`text-[14px] font-medium whitespace-nowrap transition-all duration-300 ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}`}>
                    {category.name}
                  </span>
                  <span className={`text-gray-400/50 text-xs ml-auto transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>›</span>
                </Link>
              ))
            )}
            <Link
              href="/categories"
              className="group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-white/80 hover:bg-white/20 hover:text-white"
            >
              <span className="text-white/70 group-hover:text-white transition-colors shrink-0">
                <LayoutDashboard className="w-5 h-5" />
              </span>
              <span className={`text-[14px] font-medium whitespace-nowrap transition-all duration-300 ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}`}>
                All Categories
              </span>
              <span className={`text-gray-400/50 text-xs ml-auto transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>›</span>
            </Link>
          </div>
        </div>

        {/* MY ACCOUNT */}
        <div>
          <p className={`text-[9px] font-bold text-gray-300 uppercase tracking-wider mb-2 px-1 transition-all duration-300 drop-shadow-md ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>My Account</p>
          <div className="space-y-1">
            {accountLinks.map((link) => (
              <Link key={link.label} href={link.href} className="group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-white/80 hover:bg-white/20 hover:text-white">
                <span className="text-white/70 group-hover:text-white transition-colors shrink-0">{link.icon}</span>
                <span className={`text-[14px] font-medium whitespace-nowrap transition-all duration-300 ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}`}>{link.label}</span>
                <div className={`flex items-center gap-2 ml-auto transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
                  {link.badge && <span className="text-[8px] font-medium bg-[#2B7A4B]/30 text-[#4ade80] px-1.5 py-0.5 rounded-full">{link.badge}</span>}
                  <span className="text-gray-400/50 text-xs">›</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* SUPPORT */}
        <div>
          <p className={`text-[9px] font-bold text-gray-300 uppercase tracking-wider mb-2 px-1 transition-all duration-300 drop-shadow-md ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>Support</p>
          <div className="space-y-1">
            {supportLinks.map((link) => (
              <Link key={link.label} href={link.href} className="group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-white/80 hover:bg-white/20 hover:text-white">
                <span className="text-white/70 group-hover:text-white transition-colors shrink-0">{link.icon}</span>
                <span className={`text-[14px] font-medium whitespace-nowrap transition-all duration-300 ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}`}>{link.label}</span>
                <span className={`text-gray-400/50 text-xs ml-auto transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>›</span>
              </Link>
            ))}
          </div>
        </div>

        {/* LOGOUT */}
        <div className="pt-4 mt-4 border-t border-white/10">
          <button onClick={handleLogout} className="group flex items-center gap-3 w-full px-3 py-2.5 text-white/70 hover:text-red-400 hover:bg-white/10 rounded-xl transition-colors text-[14px] font-medium">
            <LogOut className="w-5 h-5 shrink-0 group-hover:text-red-400 transition-colors" />
            <span className={`text-[14px] font-medium whitespace-nowrap transition-all duration-300 ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}`}>Logout</span>
          </button>
        </div>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}