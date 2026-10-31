import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Package, Calendar, Phone, Mail, LogOut, CheckCircle2, Clock, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDragon } from '../context/DragonContext';
import { api } from '../services/api';
import { Order } from '../types';
import { PageTransition } from '../components/layout/PageTransition';

export const Profile: React.FC = () => {
  const { user, isAuthenticated, signOut } = useAuth();
  const { setEmotion, moveTo, speak } = useDragon();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }

    moveTo('BOTTOM_RIGHT');
    setEmotion('HAPPY', 2000);
    speak(`Welcome to your account, ${user?.fullName || user?.username}! 🌾`, 3500);

    const loadOrders = async () => {
      try {
        const data = await api.orders.getMyOrders();
        setOrders(data);
      } catch (e) {
        console.error('Failed to load orders', e);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [isAuthenticated]);

  if (!user) return null;

  return (
    <PageTransition>
      {/* Banner */}
      <section className="py-12 bg-gradient-to-r from-emerald-900 to-agri-950 text-white text-center relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-xs font-semibold text-emerald-200 uppercase tracking-widest mb-1">
            <Link to="/" className="hover:text-white">Home</Link> / <span>Account</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white">
            Farmer Dashboard & Orders
          </h1>
          <p className="text-xs text-emerald-100 mt-1">
            Track your seasonal harvest dispatches and account details.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* User Profile Card (Col 4) */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-soft space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-display font-bold text-2xl uppercase shadow-inner">
                {user.username.slice(0, 2)}
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900">
                  {user.fullName || user.username}
                </h3>
                <span className="text-[11px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-100">
                  {user.role}
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100 text-xs">
              <div className="flex items-center space-x-3 text-slate-600">
                <User className="w-4 h-4 text-emerald-700" />
                <span>Username: <strong className="text-slate-800">{user.username}</strong></span>
              </div>
              <div className="flex items-center space-x-3 text-slate-600">
                <Mail className="w-4 h-4 text-emerald-700" />
                <span className="truncate">{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex items-center space-x-3 text-slate-600">
                  <Phone className="w-4 h-4 text-emerald-700" />
                  <span>{user.phone}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                signOut();
                navigate('/signin');
              }}
              className="w-full py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors flex items-center justify-center space-x-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>

          {/* Orders History List (Col 8) */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-soft space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-display font-bold text-xl text-slate-900">
                  Order History & Tracking
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Live status of your agriculture portal shipments.
                </p>
              </div>
              <span className="text-xs font-bold bg-slate-100 px-3 py-1 rounded-full text-slate-700">
                {orders.length} Orders
              </span>
            </div>

            {loading ? (
              <div className="py-12 text-center text-xs text-slate-500">
                Loading orders...
              </div>
            ) : orders.length === 0 ? (
              <div className="py-12 text-center text-slate-500 space-y-3">
                <Package className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-xs">You have not placed any orders yet.</p>
                <Link
                  to="/shop"
                  className="inline-flex items-center space-x-1 px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Browse Shop</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((o) => (
                  <div
                    key={o.id}
                    className="p-5 rounded-2xl border border-slate-100 bg-earth-50/40 hover:bg-white hover:shadow-md transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-emerald-900 text-sm">
                          {o.orderNumber}
                        </span>
                        <span className="inline-flex items-center gap-1 bg-emerald-100/80 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[10px]">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          {o.status}
                        </span>
                      </div>
                      <span className="text-slate-400 text-[11px]">
                        {new Date(o.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 font-medium line-clamp-2">
                      {o.orderDetails}
                    </p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500">
                        Paid via: <strong className="text-slate-700">{o.paymentMethod}</strong>
                      </span>
                      <span className="font-extrabold text-base text-emerald-800">
                        ₹ {o.totalAmount?.toFixed ? o.totalAmount.toFixed(2) : o.totalAmount}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
