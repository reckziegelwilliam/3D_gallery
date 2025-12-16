'use client';

import React from 'react';
import { Text } from '@react-three/drei';
import { usePreloadFont } from '@/hooks/usePreloadFont';

export function ThankYouMessage() {
  // Preload custom font for smoother rendering
  usePreloadFont('/fonts/playfair-display.woff');
  
  return (
    <group position={[-4.5, 2.0, -8.4]}>
      {/* Main message */}
      <Text
        position={[0, 0.5, 0]}
        rotation={[0, 0, 0]}
        fontSize={0.4}
        color="#D4AF37"
        anchorX="center"
        maxWidth={4}
        textAlign="center"
      >
        Thank You, Mom
      </Text>

      {/* Personal note */}
      <Text
        position={[0, -0.4, 0]}
        rotation={[0, 0, 0]}
        fontSize={0.12}
        color="#3E2723"
        anchorX="center"
        maxWidth={3.5}
        textAlign="center"
        lineHeight={1.5}
      >
        {`For inspiring me with your creativity,\nfor filling our home with beauty,\nand for showing me that art is love made visible.\n\nThis gallery is my gift to you,\nbut your art has been a gift to all of us.\n\nMerry Christmas 2024\nWith all my love,\nLiam`}
      </Text>
    </group>
  );
}

