'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useGalleryStore } from '@/store/galleryStore';
import { Card } from '@/components/ui/Card';
import { Artwork } from '@/types/gallery';

export default function FallbackPage() {
  const { artworks } = useGalleryStore();
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

  return (
    <main className="min-h-screen bg-gallery-warmWhite">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-serif font-bold text-gallery-darkWood">
              Leslie's Gallery
            </h1>
            <Link
              href="/"
              className="text-gallery-gold hover:text-gallery-accent transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {artworks.map((artwork) => (
            <Card
              key={artwork.id}
              artwork={artwork}
              onClick={() => setSelectedArtwork(artwork)}
            />
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedArtwork && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setSelectedArtwork(null)}
        >
          <div
            className="relative max-w-6xl w-full bg-gallery-cream rounded-lg shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              title="Close"
              onClick={() => setSelectedArtwork(null)}
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

            <div className="grid md:grid-cols-2 gap-8 p-8">
              {/* Artwork image */}
              <div className="flex items-center justify-center bg-white rounded-lg p-4 shadow-inner">
                <div
                  className="relative w-full"
                  style={{
                    aspectRatio: `${selectedArtwork.realSizeMeters.width}/${selectedArtwork.realSizeMeters.height}`,
                  }}
                >
                  <Image
                    src={selectedArtwork.imagePath}
                    alt={selectedArtwork.title || selectedArtwork.id}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              {/* Artwork details */}
              <div className="flex flex-col justify-center space-y-6 max-h-[70vh] overflow-y-auto">
                <div>
                  <h2 className="text-4xl font-serif font-bold text-gallery-darkWood mb-2">
                    {selectedArtwork.title || selectedArtwork.id}
                  </h2>
                  <p className="text-xl text-gallery-accent">
                    {selectedArtwork.year} • {selectedArtwork.medium}
                  </p>
                </div>

                <div className="space-y-4">
                  <p className="text-lg text-gallery-darkWood leading-relaxed">
                    {selectedArtwork.description}
                  </p>

                  {selectedArtwork.personalNote && (
                    <div className="bg-gallery-gold/10 border-l-4 border-gallery-gold p-4 rounded">
                      <p className="text-gallery-darkWood italic leading-relaxed">
                        {selectedArtwork.personalNote}
                      </p>
                    </div>
                  )}
                </div>

                {selectedArtwork.room && (
                  <div className="pt-4 border-t border-gallery-accent/20">
                    <p className="text-sm uppercase tracking-wide text-gallery-accent">
                      Collection: {selectedArtwork.room}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

