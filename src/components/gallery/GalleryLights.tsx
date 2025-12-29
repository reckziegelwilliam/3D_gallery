'use client';

import React from 'react';

/**
 * Gallery Lighting System
 * 
 * Optimized for performance: uses room-level lighting instead of per-artwork spotlights.
 * This reduces the light count from 48+ to ~12 for significant GPU savings.
 */
export function GalleryLights() {
  return (
    <>
      {/* Global ambient lighting - prevents black backgrounds */}
      <ambientLight intensity={0.7} />
      
      {/* Hemisphere light for natural sky/ground lighting */}
      <hemisphereLight
        color="#ffffff"
        groundColor="#d4c4b0"
        intensity={0.9}
        position={[0, 10, 0]}
      />
      
      {/* Directional light for overall brightness and subtle shadows */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.6}
        castShadow={false}
      />

      {/* ========================================
          ROOM 1: Entrance Gallery
          ======================================== */}
      <pointLight 
        position={[0, 5.0, 3]} 
        intensity={1.5} 
        distance={14} 
        decay={1.6} 
      />
      {/* West wall accent */}
      <pointLight 
        position={[-3, 4.0, 3]} 
        intensity={0.8} 
        distance={8} 
        decay={2} 
      />
      {/* East wall accent */}
      <pointLight 
        position={[3, 4.0, 3]} 
        intensity={0.8} 
        distance={8} 
        decay={2} 
      />

      {/* ========================================
          ROOM 2: Abstract Wing
          ======================================== */}
      <pointLight 
        position={[-5, 5.0, -3.5]} 
        intensity={1.5} 
        distance={14} 
        decay={1.6} 
      />
      {/* West wall accent */}
      <pointLight 
        position={[-7, 4.0, -3.5]} 
        intensity={0.8} 
        distance={8} 
        decay={2} 
      />

      {/* ========================================
          ROOM 3: Early Works
          ======================================== */}
      <pointLight 
        position={[5, 5.0, -3.5]} 
        intensity={1.5} 
        distance={14} 
        decay={1.6} 
      />
      {/* East wall accent */}
      <pointLight 
        position={[7, 4.0, -3.5]} 
        intensity={0.8} 
        distance={8} 
        decay={2} 
      />

      {/* ========================================
          ROOM 4: Feature Gallery (Finale)
          ======================================== */}
      {/* Main ceiling light */}
      <pointLight 
        position={[0, 5.0, -10.5]} 
        intensity={1.8} 
        distance={16} 
        decay={1.5} 
      />
      
      {/* Back wall dedicated lights for masterpiece */}
      <pointLight 
        position={[-1.5, 4.0, -13.5]} 
        intensity={1.2} 
        distance={10} 
        decay={1.8} 
      />
      <pointLight 
        position={[1.5, 4.0, -13.5]} 
        intensity={1.2} 
        distance={10} 
        decay={1.8} 
      />

      {/* ========================================
          Archway Transition Lights
          ======================================== */}
      <pointLight 
        position={[0, 4.5, 0.5]} 
        intensity={1.0} 
        distance={10} 
        decay={1.8} 
      />
      <pointLight 
        position={[0, 4.5, -7]} 
        intensity={1.0} 
        distance={10} 
        decay={1.8} 
      />
    </>
  );
}
