'use client';

import React from 'react';
import { useGalleryStore } from '@/store/galleryStore';

export function GalleryLights() {
  const { artworks } = useGalleryStore();

  return (
    <>
      {/* Global ambient lighting - prevents black backgrounds */}
      <ambientLight intensity={0.6} />
      
      {/* Hemisphere light for natural sky/ground lighting */}
      <hemisphereLight
        color="#ffffff"
        groundColor="#d4c4b0"
        intensity={0.8}
        position={[0, 10, 0]}
      />
      
      {/* Directional light for overall brightness */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.5}
        castShadow={false}
      />

      {/* Room 1: Entrance Gallery */}
      <pointLight position={[0, 5.0, 3]} intensity={1.2} distance={12} decay={1.8} />

      {/* Room 2: Abstract Wing */}
      <pointLight position={[-5, 5.0, -3.5]} intensity={1.2} distance={12} decay={1.8} />

      {/* Room 3: Early Works */}
      <pointLight position={[5, 5.0, -3.5]} intensity={1.2} distance={12} decay={1.8} />

      {/* Room 4: Feature Gallery - enhanced lighting */}
      <pointLight position={[0, 5.0, -10.5]} intensity={1.4} distance={14} decay={1.8} />
      
      {/* Room 4: Back wall dedicated lights */}
      <pointLight position={[-1.5, 4.0, -13.5]} intensity={1.0} distance={8} decay={2} />
      <pointLight position={[1.5, 4.0, -13.5]} intensity={1.0} distance={8} decay={2} />

      {/* Archway transition lights */}
      <pointLight position={[0, 4.5, 0.5]} intensity={0.9} distance={8} decay={2} />
      <pointLight position={[0, 4.5, -7]} intensity={0.9} distance={8} decay={2} />

      {/* Spotlights for each artwork */}
      {artworks.map((artwork) => {
        // Calculate light position above artwork
        const lightPos: [number, number, number] = [
          artwork.position[0],
          artwork.position[1] + 0.8,
          artwork.position[2],
        ];

        // Adjust light position based on wall normal
        const normalOffset = 0.5;
        if (Math.abs(artwork.rotation[1]) < 0.1) {
          // North wall - offset toward viewer
          lightPos[2] += normalOffset;
        } else if (Math.abs(artwork.rotation[1] - Math.PI) < 0.1) {
          // South wall - offset toward viewer
          lightPos[2] -= normalOffset;
        } else if (artwork.rotation[1] > 0) {
          // West wall - offset toward viewer
          lightPos[0] += normalOffset;
        } else {
          // East wall - offset toward viewer
          lightPos[0] -= normalOffset;
        }

        return (
          <spotLight
            key={artwork.id}
            position={lightPos}
            target-position={artwork.position}
            angle={Math.PI / 4}
            penumbra={0.6}
            intensity={1.6}
            distance={9}
            castShadow={false}
          />
        );
      })}
    </>
  );
}

