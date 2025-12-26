'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Artwork } from '@/types/gallery';
import * as THREE from 'three';
import { GALLERY_CONFIG } from '@/data/galleryConfig';
import { ArtworkPlaque } from './ArtworkPlaque';

interface ArtworkFrameProps {
  artwork: Artwork;
}

// ========================================
// SHARED GEOMETRIES (Instancing)
// ========================================
// Create geometry cache at module level to share across all frames
const GEOMETRY_CACHE = new Map<string, THREE.BufferGeometry>();

function getSharedGeometry(
  type: 'frame' | 'canvas' | 'hitbox',
  width: number,
  height: number,
  depth = 0.06
): THREE.BufferGeometry {
  const key = `${type}-${width.toFixed(2)}-${height.toFixed(2)}-${depth.toFixed(2)}`;
  
  if (!GEOMETRY_CACHE.has(key)) {
    let geometry: THREE.BufferGeometry;
    
    if (type === 'frame') {
      geometry = new THREE.BoxGeometry(width, height, depth);
    } else {
      geometry = new THREE.PlaneGeometry(width, height);
    }
    
    GEOMETRY_CACHE.set(key, geometry);
  }
  
  return GEOMETRY_CACHE.get(key)!;
}

// ========================================
// SHARED MATERIALS (Instancing)
// ========================================
const FRAME_MATERIAL = new THREE.MeshStandardMaterial({
  color: '#3E2723',
  roughness: 0.6,
  metalness: 0.1,
});

const CANVAS_COLORS = [
  '#E8D4C0', '#C9B8A8', '#D4C4B0', '#B8A898', 
  '#E0D0C0', '#D8C8B8', '#C8B8A8', '#E0CDB0'
];

// Material cache for canvas colors
const CANVAS_MATERIAL_CACHE = new Map<string, THREE.MeshStandardMaterial>();

function getCanvasMaterial(artworkId: string): THREE.MeshStandardMaterial {
  if (!CANVAS_MATERIAL_CACHE.has(artworkId)) {
    // Simple hash from artwork ID
    let hash = 0;
    for (let i = 0; i < artworkId.length; i++) {
      hash = artworkId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colorIndex = Math.abs(hash) % CANVAS_COLORS.length;
    
    const material = new THREE.MeshStandardMaterial({
      color: CANVAS_COLORS[colorIndex],
      roughness: 0.7,
    });
    
    CANVAS_MATERIAL_CACHE.set(artworkId, material);
  }
  
  return CANVAS_MATERIAL_CACHE.get(artworkId)!;
}

// ========================================
// ARTWORK FRAME COMPONENT
// ========================================

export function ArtworkFrame({ artwork }: ArtworkFrameProps) {
  const { position, rotation, realSizeMeters } = artwork;
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  
  // Calculate scaled dimensions
  const sizeMultiplier = GALLERY_CONFIG.artwork.sizeMultiplier || 1;
  const scaledWidth = realSizeMeters.width * sizeMultiplier;
  const scaledHeight = realSizeMeters.height * sizeMultiplier;
  
  // Frame dimensions
  const frameThickness = GALLERY_CONFIG.artwork.frameThickness;
  const frameBorder = GALLERY_CONFIG.artwork.frameBorderWidth;
  const frameWidth = scaledWidth + frameBorder * 2;
  const frameHeight = scaledHeight + frameBorder * 2;
  
  // LOD state
  const [lodLevel, setLodLevel] = React.useState<'full' | 'simplified' | 'hidden'>('full');
  
  // Calculate LOD based on camera distance
  useFrame(() => {
    if (!groupRef.current) return;
    
    const artworkPos = new THREE.Vector3(...position);
    const distance = camera.position.distanceTo(artworkPos);
    
    // LOD levels:
    // 0-15m: Full detail
    // 15-30m: Simplified (no frame detail)
    // 30m+: Hidden (frustum culling)
    if (distance < 15) {
      if (lodLevel !== 'full') setLodLevel('full');
    } else if (distance < 30) {
      if (lodLevel !== 'simplified') setLodLevel('simplified');
    } else {
      if (lodLevel !== 'hidden') setLodLevel('hidden');
    }
  });
  
  // Get shared geometries (instanced)
  const geometries = useMemo(() => ({
    frame: getSharedGeometry('frame', frameWidth, frameHeight, frameThickness),
    canvas: getSharedGeometry('canvas', scaledWidth, scaledHeight),
    hitbox: getSharedGeometry('hitbox', frameWidth + 0.1, frameHeight + 0.1),
  }), [frameWidth, frameHeight, frameThickness, scaledWidth, scaledHeight]);
  
  // Get shared materials
  const canvasMaterial = useMemo(() => getCanvasMaterial(artwork.id), [artwork.id]);
  
  const wallOffset = 0.02;
  
  // Don't render if too far (aggressive culling)
  if (lodLevel === 'hidden') {
    return null;
  }
  
  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Render based on LOD level */}
      {lodLevel === 'full' ? (
        <>
          {/* Full detail: Frame + Canvas + Plaque */}
          <mesh position={[0, 0, wallOffset - frameThickness / 2]} castShadow={false}>
            <primitive object={geometries.frame} />
            <primitive object={FRAME_MATERIAL} attach="material" />
          </mesh>
          
          <mesh position={[0, 0, wallOffset + 0.001]} receiveShadow={false}>
            <primitive object={geometries.canvas} />
            <primitive object={canvasMaterial} attach="material" />
          </mesh>
          
          <ArtworkPlaque artwork={artwork} artworkHeight={scaledHeight} />
        </>
      ) : (
        <>
          {/* Simplified: Just colored plane (no frame) */}
          <mesh position={[0, 0, wallOffset]} receiveShadow={false}>
            <primitive object={geometries.canvas} />
            <primitive object={canvasMaterial} attach="material" />
          </mesh>
        </>
      )}
      
      {/* Invisible hitbox for raycasting (always present) */}
      <mesh
        position={[0, 0, wallOffset]}
        visible={false}
        userData={{ artworkId: artwork.id }}
      >
        <primitive object={geometries.hitbox} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
}
