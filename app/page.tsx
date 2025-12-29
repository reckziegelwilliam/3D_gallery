'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { detectWebGLSupport } from '@/utils/webglDetect';

export default function Home() {
  const router = useRouter();
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    setHasWebGL(detectWebGLSupport());
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gallery-cream via-gallery-warmWhite to-gallery-gold/20 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center space-y-8 animate-fade-in">
        {/* Hero Section */}
        <div className="space-y-4">
          <h1 className="text-6xl md:text-7xl font-serif font-bold text-gallery-darkWood mb-4">
            Welcome to
            <br />
            <span className="text-gallery-gold">Leslie's Gallery</span>
          </h1>

          <p className="text-xl md:text-2xl text-gallery-accent max-w-2xl mx-auto leading-relaxed">
            A personal collection celebrating years of artistic passion, creativity, and beauty
          </p>
        </div>

        {/* Personal Message */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-xl p-8 max-w-2xl mx-auto">
          <p className="text-lg text-gallery-darkWood leading-relaxed italic">
            <br />
            <br />
            This gallery is a small way to honor your incredible talent and the countless hours
            you've spent bringing beauty into the world through your art.
            <br />
            <br />
            Walk through these virtual halls and remember the joy each painting brought you. Your
            art has always inspired me, and I hope this gallery helps you see your work the way I
            do - as something truly special.
            <br />
            <br />
            Love,
            <br />
            <span className="not-italic font-medium">Liam</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {hasWebGL ? (
            <Link href="/gallery">
              <Button size="lg" className="w-full sm:w-auto min-w-[200px]">
                Enter 3D Gallery
              </Button>
            </Link>
          ) : (
            <div className="text-center space-y-2">
              <p className="text-sm text-gallery-accent">
                3D gallery not supported on this device
              </p>
            </div>
          )}

          <Link href="/fallback">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto min-w-[200px]"
            >
              Browse Collection
            </Button>
          </Link>
        </div>

        {/* Instructions */}
        {hasWebGL && (
          <div className="bg-gallery-accent/10 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="font-semibold text-gallery-darkWood mb-3">
              Gallery Controls
            </h3>
            <div className="grid sm:grid-cols-2 gap-3 text-sm text-gallery-darkWood">
              <div>
                <span className="font-medium">WASD / Arrow Keys:</span> Move around
              </div>
              <div>
                <span className="font-medium">Mouse:</span> Look around
              </div>
              <div>
                <span className="font-medium">E:</span> Inspect artwork
              </div>
              <div>
                <span className="font-medium">ESC:</span> Exit / Menu
              </div>
            </div>
          </div>
        )}

        {/* Footer Note */}
        <p className="text-sm text-gallery-accent/70 pt-8">
          Merry Christmas 2025 • Made with love for Leslie
        </p>
      </div>
    </main>
  );
}

