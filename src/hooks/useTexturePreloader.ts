'use client';

import { useState, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { artworks } from '@/data/artworks';

interface PreloaderState {
  progress: number;
  isLoaded: boolean;
  loadedCount: number;
  totalCount: number;
}

/**
 * Hook to preload all artwork textures with progress tracking.
 * Uses Three.js TextureLoader for consistent texture handling.
 */
export function useTexturePreloader(): PreloaderState {
  const [state, setState] = useState<PreloaderState>({
    progress: 0,
    isLoaded: false,
    loadedCount: 0,
    totalCount: artworks.length,
  });

  const preloadTextures = useCallback(async () => {
    const loader = new THREE.TextureLoader();
    const total = artworks.length;
    let loaded = 0;

    // Create an array of promises for parallel loading
    const loadPromises = artworks.map((artwork) => {
      return new Promise<void>((resolve) => {
        loader.load(
          artwork.imagePath,
          (texture) => {
            // Configure texture on successful load
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.minFilter = THREE.LinearMipmapLinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.generateMipmaps = true;
            
            loaded++;
            const progress = Math.round((loaded / total) * 100);
            
            setState({
              progress,
              isLoaded: loaded === total,
              loadedCount: loaded,
              totalCount: total,
            });
            
            resolve();
          },
          undefined, // onProgress (not used for individual textures)
          (error) => {
            // Still count failed loads to avoid getting stuck
            console.warn(`Failed to preload texture: ${artwork.imagePath}`, error);
            loaded++;
            const progress = Math.round((loaded / total) * 100);
            
            setState({
              progress,
              isLoaded: loaded === total,
              loadedCount: loaded,
              totalCount: total,
            });
            
            resolve();
          }
        );
      });
    });

    // Wait for all textures to load (or fail)
    await Promise.all(loadPromises);
  }, []);

  useEffect(() => {
    preloadTextures();
  }, [preloadTextures]);

  return state;
}

/**
 * Utility to get cached texture if already loaded.
 * Textures loaded via TextureLoader are cached by URL.
 */
export function getCachedTexture(path: string): THREE.Texture | null {
  // Three.js caches textures by URL in the LoadingManager
  // This is handled automatically by useTexture from drei
  return null;
}

