
// components/Header.js
'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Search, ShoppingCart, Heart, User, Menu, X, LogIn, UserPlus, LogOut, 
  UserCircle, Package, MapPin, Flower2, Sprout, Shovel, Tag, Leaf
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';


const API_BASE_URL = '/api';

export default function Header() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);
  const accountDropdownRef = useRef(null);

  // ===== AUTH STATE (COOKIE BASED) =====
  const [user, setUser] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  // ===== CATEGORIES STATE =====
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // ===== ICON MAPPING =====
  const getCategoryIcon = (categoryName) => {
    const iconMap = {
      'All': <Leaf className="w-4 h-4" />,
      'All Products': <Leaf className="w-4 h-4" />,
      'Plants': <Flower2 className="w-4 h-4" />,
      'Indoor Plants': <Flower2 className="w-4 h-4" />,
      'Outdoor Plants': <Sprout className="w-4 h-4" />,
      'Tools': <Shovel className="w-4 h-4" />,
      'Seeds & Bulbs': <Sprout className="w-4 h-4" />,
      'Seeds and Bulbs': <Sprout className="w-4 h-4" />,
      'Deals': <Tag className="w-4 h-4" />,
      'Pots & Planters': <Package className="w-4 h-4" />,
      'Fertilizers & Soil': <Leaf className="w-4 h-4" />,
      'Gardening Tools': <Shovel className="w-4 h-4" />,
    };
    
    // Check if category has custom icon URL
    const category = categories.find(c => c.name === categoryName);
    if (category?.icon?.startsWith('http')) {
      return <img src={category.icon} alt={categoryName} className="w-5 h-5 object-contain" />;
    }
    if (category?.icon && !category.icon.startsWith('http')) {
      return <span className="text-xl">{category.icon}</span>;
    }
    
    return iconMap[categoryName] || <Leaf className="w-4 h-4" />;
  };

  // ===== MAIN NAVIGATION LINKS =====
  const mainNavLinks = [
    { label: 'All Products', href: '/products?category=All', icon: 'Leaf' },
  ];

  // ===== DYNAMIC CATEGORY LINKS =====
  const categoryLinks = categories.map(cat => ({
    label: cat.name,
    href: `/products?category=${encodeURIComponent(cat.name)}`,
    icon: cat.name,
  }));

  // ===== COMBINED NAVIGATION =====
  const allNavLinks = [...mainNavLinks, ...categoryLinks];

  // 🔥 Fetch user from backend using the httpOnly cookie
  const fetchUser = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        credentials: 'include',
      });
      
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoadingUser(false);
    }
  };

  // ===== FETCH CATEGORIES FROM BACKEND =====
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/categories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      const fetchedCategories = data.categories || [];
      setCategories(fetchedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  };

  // 🔥 Load user on mount and listen for auth changes
  useEffect(() => {
    setIsMounted(true);
    fetchUser();
    fetchCategories();

    const handleAuthChange = () => fetchUser();
    window.addEventListener('authChange', handleAuthChange);

    const handleProfileImageUpdate = () => fetchUser();
    window.addEventListener('profileImageUpdated', handleProfileImageUpdate);

    return () => {
      window.removeEventListener('authChange', handleAuthChange);
      window.removeEventListener('profileImageUpdated', handleProfileImageUpdate);
    };
  }, []);

  // ===== LOGOUT (CLEAR COOKIE) =====
  const handleLogout = async () => {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    setUser(null);
    window.dispatchEvent(new Event('authChange'));
    router.push('/');
  };

  // ===== CART BADGE LOGIC (UPDATED FOR BOT) =====
  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = () => {
    if (typeof window !== 'undefined') {
      const cart = localStorage.getItem('cart');
      if (cart) {
        try {
          const parsedCart = JSON.parse(cart);
          const total = parsedCart.reduce((sum, item) => sum + item.quantity, 0);
          setCartCount(total);
        } catch (e) {
          setCartCount(0);
        }
      } else {
        setCartCount(0);
      }
    }
  };

  useEffect(() => {
    updateCartCount();
    const handleStorageChange = () => updateCartCount();
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdated', handleStorageChange);
    
    // ✅ Listen for bot adding to cart
    window.addEventListener('botAddToCart', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleStorageChange);
      window.removeEventListener('botAddToCart', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (activeDropdown && 
          ((dropdownRef.current && !dropdownRef.current.contains(event.target)) &&
           (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target)))
      ) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeDropdown]);

  const toggleDropdown = (type) => {
    setActiveDropdown(activeDropdown === type ? null : type);
  };

  // Avoid hydration mismatch
  if (!isMounted || isLoadingUser) return null;

  return (
    <header className="bg-white shadow-sm w-full z-50 font-sans sticky top-0 left-0">
      
      <div className="bg-[#2B7A4B] text-white h-[34px] sm:h-[40px] md:h-[46px] lg:h-[50px] xl:h-[56px] overflow-hidden flex items-center w-full">
        <div className="hidden sm:flex whitespace-nowrap animate-scroll w-full">
          <div className="flex items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 px-4 sm:px-6 md:px-8 lg:px-10 text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] xl:text-[20px] 2xl:text-[22px] font-semibold shrink-0">
            <span className="inline-flex items-center gap-1 sm:gap-2">
              🌱 Spring Sale is Live! Up to 40% OFF <span className="underline cursor-pointer hover:opacity-80 font-bold"><Link href="/products">Shop Now</Link></span>
            </span>
            <span className="text-white/40 text-sm">|</span>
            <span className="shrink-0">🚚 Free Shipping over 1000Rs</span>
            <span className="text-white/40 text-sm">|</span>
            <span className="shrink-0">🌿 30-Day Plant Guarantee</span>
          </div>
          <div className="flex items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 px-4 sm:px-6 md:px-8 lg:px-10 text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] xl:text-[20px] 2xl:text-[22px] font-semibold shrink-0">
            <span className="inline-flex items-center gap-1 sm:gap-2">
              🌱 Spring Sale is Live! Up to 40% OFF <span className="underline cursor-pointer hover:opacity-80 font-bold"><Link href="/products">Shop Now</Link></span>
            </span>
            <span className="text-white/40 text-sm">|</span>
            <span className="shrink-0">🚚 Free Shipping over 1000Rs</span>
            <span className="text-white/40 text-sm">|</span>
            <span className="shrink-0">🌿 30-Day Plant Guarantee</span>
          </div>
          <div className="flex items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 px-4 sm:px-6 md:px-8 lg:px-10 text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] xl:text-[20px] 2xl:text-[22px] font-semibold shrink-0">
            <span className="inline-flex items-center gap-1 sm:gap-2">
              🌱 Spring Sale is Live! Up to 40% OFF <span className="underline cursor-pointer hover:opacity-80 font-bold"><Link href="/products">Shop Now</Link></span>
            </span>
            <span className="text-white/40 text-sm">|</span>
            <span className="shrink-0">🚚 Free Shipping over 1000Rs</span>
            <span className="text-white/40 text-sm">|</span>
            <span className="shrink-0">🌿 30-Day Plant Guarantee</span>
          </div>
        </div>

        <div className="flex sm:hidden w-full">
          <marquee behavior="scroll" direction="left" scrollamount="4" className="w-full h-full flex items-center">
            <span className="inline-flex items-center gap-2 px-2 text-[11px] font-semibold whitespace-nowrap">
              <span className="inline-flex items-center gap-1">🌱 Spring Sale 40% OFF <span className="underline font-bold"><Link href="/products">Shop Now</Link></span></span>
              <span className="text-white/40 text-[9px]">|</span>
              <span>🚚 Free Shipping over 1000Rs</span>
              <span className="text-white/40 text-[9px]">|</span>
              <span>🌿 30-Day Plant Guarantee</span>
            </span>
          </marquee>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
        <div className="flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-1 cursor-pointer shrink-0">
            <Link href="/">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#2B7A4B] tracking-tight">Green</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight">Scape</span>
            </Link>
            <span className="hidden lg:block text-[9px] text-gray-400 ml-1 -mt-3 font-medium">Grow. Nature. Thrive.</span>
          </div>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const query = formData.get('search');
              if (query && query.trim() !== '') {
                window.location.href = `/products?search=${encodeURIComponent(query.trim())}`;
              }
            }}
            className="hidden md:flex flex-1 max-w-xl mx-6 lg:mx-10"
          >
            <div className="relative w-full">
              <input 
                name="search"
                type="text" 
                placeholder="Search plants, tools, seeds..." 
                defaultValue="" 
                className="w-full pl-4 pr-10 py-2.5 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[#2B7A4B] bg-gray-50 placeholder:text-gray-400"
              />
              <button type="submit" className="absolute right-3 top-2.5 text-[#2B7A4B] hover:text-[#23663e] transition-colors">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="hidden md:flex items-center gap-6 lg:gap-8 shrink-0">
            
            <Link href="/cart" className="flex flex-col items-center cursor-pointer group relative">
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-gray-700 group-hover:text-[#2B7A4B] transition" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#2B7A4B] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-gray-600 mt-0.5 group-hover:text-[#2B7A4B] transition">Cart</span>
            </Link>

            <div className="flex flex-col items-center cursor-pointer group">
              <Heart className="w-5 h-5 text-gray-700 group-hover:text-[#2B7A4B] transition" />
              <span className="text-[10px] text-gray-600 mt-0.5 group-hover:text-[#2B7A4B] transition">Wishlist</span>
            </div>

            {/* ===== DYNAMIC ACCOUNT DROPDOWN ===== */}
            <div className="relative z-50" ref={accountDropdownRef}>
              <button onClick={() => toggleDropdown('account')} className="flex flex-col items-center cursor-pointer group">
                {user ? (
                  user.profileImage ? (
                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#2B7A4B] shadow-sm">
                        <Image
    src={user.profileImage}
    alt={user?.name || 'Profile'}
    fill
    sizes="(max-width: 768px) 100vw, 200px"
    className="object-cover"
    priority={false}
  />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-[#2B7A4B] rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </div>
                  )
                ) : (
                  <User className="w-5 h-5 text-gray-700 group-hover:text-[#2B7A4B] transition" />
                )}
                <span className="text-[10px] text-gray-600 mt-0.5 group-hover:text-[#2B7A4B] transition">
                  {user ? user.firstName || 'Account' : 'Account'}
                </span>
              </button>
              
              {activeDropdown === 'account' && (
                <div className="absolute top-full right-0 mt-3 min-w-[260px] bg-white shadow-2xl rounded-lg overflow-hidden border border-gray-100 z-50">
                  <div className="absolute -top-2 right-3 w-4 h-4 bg-white border-t border-l border-gray-100 rotate-45 z-10"></div>
                  
                  {user ? (
                    <div className="relative z-10 flex flex-col p-4 gap-1">
                      <div className="px-2 py-2 border-b border-gray-100 mb-1 flex items-center gap-3">
                        {user.profileImage ? (
                          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#2B7A4B]">
                           <Image
      src={user.profileImage}
      alt={user?.name || 'Profile'}
      fill
      sizes="40px"
      className="object-cover"
      priority={false}
    />
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-[#2B7A4B] rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {user.firstName?.[0]}{user.lastName?.[0]}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{user.firstName} {user.lastName}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                      </div>

                      <Link 
                        href="/account/profile"
                        className="relative flex items-center w-full py-2.5 px-3 rounded-md overflow-hidden group/link transition-colors"
                      >
                        <span className="absolute inset-0 bg-[#E8F5E9] w-0 group-hover/link:w-full transition-all duration-700 ease-in-out -z-10"></span>
                        <span className="relative z-10 flex items-center gap-3">
                          <UserCircle className="w-4 h-4 text-gray-500" />
                          <span className="font-medium text-gray-700 transition-colors duration-700 group-hover/link:text-[#2B7A4B]">My Profile</span>
                        </span>
                      </Link>

                      <Link 
                        href="/account/orders"
                        className="relative flex items-center w-full py-2.5 px-3 rounded-md overflow-hidden group/link transition-colors"
                      >
                        <span className="absolute inset-0 bg-[#E8F5E9] w-0 group-hover/link:w-full transition-all duration-700 ease-in-out -z-10"></span>
                        <span className="relative z-10 flex items-center gap-3">
                          <Package className="w-4 h-4 text-gray-500" />
                          <span className="font-medium text-gray-700 transition-colors duration-700 group-hover/link:text-[#2B7A4B]">Order History</span>
                        </span>
                      </Link>

                      <Link 
                        href="/account/addresses"
                        className="relative flex items-center w-full py-2.5 px-3 rounded-md overflow-hidden group/link transition-colors"
                      >
                        <span className="absolute inset-0 bg-[#E8F5E9] w-0 group-hover/link:w-full transition-all duration-700 ease-in-out -z-10"></span>
                        <span className="relative z-10 flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span className="font-medium text-gray-700 transition-colors duration-700 group-hover/link:text-[#2B7A4B]">Address Book</span>
                        </span>
                      </Link>

                      <button 
                        onClick={handleLogout}
                        className="relative flex items-center w-full py-2.5 px-3 rounded-md overflow-hidden group/link transition-colors mt-1 border-t border-gray-100 pt-3"
                      >
                        <span className="absolute inset-0 bg-red-50 w-0 group-hover/link:w-full transition-all duration-700 ease-in-out -z-10"></span>
                        <span className="relative z-10 flex items-center gap-3">
                          <LogOut className="w-4 h-4 text-red-500" />
                          <span className="font-medium text-red-600 transition-colors duration-700 group-hover/link:text-red-700">Logout</span>
                        </span>
                      </button>
                    </div>
                  ) : (
                    <div className="relative z-10 flex flex-col p-4 gap-1">
                      <Link 
                        href="/login"
                        className="relative flex items-center justify-center w-full py-2.5 px-4 rounded-md overflow-hidden group/link transition-colors"
                      >
                        <span className="absolute inset-0 bg-[#E8F5E9] w-0 group-hover/link:w-full transition-all duration-700 ease-in-out -z-10"></span>
                        <span className="relative z-10 flex items-center gap-2">
                          <LogIn className="w-4 h-4" />
                          <span className="font-medium transition-colors duration-700 group-hover/link:text-[#2B7A4B]">Sign In</span>
                        </span>
                      </Link>
                      <div className="border-t border-gray-100 my-1"></div>
                      <Link 
                        href="/signup"
                        className="relative flex items-center justify-center w-full py-2.5 px-4 rounded-md overflow-hidden group/link transition-colors"
                      >
                        <span className="absolute inset-0 bg-[#E8F5E9] w-0 group-hover/link:w-full transition-all duration-700 ease-in-out -z-10"></span>
                        <span className="relative z-10 flex items-center gap-2">
                          <UserPlus className="w-4 h-4" />
                          <span className="font-medium transition-colors duration-700 group-hover/link:text-[#2B7A4B]">Sign Up</span>
                        </span>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition">
            {mobileMenuOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
          </button>
        </div>

        {/* ===== DESKTOP NAVIGATION LINKS ===== */}
        <div className="hidden md:flex items-center justify-center gap-2 mt-3 text-sm font-medium text-gray-700 border-t border-gray-100 pt-3 relative">
          
          {/* ===== CATEGORIES DROPDOWN (DYNAMIC) ===== */}
          <div className="relative group" ref={dropdownRef}>
            <button onClick={() => toggleDropdown('categories')} className="flex items-center gap-1 hover:text-[#2B7A4B] transition py-2 px-4 rounded-lg relative overflow-hidden group/nav">
              <span className="absolute inset-0 bg-[#E8F5E9] w-0 group-hover/nav:w-full transition-all duration-500 ease-in-out -z-10"></span>
              <span className="relative z-10">Categories</span>
              <span className={`text-[10px] text-gray-400 transition-transform duration-300 ${activeDropdown === 'categories' ? 'rotate-180' : ''}`}>▼</span>
            </button>
            
            {activeDropdown === 'categories' && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 w-full min-w-[320px] md:min-w-[600px] lg:w-[1000px] bg-white shadow-xl rounded-lg p-8 border border-gray-100 z-50 overflow-hidden">
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-t border-l border-gray-100 rotate-45 z-10"></div>
                <div className="relative z-10">
                  {loadingCategories ? (
                    <div className="flex justify-center py-8">
                      <div className="w-6 h-6 border-2 border-[#2B7A4B] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : categories.length === 0 ? (
                    <p className="text-gray-500 py-4 px-6">No categories available.</p>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4">
                      {categories.map((category) => (
                        <Link
                          key={category._id}
                          href={`/products?category=${encodeURIComponent(category.name)}`}
                          className="relative flex items-center gap-3 text-gray-600 hover:text-[#2B7A4B] text-base py-2 px-4 rounded-md overflow-hidden border-l-2 border-transparent hover:border-[#2B7A4B] group/link"
                        >
                          <span className="absolute inset-0 bg-[#E8F5E9] w-0 group-hover/link:w-full transition-all duration-700 ease-in-out -z-10"></span>
                          <span className="relative z-10 flex items-center gap-3">
                            <span className="text-xl">
                              {getCategoryIcon(category.name)}
                            </span>
                            <span>{category.name}</span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Static Links - Now linking to category pages */}
          {allNavLinks.slice(0, 5).map((link) => (
            <Link 
              key={link.label}
              href={link.href}
              className="relative hover:text-[#2B7A4B] transition py-2 px-4 rounded-lg overflow-hidden group/nav flex items-center gap-1.5"
            >
              <span className="absolute inset-0 bg-[#E8F5E9] w-0 group-hover/nav:w-full transition-all duration-500 ease-in-out -z-10"></span>
              <span className="relative z-10 flex items-center gap-1.5">
                {getCategoryIcon(link.icon)}
                {link.label}
              </span>
            </Link>
          ))}

          <Link 
            href="/blog" 
            className="relative hover:text-[#2B7A4B] transition py-2 px-4 rounded-lg overflow-hidden group/nav"
          >
            <span className="absolute inset-0 bg-[#E8F5E9] w-0 group-hover/nav:w-full transition-all duration-500 ease-in-out -z-10"></span>
            <span className="relative z-10">Blog</span>
          </Link>
        </div>

        {/* ===== MOBILE MENU ===== */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-100 pt-4 space-y-3">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const query = formData.get('search');
                if (query && query.trim() !== '') {
                  window.location.href = `/products?search=${encodeURIComponent(query.trim())}`;
                }
              }}
              className="relative w-full mb-3"
            >
              <input 
                name="search"
                type="text" 
                placeholder="Search plants, tools..." 
                className="w-full pl-4 pr-10 py-2.5 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[#2B7A4B] bg-gray-50"
              />
              <button type="submit" className="absolute right-3 top-2.5 text-[#2B7A4B]">
                <Search className="w-4 h-4" />
              </button>
            </form>

            <div className="flex items-center gap-4 pb-2 border-b border-gray-100">
              <Link href="/cart" className="flex flex-col items-center cursor-pointer group relative flex-1">
                <div className="relative">
                  <ShoppingCart className="w-5 h-5 text-gray-700 group-hover:text-[#2B7A4B] transition" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-[#2B7A4B] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-gray-600 mt-0.5">Cart</span>
              </Link>
              <div className="flex flex-col items-center cursor-pointer group flex-1">
                <Heart className="w-5 h-5 text-gray-700 group-hover:text-[#2B7A4B] transition" />
                <span className="text-[10px] text-gray-600 mt-0.5">Wishlist</span>
              </div>
              {user ? (
                <div className="flex flex-col items-center flex-1">
                  {user.profileImage ? (
                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#2B7A4B]">
                      <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-[#2B7A4B] rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {user.firstName?.[0]}
                    </div>
                  )}
                  <span className="text-[10px] text-gray-600 mt-0.5">{user.firstName}</span>
                </div>
              ) : (
                <Link href="/login" className="flex flex-col items-center cursor-pointer group flex-1">
                  <User className="w-5 h-5 text-gray-700 group-hover:text-[#2B7A4B] transition" />
                  <span className="text-[10px] text-gray-600 mt-0.5">Account</span>
                </Link>
              )}
            </div>

            {/* ===== MOBILE CATEGORIES (DYNAMIC) ===== */}
            <div className="space-y-2">
              <details>
                <summary className="block py-2 text-gray-700 font-medium cursor-pointer flex items-center justify-between">
                  Categories <span className="text-xs">▶</span>
                </summary>
                <div className="pl-4 py-2 space-y-2 bg-gray-50 rounded-lg">
                  {loadingCategories ? (
                    <div className="flex justify-center py-4">
                      <div className="w-5 h-5 border-2 border-[#2B7A4B] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : categories.length === 0 ? (
                    <p className="text-gray-500 text-xs py-2 px-2">No categories available.</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {categories.map((category) => (
                        <Link
                          key={category._id}
                          href={`/products?category=${encodeURIComponent(category.name)}`}
                          className="flex items-center gap-2 text-gray-600 text-sm py-1.5 px-2 hover:text-[#2B7A4B] rounded-md hover:bg-gray-100 transition-colors"
                        >
                          <span className="text-base">
                            {getCategoryIcon(category.name)}
                          </span>
                          <span>{category.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </details>
              
              {/* Main nav links in mobile */}
              {allNavLinks.slice(0, 6).map((link) => (
                <Link 
                  key={link.label}
                  href={link.href}
                  className="block py-2 text-gray-700 border-b border-gray-50 hover:text-[#2B7A4B] transition-colors flex items-center gap-2"
                >
                  {getCategoryIcon(link.icon)}
                  {link.label}
                </Link>
              ))}
              
              <Link href="/blog" className="block py-2 text-gray-700 border-b border-gray-50 hover:text-[#2B7A4B] transition-colors">Blog</Link>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </header>
  );
}