import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useDragon } from '../context/DragonContext';
import { PageTransition } from '../components/layout/PageTransition';

export const Wishlist: React.FC = () => {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { setEmotion, moveTo, speak } = useDragon();

  useEffect(() => {
    moveTo('BOTTOM_RIGHT');
    if (items.length === 0) {
      setEmotion('CURIOUS', 2500);
      speak('No saved favorites yet! 🌿', 3000);
    } else {
      setEmotion('HAPPY', 2000);
      speak(`You have ${items.length} saved crops & products!`, 3000);
    }
  }, [items.length]);

  return (
    <PageTransition>
      {/* Banner */}
      <section className="py-12 bg-gradient-to-r from-emerald-900 to-agri-950 text-white text-center relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-xs font-semibold text-emerald-200 uppercase tracking-widest mb-1">
            <Link to="/" className="hover:text-white">Home</Link> / <span>Wishlist</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white">
            My Harvest Wishlist
          </h1>
          <p className="text-xs text-emerald-100 mt-1">
            Keep track of favorite organic items and seasonal crops.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {items.length === 0 ? (
          /* Empty State */
          <div className="py-16 text-center max-w-md mx-auto bg-white rounded-3xl border border-slate-100 p-8 shadow-soft">
            <div className="text-5xl mb-4">💚</div>
            <h2 className="font-display font-bold text-2xl text-slate-800">
              Your Wishlist is Empty
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Save your favorite fresh vegetables, seasonal fruits, and fertilizers here to purchase anytime.
            </p>
            <Link
              to="/shop"
              className="mt-6 inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all hover:scale-105"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore Farm Shop</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-soft hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-48 bg-slate-50 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="absolute top-3 right-3 p-2 bg-white/90 rounded-full text-slate-400 hover:text-rose-600 transition-colors shadow-xs"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-5">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block mb-1">
                      {item.categoryName || 'Organic'}
                    </span>
                    <Link
                      to={`/product/${item.productId}`}
                      className="font-display font-bold text-base text-slate-900 hover:text-emerald-700 transition-colors block line-clamp-1"
                    >
                      {item.productName}
                    </Link>

                    <div className="mt-3 flex items-baseline space-x-2">
                      <span className="font-extrabold text-lg text-emerald-800">
                        ₹ {item.discountedPrice || item.price}
                      </span>
                      {item.discount > 0 && (
                        <span className="text-xs text-slate-400 line-through">
                          ₹ {item.price}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => {
                      addToCart(item.productId, 1);
                      removeFromWishlist(item.id);
                    }}
                    className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Move to Cart</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
};
