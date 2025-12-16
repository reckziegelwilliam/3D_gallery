'use client';

import React from 'react';
import { useGalleryStore } from '@/store/galleryStore';

export function GalleryLights() {
  const { artworks } = useGalleryStore();

  return (
    <>
      {/* General ceiling lights - enhanced for 2x artworks */}
      <pointLight position={[0, 4.0, 0]} intensity={0.8} distance={14} decay={2} />
      <pointLight position={[-4, 4.0, -4]} intensity={0.7} distance={12} decay={2} />
      <pointLight position={[4, 4.0, -4]} intensity={0.7} distance={12} decay={2} />
      <pointLight position={[-4, 4.0, 4]} intensity={0.7} distance={12} decay={2} />
      <pointLight position={[4, 4.0, 4]} intensity={0.7} distance={12} decay={2} />

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

