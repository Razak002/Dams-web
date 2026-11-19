"use client";

import * as React from "react";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Float } from "@react-three/drei";
import type { Group } from "three";

interface ShoeModelProps {
  colourHex?: string;
  useExternalGltf?: boolean;
}

function LoadedGltfShoe({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={1.8} position={[0, -0.2, 0]} />;
}

/**
 * Sculptural 3D Artisan Shoe Showcase
 * Uses React Three Fiber PBR materials (burnished calfskin upper, Blake-stitched welt,
 * stacked leather heel, and Benin-cast brass hardware accent) and optionally loads
 * /models/hero-shoe.glb when custom GLTF geometry is provided.
 */
export function ShoeModel({
  colourHex = "#3A2218",
  useExternalGltf = false,
}: ShoeModelProps) {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    // Gentle breathing tilt on top of OrbitControls autoRotate
    groupRef.current.rotation.z =
      Math.sin(state.clock.elapsedTime * 0.7) * 0.035;
  });

  if (useExternalGltf) {
    return (
      <React.Suspense fallback={null}>
        <LoadedGltfShoe url="/models/hero-shoe.glb" />
      </React.Suspense>
    );
  }

  return (
    <Float
      speed={1.4}
      rotationIntensity={0.18}
      floatIntensity={0.35}
      floatingRange={[-0.06, 0.06]}
    >
      <group
        ref={groupRef}
        position={[0, -0.15, 0]}
        rotation={[0.12, -0.55, -0.05]}
        scale={1.18}
      >
        {/* Outsole — Stacked Leather */}
        <mesh position={[0.15, -0.38, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.55, 0.11, 0.92]} />
          <meshStandardMaterial
            color="#231710"
            roughness={0.65}
            metalness={0.08}
          />
        </mesh>

        {/* Storm Welt Stitch Rim */}
        <mesh position={[0.15, -0.31, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.48, 0.05, 0.88]} />
          <meshStandardMaterial
            color="#6E472B"
            roughness={0.5}
            metalness={0.12}
          />
        </mesh>

        {/* Stacked Leather Heel Block */}
        <mesh position={[-0.78, -0.49, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.72, 0.18, 0.86]} />
          <meshStandardMaterial
            color="#19110C"
            roughness={0.75}
            metalness={0.05}
          />
        </mesh>

        {/* Gold/Brass Heel Stabilizer Plate */}
        <mesh position={[-0.78, -0.4, 0]}>
          <boxGeometry args={[0.73, 0.025, 0.87]} />
          <meshStandardMaterial
            color="#FFEEB3"
            roughness={0.22}
            metalness={0.88}
          />
        </mesh>

        {/* Main Shoe Last / Quarter & Vamp (Full-Grain Calfskin) */}
        <mesh position={[-0.18, 0.02, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.65, 0.62, 0.82]} />
          <meshStandardMaterial
            color={colourHex}
            roughness={0.32}
            metalness={0.12}
          />
        </mesh>

        {/* Sculpted Toe Box / Forefoot */}
        <mesh
          position={[0.78, -0.1, 0]}
          rotation={[0, 0, -0.12]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[1.15, 0.42, 0.78]} />
          <meshStandardMaterial
            color={colourHex}
            roughness={0.28}
            metalness={0.15}
          />
        </mesh>

        {/* Raised Apron / Vamp Saddle Strap */}
        <mesh position={[0.25, 0.18, 0]} castShadow>
          <boxGeometry args={[0.42, 0.22, 0.85]} />
          <meshStandardMaterial
            color="#26150E"
            roughness={0.3}
            metalness={0.15}
          />
        </mesh>

        {/* Cast Brass Hardware Bit Across Saddle */}
        <mesh
          position={[0.26, 0.3, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          castShadow
        >
          <cylinderGeometry args={[0.032, 0.032, 0.68, 24]} />
          <meshStandardMaterial
            color="#FFEEB3"
            roughness={0.18}
            metalness={0.92}
          />
        </mesh>

        {/* Ankle Collar / Interior Kidskin Lining */}
        <mesh position={[-0.55, 0.34, 0]}>
          <boxGeometry args={[0.78, 0.08, 0.68]} />
          <meshStandardMaterial
            color="#C89B54"
            roughness={0.55}
            metalness={0.05}
          />
        </mesh>
      </group>
    </Float>
  );
}
