'use client';

import React, { useMemo } from 'react';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { GALLERY_CONFIG } from '@/data/galleryConfig';

// Procedural gallery - fallback if Blender model not available
export function ProceduralGallery() {
  // Gallery dimensions from config
  const length = GALLERY_CONFIG.gallery.length;
  const width = GALLERY_CONFIG.gallery.width;
  const height = GALLERY_CONFIG.gallery.wallHeight;
  const wallThickness = 0.2;

  // Materials - memoized to prevent recreation on every render
  const materials = useMemo(
    () => ({
      floor: new THREE.MeshStandardMaterial({
        color: '#A0896C', // Slightly lighter floor for balance
        roughness: 0.6,
        metalness: 0.1,
      }),
      wall: new THREE.MeshStandardMaterial({
        color: '#FFFFFF', // Pure white for bright, modern gallery
        roughness: 0.75, // Reduced for subtle sheen
        emissive: '#FFFFFF',
        emissiveIntensity: 0.15, // Subtle self-illumination
      }),
      ceiling: new THREE.MeshStandardMaterial({
        color: '#FFFFFF',
        roughness: 0.85,
        emissive: '#FAFAFA',
        emissiveIntensity: 0.1,
      }),
    }),
    []
  );

  return (
    <group>
      {/* Floor */}
      <RigidBody type="fixed" colliders={false}>
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[length, width]} />
          <primitive object={materials.floor} attach="material" />
        </mesh>
        <CuboidCollider args={[length / 2, 0.1, width / 2]} position={[0, -0.1, 0]} />
      </RigidBody>

      {/* Ceiling */}
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, height, 0]}
        receiveShadow
      >
        <planeGeometry args={[length, width]} />
        <primitive object={materials.ceiling} attach="material" />
      </mesh>

      {/* West Wall (left) */}
      <RigidBody type="fixed" colliders={false}>
        <mesh
          position={[-length / 2, height / 2, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[wallThickness, height, width]} />
          <primitive object={materials.wall} attach="material" />
        </mesh>
        <CuboidCollider args={[wallThickness / 2, height / 2, width / 2]} position={[-length / 2, height / 2, 0]} />
      </RigidBody>

      {/* East Wall (right) */}
      <RigidBody type="fixed" colliders={false}>
        <mesh
          position={[length / 2, height / 2, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[wallThickness, height, width]} />
          <primitive object={materials.wall} attach="material" />
        </mesh>
        <CuboidCollider args={[wallThickness / 2, height / 2, width / 2]} position={[length / 2, height / 2, 0]} />
      </RigidBody>

      {/* North Wall (back) */}
      <RigidBody type="fixed" colliders={false}>
        <mesh
          position={[0, height / 2, -width / 2]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[length, height, wallThickness]} />
          <primitive object={materials.wall} attach="material" />
        </mesh>
        <CuboidCollider args={[length / 2, height / 2, wallThickness / 2]} position={[0, height / 2, -width / 2]} />
      </RigidBody>

      {/* South Wall (front) - with entrance opening */}
      <RigidBody type="fixed" colliders={false}>
        {/* Left section of south wall */}
        <mesh
          position={[-length / 2 + 2, height / 2, width / 2]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[4, height, wallThickness]} />
          <primitive object={materials.wall} attach="material" />
        </mesh>
        <CuboidCollider args={[2, height / 2, wallThickness / 2]} position={[-length / 2 + 2, height / 2, width / 2]} />

        {/* Right section of south wall */}
        <mesh
          position={[length / 2 - 2, height / 2, width / 2]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[4, height, wallThickness]} />
          <primitive object={materials.wall} attach="material" />
        </mesh>
        <CuboidCollider args={[2, height / 2, wallThickness / 2]} position={[length / 2 - 2, height / 2, width / 2]} />

        {/* Top section above entrance */}
        <mesh
          position={[0, height - 0.4, width / 2]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[3, 0.8, wallThickness]} />
          <primitive object={materials.wall} attach="material" />
        </mesh>
      </RigidBody>

      {/* Center divider wall (creates two rooms) */}
      <RigidBody type="fixed" colliders={false}>
        {/* Left section */}
        <mesh
          position={[-3, height / 2, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[wallThickness, height, 4]} />
          <primitive object={materials.wall} attach="material" />
        </mesh>
        <CuboidCollider args={[wallThickness / 2, height / 2, 2]} position={[-3, height / 2, 0]} />

        {/* Right section */}
        <mesh
          position={[3, height / 2, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[wallThickness, height, 4]} />
          <primitive object={materials.wall} attach="material" />
        </mesh>
        <CuboidCollider args={[wallThickness / 2, height / 2, 2]} position={[3, height / 2, 0]} />
      </RigidBody>
    </group>
  );
}

