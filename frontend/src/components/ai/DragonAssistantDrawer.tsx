import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Send,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  Bot,
  RotateCcw,
  Plus,
} from 'lucide-react';
import { useDragon } from '../../context/DragonContext';
import { useCart } from '../../context/CartContext';
import { api } from '../../services/api';
import { AiMessage, Product } from '../../types';
import { useNavigate } from 'react-router-dom';

const defaultQuickPrompts = [
  'What crop should I plant this month?',
  'Find organic fertilizer under ₹1000.',
  'Where is my order?',
  'How much water does wheat need?',
  'Organic pest control tips for vegetables',
];

export const DragonAssistantDrawer: React.FC = () => {
  const { isAssistantOpen, setAssistantOpen, emotion, setEmotion } = useDragon();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<AiMessage[]>([
    {
      id: 'init-1',
      sender: 'dragon',
      text: 'Hello! I am your 3D Agriculture Portal companion and AI farming advisor. How can I help with your harvest, crops, or orders today?',
      emotion: 'GREETING',
      timestamp: new Date(),
      followUpQuestions: defaultQuickPrompts.slice(0, 3),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAssistantOpen) {
      scrollToBottom();
    }
  }, [messages, isAssistantOpen]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    if (!textToSend || isTyping) return;

    const userMsg: AiMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setEmotion('THINKING');

    try {
      const res = await api.ai.chat(textToSend);

      const dragonMsg: AiMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'dragon',
        text: res.reply,
        emotion: res.emotion || 'HAPPY',
        suggestedProducts: res.suggestedProducts,
        suggestedAction: res.suggestedAction,
        followUpQuestions: res.followUpQuestions,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, dragonMsg]);
      setEmotion(res.emotion || 'HAPPY', 3000);
    } catch (e) {
      const errorMsg: AiMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'dragon',
        text: 'I apologize, but I had trouble reaching our agricultural server. Please ensure the backend is connected!',
        emotion: 'CONFUSED',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
      setEmotion('CONFUSED', 3000);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <AnimatePresence>
      {isAssistantOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={() => setAssistantOpen(false)}
            className="fixed inset-0 bg-slate-950 z-50 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col border-l border-agri-100"
          >
            {/* Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-emerald-800 to-agri-700 text-white flex items-center justify-between shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-xl shadow-inner">
                  🌱
                </div>
                <div>
                  <h3 className="font-display font-semibold text-base flex items-center gap-1.5">
                    Agriculture AI Companion
                    <span className="text-[10px] bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 px-1.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                      Spring AI
                    </span>
                  </h3>
                  <p className="text-xs text-emerald-100/80">
                    Active state: <span className="font-semibold text-amber-300">{emotion}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAssistantOpen(false)}
                className="p-1.5 rounded-xl hover:bg-white/10 text-emerald-100 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-earth-50/50">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${
                    m.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                      m.sender === 'user'
                        ? 'bg-agri-600 text-white rounded-br-sm'
                        : 'bg-white border border-slate-200/80 text-slate-800 rounded-bl-sm'
                    }`}
                  >
                    <p className="whitespace-pre-line leading-relaxed">{m.text}</p>

                    {/* Suggested Products Display */}
                    {m.suggestedProducts && m.suggestedProducts.length > 0 && (
                      <div className="mt-3 space-y-2 border-t border-slate-100 pt-3">
                        <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider block">
                          Suggested Agricultural Products:
                        </span>
                        {m.suggestedProducts.map((p) => (
                          <div
                            key={p.id}
                            className="flex items-center justify-between p-2 rounded-xl bg-agri-50/60 border border-agri-100 hover:bg-agri-100/60 transition-colors"
                          >
                            <div className="flex items-center space-x-2.5">
                              <img
                                src={p.imageUrl}
                                alt={p.name}
                                className="w-10 h-10 object-cover rounded-lg border border-slate-200"
                              />
                              <div>
                                <h4 className="text-xs font-semibold text-slate-800 line-clamp-1">
                                  {p.name}
                                </h4>
                                <div className="text-[11px] text-emerald-700 font-bold">
                                  ₹{p.discountedPrice || p.price}
                                  {p.discount > 0 && (
                                    <span className="text-slate-400 line-through text-[10px] ml-1.5 font-normal">
                                      ₹{p.price}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => addToCart(p.id)}
                                className="p-1.5 bg-agri-600 hover:bg-agri-700 text-white rounded-lg shadow-sm"
                                title="Add to Cart"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  navigate(`/product/${p.id}`);
                                  setAssistantOpen(false);
                                }}
                                className="p-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg shadow-sm"
                                title="View Details"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Follow-up Question Chips */}
                  {m.followUpQuestions && m.followUpQuestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2 max-w-[85%]">
                      {m.followUpQuestions.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(q)}
                          className="text-xs bg-white/90 hover:bg-agri-50 hover:text-agri-700 hover:border-agri-300 text-slate-600 border border-slate-200 px-2.5 py-1 rounded-full transition-all duration-150"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center space-x-2 text-xs text-emerald-700 font-medium bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-xl w-fit">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>Dragon is thinking...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts Carousel */}
            <div className="px-4 py-2 border-t border-slate-100 bg-white overflow-x-auto flex gap-1.5 no-scrollbar">
              {defaultQuickPrompts.map((p, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(p)}
                  className="whitespace-nowrap text-[11px] bg-slate-100 hover:bg-agri-100 hover:text-agri-800 text-slate-600 px-2.5 py-1 rounded-full transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-4 border-t border-slate-200 bg-white">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center space-x-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask dragon about crops, fertilizers, orders..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-agri-500 focus:bg-white transition-all"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="bg-agri-600 hover:bg-agri-700 disabled:opacity-50 text-white p-2.5 rounded-xl shadow-sm transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
