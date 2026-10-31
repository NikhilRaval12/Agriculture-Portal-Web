import React from 'react';
import { motion } from 'framer-motion';
import { useDragon } from '../../context/DragonContext';

export const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { reducedMotion } = useDragon();

  if (reducedMotion) {
    return <div className="min-h-[80vh]">{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, filter: 'blur(3px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -8, filter: 'blur(3px)' }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-[80vh]"
    >
      {children}
    </motion.div>
  );
};
