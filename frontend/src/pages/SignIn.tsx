import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, User, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDragon } from '../context/DragonContext';
import { PageTransition } from '../components/layout/PageTransition';

export const SignIn: React.FC = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signIn, isAuthenticated } = useAuth();
  const { setEmotion, speak, moveTo } = useDragon();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    moveTo('BOTTOM_RIGHT');
    setEmotion('GREETING', 2000);
    speak('Welcome back to the portal! 🌾', 3000);

    if (isAuthenticated) {
      navigate('/profile');
    }
  }, [isAuthenticated]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setEmotion('THINKING');

    try {
      await signIn(credentials);
      setEmotion('HAPPY', 2000);
      speak('Successfully signed in!', 3000);
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Invalid username or password');
      setEmotion('ERROR', 3000);
      speak('Login failed, please check credentials', 3500);
    } finally {
      setIsSubmitting(false);
    }
  };

  const setDemoCredentials = (u: string, p: string) => {
    setCredentials({ username: u, password: p });
  };

  return (
    <PageTransition>
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-earth-50/50">
        <div className="w-full max-w-md bg-white rounded-3xl border border-slate-100 p-8 sm:p-10 shadow-soft">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white flex items-center justify-center text-2xl mx-auto mb-3 shadow-md">
              🌱
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
              Agriculture Portal
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Sign in to manage your orders and favorites.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Username or Email *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="username"
                  required
                  value={credentials.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-agri-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="password"
                  required
                  value={credentials.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-agri-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2 active:scale-95"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo Login Chips for instant testing */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 text-center">
              Quick Fill Demo Accounts:
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDemoCredentials('farmer', 'farmer123')}
                className="flex-1 py-1.5 px-2 bg-slate-50 hover:bg-agri-50 hover:border-agri-300 text-slate-700 border border-slate-200 rounded-xl text-[11px] font-medium transition-colors"
              >
                🌾 Farmer Patel
              </button>
              <button
                type="button"
                onClick={() => setDemoCredentials('nikhil', 'nikhil123')}
                className="flex-1 py-1.5 px-2 bg-slate-50 hover:bg-agri-50 hover:border-agri-300 text-slate-700 border border-slate-200 rounded-xl text-[11px] font-medium transition-colors"
              >
                👑 Admin Nikhil
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-slate-500 mt-6">
            Don't have an account yet?{' '}
            <Link to="/signup" className="font-bold text-emerald-700 hover:underline">
              Create an Account
            </Link>
          </p>
        </div>
      </div>
    </PageTransition>
  );
};
