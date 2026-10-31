import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useDragon } from '../context/DragonContext';
import { PageTransition } from '../components/layout/PageTransition';

export const Cart: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const { setEmotion, moveTo, speak } = useDragon();
  const navigate = useNavigate();

  useEffect(() => {
    moveTo('CART_SIDE');
    if (cart.items.length === 0) {
      setEmotion('CONFUSED', 3000);
      speak('Your harvest basket is empty! 🧺', 3500);
    } else {
      setEmotion('HAPPY', 2000);
      speak(`Guarding your ${cart.cartCount} farm items! 🌾`, 3500);
    }
  }, [cart.items.length]);

  return (
    <PageTransition>
      {/* Banner */}
      <section className="py-12 bg-gradient-to-r from-emerald-900 to-agri-950 text-white text-center relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-xs font-semibold text-emerald-200 uppercase tracking-widest mb-1">
            <Link to="/" className="hover:text-white">Home</Link> / <span>Cart</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white">
            My Harvest Cart
          </h1>
          <p className="text-xs text-emerald-100 mt-1">
            Review your organic selections before dispatch.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {cart.items.length === 0 ? (
          /* Empty State (with Dragon Guarding Empty Basket) */
          <div className="py-16 text-center max-w-md mx-auto bg-white rounded-3xl border border-slate-100 p-8 shadow-soft">
            <div className="text-6xl mb-4">🧺</div>
            <h2 className="font-display font-bold text-2xl text-slate-800">
              Your Basket is Empty
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Looks like you haven't selected any fresh organic vegetables or seeds yet. Our dragon companion is waiting to guard your harvest!
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Cart Table (Col 8) */}
            <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-display font-bold text-lg text-slate-800">
                  Cart Items ({cart.cartCount})
                </h3>
                <button
                  onClick={clearCart}
                  className="text-xs text-slate-400 hover:text-rose-500 transition-colors"
                >
                  Clear All Items
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-3 px-6">Product</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4 text-center">Quantity</th>
                      <th className="py-3 px-4">Total</th>
                      <th className="py-3 px-4 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {cart.items.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/40 transition-colors">
                        {/* Product Info */}
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <img
                              src={item.imageUrl}
                              alt={item.productName}
                              className="w-14 h-14 object-cover rounded-xl border border-slate-200 shrink-0"
                            />
                            <div>
                              <Link
                                to={`/product/${item.productId}`}
                                className="font-semibold text-slate-800 hover:text-emerald-700 transition-colors block line-clamp-1"
                              >
                                {item.productName}
                              </Link>
                              <span className="text-[11px] text-slate-400">
                                Fresh Harvest
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Unit Price */}
                        <td className="py-4 px-4 font-semibold text-slate-700">
                          ₹ {item.discountedPrice || item.price}
                        </td>

                        {/* Quantity Increment/Decrement */}
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 text-center font-bold text-slate-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                        {/* Line Total */}
                        <td className="py-4 px-4 font-bold text-emerald-800">
                          ₹ {item.total.toFixed(2)}
                        </td>

                        {/* Remove */}
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Cart Totals Box (Col 4) (Matching original cart totals box from cart.html) */}
            <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-100 shadow-soft p-6 space-y-6">
              <h3 className="font-display font-bold text-lg text-slate-800 border-b border-slate-100 pb-3">
                Cart Totals
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800">₹ {cart.subtotal.toFixed(2)}</span>
                </div>

                {cart.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount Savings</span>
                    <span>- ₹ {cart.discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600 items-center">
                  <div>
                    <span>Delivery Fee</span>
                    <span className="block text-[10px] text-slate-400">
                      {cart.subtotal > 500 ? 'Free Shipping Qualified' : 'Orders under ₹500: ₹70'}
                    </span>
                  </div>
                  <span className="font-semibold text-slate-800">
                    {cart.delivery === 0 ? (
                      <span className="text-emerald-700 font-bold uppercase text-xs">Free</span>
                    ) : (
                      `₹ ${cart.delivery.toFixed(2)}`
                    )}
                  </span>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-between items-baseline">
                  <span className="font-bold text-base text-slate-900">Total</span>
                  <span className="font-display font-black text-2xl text-emerald-800">
                    ₹ {cart.total.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setEmotion('WORKING', 2000);
                  navigate('/checkout');
                }}
                className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-2xl text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 active:scale-95"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center">
                <Link
                  to="/shop"
                  className="text-xs text-slate-500 hover:text-emerald-700 font-medium transition-colors"
                >
                  &larr; Continue Shopping
                </Link>
              </div>

              <div className="pt-2 flex items-center justify-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Secure Checkout
                </span>
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-emerald-600" />
                  Dispatch from Farm
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};
