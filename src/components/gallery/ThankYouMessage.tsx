'use client';

import React from 'react';
import { Text } from '@react-three/drei';
import { usePreloadFont } from '@/hooks/usePreloadFont';
import * as THREE from 'three';

export function ThankYouMessage() {
  // Preload custom font for smoother rendering
  usePreloadFont('/fonts/playfair-display.woff');
  
  const ceilingHeight = 6.0;
  
  return (
    // Position on ceiling, rotated to face down
    <group position={[0, ceilingHeight - 0.1, -11.5]} rotation={[-Math.PI, 0, 0]}>
      {/* Decorative frame background */}
      <mesh position={[0, 0, -0.06]} renderOrder={1}>
        <planeGeometry args={[5, 4]} />
        <meshStandardMaterial 
          color="#F5F3F0"
          roughness={0.8}
          side={THREE.DoubleSide}
          depthWrite={true}
        />
      </mesh>
      
      {/* Inner border accent */}
      <mesh position={[0, 0, -0.04]} renderOrder={2}>
        <planeGeometry args={[4.8, 3.8]} />
        <meshStandardMaterial 
          color="#2A2520"
          roughness={0.9}
          side={THREE.DoubleSide}
          depthWrite={true}
        />
      </mesh>
      
      {/* Gold accent border */}
      <mesh position={[0, 0, -0.02]} renderOrder={3}>
        <planeGeometry args={[4.6, 3.6]} />
        <meshStandardMaterial 
          color="#1A1614"
          roughness={0.9}
          side={THREE.DoubleSide}
          depthWrite={true}
        />
      </mesh>

      {/* Main message */}
      <Text
        position={[0, 1.2, 0.01]}
        rotation={[0, 0, 0]}
        fontSize={0.5}
        color="#D4AF37"
        anchorX="center"
        maxWidth={4.5}
        textAlign="center"
        letterSpacing={0.03}
        outlineWidth={0.008}
        outlineColor="#8B7355"
        renderOrder={5}
        depthOffset={-1}
      >
        Thank You, Mom
      </Text>
      
      {/* Decorative line */}
      <mesh position={[0, 0.8, 0.01]} renderOrder={4}>
        <planeGeometry args={[2, 0.01]} />
        <meshStandardMaterial 
          color="#D4AF37"
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Personal note */}
      <Text
        position={[0, -0.2, 0.01]}
        rotation={[0, 0, 0]}
        fontSize={0.15}
        color="#F5F3F0"
        anchorX="center"
        maxWidth={4}
        textAlign="center"
        lineHeight={1.7}
        outlineWidth={0.002}
        outlineColor="#000000"
        renderOrder={5}
        depthOffset={-1}
      >
        {`For inspiring me with your creativity,\nfor filling our home with beauty,\nand for showing me that art is love made visible.\n\nThis gallery is my gift to you,\nbut your art has been a gift to all of us.\n\nMerry Christmas 2024\nWith all my love,\nLiam`}
      </Text>
    </group>
  );
}

