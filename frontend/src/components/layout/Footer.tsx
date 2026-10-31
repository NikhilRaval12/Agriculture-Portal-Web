import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Heart, ArrowUp, ShieldCheck, Truck, RefreshCw, Sparkles } from 'lucide-react';
import { useDragon } from '../../context/DragonContext';

export const Footer: React.FC = () => {
  const { setEmotion, speak } = useDragon();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setEmotion('HAPPY', 1500);
  };

  return (
    <footer className="bg-emerald-950 text-slate-300 pt-16 pb-8 border-t border-emerald-900 relative">
      {/* Scroll to Top Floating Button */}
      <button
        onClick={scrollToTop}
        className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-agri-600 hover:bg-agri-500 text-white flex items-center justify-center shadow-lg transition-transform hover:-translate-y-1 active:scale-95"
        title="Scroll to Top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Core Links & Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: About Portal */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-800 flex items-center justify-center text-xl shadow-xs">
                🌱
              </div>
              <span className="font-display font-bold text-xl text-white">
                Agriculture Portal
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering farmers and conscious consumers with certified organic vegetables, sweet farm fruits, bio-enriched fertilizers, and precision modern machinery.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-emerald-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                100% Organic Verified
              </span>
              <span className="flex items-center gap-1">
                <Truck className="w-4 h-4 text-emerald-400" />
                Direct Farm Dispatch
              </span>
            </div>
          </div>

          {/* Col 2: Navigation Menu */}
          <div>
            <h4 className="font-display font-semibold text-white text-base mb-4 tracking-wide uppercase text-xs">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/shop" className="hover:text-emerald-400 transition-colors">
                  Shop Products & Categories
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-emerald-400 transition-colors">
                  Your Harvest Wishlist
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-emerald-400 transition-colors">
                  About Our Mission
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-emerald-400 transition-colors">
                  Agriculture Knowledge Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-emerald-400 transition-colors">
                  Contact & Farm Inquiry
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Policies */}
          <div>
            <h4 className="font-display font-semibold text-white text-base mb-4 tracking-wide uppercase text-xs">
              Harvest Policies
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <span className="text-slate-400 hover:text-slate-200 cursor-pointer">
                  Free Shipping on Orders &gt; ₹500
                </span>
              </li>
              <li>
                <span className="text-slate-400 hover:text-slate-200 cursor-pointer">
                  3-5 Business Days Delivery
                </span>
              </li>
              <li>
                <span className="text-slate-400 hover:text-slate-200 cursor-pointer">
                  Freshness Guarantee & Returns
                </span>
              </li>
              <li>
                <span className="text-slate-400 hover:text-slate-200 cursor-pointer">
                  Farmer Partnership Program
                </span>
              </li>
              <li>
                <span className="text-slate-400 hover:text-slate-200 cursor-pointer">
                  Privacy Policy & Terms
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact Info */}
          <div>
            <h4 className="font-display font-semibold text-white text-base mb-4 tracking-wide uppercase text-xs">
              Portal Headquarters
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-slate-300">
                  Langhanaj, Mahesana, Gujarat, India.
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="tel:+919558254569" className="hover:text-emerald-400 transition-colors">
                  +91 95582 54569
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="mailto:nikhilraval7473@gmail.com" className="hover:text-emerald-400 transition-colors">
                  nikhilraval7473@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Notice */}
        <div className="pt-8 border-t border-emerald-900/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>
            &copy; 2026 Agriculture Portal. All Rights Reserved.
          </p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> by{' '}
            <span className="text-white font-medium">Nikhil Raval</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
