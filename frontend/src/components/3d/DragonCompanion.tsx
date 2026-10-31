import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Sparkles, X, ChevronUp, ChevronDown, Compass } from 'lucide-react';
import { useDragon } from '../../context/DragonContext';
import { DragonScene } from './DragonScene';
import { DragonPosition } from '../../types';

export const DragonCompanion: React.FC = () => {
  const {
    emotion,
    setEmotion,
    position,
    moveTo,
    speechText,
    isAssistantOpen,
    setAssistantOpen,
    isMinimized,
    setMinimized,
    reducedMotion,
  } = useDragon();

  const [isHovered, setIsHovered] = useState(false);

  // Position Coordinates Mapping
  const getPositionClasses = (pos: DragonPosition) => {
    switch (pos) {
      case 'BOTTOM_LEFT':
        return 'bottom-6 left-6';
      case 'TOP_RIGHT':
        return 'top-24 right-6';
      case 'HERO':
        return 'top-32 right-12 md:right-24';
      case 'FLOATING_PRODUCT':
        return 'bottom-20 right-10 md:right-32';
      case 'CART_SIDE':
        return 'bottom-16 right-8 md:right-20';
      case 'CHECKOUT_WAIT':
        return 'bottom-12 right-6 md:right-16';
      case 'BOTTOM_RIGHT':
      default:
        return 'bottom-6 right-6';
    }
  };

  const handleDragonClick = () => {
    setEmotion('HAPPY', 2000);
    setAssistantOpen(!isAssistantOpen);
  };

  const cyclePosition = (e: React.MouseEvent) => {
    e.stopPropagation();
    const positions: DragonPosition[] = ['BOTTOM_RIGHT', 'BOTTOM_LEFT', 'TOP_RIGHT'];
    const nextIdx = (positions.indexOf(position) + 1) % positions.length;
    moveTo(positions[nextIdx]);
    setEmotion('CURIOUS', 1500);
  };

  return (
    <div
      className={`fixed ${getPositionClasses(position)} z-40 transition-all duration-700 ease-out select-none pointer-events-none`}
    >
      <div className="relative flex flex-col items-center pointer-events-auto">
        {/* Dynamic Speech Bubble */}
        <AnimatePresence>
          {speechText && !isMinimized && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              className="mb-2 max-w-[210px] bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-lg border border-agri-100 text-xs font-medium text-slate-800 text-center relative pointer-events-auto cursor-pointer"
              onClick={() => setAssistantOpen(true)}
            >
              <span>{speechText}</span>
              {/* Bubble Arrow */}
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white/95 rotate-45 border-r border-b border-agri-100"></div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Companion Capsule Container */}
        <div className="relative group">
          {/* Controls Bar on Hover */}
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center space-x-1 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full border border-slate-200 shadow-sm text-[11px] text-slate-600">
            <button
              onClick={cyclePosition}
              title="Fly to another corner"
              className="p-1 hover:text-agri-600 transition-colors"
            >
              <Compass className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMinimized(!isMinimized);
              }}
              title={isMinimized ? 'Expand Companion' : 'Minimize Companion'}
              className="p-1 hover:text-slate-900 transition-colors"
            >
              {isMinimized ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          {/* 3D Character Stage */}
          {!isMinimized ? (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={handleDragonClick}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-b from-white/30 to-agri-50/20 backdrop-blur-[2px] p-1 flex items-center justify-center relative cursor-pointer group-hover:shadow-glow transition-shadow duration-300"
            >
              <DragonScene
                emotion={emotion}
                isHovered={isHovered}
                reducedMotion={reducedMotion}
              />

              {/* Quick AI Assistant Trigger Badge */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setAssistantOpen(true);
                }}
                className="absolute -bottom-1 -right-1 bg-gradient-to-r from-agri-600 to-emerald-600 text-white p-2 rounded-full shadow-md hover:shadow-lg hover:scale-110 active:scale-95 transition-all duration-200"
                title="Ask Agriculture Assistant"
              >
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ) : (
            /* Minimized Token */
            <motion.button
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              onClick={() => setMinimized(false)}
              className="bg-emerald-700 text-white px-3 py-1.5 rounded-full shadow-md flex items-center space-x-1.5 text-xs font-semibold hover:bg-emerald-800 transition-colors"
            >
              <span className="text-sm">🌱</span>
              <span>Dragon</span>
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};
