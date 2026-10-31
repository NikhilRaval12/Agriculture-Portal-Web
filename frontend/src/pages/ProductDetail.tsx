import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  Star,
  Minus,
  Plus,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { api } from '../services/api';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useDragon } from '../context/DragonContext';
import { PageTransition } from '../components/layout/PageTransition';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { setEmotion, moveTo, speak } = useDragon();

  useEffect(() => {
    // Position dragon beside product information unobtrusively
    moveTo('FLOATING_PRODUCT');
    setEmotion('CURIOUS', 2000);

    const loadProduct = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await api.products.getById(parseInt(id));
        setProduct(data);
        speak(`Fresh harvest: ${data.name}! 🍎`, 3000);
      } catch (e) {
        console.error('Failed to load product:', e);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleQuantityChange = (newQty: number) => {
    if (!product) return;
    const max = product.availableQuantity || 10;
    const clamped = Math.max(1, Math.min(newQty, max));
    setQuantity(clamped);
    setEmotion('HAPPY', 1000);
  };

  const handleAddToCart = async () => {
    if (!product) return;
    await addToCart(product.id, quantity);
  };

  const handleBuyNow = async () => {
    if (!product) return;
    await addToCart(product.id, quantity);
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-emerald-700 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-semibold text-slate-500 mt-3">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-3xl border border-slate-100 max-w-md shadow-soft">
          <h2 className="text-xl font-bold font-display text-slate-800">Product Not Found</h2>
          <p className="text-xs text-slate-500 mt-1">This item might no longer be in season.</p>
          <Link to="/shop" className="mt-4 inline-block px-5 py-2.5 bg-emerald-700 text-white rounded-xl text-xs font-bold">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);

  return (
    <PageTransition>
      {/* Breadcrumb Navigation */}
      <div className="bg-earth-50/60 border-b border-slate-100 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center space-x-2 text-xs text-slate-500">
          <Link to="/" className="hover:text-emerald-700 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-emerald-700 transition-colors">Products</Link>
          <span>/</span>
          <span className="font-semibold text-slate-800 truncate">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          to="/shop"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-emerald-800 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Product List</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Product Image Stage */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative rounded-3xl overflow-hidden bg-white border border-slate-100 shadow-soft">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-[420px] sm:h-[480px] object-cover hover:scale-105 transition-transform duration-500"
              />

              {product.discount > 0 && (
                <div className="absolute top-4 left-4 bg-rose-500 text-white text-xs font-extrabold px-3 py-1.5 rounded-full shadow-md">
                  {product.discount}% OFF
                </div>
              )}

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-colors shadow-md ${
                  inWishlist
                    ? 'bg-rose-50 text-rose-500'
                    : 'bg-white/90 text-slate-600 hover:text-rose-500'
                }`}
                title={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-rose-500' : ''}`} />
              </button>
            </div>
          </div>

          {/* Product Details & Actions */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center space-x-3 text-xs text-slate-500 mb-1.5">
                <span className="bg-emerald-100/70 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px]">
                  {product.categoryName || 'Organic Harvest'}
                </span>
                <span className="flex items-center text-amber-500 font-semibold">
                  <Star className="w-4 h-4 fill-amber-400 mr-1" />
                  {product.rating} Rating
                </span>
              </div>

              <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900">
                {product.name}
              </h1>

              <p className="text-xs text-slate-400 mt-1">
                Cultivated by: <span className="font-semibold text-slate-700">{product.vendorName}</span>
              </p>
            </div>

            {/* Pricing Section */}
            <div className="p-4 rounded-2xl bg-earth-50/70 border border-earth-100 flex items-baseline space-x-4">
              {product.discount > 0 ? (
                <>
                  <span className="text-3xl font-extrabold text-emerald-800">
                    ₹ {product.discountedPrice}
                  </span>
                  <span className="text-sm text-slate-400 line-through">
                    ₹ {product.price}
                  </span>
                  <span className="text-xs font-bold text-rose-600">
                    You save ₹ {(product.price - product.discountedPrice).toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-3xl font-extrabold text-emerald-800">
                  ₹ {product.price}
                </span>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Product Description
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Availability Counter (From product-single.html: "XX quantity available") */}
            <div className="flex items-center space-x-2 text-xs font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-slate-700">
                {product.availableQuantity} units available in stock
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Select Quantity
              </span>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-slate-200 bg-white rounded-2xl p-1 shadow-xs">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 disabled:opacity-40"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-sm font-bold text-slate-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.availableQuantity}
                    className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 disabled:opacity-40"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-xs text-slate-500">
                  Subtotal: <span className="font-bold text-slate-900">₹ {((product.discountedPrice || product.price) * quantity).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Add to Cart & Buy Now Buttons (From product-single.html) */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Buy Now</span>
              </button>
            </div>

            {/* Farm Quality Assurance Grid */}
            <div className="pt-6 border-t border-slate-100 grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-white rounded-2xl border border-slate-100">
                <ShieldCheck className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                <div className="text-[11px] font-bold text-slate-800">100% Organic</div>
                <div className="text-[9px] text-slate-400">Zero Synthetic Pesticides</div>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-slate-100">
                <Truck className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                <div className="text-[11px] font-bold text-slate-800">Direct Delivery</div>
                <div className="text-[9px] text-slate-400">Free over ₹500</div>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-slate-100">
                <RotateCcw className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                <div className="text-[11px] font-bold text-slate-800">Guaranteed Fresh</div>
                <div className="text-[9px] text-slate-400">Harvested on Order</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
