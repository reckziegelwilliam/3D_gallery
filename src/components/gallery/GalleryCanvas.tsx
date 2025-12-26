'use client';

import React, { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { PhysicsWorld } from './PhysicsWorld';
import { ProceduralGallery } from './ProceduralGallery';
import { PlayerController } from './PlayerController';
import { GalleryEnvironment } from './GalleryEnvironment';
import { GalleryLights } from './GalleryLights';
import { ArtworkGrid } from './ArtworkGrid';
import { PostProcessing } from './PostProcessing';
import { TourController } from './TourController';
import { RoomLabels } from './RoomLabels';
import { ThankYouMessage } from './ThankYouMessage';
import { InteractionManager } from './InteractionManager';
import { GALLERY_CONFIG } from '@/data/galleryConfig';
import { runArtworkValidation } from '@/utils/validateArtworkPositions';

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  );
}

export function GalleryCanvas() {
  // Run artwork position validation in development mode
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      runArtworkValidation();
    }
  }, []);

  return (
    <div className="w-full h-screen">
      <Canvas
        shadows={false}
        gl={{ 
          alpha: false,
          antialias: true,
        }}
        onCreated={({ gl, scene, camera }) => {
          console.log('✓ Canvas created');
          console.log('Scene children count:', scene.children.length);
          console.log('Camera position:', camera.position);
          gl.setClearColor('#1a1a1a', 1);
        }}
        camera={{
          fov: GALLERY_CONFIG.camera.fov,
          near: GALLERY_CONFIG.camera.near,
          far: GALLERY_CONFIG.camera.far,
          position: [0, GALLERY_CONFIG.player.eyeHeight, 5],
        }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <GalleryEnvironment />
          <GalleryLights />

          <PhysicsWorld>
            <ProceduralGallery />
            <PlayerController />
            <ArtworkGrid />
          </PhysicsWorld>
          
          <RoomLabels />
          <ThankYouMessage />
          <TourController />
          <InteractionManager />
          <PostProcessing />
        </Suspense>
      </Canvas>

      {/* UI Overlay hint */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-lg pointer-events-none">
        <p className="text-sm">Click to enter • WASD to move • Mouse to look around</p>
      </div>
    </div>
  );
}

