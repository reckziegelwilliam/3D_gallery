'use client';

import React from 'react';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useGalleryStore } from '@/store/galleryStore';

export function PostProcessing() {
  // Use Zustand selector to prevent unnecessary re-renders
  const settings = useGalleryStore((state) => state.settings);

  // Skip post-processing if motion reduced mode is enabled or quality is low
  if (settings.motionReduced || settings.quality === 'low') {
    return null;
  }

  return (
    <EffectComposer>
      <Bloom
        intensity={0.3}
        luminanceThreshold={0.9}
        luminanceSmoothing={0.9}
      />
      <Vignette offset={0.3} darkness={0.5} />
    </EffectComposer>
  );
}

