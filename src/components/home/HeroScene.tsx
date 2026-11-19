"use client";

import * as React from "react";
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles, Float } from "@react-three/drei";
import type { Group, Mesh } from "three";

function AtelierOrbitalRings() {
  const outerRingRef = useRef<Mesh>(null);
  const innerRingRef = useRef<Mesh>(null);
  const groupRef = useRef<Group>(null);

  useFrame((state, delta) => {
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z += delta * 0.18;
      outerRingRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.35 + 0.55;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z -= delta * 0.25;
      innerRingRef.current.rotation.y =
        Math.cos(state.clock.elapsedTime * 0.4) * 0.4;
    }
    if (groupRef.current) {
      // Subtle mouse parallax response
      const targetX = state.pointer.x * 0.25;
      const targetY = state.pointer.y * 0.25;
      groupRef.current.rotation.y +=
        (targetX - groupRef.current.rotation.y) * 0.05;
      groupRef.current.rotation.x +=
        (-targetY - groupRef.current.rotation.x) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.6} rotationIntensity={0.2} floatIntensity={0.4}>
        {/* Outer Sculpted Gold Torus Ring */}
        <mesh ref={outerRingRef} scale={1.95}>
          <torusGeometry args={[1.15, 0.012, 24, 120]} />
          <meshStandardMaterial
            color="#FFEEB3"
            emissive="#FFEEB3"
            emissiveIntensity={0.35}
            metalness={0.9}
            roughness={0.15}
            transparent
            opacity={0.45}
          />
        </mesh>

        {/* Inner Tilted Brass Ring */}
        <mesh ref={innerRingRef} scale={1.55} rotation={[0.8, 0.3, 0]}>
          <torusGeometry args={[1.0, 0.008, 16, 100]} />
          <meshStandardMaterial
            color="#C89B54"
            emissive="#FFEEB3"
            emissiveIntensity={0.2}
            metalness={0.95}
            roughness={0.2}
            transparent
            opacity={0.35}
          />
        </mesh>
      </Float>

      {/* Floating Golden Atelier Sparkles */}
      <Sparkles
        count={48}
        scale={4.8}
        size={2.2}
        speed={0.45}
        opacity={0.65}
        color="#FFEEB3"
      />
    </group>
  );
}

export default function HeroScene() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0"
      aria-hidden="true"
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 4.5], fov: 42 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[4, 5, 3]} intensity={1.5} color="#FFEEB3" />
        <pointLight position={[-3, -2, 2]} intensity={0.8} color="#013E37" />
        <AtelierOrbitalRings />
      </Canvas>
    </div>
  );
}
