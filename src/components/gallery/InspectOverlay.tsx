'use client';

import React, { useEffect } from 'react';
import { useGalleryStore } from '@/store/galleryStore';
import Image from 'next/image';

export function InspectOverlay() {
  // Use Zustand selectors to prevent unnecessary re-renders
  const isInspecting = useGalleryStore((state) => state.isInspecting);
  const activeArtworkId = useGalleryStore((state) => state.activeArtworkId);
  const artworks = useGalleryStore((state) => state.artworks);
  const exitInspectMode = useGalleryStore((state) => state.exitInspectMode);
  const nextArtwork = useGalleryStore((state) => state.nextArtwork);
  const prevArtwork = useGalleryStore((state) => state.prevArtwork);

  const artwork = artworks.find((a) => a.id === activeArtworkId);

  useEffect(() => {
    if (!isInspecting) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        exitInspectMode();
        if (document.pointerLockElement) {
          document.exitPointerLock();
        }
      } else if (e.code === 'ArrowRight') {
        nextArtwork();
      } else if (e.code === 'ArrowLeft') {
        prevArtwork();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isInspecting, exitInspectMode, nextArtwork, prevArtwork]);

  if (!isInspecting || !artwork) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          exitInspectMode();
        }
      }}
    >
      <div className="relative max-w-6xl w-full mx-4 bg-gallery-cream rounded-lg shadow-2xl overflow-hidden">
        {/* Close button */}
        <button
          title="Close"
          onClick={exitInspectMode}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        {/* Previous button */}
        <button
          title="Previous"
          onClick={prevArtwork}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>

        {/* Next button */}
        <button
          title="Next"
          onClick={nextArtwork}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M9 5l7 7-7 7"></path>
          </svg>
        </button>

        <div className="grid md:grid-cols-2 gap-8 p-8">
          {/* Artwork image */}
          <div className="flex items-center justify-center bg-white rounded-lg p-4 shadow-inner">
            <div className="relative w-full" style={{ aspectRatio: `${artwork.realSizeMeters.width}/${artwork.realSizeMeters.height}` }}>
              <Image
                src={artwork.imagePath}
                alt="Artwork"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Artwork details */}
          <div className="flex flex-col justify-center space-y-6 max-h-[70vh] overflow-y-auto">
            <div>
              <p className="text-xl text-gallery-accent">
                {artwork.year} • {artwork.medium}
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-lg text-gallery-darkWood leading-relaxed">
                {artwork.description}
              </p>

            </div>

            {artwork.room && (
              <div className="pt-4 border-t border-gallery-accent/20">
                <p className="text-sm uppercase tracking-wide text-gallery-accent">
                  Collection: {artwork.room}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Keyboard hints */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4 text-sm text-gray-600">
          <span>← Previous</span>
          <span>ESC to close</span>
          <span>Next →</span>
        </div>
      </div>
    </div>
  );
}

