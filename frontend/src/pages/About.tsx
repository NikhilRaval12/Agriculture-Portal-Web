import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, Sprout, Users, Award, Heart, CheckCircle2 } from 'lucide-react';
import { useDragon } from '../context/DragonContext';
import { PageTransition } from '../components/layout/PageTransition';

export const About: React.FC = () => {
  const { setEmotion, moveTo, speak } = useDragon();

  useEffect(() => {
    moveTo('HERO');
    setEmotion('HAPPY', 2000);
    speak('Welcome to our farm story! 🌱', 3000);
  }, []);

  return (
    <PageTransition>
      {/* Banner */}
      <section className="py-14 bg-gradient-to-r from-emerald-900 via-agri-800 to-emerald-950 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <img src="/images/bg_1.jpg" alt="About banner" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-xs font-semibold text-emerald-200 uppercase tracking-widest mb-1.5">
            <Link to="/" className="hover:text-white">Home</Link> / <span>About Us</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white">
            Rooted in Soil & Trust
          </h1>
          <p className="text-sm text-emerald-100 max-w-xl mx-auto mt-2">
            The story behind the Agriculture Portal — empowering regional farmers and delivering nutrient-dense organic foods directly to families.
          </p>
        </div>
      </section>

      {/* Main Story & Visuals */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Visual Showcase (from about.html) */}
          <div className="lg:col-span-6 relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="/images/about.jpg"
                alt="Agricultural fields and organic vegetables"
                className="w-full h-[440px] object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            {/* Experience Pill */}
            <div className="absolute -bottom-6 -right-6 bg-white p-5 rounded-3xl shadow-xl border border-slate-100 max-w-xs hidden sm:block">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl font-bold">
                  🌿
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-semibold uppercase">Purity Certified</div>
                  <div className="text-sm font-bold text-slate-800">100% Residue-Free</div>
                </div>
              </div>
            </div>
          </div>

          {/* Narrative Content */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
              Established in Gujarat
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 leading-tight">
              Bridging The Gap Between Regional Soil & Modern Kitchens
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Founded by <span className="font-bold text-slate-900">Nikhil Raval</span> in Langhanaj, Mahesana, the Agriculture Portal was conceived with a transparent mandate: eliminate exploitative intermediaries, guarantee honest market pricing for hardworking cultivators, and deliver pristine organic vegetables and fruits to homes within hours of harvest.
            </p>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              We partner with over 500 smallholder and cooperative farmers across Gujarat, ensuring every harvest follows natural regenerative agriculture principles without chemical fertilizers, synthetic insecticides, or hormone ripeners.
            </p>

            {/* Core Values Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center space-x-2.5 text-xs font-semibold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero Synthetic Pesticides</span>
              </div>
              <div className="flex items-center space-x-2.5 text-xs font-semibold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Fair Remuneration for Farmers</span>
              </div>
              <div className="flex items-center space-x-2.5 text-xs font-semibold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Cold-Chain Direct Dispatch</span>
              </div>
              <div className="flex items-center space-x-2.5 text-xs font-semibold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Interactive 3D Companion Guide</span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                to="/shop"
                className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all hover:scale-105"
              >
                <span>Browse Certified Produce</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Impact Numbers */}
        <div className="mt-20 pt-12 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          <div>
            <div className="font-display font-black text-3xl sm:text-4xl text-emerald-800">500+</div>
            <div className="text-xs text-slate-500 mt-1 font-semibold uppercase tracking-wider">Cultivator Partners</div>
          </div>
          <div>
            <div className="font-display font-black text-3xl sm:text-4xl text-emerald-800">10,000+</div>
            <div className="text-xs text-slate-500 mt-1 font-semibold uppercase tracking-wider">Happy Consumers</div>
          </div>
          <div>
            <div className="font-display font-black text-3xl sm:text-4xl text-emerald-800">100%</div>
            <div className="text-xs text-slate-500 mt-1 font-semibold uppercase tracking-wider">Organic Certified</div>
          </div>
          <div>
            <div className="font-display font-black text-3xl sm:text-4xl text-emerald-800">24/7</div>
            <div className="text-xs text-slate-500 mt-1 font-semibold uppercase tracking-wider">Agro Support</div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
