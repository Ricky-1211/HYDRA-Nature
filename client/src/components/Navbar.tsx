import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
  LogOut,
  Package,
  LayoutDashboard,
  Instagram,
  Youtube,
  Linkedin,
} from 'lucide-react';

import { useAppDispatch, useAppSelector } from '../store';
import { logoutUser } from '../store/authSlice';
import { toggleCartDrawer } from '../store/cartSlice';

export const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const cartItems = useAppSelector((state) => state.cart.items);
  const wishlistItems = useAppSelector((state) => state.wishlist.items);

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on path change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  // Click outside to close user dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Botanical Announcement Bar */}
      <div className="bg-[#13382B] text-[#FAF8F5] text-xs py-2 px-4 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden sm:block text-[11px] tracking-wider text-[#A2B997]">
            NATURE • SCIENCE • RADIANCE
          </div>

          <div className="mx-auto sm:mx-0 flex items-center gap-2 text-center text-xs tracking-wide">
            <span>🌿 Free Shipping on Orders Above ₹999</span>
            <span className="text-[#C5A880]">|</span>
            <span className="text-[#E8DFD0]">Nature. Science. You.</span>
          </div>

          {/* Social Icons */}
          <div className="hidden md:flex items-center gap-3 text-[#A2B997]">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors" aria-label="Instagram">
              <Instagram className="w-3.5 h-3.5" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors" aria-label="YouTube">
              <Youtube className="w-3.5 h-3.5" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors" aria-label="LinkedIn">
              <Linkedin className="w-3.5 h-3.5" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors text-[10px] font-bold" aria-label="X">
              𝕏
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md py-3 border-b border-[#EDE8E1]'
            : 'bg-[#FAF8F5]/90 backdrop-blur-sm py-4 border-b border-[#EDE8E1]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Mobile Hamburger Button */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#13382B] hover:text-[#2E6B48] focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Hydra Brand Wordmark & Emblem */}
          <Link to="/" className="flex flex-shrink-0 items-center" aria-label="Hydra home">
            <img
              src="/images/home/Logo.png"
              alt="Hydra Professional Beauty"
              className="h-auto w-24 object-contain [filter:brightness(0)_saturate(100%)_invert(17%)_sepia(20%)_saturate(1200%)_hue-rotate(102deg)_brightness(85%)_contrast(95%)] sm:w-28 lg:w-32"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8 text-sm font-medium text-[#1A211D]">
            <Link
              to="/"
              className={`hover:text-[#13382B] transition-colors ${
                location.pathname === '/' ? 'text-[#13382B] font-semibold border-b-2 border-[#13382B] pb-1' : ''
              }`}
            >
              Home
            </Link>

            <Link
              to="/shop"
              className={`hover:text-[#13382B] transition-colors ${
                location.pathname.startsWith('/shop')
                  ? 'text-[#13382B] font-semibold border-b-2 border-[#13382B] pb-1'
                  : ''
              }`}
            >
              Shop
            </Link>

            <Link
              to="/about"
              className={`hover:text-[#13382B] transition-colors ${
                location.pathname === '/about' ? 'text-[#13382B] font-semibold border-b-2 border-[#13382B] pb-1' : ''
              }`}
            >
              About
            </Link>

            <Link
              to="/blog"
              className={`hover:text-[#13382B] transition-colors ${
                location.pathname.startsWith('/blog') ? 'text-[#13382B] font-semibold border-b-2 border-[#13382B] pb-1' : ''
              }`}
            >
              Blog
            </Link>

            <Link
              to="/contact"
              className={`hover:text-[#13382B] transition-colors ${
                location.pathname === '/contact' ? 'text-[#13382B] font-semibold border-b-2 border-[#13382B] pb-1' : ''
              }`}
            >
              Contact
            </Link>

            <Link
              to="/career"
              className={`hover:text-[#13382B] transition-colors ${
                location.pathname === '/career' ? 'text-[#13382B] font-semibold border-b-2 border-[#13382B] pb-1' : ''
              }`}
            >
              Career
            </Link>
          </div>

          {/* Right Action Icons: Search, Account, Wishlist, Cart */}
          <div className="flex items-center space-x-3 sm:space-x-5 text-[#13382B]">
            {/* Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-1.5 hover:text-[#2E6B48] transition-colors rounded-full hover:bg-black/5"
              aria-label="Search products"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* User Account / Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="p-1.5 hover:text-[#2E6B48] transition-colors rounded-full hover:bg-black/5 flex items-center gap-1"
                aria-label="User Account"
              >
                <User className="w-5 h-5" />
                {user?.role === 'admin' && (
                  <span className="hidden sm:inline-block text-[10px] bg-[#13382B] text-white px-1.5 py-0.5 rounded font-bold uppercase">
                    Admin
                  </span>
                )}
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-[#EDE8E1] py-2 z-50">
                  {isAuthenticated && user ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs font-semibold text-gray-900 truncate">{user.name}</p>
                        <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                      </div>

                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#13382B] hover:bg-[#EAF1EB]"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}

                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-[#FAF8F5]"
                      >
                        <User className="w-4 h-4 text-gray-500" />
                        <span>My Account</span>
                      </Link>

                      <Link
                        to="/orders"
                        className="flex items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-[#FAF8F5]"
                      >
                        <Package className="w-4 h-4 text-gray-500" />
                        <span>Order History</span>
                      </Link>

                      <Link
                        to="/wishlist"
                        className="flex items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-[#FAF8F5]"
                      >
                        <Heart className="w-4 h-4 text-gray-500" />
                        <span>Wishlist ({wishlistItems.length})</span>
                      </Link>

                      <div className="border-t border-gray-100 my-1" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </>
                  ) : (
                    <div className="p-3 text-center">
                      <p className="text-xs text-gray-600 mb-2">Welcome to Hydra Skincare</p>
                      <Link
                        to="/auth"
                        className="block w-full py-2 bg-[#13382B] text-white text-xs font-semibold rounded-lg hover:bg-[#1E4D3B] transition-colors"
                      >
                        Sign In / Register
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className="relative p-1.5 hover:text-[#2E6B48] transition-colors rounded-full hover:bg-black/5"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C5A880] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Shopping Bag / Cart */}
            <button
              onClick={() => dispatch(toggleCartDrawer(true))}
              className="relative p-1.5 hover:text-[#2E6B48] transition-colors rounded-full hover:bg-black/5"
              aria-label="Open Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#13382B] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Animated Search Drawer */}
        {searchOpen && (
          <div className="border-t border-[#EDE8E1] bg-white px-4 py-3 shadow-inner">
            <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto flex items-center gap-2">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                autoFocus
                placeholder="Search natural serums, moisturizers, cleansers, or sunscreen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 text-sm bg-transparent border-none focus:outline-none text-[#1A211D]"
              />
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#13382B] text-white text-xs font-semibold rounded-full hover:bg-[#1E4D3B]"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#EDE8E1] bg-[#FAF8F5] px-4 pt-3 pb-6 space-y-3">
            <Link to="/" className="block py-2 text-sm font-semibold text-[#13382B]">
              Home
            </Link>
            <Link to="/shop" className="block py-2 text-sm font-semibold text-[#13382B]">
              Shop
            </Link>
            <Link to="/about" className="block py-2 text-sm font-semibold text-[#13382B]">
              About Us
            </Link>
            <Link to="/blog" className="block py-2 text-sm font-semibold text-[#13382B]">
              Blog
            </Link>
            <Link to="/contact" className="block py-2 text-sm font-semibold text-[#13382B]">
              Contact
            </Link>
            <Link to="/career" className="block py-2 text-sm font-semibold text-[#13382B]">
              Career
            </Link>
            {!isAuthenticated && (
              <div className="pt-2">
                <Link
                  to="/auth"
                  className="block w-full py-2.5 bg-[#13382B] text-white text-center text-xs font-semibold rounded-full"
                >
                  Sign In / Register
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};
