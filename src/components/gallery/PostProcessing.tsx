'use client';

import React from 'react';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useGalleryStore } from '@/store/galleryStore';
import { GALLERY_CONFIG } from '@/data/galleryConfig';

export function PostProcessing() {
  // Use Zustand selector with null safety fallback
  const settings = useGalleryStore((state) => state.settings) ?? GALLERY_CONFIG.defaultSettings;

  // Skip post-processing if motion reduced mode is enabled or quality is low
  if (!settings || settings.motionReduced || settings.quality === 'low') {
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

