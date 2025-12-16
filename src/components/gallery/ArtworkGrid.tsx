'use client';

import React from 'react';
import { useGalleryStore } from '@/store/galleryStore';
import { ArtworkFrame } from './ArtworkFrame';

export function ArtworkGrid() {
  const { artworks } = useGalleryStore();

  return (
    <>
      {artworks.map((artwork) => (
        <ArtworkFrame key={artwork.id} artwork={artwork} />
      ))}
    </>
  );
}

