'use client';

import React from 'react';
import { Text } from '@react-three/drei';
import { usePreloadFont } from '@/hooks/usePreloadFont';
import * as THREE from 'three';

export function RoomLabels() {
  // Preload custom font for smoother rendering
  usePreloadFont('/fonts/playfair-display.woff');
  
  return (
    <>
      {/* Welcome - enhanced with background and subtitle */}
      <group position={[0, 4.2, 5.4]} rotation={[0, Math.PI, 0]}>
        {/* Background panel */}
        <mesh position={[0, 0, -0.02]} renderOrder={0}>
          <planeGeometry args={[6, 2]} />
          <meshStandardMaterial 
            color="#1A1614"
            opacity={0.85}
            transparent
            roughness={0.9}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
        
        {/* Main title */}
        <Text
          position={[0, 0.3, 0.01]}
          fontSize={0.65}
          color="#D4AF37"
          anchorX="center"
          letterSpacing={0.05}
          outlineWidth={0.01}
          outlineColor="#000000"
          renderOrder={2}
          depthOffset={-1}
        >
          Leslie's Gallery
        </Text>
        
        {/* Subtitle */}
        <Text
          position={[0, -0.25, 0.01]}
          fontSize={0.18}
          color="#C9B8A8"
          anchorX="center"
          letterSpacing={0.08}
          renderOrder={2}
          depthOffset={-1}
        >
          A CELEBRATION OF ARTISTRY
        </Text>
      </group>

      {/* Room 1 label - with subtitle */}
      <group position={[0, 3.8, 0.35]} rotation={[0, Math.PI, 0]}>
        {/* Background panel */}
        <mesh position={[0, 0, -0.02]} renderOrder={0}>
          <planeGeometry args={[4, 1]} />
          <meshStandardMaterial 
            color="#2A2520"
            opacity={0.8}
            transparent
            roughness={0.9}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
        
        <Text
          position={[0, 0.2, 0.01]}
          fontSize={0.35}
          color="#D4AF37"
          anchorX="center"
          outlineWidth={0.005}
          outlineColor="#000000"
          renderOrder={2}
          depthOffset={-1}
        >
          Gallery I
        </Text>
        <Text
          position={[0, -0.15, 0.01]}
          fontSize={0.15}
          color="#C9B8A8"
          anchorX="center"
          renderOrder={2}
          depthOffset={-1}
        >
          Landscapes & Natural Beauty
        </Text>
      </group>

      {/* Archway to Rooms 2 & 3 */}
      <Text
        position={[0, 4.2, 0.5]}
        rotation={[0, Math.PI, 0]}
        fontSize={0.18}
        color="#A0896C"
        anchorX="center"
        outlineWidth={0.003}
        outlineColor="#000000"
        renderOrder={2}
        depthOffset={-1}
      >
        Continue to Abstract & Early Works →
      </Text>

      {/* Room 2 label - with subtitle */}
      <group position={[-7.4, 3.5, -3.5]} rotation={[0, Math.PI / 2, 0]}>
        {/* Background panel */}
        <mesh position={[0, 0, -0.02]} renderOrder={0}>
          <planeGeometry args={[4.5, 1.2]} />
          <meshStandardMaterial 
            color="#2A2520"
            opacity={0.8}
            transparent
            roughness={0.9}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
        
        <Text
          position={[0, 0.25, 0.01]}
          fontSize={0.38}
          color="#D4AF37"
          anchorX="center"
          outlineWidth={0.005}
          outlineColor="#000000"
          renderOrder={2}
          depthOffset={-1}
        >
          Gallery II
        </Text>
        <Text
          position={[0, -0.18, 0.01]}
          fontSize={0.16}
          color="#C9B8A8"
          anchorX="center"
          renderOrder={2}
          depthOffset={-1}
        >
          Abstract Collection
        </Text>
      </group>

      {/* Room 3 label - with subtitle */}
      <group position={[7.4, 3.5, -3.5]} rotation={[0, -Math.PI / 2, 0]}>
        {/* Background panel */}
        <mesh position={[0, 0, -0.02]} renderOrder={0}>
          <planeGeometry args={[4.5, 1.2]} />
          <meshStandardMaterial 
            color="#2A2520"
            opacity={0.8}
            transparent
            roughness={0.9}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
        
        <Text
          position={[0, 0.25, 0.01]}
          fontSize={0.38}
          color="#D4AF37"
          anchorX="center"
          outlineWidth={0.005}
          outlineColor="#000000"
          renderOrder={2}
          depthOffset={-1}
        >
          Gallery III
        </Text>
        <Text
          position={[0, -0.18, 0.01]}
          fontSize={0.16}
          color="#C9B8A8"
          anchorX="center"
          renderOrder={2}
          depthOffset={-1}
        >
          Early Works
        </Text>
      </group>

      {/* Archway to Room 4 */}
      <Text
        position={[0, 4.2, -7.5]}
        rotation={[0, Math.PI, 0]}
        fontSize={0.18}
        color="#A0896C"
        anchorX="center"
        outlineWidth={0.003}
        outlineColor="#000000"
        renderOrder={2}
        depthOffset={-1}
      >
        Featured Collection →
      </Text>

      {/* Room 4 label - with subtitle */}
      <group position={[0, 4.2, -8.5]} rotation={[0, Math.PI, 0]}>
        {/* Background panel */}
        <mesh position={[0, 0, -0.02]} renderOrder={0}>
          <planeGeometry args={[5, 1.4]} />
          <meshStandardMaterial 
            color="#2A2520"
            opacity={0.8}
            transparent
            roughness={0.9}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
        
        <Text
          position={[0, 0.3, 0.01]}
          fontSize={0.42}
          color="#D4AF37"
          anchorX="center"
          outlineWidth={0.006}
          outlineColor="#000000"
          renderOrder={2}
          depthOffset={-1}
        >
          Gallery IV
        </Text>
        <Text
          position={[0, -0.2, 0.01]}
          fontSize={0.18}
          color="#C9B8A8"
          anchorX="center"
          renderOrder={2}
          depthOffset={-1}
        >
          Featured Works
        </Text>
      </group>
    </>
  );
}
