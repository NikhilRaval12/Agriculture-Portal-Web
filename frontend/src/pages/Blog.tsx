import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Clock, ArrowRight, BookOpen } from 'lucide-react';
import { api } from '../services/api';
import { BlogPost } from '../types';
import { useDragon } from '../context/DragonContext';
import { PageTransition } from '../components/layout/PageTransition';

export const Blog: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { setEmotion, moveTo, speak } = useDragon();

  useEffect(() => {
    // Dragon reading behavior on blog
    moveTo('TOP_RIGHT');
    setEmotion('THINKING', 2500);
    speak('Reading up on smart agronomy! 📖🌾', 3500);

    const loadBlogs = async () => {
      try {
        const data = await api.blogs.getAll();
        setBlogs(data);
      } catch (e) {
        console.error('Failed to load blog posts:', e);
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
  }, []);

  return (
    <PageTransition>
      {/* Banner */}
      <section className="py-14 bg-gradient-to-r from-emerald-900 via-agri-800 to-emerald-950 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <img src="/images/bg_2.jpg" alt="Blog banner" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-xs font-semibold text-emerald-200 uppercase tracking-widest mb-1.5">
            <Link to="/" className="hover:text-white">Home</Link> / <span>Blog</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white">
            Agriculture Insights & Field Notes
          </h1>
          <p className="text-sm text-emerald-100 max-w-xl mx-auto mt-2">
            Agronomy advice, organic composting guides, and water conservation practices curated by Nikhil Raval and regional agricultural experts.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {loading ? (
          <div className="py-24 text-center">
            <div className="inline-block w-8 h-8 border-4 border-emerald-700 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-semibold text-slate-500 mt-3">Loading agricultural articles...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="py-16 text-center max-w-md mx-auto bg-white rounded-3xl border border-slate-100 p-8 shadow-soft">
            <BookOpen className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
            <h3 className="font-display font-bold text-xl text-slate-800">No Articles Found</h3>
            <p className="text-xs text-slate-500 mt-1">Our farmers are writing fresh seasonal reports right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-soft hover:shadow-xl transition-all duration-300 flex flex-col group"
                onMouseEnter={() => setEmotion('CURIOUS')}
              >
                <div className="relative h-52 overflow-hidden bg-slate-100">
                  <img
                    src={post.imageUrl || '/images/image_1.jpg'}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3.5 left-3.5 bg-emerald-800 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-xs">
                    {post.category}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-4 text-xs text-slate-400 mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-emerald-600" />
                        {post.readTime}
                      </span>
                    </div>

                    <Link
                      to={`/blog/${post.id}`}
                      className="font-display font-bold text-lg text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2"
                    >
                      {post.title}
                    </Link>

                    <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                      <User className="w-3.5 h-3.5 text-emerald-600" />
                      {post.author}
                    </span>

                    <Link
                      to={`/blog/${post.id}`}
                      onClick={() => setEmotion('HAPPY', 1500)}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group/btn"
                    >
                      <span>Read Story</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
};
