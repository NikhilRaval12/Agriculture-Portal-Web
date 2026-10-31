import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, ShoppingBag, Heart, Star, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { Category, Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useDragon } from '../context/DragonContext';
import { PageTransition } from '../components/layout/PageTransition';

export const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category');

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(
    initialCategory ? parseInt(initialCategory) : null
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { setEmotion, moveTo, speak } = useDragon();

  useEffect(() => {
    moveTo('FLOATING_PRODUCT');
    setEmotion('CURIOUS', 2000);

    const fetchCategories = async () => {
      try {
        const cats = await api.categories.getAll();
        setCategories(cats);
      } catch (e) {
        console.error('Failed to load categories', e);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await api.products.getAll(
          selectedCategory || undefined,
          searchTerm || undefined,
          currentPage,
          8
        );
        let list = [...data.products];

        // Sort items
        if (sortBy === 'price-asc') {
          list.sort((a, b) => (a.discountedPrice || a.price) - (b.discountedPrice || b.price));
        } else if (sortBy === 'price-desc') {
          list.sort((a, b) => (b.discountedPrice || b.price) - (a.discountedPrice || a.price));
        } else if (sortBy === 'rating') {
          list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        }

        setProducts(list);
        setTotalPages(data.totalPages || 1);
      } catch (e) {
        console.error('Error fetching products:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchTerm, currentPage, sortBy]);

  const handleCategorySelect = (catId: number | null) => {
    setSelectedCategory(catId);
    setCurrentPage(0);
    if (catId) {
      setSearchParams({ category: catId.toString() });
      const cat = categories.find((c) => c.id === catId);
      if (cat) speak(`Exploring ${cat.name}! 🌾`, 2500);
    } else {
      setSearchParams({});
      speak('Showing all organic produce', 2000);
    }
    setEmotion('HAPPY', 1500);
  };

  return (
    <PageTransition>
      {/* Shop Header Banner (Matching original shop.html hero breadcrumbs) */}
      <section className="relative py-14 bg-gradient-to-r from-emerald-900 via-agri-800 to-emerald-950 text-white overflow-hidden shadow-inner">
        <div className="absolute inset-0 opacity-15">
          <img src="/images/bg_1.jpg" alt="Shop banner" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="text-xs font-semibold text-emerald-200 uppercase tracking-widest mb-1.5">
            <Link to="/" className="hover:text-white transition-colors">Home</Link> / <span>Products</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white">
            Agricultural Products
          </h1>
          <p className="text-sm text-emerald-100 max-w-xl mx-auto mt-2">
            Fresh vegetables, fruits, bio-fertilizers, and farm machinery sourced directly from certified regional cultivators.
          </p>
        </div>
      </section>

      {/* Main Shop View */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Controls Bar: Search, Category Tabs, Sorting */}
        <div className="space-y-6 mb-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(0);
                  if (e.target.value.length > 2) {
                    setEmotion('CURIOUS', 1000);
                  }
                }}
                placeholder="Search vegetables, fertilizers, seeds..."
                className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-agri-500 focus:border-transparent shadow-xs transition-all"
              />
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
              <span className="text-xs font-semibold text-slate-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-agri-500 shadow-xs"
              >
                <option value="featured">Featured / Best Sellers</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills (From original shop.html categories menu) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            <button
              onClick={() => handleCategorySelect(null)}
              className={`px-5 py-2 rounded-2xl text-xs font-bold transition-all shadow-xs shrink-0 ${
                selectedCategory === null
                  ? 'bg-emerald-700 text-white shadow-md'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              All Products
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`px-5 py-2 rounded-2xl text-xs font-bold transition-all shadow-xs shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-700 text-white shadow-md'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="inline-block w-8 h-8 border-4 border-agri-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-semibold text-slate-500 mt-3">Loading fresh harvest catalogue...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-24 text-center bg-white rounded-3xl border border-slate-100 p-8 shadow-soft max-w-md mx-auto">
            <div className="text-4xl mb-3">🌾</div>
            <h3 className="font-display font-bold text-lg text-slate-800">No matching products found</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try changing your search term or selecting another category.
            </p>
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSearchTerm('');
              }}
              className="mt-4 px-4 py-2 bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => {
              const inWishlist = isInWishlist(p.id);
              return (
                <div
                  key={p.id}
                  className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-soft hover:shadow-xl transition-all duration-300 flex flex-col group"
                  onMouseEnter={() => setEmotion('CURIOUS')}
                >
                  {/* Image & Discount Badge */}
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

                  {/* Card Content */}
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
        )}

        {/* Pagination Controls (Matching original pagination style) */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center space-x-2">
            <button
              disabled={currentPage === 0}
              onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
              className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx)}
                className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                  currentPage === idx
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {idx + 1}
              </button>
            ))}

            <button
              disabled={currentPage >= totalPages - 1}
              onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
              className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </PageTransition>
  );
};
