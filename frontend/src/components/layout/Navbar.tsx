import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  User,
  LogOut,
  Menu,
  X,
  Sparkles,
  Phone,
  Mail,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useDragon } from '../../context/DragonContext';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, signOut } = useAuth();
  const { cart } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { setAssistantOpen, setEmotion, speak } = useDragon();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleDragonCall = () => {
    setEmotion('GREETING', 2000);
    speak('Ready to assist your harvest!', 3000);
    setAssistantOpen(true);
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/shop' },
    { label: 'Blog', path: '/blog' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Top Welcome Notification Bar */}
      <div className="bg-emerald-900 text-emerald-100 text-xs py-1.5 px-4 hidden md:block border-b border-emerald-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-1.5 text-emerald-200">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Direct Farm-to-Table Portal • Gujarat
            </span>
            <span className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone className="w-3 h-3 text-amber-400" />
              +91 95582 54569
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-amber-300 font-medium">
              Free Shipping on all orders above ₹500
            </span>
            <span className="text-emerald-400">|</span>
            <span className="flex items-center gap-1 text-emerald-200">
              <Mail className="w-3 h-3" />
              nikhilraval7473@gmail.com
            </span>
          </div>
        </div>
      </div>

      {/* Main Glass Navbar */}
      <nav className="glass border-b border-slate-200/80 shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Project Brand */}
            <Link
              to="/"
              className="flex items-center space-x-3 group"
              onClick={() => {
                setEmotion('HAPPY', 1500);
              }}
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-800 via-agri-700 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-900/10 group-hover:scale-105 transition-transform duration-200">
                <span className="text-2xl">🌱</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-xl sm:text-2xl tracking-tight text-emerald-950 group-hover:text-agri-700 transition-colors">
                  Agriculture Portal
                </span>
                <span className="text-[10px] uppercase tracking-widest text-emerald-700 font-bold -mt-0.5">
                  Organic & Agricultural Marketplace
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-agri-100/80 text-agri-900 font-bold shadow-xs'
                        : 'text-slate-700 hover:text-agri-800 hover:bg-slate-100/60'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* Actions: AI Assistant, Wishlist, Cart, Account */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Call Dragon Assistant Button */}
              <button
                onClick={handleDragonCall}
                className="hidden sm:flex items-center space-x-1.5 bg-gradient-to-r from-emerald-50 to-agri-100 hover:from-emerald-100 hover:to-agri-200 text-emerald-900 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-xs transition-all hover:scale-105"
                title="Open AI Agriculture Assistant"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" />
                <span>Dragon AI</span>
              </button>

              {/* Wishlist Link */}
              <Link
                to="/wishlist"
                className="p-2 text-slate-700 hover:text-rose-600 hover:bg-slate-100/80 rounded-xl relative transition-colors"
                title="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              {/* Cart Button */}
              <Link
                to="/cart"
                className="flex items-center space-x-2 bg-emerald-800 hover:bg-emerald-900 text-white px-3.5 py-2 rounded-xl text-sm font-semibold shadow-sm hover:shadow-md transition-all group"
              >
                <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Cart</span>
                <span className="bg-emerald-700/80 text-emerald-100 text-xs px-1.5 py-0.5 rounded-lg border border-emerald-600">
                  {cart.cartCount}
                </span>
              </Link>

              {/* User Account / Auth */}
              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-1.5 p-1.5 rounded-xl hover:bg-slate-100 text-slate-700 text-sm font-medium transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-agri-200 text-agri-800 flex items-center justify-center font-bold text-xs uppercase">
                      {user.username.slice(0, 2)}
                    </div>
                    <span className="hidden xl:inline text-xs font-semibold">{user.username}</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-800">{user.fullName || user.username}</p>
                        <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        <User className="w-4 h-4 text-emerald-600" />
                        <span>My Account & Orders</span>
                      </Link>
                      <button
                        onClick={signOut}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden sm:flex items-center space-x-2">
                  <Link
                    to="/signin"
                    className="text-xs font-semibold text-slate-700 hover:text-agri-700 px-3 py-2 rounded-xl transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="text-xs font-semibold bg-agri-600 hover:bg-agri-700 text-white px-3 py-2 rounded-xl shadow-xs transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200/80 bg-white/95 px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-3.5 py-2 rounded-xl text-sm font-semibold ${
                    isActive ? 'bg-agri-100 text-agri-800' : 'text-slate-700 hover:bg-slate-50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              {!isAuthenticated ? (
                <div className="flex gap-2 w-full">
                  <Link
                    to="/signin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center py-2 text-xs font-semibold border border-slate-200 rounded-xl"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center py-2 text-xs font-semibold bg-agri-600 text-white rounded-xl"
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-rose-600 font-semibold px-2 py-1"
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
