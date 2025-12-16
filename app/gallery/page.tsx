'use client';

import dynamic from 'next/dynamic';
import { useGalleryStore } from '@/store/galleryStore';
import { Button } from '@/components/ui/Button';

// Dynamically import 3D components with no SSR
const GalleryCanvas = dynamic(
  () => import('@/components/gallery/GalleryCanvas').then((mod) => mod.GalleryCanvas),
  { ssr: false }
);

const InspectOverlay = dynamic(
  () => import('@/components/gallery/InspectOverlay').then((mod) => mod.InspectOverlay),
  { ssr: false }
);

const TourOverlay = dynamic(
  () => import('@/components/gallery/TourOverlay').then((mod) => mod.TourOverlay),
  { ssr: false }
);

const SettingsPanel = dynamic(
  () => import('@/components/gallery/SettingsPanel').then((mod) => mod.SettingsPanel),
  { ssr: false }
);

export default function GalleryPage() {
  // Use Zustand selectors to prevent unnecessary re-renders
  const startTour = useGalleryStore((state) => state.startTour);
  const tourActive = useGalleryStore((state) => state.tourActive);

  return (
    <main className="relative w-full h-screen bg-black">
      <GalleryCanvas />
      <InspectOverlay />
      <TourOverlay />
      <SettingsPanel />

      {/* Start Tour Button */}
      {!tourActive && (
        <div className="absolute top-4 right-4 z-30">
          <Button onClick={startTour} size="sm">
            Start Guided Tour
          </Button>
        </div>
      )}
    </main>
  );
}

