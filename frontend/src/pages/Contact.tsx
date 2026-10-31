import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { useDragon } from '../context/DragonContext';
import { PageTransition } from '../components/layout/PageTransition';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { setEmotion, moveTo, speak } = useDragon();

  useEffect(() => {
    moveTo('BOTTOM_RIGHT');
    setEmotion('CURIOUS', 2000);
    speak('Feel free to ask Nikhil Raval and our team anything! ✉️', 3500);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);
    setEmotion('THINKING');

    try {
      const res = await api.contact.submit(formData);
      setStatusMessage({ type: 'success', text: res.message });
      setFormData({ name: '', email: '', subject: '', message: '' });
      setEmotion('HAPPY', 3000);
      speak('Message dispatched to our agricultural team! 📬', 4000);
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: 'Failed to send message. Please ensure the backend is running.',
      });
      setEmotion('ERROR', 3000);
      speak('Oops, error sending inquiry!', 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      {/* Banner */}
      <section className="py-14 bg-gradient-to-r from-emerald-900 via-agri-800 to-emerald-950 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <img src="/images/bg_1.jpg" alt="Contact banner" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-xs font-semibold text-emerald-200 uppercase tracking-widest mb-1.5">
            <Link to="/" className="hover:text-white">Home</Link> / <span>Contact Us</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white">
            Connect With Our Agronomy Team
          </h1>
          <p className="text-sm text-emerald-100 max-w-xl mx-auto mt-2">
            Have questions regarding wholesale bulk produce, organic soil advice, or order tracking? Reach out directly.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Contact Details Cards (Col 5) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
                Direct Contact
              </span>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 mt-1">
                Portal Headquarters
              </h2>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Our main aggregation facility and customer helpdesk is situated in North Gujarat, directly adjacent to our partner farming clusters.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-soft">
                <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase">Registered Address</div>
                  <div className="text-sm font-semibold text-slate-800 mt-0.5">
                    Langhanaj, Mahesana, Gujarat, India.
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-soft">
                <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase">Direct Helpline</div>
                  <div className="text-sm font-semibold text-slate-800 mt-0.5">
                    <a href="tel:+919558254569" className="hover:text-emerald-700 transition-colors">
                      +91 95582 54569
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-soft">
                <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase">Official Email</div>
                  <div className="text-sm font-semibold text-slate-800 mt-0.5">
                    <a href="mailto:nikhilraval7473@gmail.com" className="hover:text-emerald-700 transition-colors">
                      nikhilraval7473@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-soft">
                <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase">Operating Hours</div>
                  <div className="text-sm font-semibold text-slate-800 mt-0.5">
                    Monday – Saturday: 7:00 AM – 7:00 PM
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Inquiry Form (Col 7) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-100 p-8 sm:p-10 shadow-soft">
            <h3 className="font-display font-bold text-xl text-slate-900 mb-2">
              Send an Inquiry to Nikhil Raval
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Fill out the form below and our agricultural support personnel will reply within 24 hours.
            </p>

            {statusMessage && (
              <div
                className={`mb-6 p-4 rounded-2xl text-xs font-semibold flex items-start space-x-2.5 ${
                  statusMessage.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {statusMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <span>{statusMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Ramesh Patel"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-agri-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. ramesh@example.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-agri-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Bulk order / Fertilizer consultation / Farm inquiry"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-agri-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Message *
                </label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us what crops or agricultural supplies you need assistance with..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-agri-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center space-x-2 active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending Message...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
