'use client';

import React from 'react';

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-gallery-cream via-gallery-warmWhite to-gallery-gold/20">
      <div className="text-center space-y-6">
        <h2 className="text-4xl font-serif font-bold text-gallery-darkWood">
          Loading Gallery...
        </h2>

        {/* Animated loader */}
        <div className="flex justify-center space-x-2">
          <div className="w-3 h-3 bg-gallery-gold rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-gallery-gold rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-gallery-gold rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>

        <p className="text-gallery-accent">
          Preparing your virtual experience...
        </p>
      </div>
    </div>
  );
}

