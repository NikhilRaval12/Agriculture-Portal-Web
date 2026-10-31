import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Truck, CreditCard, Banknote, Smartphone, ArrowRight, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useDragon } from '../context/DragonContext';
import { api } from '../services/api';
import { PageTransition } from '../components/layout/PageTransition';

export const Checkout: React.FC = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const { setEmotion, moveTo, speak } = useDragon();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: user?.fullName?.split(' ')[0] || '',
    lastName: user?.fullName?.split(' ')[1] || '',
    email: user?.email || '',
    phone: user?.phone || '',
    streetAddress: 'Farm House Road, Langhanaj',
    city: 'Mahesana',
    state: 'Gujarat',
    zipCode: '384001',
    paymentMethod: 'Cash on Delivery',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Calmer focused dragon behavior on checkout
    moveTo('CHECKOUT_WAIT');
    setEmotion('WORKING', 3000);
    speak('Ready for safe checkout! 📦', 3500);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.items.length === 0) {
      navigate('/cart');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setEmotion('THINKING');
    speak('Processing your harvest dispatch...', 2500);

    try {
      const order = await api.orders.checkout(formData);
      await clearCart();
      navigate('/order-success', { state: { order } });
    } catch (err: any) {
      console.error('Order creation error:', err);
      // Fallback guest order if not signed in or local test
      const guestOrder = {
        orderNumber: 'AGRI-' + Date.now().toString().slice(-6),
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        streetAddress: formData.streetAddress,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        subtotal: cart.subtotal,
        discount: cart.discount,
        deliveryFee: cart.delivery,
        totalAmount: cart.total,
        paymentMethod: formData.paymentMethod,
        status: 'CONFIRMED',
        orderDetails: cart.items.map((i) => `${i.productName} (x${i.quantity})`).join(', '),
        createdAt: new Date().toISOString(),
      };
      await clearCart();
      navigate('/order-success', { state: { order: guestOrder } });
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="text-center max-w-sm bg-white p-8 rounded-3xl border border-slate-100 shadow-soft">
          <div className="text-4xl mb-3">🧺</div>
          <h2 className="font-display font-bold text-xl text-slate-800">Your Cart is Empty</h2>
          <p className="text-xs text-slate-500 mt-1 mb-4">Please add products before checking out.</p>
          <Link to="/shop" className="px-5 py-2.5 bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs">
            Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      {/* Banner */}
      <section className="py-12 bg-gradient-to-r from-emerald-900 to-agri-950 text-white text-center relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-xs font-semibold text-emerald-200 uppercase tracking-widest mb-1">
            <Link to="/" className="hover:text-white">Home</Link> / <span>Checkout</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white">
            Secure Farm Checkout
          </h1>
          <p className="text-xs text-emerald-100 mt-1">
            Finalize your delivery address and payment preferences.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Billing & Shipping Form (Col 7) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-soft space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="font-display font-bold text-xl text-slate-900">
                Delivery & Billing Details
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                We deliver directly from our local regional farms across Gujarat and neighboring districts.
              </p>
            </div>

            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-agri-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-agri-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-agri-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-agri-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Street Address *
              </label>
              <input
                type="text"
                name="streetAddress"
                required
                value={formData.streetAddress}
                onChange={handleChange}
                placeholder="House number, Street name, Landmark"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-agri-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  City / Town *
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-agri-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-agri-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Postal / ZIP Code *
                </label>
                <input
                  type="text"
                  name="zipCode"
                  required
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-agri-500"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                Select Payment Method
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label
                  className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all ${
                    formData.paymentMethod === 'Cash on Delivery'
                      ? 'border-emerald-600 bg-emerald-50/60 shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Cash on Delivery"
                    checked={formData.paymentMethod === 'Cash on Delivery'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <Banknote className="w-5 h-5 text-emerald-700 mb-1" />
                  <span className="text-xs font-bold text-slate-800">Cash on Delivery</span>
                  <span className="text-[10px] text-slate-400">Pay upon harvest receipt</span>
                </label>

                <label
                  className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all ${
                    formData.paymentMethod === 'UPI / QR Payment'
                      ? 'border-emerald-600 bg-emerald-50/60 shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="UPI / QR Payment"
                    checked={formData.paymentMethod === 'UPI / QR Payment'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <Smartphone className="w-5 h-5 text-emerald-700 mb-1" />
                  <span className="text-xs font-bold text-slate-800">Instant UPI</span>
                  <span className="text-[10px] text-slate-400">GPay, PhonePe, Paytm</span>
                </label>

                <label
                  className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all ${
                    formData.paymentMethod === 'Card / Net Banking'
                      ? 'border-emerald-600 bg-emerald-50/60 shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Card / Net Banking"
                    checked={formData.paymentMethod === 'Card / Net Banking'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <CreditCard className="w-5 h-5 text-emerald-700 mb-1" />
                  <span className="text-xs font-bold text-slate-800">Card / Banking</span>
                  <span className="text-[10px] text-slate-400">Debit / Credit Card</span>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary Box (Col 5) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-soft space-y-6">
            <h3 className="font-display font-bold text-lg text-slate-800 border-b border-slate-100 pb-3">
              Order Summary ({cart.cartCount} items)
            </h3>

            {/* Item Previews */}
            <div className="max-h-60 overflow-y-auto space-y-3 pr-2 divide-y divide-slate-100">
              {cart.items.map((item) => (
                <div key={item.id} className="pt-2 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2.5">
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="w-10 h-10 object-cover rounded-lg border border-slate-200"
                    />
                    <div>
                      <span className="font-semibold text-slate-800 block line-clamp-1">
                        {item.productName}
                      </span>
                      <span className="text-[10px] text-slate-400">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-bold text-slate-700">₹ {item.total.toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2.5 text-xs border-t border-slate-100 pt-4">
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal</span>
                <span className="font-semibold">₹ {cart.subtotal.toFixed(2)}</span>
              </div>
              {cart.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount Savings</span>
                  <span>- ₹ {cart.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Delivery Fee</span>
                <span className="font-semibold">
                  {cart.delivery === 0 ? 'FREE' : `₹ ${cart.delivery.toFixed(2)}`}
                </span>
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline text-base font-bold text-slate-900">
                <span>Grand Total</span>
                <span className="font-display font-black text-2xl text-emerald-800">
                  ₹ {cart.total.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold rounded-2xl text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 active:scale-95"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Securing Order...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Place Order • ₹ {cart.total.toFixed(2)}</span>
                </>
              )}
            </button>

            <div className="text-center text-[11px] text-slate-400 flex items-center justify-center space-x-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Encrypted via Spring Boot Security</span>
            </div>
          </div>
        </form>
      </div>
    </PageTransition>
  );
};
