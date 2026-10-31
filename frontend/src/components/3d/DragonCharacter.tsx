import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DragonEmotion } from '../../types';

interface DragonCharacterProps {
  emotion: DragonEmotion;
  isHovered: boolean;
  reducedMotion?: boolean;
}

export const DragonCharacter: React.FC<DragonCharacterProps> = ({
  emotion,
  isHovered,
  reducedMotion = false,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftWingRef = useRef<THREE.Group>(null);
  const rightWingRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  const hatRef = useRef<THREE.Group>(null);

  // Agricultural Organic Emerald & Sprout Palette
  const materials = useMemo(() => {
    return {
      body: new THREE.MeshStandardMaterial({
        color: '#15803d', // Rich forest emerald
        roughness: 0.35,
        metalness: 0.1,
      }),
      belly: new THREE.MeshStandardMaterial({
        color: '#86efac', // Soft pale sprout green
        roughness: 0.45,
      }),
      hornsAndClaws: new THREE.MeshStandardMaterial({
        color: '#f59e0b', // Amber horn tips
        roughness: 0.3,
        metalness: 0.2,
      }),
      wings: new THREE.MeshStandardMaterial({
        color: '#4ade80', // Vibrant leaf wing membrane
        roughness: 0.3,
        transparent: true,
        opacity: 0.92,
        side: THREE.DoubleSide,
      }),
      eyes: new THREE.MeshStandardMaterial({
        color: '#0f172a', // Deep onyx
        roughness: 0.1,
      }),
      pupilGlow: new THREE.MeshBasicMaterial({
        color: '#ffffff',
      }),
      strawHat: new THREE.MeshStandardMaterial({
        color: '#d97706', // Natural straw amber
        roughness: 0.8,
      }),
      hatBand: new THREE.MeshStandardMaterial({
        color: '#b91c1c', // Country red ribbon band
        roughness: 0.5,
      }),
      sproutLeaf: new THREE.MeshStandardMaterial({
        color: '#22c55e', // Fresh organic sprout
        roughness: 0.3,
      }),
      cheeks: new THREE.MeshBasicMaterial({
        color: '#f43f5e', // Gentle rosy cheeks
        transparent: true,
        opacity: 0.45,
      }),
    };
  }, []);

  // Animation Kinematics Loop
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    if (reducedMotion) {
      groupRef.current.position.y = 0;
      return;
    }

    // 1. Idle Floating & Hover Physics
    let floatSpeed = 2.0;
    let floatHeight = 0.08;
    let wingSpeed = 8.0;
    let wingAngle = 0.4;
    let targetHeadPitch = 0;
    let targetHeadYaw = 0;
    let targetHeadRoll = 0;
    let tailWagSpeed = 3.0;
    let tailWagAngle = 0.25;

    // Adjust parameters per emotion
    switch (emotion) {
      case 'HAPPY':
        floatSpeed = 4.0;
        floatHeight = 0.12;
        wingSpeed = 12.0;
        tailWagSpeed = 8.0;
        tailWagAngle = 0.45;
        targetHeadRoll = Math.sin(t * 4) * 0.12;
        break;

      case 'EXCITED':
      case 'CELEBRATING':
        floatSpeed = 6.0;
        floatHeight = 0.2;
        wingSpeed = 16.0;
        wingAngle = 0.6;
        tailWagSpeed = 12.0;
        tailWagAngle = 0.6;
        targetHeadPitch = Math.sin(t * 6) * 0.15;
        groupRef.current.rotation.y += delta * 1.5;
        break;

      case 'CURIOUS':
        floatSpeed = 1.5;
        wingSpeed = 5.0;
        targetHeadRoll = 0.25; // Inquisitive head tilt
        targetHeadYaw = Math.sin(t * 1.5) * 0.3;
        tailWagAngle = 0.15;
        break;

      case 'THINKING':
        floatSpeed = 1.0;
        wingSpeed = 4.0;
        targetHeadPitch = -0.2; // Looking upwards thoughtfully
        targetHeadYaw = 0.15;
        break;

      case 'SLEEPING':
        floatSpeed = 0.8;
        floatHeight = 0.03;
        wingSpeed = 1.5;
        wingAngle = 0.1;
        targetHeadPitch = 0.25; // Resting head
        tailWagSpeed = 0.5;
        tailWagAngle = 0.05;
        break;

      case 'CONFUSED':
      case 'ERROR':
        floatSpeed = 2.5;
        wingSpeed = 7.0;
        targetHeadRoll = Math.sin(t * 3) * 0.2;
        targetHeadPitch = Math.sin(t * 2) * 0.1;
        break;

      case 'SAD':
        floatSpeed = 1.0;
        floatHeight = 0.04;
        wingSpeed = 3.0;
        targetHeadPitch = 0.3; // Head hung low
        tailWagAngle = 0.05;
        break;

      case 'WORKING':
        floatSpeed = 3.0;
        wingSpeed = 10.0;
        targetHeadPitch = 0.1;
        break;

      case 'GREETING':
        floatSpeed = 3.0;
        wingSpeed = 10.0;
        targetHeadYaw = Math.sin(t * 3) * 0.3;
        targetHeadPitch = -0.1;
        break;

      case 'IDLE':
      default:
        floatSpeed = 2.0;
        floatHeight = 0.08;
        wingSpeed = 6.0;
        break;
    }

    if (isHovered && emotion === 'IDLE') {
      wingSpeed = 12.0;
      targetHeadRoll = 0.15;
      floatHeight = 0.12;
    }

    // Apply smooth vertical floating
    groupRef.current.position.y = Math.sin(t * floatSpeed) * floatHeight;

    // Wing flapping kinematics
    if (leftWingRef.current && rightWingRef.current) {
      const flap = Math.sin(t * wingSpeed) * wingAngle;
      leftWingRef.current.rotation.z = 0.3 + flap;
      rightWingRef.current.rotation.z = -0.3 - flap;
    }

    // Tail wagging
    if (tailRef.current) {
      tailRef.current.rotation.y = Math.sin(t * tailWagSpeed) * tailWagAngle;
      tailRef.current.rotation.x = Math.cos(t * tailWagSpeed * 0.5) * 0.1;
    }

    // Head orientation lerp
    if (headRef.current) {
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, targetHeadPitch, 0.1);
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetHeadYaw, 0.1);
      headRef.current.rotation.z = THREE.MathUtils.lerp(headRef.current.rotation.z, targetHeadRoll, 0.1);
    }

    // Eye blinking / squinting
    if (leftEyeRef.current && rightEyeRef.current) {
      const blinkCycle = Math.floor(t % 4);
      const isBlinking = blinkCycle === 0 && (t % 1 < 0.15);
      const isSleeping = emotion === 'SLEEPING';
      const eyeScaleY = (isBlinking || isSleeping) ? 0.1 : (emotion === 'HAPPY' ? 0.6 : 1.0);

      leftEyeRef.current.scale.y = THREE.MathUtils.lerp(leftEyeRef.current.scale.y, eyeScaleY, 0.2);
      rightEyeRef.current.scale.y = THREE.MathUtils.lerp(rightEyeRef.current.scale.y, eyeScaleY, 0.2);
    }
  });

  return (
    <group ref={groupRef} scale={[0.85, 0.85, 0.85]}>
      {/* 1. MAIN BODY */}
      <mesh material={materials.body} position={[0, 0, 0]}>
        <sphereGeometry args={[0.55, 32, 32]} />
      </mesh>

      {/* 2. SOFT BELLY */}
      <mesh material={materials.belly} position={[0, -0.05, 0.28]} scale={[0.8, 0.85, 0.6]}>
        <sphereGeometry args={[0.45, 24, 24]} />
      </mesh>

      {/* 3. HEAD & EXPRESSION GROUP */}
      <group ref={headRef} position={[0, 0.45, 0.25]}>
        {/* Head Base */}
        <mesh material={materials.body}>
          <sphereGeometry args={[0.42, 32, 32]} />
        </mesh>

        {/* Cute Snout */}
        <mesh material={materials.body} position={[0, -0.08, 0.32]} scale={[0.9, 0.7, 1.0]}>
          <sphereGeometry args={[0.26, 24, 24]} />
        </mesh>

        {/* Nostrils */}
        <mesh material={materials.hornsAndClaws} position={[-0.06, -0.05, 0.52]}>
          <sphereGeometry args={[0.02, 12, 12]} />
        </mesh>
        <mesh material={materials.hornsAndClaws} position={[0.06, -0.05, 0.52]}>
          <sphereGeometry args={[0.02, 12, 12]} />
        </mesh>

        {/* Expressive Eyes */}
        <group position={[0, 0.08, 0.28]}>
          {/* Left Eye */}
          <group position={[-0.18, 0, 0]}>
            <mesh ref={leftEyeRef} material={materials.eyes}>
              <sphereGeometry args={[0.1, 24, 24]} />
            </mesh>
            {/* Eye Highlight / Catchlight */}
            <mesh material={materials.pupilGlow} position={[0.025, 0.035, 0.08]}>
              <sphereGeometry args={[0.028, 12, 12]} />
            </mesh>
          </group>

          {/* Right Eye */}
          <group position={[0.18, 0, 0]}>
            <mesh ref={rightEyeRef} material={materials.eyes}>
              <sphereGeometry args={[0.1, 24, 24]} />
            </mesh>
            {/* Eye Highlight / Catchlight */}
            <mesh material={materials.pupilGlow} position={[0.025, 0.035, 0.08]}>
              <sphereGeometry args={[0.028, 12, 12]} />
            </mesh>
          </group>
        </group>

        {/* Rosy Cheeks */}
        <mesh material={materials.cheeks} position={[-0.26, -0.08, 0.26]}>
          <sphereGeometry args={[0.07, 16, 16]} />
        </mesh>
        <mesh material={materials.cheeks} position={[0.26, -0.08, 0.26]}>
          <sphereGeometry args={[0.07, 16, 16]} />
        </mesh>

        {/* Cute Baby Horns */}
        <mesh material={materials.hornsAndClaws} position={[-0.24, 0.35, -0.05]} rotation={[-0.3, 0, -0.3]}>
          <coneGeometry args={[0.09, 0.26, 16]} />
        </mesh>
        <mesh material={materials.hornsAndClaws} position={[0.24, 0.35, -0.05]} rotation={[-0.3, 0, 0.3]}>
          <coneGeometry args={[0.09, 0.26, 16]} />
        </mesh>

        {/* 4. FARMER'S MINI STRAW HAT & SPROUT */}
        <group ref={hatRef} position={[0, 0.42, 0.02]} rotation={[0.15, 0, 0]}>
          {/* Hat Brim */}
          <mesh material={materials.strawHat}>
            <cylinderGeometry args={[0.34, 0.34, 0.04, 32]} />
          </mesh>
          {/* Hat Crown */}
          <mesh material={materials.strawHat} position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.2, 0.23, 0.18, 32]} />
          </mesh>
          {/* Red Ribbon Band */}
          <mesh material={materials.hatBand} position={[0, 0.03, 0]}>
            <cylinderGeometry args={[0.235, 0.235, 0.03, 32]} />
          </mesh>
          {/* Living Plant Sprout on Hat */}
          <group position={[0, 0.2, 0]} rotation={[0, 0, 0.2]}>
            <mesh material={materials.sproutLeaf}>
              <cylinderGeometry args={[0.015, 0.015, 0.1, 8]} />
            </mesh>
            <mesh material={materials.sproutLeaf} position={[0.04, 0.07, 0]} rotation={[0, 0, -0.8]} scale={[1, 0.6, 1]}>
              <sphereGeometry args={[0.05, 12, 12]} />
            </mesh>
            <mesh material={materials.sproutLeaf} position={[-0.04, 0.07, 0]} rotation={[0, 0, 0.8]} scale={[1, 0.6, 1]}>
              <sphereGeometry args={[0.05, 12, 12]} />
            </mesh>
          </group>
        </group>
      </group>

      {/* 5. ORGANIC LEAF WINGS */}
      {/* Left Wing */}
      <group ref={leftWingRef} position={[-0.4, 0.15, -0.15]}>
        <mesh material={materials.wings} rotation={[0, 0, -0.4]} scale={[1, 1.2, 0.15]}>
          <coneGeometry args={[0.35, 0.7, 5]} />
        </mesh>
      </group>

      {/* Right Wing */}
      <group ref={rightWingRef} position={[0.4, 0.15, -0.15]}>
        <mesh material={materials.wings} rotation={[0, 0, 0.4]} scale={[1, 1.2, 0.15]}>
          <coneGeometry args={[0.35, 0.7, 5]} />
        </mesh>
      </group>

      {/* 6. FEET & PAWS */}
      <mesh material={materials.body} position={[-0.28, -0.45, 0.2]} scale={[1, 0.7, 1.3]}>
        <sphereGeometry args={[0.16, 16, 16]} />
      </mesh>
      <mesh material={materials.body} position={[0.28, -0.45, 0.2]} scale={[1, 0.7, 1.3]}>
        <sphereGeometry args={[0.16, 16, 16]} />
      </mesh>

      {/* 7. WAGGING TAIL WITH LEAF TIP */}
      <group ref={tailRef} position={[0, -0.2, -0.45]}>
        <mesh material={materials.body} rotation={[-0.4, 0, 0]}>
          <coneGeometry args={[0.14, 0.55, 16]} />
        </mesh>
        {/* Leaf Clover / Sprout on Tail Tip */}
        <mesh material={materials.sproutLeaf} position={[0, -0.1, -0.32]} rotation={[0.4, 0, 0]} scale={[1, 0.5, 1]}>
          <sphereGeometry args={[0.12, 16, 16]} />
        </mesh>
      </group>
    </group>
  );
};
