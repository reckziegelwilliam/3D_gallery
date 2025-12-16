'use client';

import React from 'react';
import { useGalleryStore } from '@/store/galleryStore';
import { galleryTour } from '@/data/galleryTour';

export function TourOverlay() {
  // Use Zustand selectors to prevent unnecessary re-renders
  const tourActive = useGalleryStore((state) => state.tourActive);
  const currentWaypointIndex = useGalleryStore((state) => state.currentWaypointIndex);
  const stopTour = useGalleryStore((state) => state.stopTour);
  const advanceTour = useGalleryStore((state) => state.advanceTour);

  if (!tourActive || currentWaypointIndex >= galleryTour.length) {
    return null;
  }

  const waypoint = galleryTour[currentWaypointIndex];

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {/* Narration at bottom */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 max-w-2xl w-full px-4">
        <div className="bg-black/80 backdrop-blur-md text-white p-6 rounded-lg shadow-2xl pointer-events-auto">
          <p className="text-lg leading-relaxed mb-4">{waypoint.narration}</p>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">
              Stop {currentWaypointIndex + 1} of {galleryTour.length}
            </span>

            <div className="flex gap-2">
              <button
                onClick={advanceTour}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded transition-colors text-sm"
              >
                Next
              </button>
              <button
                onClick={stopTour}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded transition-colors text-sm"
              >
                Exit Tour
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress indicator at top */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
        <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full">
          <div className="flex gap-2">
            {galleryTour.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentWaypointIndex
                    ? 'bg-gallery-gold'
                    : index < currentWaypointIndex
                    ? 'bg-white/60'
                    : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

