import React, { useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { CheckCircle2, Package, ArrowRight, Home, Printer, ShieldCheck } from 'lucide-react';
import { useDragon } from '../context/DragonContext';
import { PageTransition } from '../components/layout/PageTransition';

export const OrderSuccess: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;
  const { celebrate, speak } = useDragon();

  useEffect(() => {
    // Celebrate successful order placement
    celebrate();
    speak('Your harvest is confirmed! Celebrating with you! 🎉🌾', 4000);

    // Launch celebratory farm confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#15803d', '#22c55e', '#f59e0b', '#fbbf24', '#ffffff'],
      });
    } catch {
      // Ignore if canvas-confetti is not loaded
    }
  }, []);

  if (!order) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-3xl border border-slate-100 shadow-soft max-w-md">
          <Package className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
          <h2 className="font-display font-bold text-xl text-slate-800">No Recent Order</h2>
          <p className="text-xs text-slate-500 mt-1 mb-4">You have not completed any order in this session.</p>
          <Link to="/shop" className="px-5 py-2.5 bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs">
            Browse Produce
          </Link>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden text-center p-8 sm:p-12 relative">
          {/* Success Badge */}
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-6 shadow-inner animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
            Order Confirmed & Scheduled
          </span>

          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 mt-2">
            Thank You For Your Harvest Order!
          </h1>

          <p className="text-sm text-slate-600 max-w-lg mx-auto mt-2 leading-relaxed">
            Your fresh agricultural order has been transmitted directly to our regional farm producers. Our harvest logistics team is preparing your package.
          </p>

          {/* Key Order Credentials */}
          <div className="mt-8 p-6 rounded-2xl bg-earth-50/70 border border-earth-100 text-left grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Order Reference:</span>
              <span className="font-mono font-bold text-sm text-emerald-900">
                {order.orderNumber}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Total Paid / Due:</span>
              <span className="font-bold text-sm text-slate-800">
                ₹ {order.totalAmount?.toFixed ? order.totalAmount.toFixed(2) : order.totalAmount}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Payment Mode:</span>
              <span className="font-semibold text-slate-700">
                {order.paymentMethod}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Estimated Delivery:</span>
              <span className="font-semibold text-emerald-700">
                3-5 Days (Farm Direct)
              </span>
            </div>
            <div className="sm:col-span-2 pt-2 border-t border-earth-200">
              <span className="text-slate-400 block font-medium">Shipping Address:</span>
              <span className="font-medium text-slate-700">
                {order.firstName} {order.lastName}, {order.streetAddress}, {order.city}, {order.state} - {order.zipCode}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/shop"
              className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/"
              className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center space-x-2"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
