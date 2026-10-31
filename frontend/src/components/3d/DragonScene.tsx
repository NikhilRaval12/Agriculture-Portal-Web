import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { DragonCharacter } from './DragonCharacter';
import { DragonEmotion } from '../../types';

interface DragonSceneProps {
  emotion: DragonEmotion;
  isHovered: boolean;
  reducedMotion?: boolean;
}

const FloatingSporeAura: React.FC<{ emotion: DragonEmotion }> = ({ emotion }) => {
  const sporeColor = emotion === 'HAPPY' || emotion === 'CELEBRATING'
    ? '#fbbf24' // Golden pollen
    : emotion === 'SUCCESS'
    ? '#34d399' // Emerald mint
    : emotion === 'THINKING'
    ? '#38bdf8' // Celestial blue
    : '#86efac'; // Soft sprout green

  return (
    <Sparkles
      count={28}
      scale={2.2}
      size={emotion === 'CELEBRATING' ? 4 : 2}
      speed={0.4}
      color={sporeColor}
      opacity={0.7}
    />
  );
};

export const DragonScene: React.FC<DragonSceneProps> = ({
  emotion,
  isHovered,
  reducedMotion = false,
}) => {
  return (
    <Canvas
      camera={{ position: [0, 0.2, 2.6], fov: 42 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      className="w-full h-full cursor-pointer"
    >
      <ambientLight intensity={1.2} />
      <directionalLight position={[4, 5, 3]} intensity={1.5} color="#fffbeb" />
      <pointLight position={[-3, 2, -2]} intensity={0.6} color="#86efac" />
      <pointLight position={[2, -2, 2]} intensity={0.4} color="#fef08a" />

      <Suspense fallback={null}>
        {!reducedMotion ? (
          <Float speed={2.5} rotationIntensity={0.2} floatIntensity={0.3}>
            <DragonCharacter
              emotion={emotion}
              isHovered={isHovered}
              reducedMotion={reducedMotion}
            />
            <FloatingSporeAura emotion={emotion} />
          </Float>
        ) : (
          <DragonCharacter
            emotion={emotion}
            isHovered={isHovered}
            reducedMotion={true}
          />
        )}
      </Suspense>
    </Canvas>
  );
};
