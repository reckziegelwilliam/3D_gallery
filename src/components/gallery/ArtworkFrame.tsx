'use client';

import React, { useMemo } from 'react';
import { Artwork } from '@/types/gallery';
import * as THREE from 'three';
import { GALLERY_CONFIG } from '@/data/galleryConfig';
import { ArtworkPlaque } from './ArtworkPlaque';

interface ArtworkFrameProps {
  artwork: Artwork;
}

export function ArtworkFrame({ artwork }: ArtworkFrameProps) {
  const { position, rotation, realSizeMeters } = artwork;

  // Apply size multiplier from config for larger artworks
  const sizeMultiplier = GALLERY_CONFIG.artwork.sizeMultiplier || 1;
  const scaledWidth = realSizeMeters.width * sizeMultiplier;
  const scaledHeight = realSizeMeters.height * sizeMultiplier;

  // Frame dimensions
  const frameThickness = GALLERY_CONFIG.artwork.frameThickness;
  const frameBorder = GALLERY_CONFIG.artwork.frameBorderWidth;
  const frameWidth = scaledWidth + frameBorder * 2;
  const frameHeight = scaledHeight + frameBorder * 2;

  // Memoize geometries to prevent recreation on re-renders
  const geometries = useMemo(
    () => ({
      frame: new THREE.BoxGeometry(frameWidth, frameHeight, frameThickness),
      canvas: new THREE.PlaneGeometry(scaledWidth, scaledHeight),
      hitbox: new THREE.PlaneGeometry(frameWidth + 0.1, frameHeight + 0.1),
    }),
    [frameWidth, frameHeight, frameThickness, scaledWidth, scaledHeight]
  );

  // Materials
  const frameMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#3E2723',
        roughness: 0.6,
        metalness: 0.1,
      }),
    []
  );

  // Temporary: Use placeholder colors instead of textures (SVGs can't be loaded as textures)
  const canvasMaterial = useMemo(() => {
    const colors = ['#E8D4C0', '#C9B8A8', '#D4C4B0', '#B8A898', '#E0D0C0', '#D8C8B8', '#C8B8A8', '#E0CDB0'];
    
    // Create a simple hash from the artwork ID string
    let hash = 0;
    for (let i = 0; i < artwork.id.length; i++) {
      hash = artwork.id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colorIndex = Math.abs(hash) % colors.length;
    
    return new THREE.MeshStandardMaterial({
      color: colors[colorIndex],
      roughness: 0.7,
    });
  }, [artwork.id]);

  return (
    <group position={position} rotation={rotation}>
      {/* Outer frame */}
      <mesh position={[0, 0, -frameThickness / 2]} castShadow={false}>
        <primitive object={geometries.frame} />
        <primitive object={frameMaterial} attach="material" />
      </mesh>

      {/* Canvas/Artwork plane */}
      <mesh position={[0, 0, 0.001]} receiveShadow={false}>
        <primitive object={geometries.canvas} />
        <primitive object={canvasMaterial} attach="material" />
      </mesh>

      {/* Museum-style plaque with title and year */}
      <ArtworkPlaque artwork={artwork} artworkHeight={scaledHeight} />

      {/* Invisible hitbox for raycasting */}
      <mesh
        position={[0, 0, 0]}
        visible={false}
        userData={{ artworkId: artwork.id }}
      >
        <primitive object={geometries.hitbox} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
}

