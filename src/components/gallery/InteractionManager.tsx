'use client';

import React, { useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useGalleryStore } from '@/store/galleryStore';
import { GALLERY_CONFIG } from '@/data/galleryConfig';
import * as THREE from 'three';

export function InteractionManager() {
  const { camera, scene } = useThree();
  
  // Use Zustand selectors to prevent unnecessary re-renders
  const enterInspectMode = useGalleryStore((state) => state.enterInspectMode);
  const isInspecting = useGalleryStore((state) => state.isInspecting);
  const tourActive = useGalleryStore((state) => state.tourActive);
  const artworks = useGalleryStore((state) => state.artworks);
  
  const [nearbyArtwork, setNearbyArtwork] = useState<string | null>(null);
  
  // Find artwork data for proximity display
  const artworkData = artworks.find((a) => a.id === nearbyArtwork);

  useEffect(() => {
    const raycaster = new THREE.Raycaster();
    const direction = new THREE.Vector3();
    let lastCheckTime = 0;

    const checkArtwork = () => {
      // Rate limiting with timestamp check
      const now = Date.now();
      if (now - lastCheckTime < 150) return;
      lastCheckTime = now;

      if (isInspecting || tourActive || !scene) {
        setNearbyArtwork(null);
        return;
      }

      try {
        camera.getWorldDirection(direction);
        raycaster.set(camera.position, direction);

        const intersects = raycaster.intersectObjects(scene.children, true);

        // Find artwork hitbox
        for (const intersect of intersects) {
          if (
            intersect.distance <= GALLERY_CONFIG.interaction.raycastDistance &&
            intersect.object.userData.artworkId
          ) {
            setNearbyArtwork(intersect.object.userData.artworkId);
            return;
          }
        }

        setNearbyArtwork(null);
      } catch (error) {
        console.error('Error in checkArtwork:', error);
      }
    };

    // Check every 200ms (reduced from 100ms for better performance)
    const interval = setInterval(checkArtwork, 200);

    // Handle E key press
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'KeyE' && nearbyArtwork && !isInspecting && !tourActive) {
        enterInspectMode(nearbyArtwork);
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [camera, scene, nearbyArtwork, isInspecting, tourActive, enterInspectMode]);

  // Always return a valid Three.js element (empty group if nothing to show)
  return (
    <>
      {nearbyArtwork && !isInspecting && !tourActive && artworkData && (
        <Html fullscreen zIndexRange={[100, 0]}>
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black/85 text-white px-8 py-4 rounded-lg pointer-events-none backdrop-blur-md shadow-2xl border border-gallery-gold/30 max-w-md">
            <p className="text-xs text-gallery-gold uppercase tracking-wider mb-1 font-medium">
              {artworkData.title}
            </p>
            <p className="text-sm opacity-80 mb-2">
              {artworkData.year} • {artworkData.medium}
            </p>
            <p className="text-sm font-medium text-gallery-gold">
              Press E to learn more
            </p>
          </div>
        </Html>
      )}
    </>
  );
}

