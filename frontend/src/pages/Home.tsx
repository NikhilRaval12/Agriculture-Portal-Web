import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Truck,
  ShieldCheck,
  Award,
  Headphones,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Heart,
  Star,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { api } from '../services/api';
import { Category, Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useDragon } from '../context/DragonContext';
import { PageTransition } from '../components/layout/PageTransition';

export const Home: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { setEmotion, moveTo, speak } = useDragon();
  const navigate = useNavigate();

  // Deal of the Day Countdown Timer
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 45 });

  useEffect(() => {
    // Initial Dragon welcome greeting on Home Page
    moveTo('HERO');
    setEmotion('GREETING', 2500);
    speak('Welcome to Agriculture Portal! 🌿', 3500);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);

    const loadData = async () => {
      try {
        const [cats, prods] = await Promise.all([
          api.categories.getAll(),
          api.products.getFeatured(),
        ]);
        setCategories(cats);
        setFeaturedProducts(prods);
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    return () => clearInterval(timer);
  }, []);

  return (
    <PageTransition>
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-agri-50/70 via-earth-50 to-white pt-10 pb-16 lg:py-24">
        {/* Soft Background Accents */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-agri-200/40 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-amber-100/40 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-agri-100/80 border border-agri-300 text-agri-900 text-xs font-bold uppercase tracking-wider shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                100% Organic & Farm Certified Produce
              </div>

              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-slate-900 tracking-tight leading-[1.12]">
                We serve Fresh <br />
                <span className="text-emerald-700 underline decoration-amber-400 decoration-wavy decoration-2">
                  Vegetables & Fruits
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Connect directly with regional farms across Gujarat. Harvest-fresh organic vegetables, crisp fruits, bio-enriched fertilizers, and quality farm equipment delivered to your door.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/shop"
                  onClick={() => setEmotion('EXCITED', 2000)}
                  className="px-7 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2 group hover:-translate-y-0.5"
                >
                  <span>Explore Shop</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/about"
                  className="px-7 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-sm shadow-xs transition-all duration-200 hover:-translate-y-0.5"
                >
                  Learn Our Story
                </Link>
              </div>

              {/* Farmer Trust Stats */}
              <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4 text-center lg:text-left">
                <div>
                  <div className="font-display font-black text-2xl text-emerald-800">500+</div>
                  <div className="text-xs text-slate-500">Partner Farms</div>
                </div>
                <div>
                  <div className="font-display font-black text-2xl text-emerald-800">100%</div>
                  <div className="text-xs text-slate-500">Chemical Free</div>
                </div>
                <div>
                  <div className="font-display font-black text-2xl text-emerald-800">₹0</div>
                  <div className="text-xs text-slate-500">Delivery &gt; ₹500</div>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Banner */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                  <img
                    src="/images/bg_1.jpg"
                    alt="Fresh vegetables and fruits"
                    className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/70 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                    <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">
                      Direct From Farmers
                    </span>
                    <h3 className="text-xl font-bold font-display">
                      Pesticide-Free Living for Your Family
                    </h3>
                  </div>
                </div>

                {/* Floating Badge */}
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center space-x-3 hidden sm:flex">
                  <div className="w-12 h-12 rounded-xl bg-agri-100 text-agri-700 flex items-center justify-center text-2xl">
                    🥦
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Daily Harvest</div>
                    <div className="text-sm font-bold text-slate-800">Fresh Every Morning</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SERVICES & TRUST PROMISES (Direct from original project) */}
      <section className="py-12 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-center space-x-4 p-4 rounded-2xl hover:bg-agri-50/60 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Truck className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-display font-bold text-base text-slate-900">Free Shipping</h4>
                <p className="text-xs text-slate-500 mt-0.5">On all orders over ₹500</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 rounded-2xl hover:bg-agri-50/60 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-display font-bold text-base text-slate-900">Always Fresh</h4>
                <p className="text-xs text-slate-500 mt-0.5">Carefully eco-packaged</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 rounded-2xl hover:bg-agri-50/60 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <Award className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-display font-bold text-base text-slate-900">Superior Quality</h4>
                <p className="text-xs text-slate-500 mt-0.5">Lab-tested organic produce</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 rounded-2xl hover:bg-agri-50/60 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <Headphones className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-display font-bold text-base text-slate-900">24/7 Support</h4>
                <p className="text-xs text-slate-500 mt-0.5">Dedicated farm advisors</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORIES SHOWCASE */}
      <section className="py-16 bg-earth-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
                Browse Categories
              </span>
              <h2 className="font-display font-extrabold text-3xl text-slate-900 mt-1">
                Farm Produce & Cultivation
              </h2>
            </div>
            <Link
              to="/shop"
              className="mt-4 md:mt-0 text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group"
            >
              <span>View All Categories</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/shop?category=${cat.id}`}
                className="group relative h-64 rounded-3xl overflow-hidden shadow-soft hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex flex-col justify-end p-6 text-white">
                  <h3 className="font-display font-bold text-xl group-hover:text-amber-300 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-2 mt-1">
                    {cat.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS GRID */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
              Handpicked Harvest
            </span>
            <h2 className="font-display font-extrabold text-3xl text-slate-900 mt-1">
              Our Featured Products
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Naturally ripened produce harvested with respect for the earth and delivered directly to your kitchen.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((p) => {
              const inWishlist = isInWishlist(p.id);
              return (
                <div
                  key={p.id}
                  className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-soft hover:shadow-xl transition-all duration-300 flex flex-col group"
                  onMouseEnter={() => setEmotion('CURIOUS')}
                >
                  {/* Image & Badges */}
                  <div className="relative h-52 bg-slate-50 overflow-hidden">
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {p.discount > 0 && (
                      <span className="absolute top-3 left-3 bg-rose-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                        {p.discount}% OFF
                      </span>
                    )}

                    <button
                      onClick={() => toggleWishlist(p.id)}
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors ${
                        inWishlist
                          ? 'bg-rose-50 text-rose-500'
                          : 'bg-white/80 text-slate-600 hover:text-rose-500'
                      }`}
                      title={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
                    >
                      <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-500' : ''}`} />
                    </button>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                        <span>{p.categoryName || 'Organic Produce'}</span>
                        <div className="flex items-center text-amber-500 font-semibold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                          <span>{p.rating || 4.8}</span>
                        </div>
                      </div>

                      <Link
                        to={`/product/${p.id}`}
                        className="font-display font-bold text-base text-slate-900 hover:text-emerald-700 transition-colors block line-clamp-1"
                      >
                        {p.name}
                      </Link>

                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                        {p.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex flex-col">
                        {p.discount > 0 ? (
                          <>
                            <span className="text-xs text-slate-400 line-through">₹ {p.price}</span>
                            <span className="text-base font-extrabold text-emerald-800">
                              ₹ {p.discountedPrice}
                            </span>
                          </>
                        ) : (
                          <span className="text-base font-extrabold text-emerald-800">
                            ₹ {p.price}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => addToCart(p.id, 1)}
                        className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs flex items-center space-x-1.5 transition-colors active:scale-95"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/shop"
              className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all hover:-translate-y-0.5"
            >
              <span>View Full Shop Catalogue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. DEAL OF THE DAY (From original index-2.html) */}
      <section className="py-20 relative bg-emerald-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="/images/bg_3.jpg" alt="Farm harvest background" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-xl ml-auto bg-emerald-900/80 backdrop-blur-md p-8 sm:p-10 rounded-3xl border border-emerald-800 shadow-2xl">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">
              Limited Time Special Offer
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white mt-2">
              Deal of the Day
            </h2>
            <p className="text-sm text-emerald-100/90 mt-3 leading-relaxed">
              Fresh organic leafy Spinach harvested at dawn from local greenhouses. Rich in iron, crisp, and packed with vitality.
            </p>

            <div className="mt-4 flex items-baseline space-x-3">
              <span className="text-3xl font-black text-amber-300">₹ 25.00</span>
              <span className="text-sm text-emerald-300 line-through">₹ 50.00</span>
              <span className="text-xs font-bold bg-amber-400 text-emerald-950 px-2.5 py-0.5 rounded-full">
                50% OFF
              </span>
            </div>

            {/* Live Countdown */}
            <div className="grid grid-cols-3 gap-3 my-6 text-center">
              <div className="bg-emerald-950/80 p-3 rounded-2xl border border-emerald-800">
                <div className="text-2xl font-bold font-display text-white">{timeLeft.hours}</div>
                <div className="text-[10px] text-emerald-300 uppercase tracking-wider">Hours</div>
              </div>
              <div className="bg-emerald-950/80 p-3 rounded-2xl border border-emerald-800">
                <div className="text-2xl font-bold font-display text-white">{timeLeft.minutes}</div>
                <div className="text-[10px] text-emerald-300 uppercase tracking-wider">Mins</div>
              </div>
              <div className="bg-emerald-950/80 p-3 rounded-2xl border border-emerald-800">
                <div className="text-2xl font-bold font-display text-white">{timeLeft.seconds}</div>
                <div className="text-[10px] text-emerald-300 uppercase tracking-wider">Secs</div>
              </div>
            </div>

            <Link
              to="/shop"
              className="w-full text-center block py-3.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold rounded-2xl text-sm shadow-md transition-all hover:scale-[1.02]"
            >
              Claim Daily Deal in Shop
            </Link>
          </div>
        </div>
      </section>

      {/* 6. FARMER TESTIMONIALS */}
      <section className="py-16 bg-earth-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
              Community Trust
            </span>
            <h2 className="font-display font-extrabold text-3xl text-slate-900 mt-1">
              Voices From The Fields
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-soft">
              <div className="flex text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-slate-600 italic">
                "The Agriculture Portal provided bio-enriched fertilizers right on schedule in Mehsana. Our yields increased noticeably this Rabi season!"
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                  RP
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Ramesh Patel</div>
                  <div className="text-[11px] text-slate-400">Mehsana Farm Owner</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-soft">
              <div className="flex text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-slate-600 italic">
                "Direct vegetable ordering without middlemen. Produce arrives crisp and fresh every morning. The companion character is delightful!"
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                  SC
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Suresh Chaudhary</div>
                  <div className="text-[11px] text-slate-400">Ahmedabad Consumer</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-soft">
              <div className="flex text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-slate-600 italic">
                "Transparent prices and genuine discounts. Free shipping on orders over ₹500 saves substantial cost for our agricultural cooperative."
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                  AS
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Anand Shah</div>
                  <div className="text-[11px] text-slate-400">Patan Cooperative</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
};
