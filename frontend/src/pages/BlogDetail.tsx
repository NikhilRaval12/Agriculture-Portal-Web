import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, Clock, ArrowLeft, Share2, Heart, MessageSquare, Send } from 'lucide-react';
import { api } from '../services/api';
import { BlogPost } from '../types';
import { useDragon } from '../context/DragonContext';
import { PageTransition } from '../components/layout/PageTransition';

export const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<{ name: string; date: string; message: string }[]>([
    {
      name: 'Ramesh Patel',
      date: 'Aug 20, 2026',
      message: 'Excellent practical breakdown! Applying Jeevamrutha in our Mehsana plots dramatically reduced water requirements.',
    },
    {
      name: 'Anand Shah',
      date: 'Aug 24, 2026',
      message: 'The companion planting advice with marigolds worked wonders for keeping root nematodes away from our tomato fields.',
    },
  ]);
  const [newComment, setNewComment] = useState({ name: '', message: '' });

  const { setEmotion, moveTo, speak } = useDragon();

  useEffect(() => {
    moveTo('TOP_RIGHT');
    setEmotion('THINKING', 2500);

    const loadPost = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await api.blogs.getById(parseInt(id));
        setPost(data);
        speak(`Reading "${data.title.slice(0, 30)}..." 🌾`, 3000);
      } catch (e) {
        console.error('Failed to load article:', e);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id]);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.name.trim() || !newComment.message.trim()) return;

    setComments((prev) => [
      ...prev,
      {
        name: newComment.name.trim(),
        date: 'Just now',
        message: newComment.message.trim(),
      },
    ]);
    setNewComment({ name: '', message: '' });
    setEmotion('HAPPY', 2000);
    speak('Thank you for sharing your farming knowledge! 💬', 3000);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-emerald-700 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-semibold text-slate-500 mt-3">Opening agriculture article...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="text-center max-w-sm bg-white p-8 rounded-3xl border border-slate-100 shadow-soft">
          <h2 className="font-display font-bold text-xl text-slate-800">Article Not Found</h2>
          <p className="text-xs text-slate-500 mt-1 mb-4">The requested article could not be retrieved.</p>
          <Link to="/blog" className="px-5 py-2.5 bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs">
            Return to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      {/* Breadcrumb Bar */}
      <div className="bg-earth-50/60 border-b border-slate-100 py-3">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center space-x-2 text-xs text-slate-500">
          <Link to="/" className="hover:text-emerald-700 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-emerald-700 transition-colors">Blog</Link>
          <span>/</span>
          <span className="font-semibold text-slate-800 truncate">{post.title}</span>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          to="/blog"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-emerald-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Articles</span>
        </Link>

        {/* Article Header */}
        <div className="space-y-4 mb-8">
          <span className="inline-block bg-emerald-100/70 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {post.category}
          </span>

          <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight leading-[1.2]">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1.5 font-semibold text-slate-700">
              <User className="w-4 h-4 text-emerald-600" />
              {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-600" />
              {post.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-600" />
              {post.readTime}
            </span>
          </div>
        </div>

        {/* Featured Image */}
        <div className="rounded-3xl overflow-hidden mb-10 shadow-lg border border-slate-100">
          <img
            src={post.imageUrl || '/images/image_1.jpg'}
            alt={post.title}
            className="w-full h-[360px] sm:h-[460px] object-cover"
          />
        </div>

        {/* Article Body */}
        <div className="prose prose-slate max-w-none text-slate-700 text-base sm:text-lg leading-relaxed space-y-6">
          <p className="font-medium text-emerald-950/90 text-lg sm:text-xl leading-relaxed italic border-l-4 border-emerald-700 pl-4 py-1">
            {post.excerpt}
          </p>

          <p>{post.content}</p>

          {/* Practical Farmer Box */}
          <div className="my-8 p-6 bg-agri-50/70 rounded-3xl border border-agri-200">
            <h4 className="font-display font-bold text-base text-emerald-900 mb-2">
              🌾 Key Field Takeaways
            </h4>
            <ul className="text-sm text-slate-700 space-y-1.5 list-disc list-inside">
              <li>Inoculate soil with beneficial mycorrhiza before seasonal sowing.</li>
              <li>Maintain regular moisture tension checks using affordable soil probes.</li>
              <li>Apply certified organic bio-fertilizers available in our Agriculture Portal shop.</li>
            </ul>
          </div>
        </div>

        {/* Discussion / Comments Section (From original blog-single.html) */}
        <div className="mt-16 pt-10 border-t border-slate-200 space-y-8">
          <h3 className="font-display font-bold text-2xl text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-emerald-700" />
            <span>Farmer Discussion ({comments.length})</span>
          </h3>

          <div className="space-y-4">
            {comments.map((c, i) => (
              <div key={i} className="p-5 rounded-2xl bg-white border border-slate-100 shadow-soft">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-slate-800">{c.name}</span>
                  <span className="text-xs text-slate-400">{c.date}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{c.message}</p>
              </div>
            ))}
          </div>

          {/* Add Comment Form */}
          <form onSubmit={handleCommentSubmit} className="bg-earth-50/70 p-6 rounded-3xl border border-earth-100 space-y-4">
            <h4 className="font-display font-bold text-base text-slate-800">
              Leave a Comment or Question
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Your Name *"
                required
                value={newComment.name}
                onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
                className="bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-agri-500"
              />
            </div>
            <textarea
              placeholder="Write your farming insights or inquiry..."
              rows={3}
              required
              value={newComment.message}
              onChange={(e) => setNewComment({ ...newComment, message: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-agri-500"
            />
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-xs flex items-center space-x-1.5 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Post Comment</span>
            </button>
          </form>
        </div>
      </article>
    </PageTransition>
  );
};
