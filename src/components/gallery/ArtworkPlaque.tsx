'use client';

import React, { useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Artwork } from '@/types/gallery';
import * as THREE from 'three';

interface ArtworkPlaqueProps {
  artwork: Artwork;
  artworkHeight: number; // Scaled height
}

export function ArtworkPlaque({ artwork, artworkHeight }: ArtworkPlaqueProps) {
  const { camera } = useThree();
  const [isNearby, setIsNearby] = useState(false);
  
  // Position plaque 20cm below artwork
  const plaqueYOffset = -(artworkHeight / 2) - 0.2;
  
  // Check distance to camera each frame
  useFrame(() => {
    const artworkPos = new THREE.Vector3(...artwork.position);
    const distance = camera.position.distanceTo(artworkPos);
    
    // Only render text when within 5 meters
    const shouldShow = distance < 5;
    if (shouldShow !== isNearby) {
      setIsNearby(shouldShow);
    }
  });
  
  // Don't render plaque at all if too far
  if (!isNearby) {
    return null;
  }

  return (
    <group position={[0, plaqueYOffset, 0.06]}>
      {/* Plaque background - inline geometry/material */}
      <mesh>
        <planeGeometry args={[0.7, 0.15]} />
        <meshStandardMaterial color="#2C1810" roughness={0.3} metalness={0.1} />
      </mesh>
      
      {/* Year */}
      <Text
        position={[0, 0, 0.001]}
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
