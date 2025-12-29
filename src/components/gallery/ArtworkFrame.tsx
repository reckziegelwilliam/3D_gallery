'use client';

import React, { useRef, useState, Suspense } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { Artwork } from '@/types/gallery';
import * as THREE from 'three';
import { GALLERY_CONFIG } from '@/data/galleryConfig';

interface ArtworkFrameProps {
  artwork: Artwork;
}

// ========================================
// TEXTURED CANVAS COMPONENT (Best Practices)
// ========================================
// Uses useTexture from drei with Suspense and ErrorBoundary

interface TexturedCanvasProps {
  imagePath: string;
  width: number;
  height: number;
  wallOffset: number;
}

// Fallback shown while loading or on error
function CanvasFallback({ width, height, wallOffset }: Omit<TexturedCanvasProps, 'imagePath'>) {
  return (
    <mesh position={[0, 0, wallOffset + 0.001]} receiveShadow={false}>
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial color="#E8D4C0" roughness={0.7} side={THREE.DoubleSide} />
    </mesh>
  );
}

// Inner component that uses useTexture (must be wrapped in Suspense)
function TexturedCanvasInner({ imagePath, width, height, wallOffset }: TexturedCanvasProps) {
  const texture = useTexture(imagePath, (tex) => {
    // Configure texture on load for proper color and quality
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = true;
  });

  return (
    <mesh position={[0, 0, wallOffset + 0.001]} receiveShadow={false}>
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial map={texture} roughness={0.8} side={THREE.DoubleSide} />
    </mesh>
  );
}

// Error boundary for texture loading failures
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class TextureErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Texture loading error:', error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Main TexturedCanvas with Suspense and Error Boundary
function TexturedCanvas({ imagePath, width, height, wallOffset }: TexturedCanvasProps) {
  const fallback = <CanvasFallback width={width} height={height} wallOffset={wallOffset} />;
  
  return (
    <TextureErrorBoundary fallback={fallback}>
      <Suspense fallback={fallback}>
        <TexturedCanvasInner
          imagePath={imagePath}
          width={width}
          height={height}
          wallOffset={wallOffset}
        />
      </Suspense>
    </TextureErrorBoundary>
  );
}


// ========================================
// ARTWORK FRAME COMPONENT
// ========================================

export function ArtworkFrame({ artwork }: ArtworkFrameProps) {
  const { position, rotation, realSizeMeters, imagePath } = artwork;
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  
  // Calculate scaled dimensions
  const sizeMultiplier = GALLERY_CONFIG.artwork.sizeMultiplier || 1;
  const scaledWidth = realSizeMeters.width * sizeMultiplier;
  const scaledHeight = realSizeMeters.height * sizeMultiplier;
  
  // Frame dimensions
  const frameThickness = GALLERY_CONFIG.artwork.frameThickness;
  const frameBorder = GALLERY_CONFIG.artwork.frameBorderWidth;
  const frameWidth = scaledWidth + frameBorder * 2;
  const frameHeight = scaledHeight + frameBorder * 2;
  
  // LOD state
  const [lodLevel, setLodLevel] = useState<'full' | 'simplified' | 'hidden'>('full');
  
  // Calculate LOD based on camera distance
  useFrame(() => {
    if (!groupRef.current) return;
    
    const artworkPos = new THREE.Vector3(...position);
    const distance = camera.position.distanceTo(artworkPos);
    
    // LOD levels:
    // 0-25m: Full detail (with frame)
    // 25-40m: Simplified (no frame detail)
    // 40m+: Hidden (frustum culling)
    if (distance < 25) {
      if (lodLevel !== 'full') setLodLevel('full');
    } else if (distance < 40) {
      if (lodLevel !== 'simplified') setLodLevel('simplified');
    } else {
      if (lodLevel !== 'hidden') setLodLevel('hidden');
    }
  });
  
  const wallOffset = 0.02;
  
  // Don't render if too far (aggressive culling)
  if (lodLevel === 'hidden') {
    return null;
  }
  
  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Render based on LOD level */}
      {lodLevel === 'full' ? (
        <>
          {/* Full detail: Frame + Textured Canvas + Plaque */}
          <mesh position={[0, 0, wallOffset - frameThickness / 2]} castShadow={false}>
            <boxGeometry args={[frameWidth, frameHeight, frameThickness]} />
            <meshStandardMaterial color="#3E2723" roughness={0.6} metalness={0.1} />
          </mesh>
          
          {/* Textured artwork with built-in fallback */}
          <TexturedCanvas 
            imagePath={imagePath} 
            width={scaledWidth} 
            height={scaledHeight}
            wallOffset={wallOffset}
          />
        </>
      ) : (
        <>
          {/* Simplified: Textured plane (no frame) */}
          <TexturedCanvas 
            imagePath={imagePath} 
            width={scaledWidth} 
            height={scaledHeight}
            wallOffset={wallOffset}
          />
        </>
      )}
      
      {/* Invisible hitbox for raycasting (always present) */}
      <mesh
        position={[0, 0, wallOffset]}
        visible={false}
        userData={{ artworkId: artwork.id }}
      >
        <planeGeometry args={[frameWidth + 0.1, frameHeight + 0.1]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
}
