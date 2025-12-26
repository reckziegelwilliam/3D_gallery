/**
 * Culling Utilities for Performance Optimization
 * 
 * Provides functions to determine which objects should be rendered
 * based on camera frustum and distance.
 */

import * as THREE from 'three';

/**
 * Check if a point is within the camera's view frustum
 */
export function isPointInFrustum(
  point: THREE.Vector3,
  camera: THREE.Camera
): boolean {
  const frustum = new THREE.Frustum();
  const matrix = new THREE.Matrix4().multiplyMatrices(
    camera.projectionMatrix,
    camera.matrixWorldInverse
  );
  frustum.setFromProjectionMatrix(matrix);
  
  return frustum.containsPoint(point);
}

/**
 * Check if an artwork position is visible to the camera
 */
export function isArtworkVisible(
  artworkPosition: [number, number, number],
  camera: THREE.Camera,
  maxDistance: number = 30
): boolean {
  const point = new THREE.Vector3(...artworkPosition);
  const distance = camera.position.distanceTo(point);
  
  // Too far away
  if (distance > maxDistance) {
    return false;
  }
  
  // Check if in frustum
  return isPointInFrustum(point, camera);
}

/**
 * Calculate distance from camera to artwork
 */
export function getArtworkDistance(
  artworkPosition: [number, number, number],
  cameraPosition: THREE.Vector3
): number {
  const point = new THREE.Vector3(...artworkPosition);
  return cameraPosition.distanceTo(point);
}

/**
 * Determine LOD level based on distance
 */
export function getLODLevel(distance: number): 'full' | 'simplified' | 'hidden' {
  if (distance < 15) {
    return 'full';
  } else if (distance < 30) {
    return 'simplified';
  } else {
    return 'hidden';
  }
}

/**
 * Check if text/plaque should be rendered based on distance
 */
export function shouldRenderText(
  artworkPosition: [number, number, number],
  cameraPosition: THREE.Vector3,
  maxDistance: number = 5
): boolean {
  return getArtworkDistance(artworkPosition, cameraPosition) < maxDistance;
}

/**
 * Batch culling check for multiple artworks
 * Returns array of artwork IDs that should be rendered
 */
export function cullArtworks(
  artworks: Array<{ id: string; position: [number, number, number] }>,
  camera: THREE.Camera,
  maxDistance: number = 30
): string[] {
  const visibleIds: string[] = [];
  
  for (const artwork of artworks) {
    if (isArtworkVisible(artwork.position, camera, maxDistance)) {
      visibleIds.push(artwork.id);
    }
  }
  
  return visibleIds;
}

/**
 * Calculate optimal render distance based on gallery size
 */
export function getOptimalRenderDistance(gallerySize: {
  length: number;
  width: number;
}): number {
  const diagonal = Math.sqrt(
    gallerySize.length ** 2 + gallerySize.width ** 2
  );
  
  // Render up to 1.5x the gallery diagonal
  return diagonal * 1.5;
}

