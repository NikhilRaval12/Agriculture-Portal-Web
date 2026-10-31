import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DragonEmotion, DragonPosition } from '../types';

interface DragonContextType {
  emotion: DragonEmotion;
  setEmotion: (emotion: DragonEmotion, durationMs?: number) => void;
  position: DragonPosition;
  customCoords: { x: number; y: number } | null;
  moveTo: (position: DragonPosition, coords?: { x: number; y: number }) => void;
  returnToDefault: () => void;
  speechText: string | null;
  speak: (text: string, durationMs?: number) => void;
  celebrate: () => void;
  reactToError: (msg?: string) => void;
  reactToSuccess: (msg?: string) => void;
  isAssistantOpen: boolean;
  setAssistantOpen: (open: boolean) => void;
  isMinimized: boolean;
  setMinimized: (minimized: boolean) => void;
  reducedMotion: boolean;
}

const DragonContext = createContext<DragonContextType | undefined>(undefined);

export const DragonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [emotion, setEmotionState] = useState<DragonEmotion>('IDLE');
  const [position, setPosition] = useState<DragonPosition>('BOTTOM_RIGHT');
  const [customCoords, setCustomCoords] = useState<{ x: number; y: number } | null>(null);
  const [speechText, setSpeechText] = useState<string | null>(null);
  const [isAssistantOpen, setAssistantOpen] = useState(false);
  const [isMinimized, setMinimized] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Detect user's reduced-motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const setEmotion = useCallback((newEmotion: DragonEmotion, durationMs?: number) => {
    setEmotionState(newEmotion);
    if (durationMs && durationMs > 0) {
      setTimeout(() => {
        setEmotionState('IDLE');
      }, durationMs);
    }
  }, []);

  const speak = useCallback((text: string, durationMs = 4000) => {
    setSpeechText(text);
    if (durationMs > 0) {
      setTimeout(() => {
        setSpeechText(prev => (prev === text ? null : prev));
      }, durationMs);
    }
  }, []);

  const moveTo = useCallback((pos: DragonPosition, coords?: { x: number; y: number }) => {
    setPosition(pos);
    if (coords) {
      setCustomCoords(coords);
    } else {
      setCustomCoords(null);
    }
  }, []);

  const returnToDefault = useCallback(() => {
    setPosition('BOTTOM_RIGHT');
    setCustomCoords(null);
  }, []);

  const celebrate = useCallback(() => {
    setEmotionState('CELEBRATING');
    speak('Hooray! 🌾✨', 3500);
    setTimeout(() => {
      setEmotionState('IDLE');
    }, 4000);
  }, [speak]);

  const reactToSuccess = useCallback((msg?: string) => {
    setEmotionState('SUCCESS');
    speak(msg || 'Wonderful! Added with care.', 3000);
    setTimeout(() => {
      setEmotionState('HAPPY');
      setTimeout(() => setEmotionState('IDLE'), 2000);
    }, 2500);
  }, [speak]);

  const reactToError = useCallback((msg?: string) => {
    setEmotionState('CONFUSED');
    speak(msg || 'Oh dear, let us check that again!', 3500);
    setTimeout(() => {
      setEmotionState('IDLE');
    }, 4000);
  }, [speak]);

  return (
    <DragonContext.Provider
      value={{
        emotion,
        setEmotion,
        position,
        customCoords,
        moveTo,
        returnToDefault,
        speechText,
        speak,
        celebrate,
        reactToError,
        reactToSuccess,
        isAssistantOpen,
        setAssistantOpen,
        isMinimized,
        setMinimized,
        reducedMotion,
      }}
    >
      {children}
    </DragonContext.Provider>
  );
};

export const useDragon = () => {
  const context = useContext(DragonContext);
  if (!context) throw new Error('useDragon must be used within a DragonProvider');
  return context;
};
