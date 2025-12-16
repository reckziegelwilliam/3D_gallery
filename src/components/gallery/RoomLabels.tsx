'use client';

import React from 'react';
import { Text } from '@react-three/drei';
import { usePreloadFont } from '@/hooks/usePreloadFont';

export function RoomLabels() {
  // Preload custom font for smoother rendering
  usePreloadFont('/fonts/playfair-display.woff');
  
  return (
    <>
      {/* Entrance/Welcome - above doorway */}
      <Text
        position={[0, 3.8, 6.2]}
        rotation={[0, Math.PI, 0]}
        fontSize={0.4}
        color="#D4AF37"
        anchorX="center"
      >
        Welcome to Leslie's Gallery
      </Text>

      {/* Landscapes Room Label */}
      <Text
        position={[-6, 3.0, -4]}
        rotation={[0, Math.PI / 2, 0]}
        fontSize={0.25}
        color="#8B7355"
        anchorX="center"
      >
        Landscapes
      </Text>

      {/* Abstract Room Label */}
      <Text
        position={[6, 3.0, -4]}
        rotation={[0, -Math.PI / 2, 0]}
        fontSize={0.25}
        color="#8B7355"
        anchorX="center"
      >
        Abstract Collection
      </Text>

      {/* Early Works Label */}
      <Text
        position={[0, 3.0, 4]}
        rotation={[0, Math.PI, 0]}
        fontSize={0.25}
        color="#8B7355"
        anchorX="center"
      >
        Early Works
      </Text>
    </>
  );
}

