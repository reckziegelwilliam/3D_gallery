'use client';

import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGalleryStore } from '@/store/galleryStore';
import { galleryTour } from '@/data/galleryTour';
import { lerpVector3 } from '@/utils/calculations';
import * as THREE from 'three';

export function TourController() {
  const { camera } = useThree();
  
  // Use Zustand selectors to prevent unnecessary re-renders
  const tourActive = useGalleryStore((state) => state.tourActive);
  const currentWaypointIndex = useGalleryStore((state) => state.currentWaypointIndex);
  const advanceTour = useGalleryStore((state) => state.advanceTour);
  const stopTour = useGalleryStore((state) => state.stopTour);

  const dwellTimer = useRef(0);
  const isMoving = useRef(false);
  const targetPosition = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());
  
  // Reusable vectors to avoid allocations in useFrame
  const currentPos = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());

  useEffect(() => {
    if (!tourActive) {
      dwellTimer.current = 0;
      isMoving.current = false;
      return;
    }

    // Set target for current waypoint
    if (currentWaypointIndex < galleryTour.length) {
      const waypoint = galleryTour[currentWaypointIndex];
      targetPosition.current.set(...waypoint.position);
      targetLookAt.current.set(...waypoint.lookAt);
      isMoving.current = true;
      dwellTimer.current = 0;
    } else {
      // Tour complete
      stopTour();
    }
  }, [tourActive, currentWaypointIndex, stopTour]);

  useFrame((state, delta) => {
    if (!tourActive || currentWaypointIndex >= galleryTour.length) return;

    const waypoint = galleryTour[currentWaypointIndex];

    if (isMoving.current) {
      // Smoothly move camera to target position using reusable vector
      currentPos.current.copy(camera.position);
      const newPos = lerpVector3(
        currentPos.current,
        targetPosition.current,
        delta * 1.5
      );
      camera.position.copy(newPos);

      // Smoothly rotate camera to look at target using reusable vector
      direction.current.subVectors(targetLookAt.current, camera.position).normalize();

      // Calculate target rotation
      const targetYaw = Math.atan2(direction.current.x, direction.current.z);
      const targetPitch = Math.asin(-direction.current.y);

      // Apply rotation
      camera.rotation.order = 'YXZ';
      camera.rotation.y = targetYaw;
      camera.rotation.x = targetPitch;

      // Check if we've arrived at position
      const distanceToTarget = camera.position.distanceTo(
        targetPosition.current
      );
      if (distanceToTarget < 0.1) {
        isMoving.current = false;
        dwellTimer.current = 0;
      }
    } else {
      // Dwelling at waypoint
      dwellTimer.current += delta;

      if (dwellTimer.current >= waypoint.dwellSeconds) {
        advanceTour();
      }
    }
  });

  return null;
}

