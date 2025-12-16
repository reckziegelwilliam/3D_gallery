'use client';

import React, { useMemo } from 'react';
import { Text } from '@react-three/drei';
import { Artwork } from '@/types/gallery';
import * as THREE from 'three';

interface ArtworkPlaqueProps {
  artwork: Artwork;
  artworkHeight: number; // Scaled height
}

export function ArtworkPlaque({ artwork, artworkHeight }: ArtworkPlaqueProps) {
  // Position plaque 20cm below artwork
  const plaqueYOffset = -(artworkHeight / 2) - 0.2;
  
  // Memoize plaque background geometry
  const plaqueGeometry = useMemo(
    () => new THREE.PlaneGeometry(0.7, 0.15),
    []
  );
  
  const plaqueMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: '#2C1810',
      roughness: 0.3,
      metalness: 0.1,
    }),
    []
  );

  return (
    <group position={[0, plaqueYOffset, 0.06]}>
      {/* Plaque background */}
      <mesh>
        <primitive object={plaqueGeometry} />
        <primitive object={plaqueMaterial} attach="material" />
      </mesh>
      
      {/* Title */}
      <Text
        position={[0, 0.03, 0.001]}
        fontSize={0.045}
        color="#D4AF37"
        anchorX="center"
        anchorY="middle"
        maxWidth={0.65}
      >
        {artwork.title}
      </Text>
      
      {/* Year */}
      <Text
        position={[0, -0.03, 0.001]}
        fontSize={0.035}
        color="#A0896C"
        anchorX="center"
        anchorY="middle"
      >
        {artwork.year}
      </Text>
    </group>
  );
}

