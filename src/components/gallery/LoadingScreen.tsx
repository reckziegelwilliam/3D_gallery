'use client';

import React from 'react';

interface LoadingScreenProps {
  progress?: number;
  loadedCount?: number;
  totalCount?: number;
}

export function LoadingScreen({ 
  progress = 0, 
  loadedCount = 0, 
  totalCount = 0 
}: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-gallery-cream via-gallery-warmWhite to-gallery-gold/20">
      <div className="text-center space-y-8 max-w-md px-6">
        <h2 className="text-4xl font-serif font-bold text-gallery-darkWood">
          Loading Gallery
        </h2>

        {/* Progress bar container */}
        <div className="space-y-3">
          <div className="w-64 h-2 bg-gallery-darkWood/20 rounded-full overflow-hidden mx-auto">
            <div 
              className="h-full bg-gradient-to-r from-gallery-gold to-gallery-accent rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Progress text */}
          <div className="flex justify-between items-center text-sm text-gallery-accent px-1">
            <span>{loadedCount} of {totalCount} artworks</span>
            <span className="font-semibold">{progress}%</span>
          </div>
        </div>

        {/* Loading status message */}
        <p className="text-gallery-accent/80 text-sm">
          {progress < 30 && 'Preparing your virtual experience...'}
          {progress >= 30 && progress < 60 && 'Loading artwork textures...'}
          {progress >= 60 && progress < 90 && 'Almost there...'}
          {progress >= 90 && progress < 100 && 'Finishing touches...'}
          {progress >= 100 && 'Welcome to the gallery!'}
        </p>

        {/* Animated dots for visual feedback */}
        <div className="flex justify-center space-x-2">
          <div 
            className="w-2 h-2 bg-gallery-gold rounded-full animate-bounce" 
            style={{ animationDelay: '0ms' }}
          />
          <div 
            className="w-2 h-2 bg-gallery-gold rounded-full animate-bounce" 
            style={{ animationDelay: '150ms' }}
          />
          <div 
            className="w-2 h-2 bg-gallery-gold rounded-full animate-bounce" 
            style={{ animationDelay: '300ms' }}
          />
        </div>
      </div>
    </div>
  );
}
