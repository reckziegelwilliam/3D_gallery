import { Artwork } from '@/types/gallery';
import { GALLERY_CONFIG } from '@/data/galleryConfig';

/**
 * Doorway zone types
 */
type NorthSouthDoorway = {
  z: number;
  xMin: number;
  xMax: number;
  name: string;
};

type EastWestDoorway = {
  x: number;
  zMin: number;
  zMax: number;
  name: string;
};

type DoorwayZone = NorthSouthDoorway | EastWestDoorway;

/**
 * Define all doorway/archway zones in the gallery
 */
export const DOORWAY_ZONES: DoorwayZone[] = [
  // North-south doorways (defined by Z position and X range)
  { z: 5.5, xMin: -1, xMax: 1, name: 'Room 1 Entrance' },
  { z: 0.5, xMin: -1.5, xMax: 1.5, name: 'Room 1 North Archway' },
  { z: -7, xMin: -1, xMax: 1, name: 'Room 4 South Archway' },
  
  // East-west doorways (defined by X position and Z range)
  { x: -5, zMin: -1.2, zMax: -0.8, name: 'Room 2 South Archway' },
  { x: -5, zMin: -6.2, zMax: -5.8, name: 'Room 2 North Archway' },
  { x: 5, zMin: -1.2, zMax: -0.8, name: 'Room 3 South Archway' },
  { x: 5, zMin: -6.2, zMax: -5.8, name: 'Room 3 North Archway' },
];

/**
 * Type guard for north-south doorways
 */
function isNorthSouthDoorway(doorway: DoorwayZone): doorway is NorthSouthDoorway {
  return 'z' in doorway;
}

/**
 * Type guard for east-west doorways
 */
function isEastWestDoorway(doorway: DoorwayZone): doorway is EastWestDoorway {
  return 'x' in doorway;
}

/**
 * Calculate the bounding box for an artwork including frame
 */
export function getArtworkBounds(artwork: Artwork) {
  const { position, realSizeMeters } = artwork;
  const { sizeMultiplier, frameBorderWidth } = GALLERY_CONFIG.artwork;
  
  // Calculate scaled dimensions
  const scaledWidth = realSizeMeters.width * sizeMultiplier;
  const scaledHeight = realSizeMeters.height * sizeMultiplier;
  
  // Add frame borders
  const totalWidth = scaledWidth + frameBorderWidth * 2;
  const totalHeight = scaledHeight + frameBorderWidth * 2;
  
  return {
    centerX: position[0],
    centerY: position[1],
    centerZ: position[2],
    halfWidth: totalWidth / 2,
    halfHeight: totalHeight / 2,
    width: totalWidth,
    height: totalHeight,
  };
}

/**
 * Determine which wall an artwork is on based on rotation
 */
export function getWallType(rotation: number[]): 'east-west' | 'north-south' {
  const yRotation = rotation[1];
  // East-west walls: rotation ±π/2 (paintings face east or west)
  if (Math.abs(yRotation) > Math.PI / 4 && Math.abs(yRotation) < (3 * Math.PI) / 4) {
    return 'east-west';
  }
  // North-south walls: rotation 0 or π (paintings face north or south)
  return 'north-south';
}

/**
 * Check if two artworks on the same wall overlap
 */
export function artworksOverlap(
  artwork1: Artwork,
  artwork2: Artwork,
  minSpacing: number = GALLERY_CONFIG.artwork.minSpacing
): boolean {
  const bounds1 = getArtworkBounds(artwork1);
  const bounds2 = getArtworkBounds(artwork2);
  
  // Check if they're on the same wall type
  const wallType1 = getWallType(artwork1.rotation);
  const wallType2 = getWallType(artwork2.rotation);
  
  if (wallType1 !== wallType2) return false;
  
  // For east-west walls, artworks share similar X coordinate
  if (wallType1 === 'east-west') {
    // Must be on same wall (within 0.3m in X)
    if (Math.abs(bounds1.centerX - bounds2.centerX) > 0.3) return false;
    
    // Check Z-axis overlap (paintings arranged vertically along wall)
    const zDistance = Math.abs(bounds1.centerZ - bounds2.centerZ);
    const zMinDistance = bounds1.halfWidth + bounds2.halfWidth + minSpacing;
    
    // Check Y-axis overlap (vertical positioning)
    const yDistance = Math.abs(bounds1.centerY - bounds2.centerY);
    const yMinDistance = bounds1.halfHeight + bounds2.halfHeight;
    
    // Overlap if both distances are less than minimum
    return zDistance < zMinDistance && yDistance < yMinDistance;
  }
  
  // For north-south walls, artworks share similar Z coordinate
  if (wallType1 === 'north-south') {
    // Must be on same wall (within 0.3m in Z)
    if (Math.abs(bounds1.centerZ - bounds2.centerZ) > 0.3) return false;
    
    // Check X-axis overlap (paintings arranged horizontally along wall)
    const xDistance = Math.abs(bounds1.centerX - bounds2.centerX);
    const xMinDistance = bounds1.halfWidth + bounds2.halfWidth + minSpacing;
    
    // Check Y-axis overlap (vertical positioning)
    const yDistance = Math.abs(bounds1.centerY - bounds2.centerY);
    const yMinDistance = bounds1.halfHeight + bounds2.halfHeight;
    
    // Overlap if both distances are less than minimum
    return xDistance < xMinDistance && yDistance < yMinDistance;
  }
  
  return false;
}

/**
 * Find all overlapping artwork pairs
 */
export function findOverlaps(artworks: Artwork[]): Array<[Artwork, Artwork]> {
  const overlaps: Array<[Artwork, Artwork]> = [];
  
  for (let i = 0; i < artworks.length; i++) {
    for (let j = i + 1; j < artworks.length; j++) {
      if (artworksOverlap(artworks[i], artworks[j])) {
        overlaps.push([artworks[i], artworks[j]]);
      }
    }
  }
  
  return overlaps;
}

/**
 * Calculate optimal spacing for artworks on the same wall
 */
export function calculateOptimalSpacing(
  artworks: Artwork[],
  axis: 'x' | 'z',
  minSpacing: number = GALLERY_CONFIG.artwork.minSpacing
): number[] {
  if (artworks.length === 0) return [];
  if (artworks.length === 1) return [artworks[0].position[axis === 'x' ? 0 : 2]];
  
  // Sort by current position
  const sorted = [...artworks].sort((a, b) => {
    const aPos = axis === 'x' ? a.position[0] : a.position[2];
    const bPos = axis === 'x' ? b.position[0] : b.position[2];
    return aPos - bPos;
  });
  
  // Calculate required space for each artwork
  const spacings: number[] = [];
  let currentPos = sorted[0].position[axis === 'x' ? 0 : 2];
  spacings.push(currentPos);
  
  for (let i = 1; i < sorted.length; i++) {
    const prevBounds = getArtworkBounds(sorted[i - 1]);
    const currBounds = getArtworkBounds(sorted[i]);
    
    // Calculate minimum safe distance
    const prevHalfSize = axis === 'x' ? prevBounds.halfWidth : prevBounds.halfWidth;
    const currHalfSize = axis === 'x' ? currBounds.halfWidth : currBounds.halfWidth;
    
    currentPos += prevHalfSize + minSpacing + currHalfSize;
    spacings.push(currentPos);
  }
  
  return spacings;
}

/**
 * Auto-arrange artworks on a wall to prevent overlaps
 */
export function autoArrangeWall(
  artworks: Artwork[],
  wallAxis: 'x' | 'z',
  startPos: number,
  minSpacing: number = GALLERY_CONFIG.artwork.minSpacing
): Artwork[] {
  if (artworks.length === 0) return [];
  
  // Sort by current position
  const sorted = [...artworks].sort((a, b) => {
    const aPos = wallAxis === 'x' ? a.position[0] : a.position[2];
    const bPos = wallAxis === 'x' ? b.position[0] : b.position[2];
    return aPos - bPos;
  });
  
  const arranged: Artwork[] = [];
  let currentPos = startPos;
  
  for (let i = 0; i < sorted.length; i++) {
    const bounds = getArtworkBounds(sorted[i]);
    const halfSize = wallAxis === 'x' ? bounds.halfWidth : bounds.halfWidth;
    
    // Position artwork
    currentPos += halfSize;
    
    const newPosition: [number, number, number] = [...sorted[i].position];
    if (wallAxis === 'x') {
      newPosition[0] = currentPos;
    } else {
      newPosition[2] = currentPos;
    }
    
    arranged.push({
      ...sorted[i],
      position: newPosition,
    });
    
    currentPos += halfSize + minSpacing;
  }
  
  return arranged;
}

/**
 * Quick fix for immediate overlap issues
 */
export function quickFixOverlaps(artworks: Artwork[]): Artwork[] {
  const overlaps = findOverlaps(artworks);
  if (overlaps.length === 0) return artworks;
  
  const fixed = [...artworks];
  const { minSpacing } = GALLERY_CONFIG.artwork;
  
  overlaps.forEach(([art1, art2]) => {
    const idx2 = fixed.findIndex(a => a.id === art2.id);
    const bounds1 = getArtworkBounds(art1);
    const bounds2 = getArtworkBounds(art2);
    
    // Move art2 based on wall orientation
    const wallType = getWallType(art2.rotation);
    const newPosition: [number, number, number] = [...art2.position];
    
    if (wallType === 'east-west') {
      // Adjust Z position (along the wall)
      const safeDistance = bounds1.halfWidth + bounds2.halfWidth + minSpacing;
      newPosition[2] = art1.position[2] < art2.position[2] 
        ? art1.position[2] + safeDistance
        : art1.position[2] - safeDistance;
    } else {
      // Adjust X position (along the wall)
      const safeDistance = bounds1.halfWidth + bounds2.halfWidth + minSpacing;
      newPosition[0] = art1.position[0] < art2.position[0]
        ? art1.position[0] + safeDistance
        : art1.position[0] - safeDistance;
    }
    
    fixed[idx2] = { ...art2, position: newPosition };
  });
  
  return fixed;
}

/**
 * Check if artwork intrudes into doorway
 */
export function artworkInDoorway(artwork: Artwork): { 
  conflicts: boolean; 
  doorway?: string;
} {
  const bounds = getArtworkBounds(artwork);
  const wallType = getWallType(artwork.rotation);
  
  for (const doorway of DOORWAY_ZONES) {
    // Check north-south doorways (defined by Z position)
    if (isNorthSouthDoorway(doorway) && wallType === 'north-south') {
      const artworkXMin = bounds.centerX - bounds.halfWidth;
      const artworkXMax = bounds.centerX + bounds.halfWidth;
      
      // Check if artwork at this Z overlaps with doorway X range
      if (Math.abs(bounds.centerZ - doorway.z) < 0.3) {
        if (artworkXMin < doorway.xMax && artworkXMax > doorway.xMin) {
          return { conflicts: true, doorway: doorway.name };
        }
      }
    }
    
    // Check east-west doorways (defined by X position)
    if (isEastWestDoorway(doorway) && wallType === 'east-west') {
      const artworkZMin = bounds.centerZ - bounds.halfWidth;
      const artworkZMax = bounds.centerZ + bounds.halfWidth;
      
      // Check if artwork at this X overlaps with doorway Z range
      if (Math.abs(bounds.centerX - doorway.x) < 0.3) {
        if (artworkZMin < doorway.zMax && artworkZMax > doorway.zMin) {
          return { conflicts: true, doorway: doorway.name };
        }
      }
    }
  }
  
  return { conflicts: false };
}

/**
 * Find all artworks that intrude into doorways
 */
export function findDoorwayConflicts(artworks: Artwork[]): Array<{
  artwork: Artwork;
  doorway: string;
}> {
  const conflicts: Array<{ artwork: Artwork; doorway: string }> = [];
  
  artworks.forEach(artwork => {
    const result = artworkInDoorway(artwork);
    if (result.conflicts && result.doorway) {
      conflicts.push({ artwork, doorway: result.doorway });
    }
  });
  
  return conflicts;
}

/**
 * Validate all artworks and report issues
 */
export function validateArtworks(artworks: Artwork[]): {
  valid: boolean;
  overlaps: Array<[string, string]>;
  warnings: string[];
  doorwayConflicts: Array<{ artwork: Artwork; doorway: string }>;
} {
  const overlaps = findOverlaps(artworks);
  const warnings: string[] = [];
  const doorwayConflicts = findDoorwayConflicts(artworks);
  
  // Check for overlaps
  const overlapPairs = overlaps.map(([a, b]) => [a.id, b.id] as [string, string]);
  
  // Check for artworks too close to floor or ceiling
  artworks.forEach((artwork) => {
    const bounds = getArtworkBounds(artwork);
    const bottomY = bounds.centerY - bounds.halfHeight;
    const topY = bounds.centerY + bounds.halfHeight;
    
    if (bottomY < 0.3) {
      warnings.push(`${artwork.id}: Too close to floor (bottom at ${bottomY.toFixed(2)}m)`);
    }
    if (topY > GALLERY_CONFIG.gallery.wallHeight - 0.3) {
      warnings.push(`${artwork.id}: Too close to ceiling (top at ${topY.toFixed(2)}m)`);
    }
  });
  
  return {
    valid: overlaps.length === 0 && warnings.length === 0 && doorwayConflicts.length === 0,
    overlaps: overlapPairs,
    warnings,
    doorwayConflicts,
  };
}

