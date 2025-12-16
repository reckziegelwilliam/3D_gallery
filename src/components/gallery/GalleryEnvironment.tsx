'use client';

import React from 'react';

export function GalleryEnvironment() {
  return (
    <>
      {/* Brighter lighting for better visibility */}
      <ambientLight intensity={1.0} />
      <hemisphereLight args={['#ffffff', '#8B7355', 0.8]} />
      
      {/* Add directional light for depth and definition */}
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={0.5}
      />
    </>
  );
}

