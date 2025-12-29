import { Artwork } from '@/types/gallery';
import { WallDefinition } from '@/data/wallDefinitions';
import { GALLERY_CONFIG } from '@/data/galleryConfig';

/**
 * Calculate bounding box for artwork with current config
 */
function getArtworkSize(artwork: Pick<Artwork, 'realSizeMeters'>) {
  const { sizeMultiplier, frameBorderWidth } = GALLERY_CONFIG.artwork;
  const scaledWidth = artwork.realSizeMeters.width * sizeMultiplier;
  const scaledHeight = artwork.realSizeMeters.height * sizeMultiplier;
  const totalWidth = scaledWidth + frameBorderWidth * 2;
  const totalHeight = scaledHeight + frameBorderWidth * 2;
  
  return { width: totalWidth, height: totalHeight };
}

/**
 * Calculate rotation euler angles from a normal vector
 * The normal points in the direction artwork should face
 */
function rotationFromNormal(normal: [number, number, number]): [number, number, number] {
  const yRotation = Math.atan2(normal[0], normal[2]);
  return [0, yRotation, 0];
}

/**
 * Calculate wall offset from normal vector
 * Positions artwork in front of the wall surface
 */
function getWallOffsetFromNormal(normal: [number, number, number]): [number, number, number] {
  const wallThickness = 0.2; // Same as in ProceduralGallery
  const artworkOffset = 0.05; // Small offset to ensure artwork is in front of wall
  const totalOffset = (wallThickness / 2) + artworkOffset;
  
  return [
    normal[0] * totalOffset,
    0,
    normal[2] * totalOffset,
  ];
}

/**
 * Automatically position artworks on a wall
 */
export function positionArtworksOnWall(
  artworks: Artwork[],
  wall: WallDefinition,
  minSpacing: number = GALLERY_CONFIG.artwork.minSpacing
): Artwork[] {
  if (artworks.length === 0) return [];
  
  // Corner clearance to prevent clipping at wall intersections
  const CORNER_CLEARANCE = 0.3; // meters
  
  // Calculate total space needed
  let totalWidth = 0;
  const sizes = artworks.map(art => {
    const size = getArtworkSize(art);
    totalWidth += size.width;
    return size;
  });
  
  // Add spacing between artworks
  totalWidth += minSpacing * (artworks.length - 1);
  
  // Calculate available space with corner clearance
  const wallLength = wall.maxPos - wall.minPos;
  const safeMinPos = wall.minPos + CORNER_CLEARANCE;
  const safeMaxPos = wall.maxPos - CORNER_CLEARANCE;
  const availableSpace = safeMaxPos - safeMinPos;
  
  // Reduce spacing for excluded zones
  const excludedSpace = (wall.avoidZones || []).reduce(
    (sum, zone) => sum + (zone.max - zone.min),
    0
  );
  const usableSpace = availableSpace - excludedSpace;
  
  if (totalWidth > usableSpace) {
    console.warn(
      `Warning: Wall ${wall.id} needs ${totalWidth.toFixed(2)}m but only has ${usableSpace.toFixed(2)}m available`
    );
  }
  
  // Center artworks on wall (within safe bounds)
  const startPos = safeMinPos + Math.max(0, (usableSpace - totalWidth) / 2);
  
  // Calculate wall offset from normal (to position artwork in front of wall, not inside it)
  const wallOffset = getWallOffsetFromNormal(wall.normal);
  
  // Calculate artwork rotation from wall normal
  const artworkRotation = rotationFromNormal(wall.normal);
  
  // Position each artwork
  const positioned: Artwork[] = [];
  let currentPos = startPos;
  
  artworks.forEach((art, index) => {
    const size = sizes[index];
    const halfWidth = size.width / 2;
    
    // Move to center of current artwork
    currentPos += halfWidth;
    
    // Check avoid zones and adjust if needed
    let finalPos = currentPos;
    if (wall.avoidZones) {
      for (const zone of wall.avoidZones) {
        if (currentPos >= zone.min && currentPos <= zone.max) {
          // Move past the zone
          finalPos = zone.max + halfWidth + 0.3;
        }
      }
    }
    
    // Clamp position to ensure artwork edges stay within safe bounds
    const clampedPos = Math.max(
      safeMinPos + halfWidth,  // Ensure left/top edge doesn't exceed min
      Math.min(
        safeMaxPos - halfWidth,  // Ensure right/bottom edge doesn't exceed max
        finalPos
      )
    );
    
    // Warn if artwork position was significantly clamped
    if (Math.abs(clampedPos - finalPos) > 0.01) {
      console.warn(
        `⚠️  ${art.id} on ${wall.id}: Position clamped from ${finalPos.toFixed(2)} to ${clampedPos.toFixed(2)} to stay within bounds`
      );
    }
    
    // Start with wall position
    const position: [number, number, number] = [...wall.position];
    
    // Set Y position (height) - use artwork's heightOffset or default height
    const baseHeight = art.heightOffset !== undefined 
      ? GALLERY_CONFIG.artwork.defaultHeight + art.heightOffset
      : GALLERY_CONFIG.artwork.defaultHeight;
    position[1] = baseHeight;
    
    // Set X or Z based on wall axis
    if (wall.axis === 'z') {
      position[2] = clampedPos;
    } else {
      position[0] = clampedPos;
    }
    
    // Apply wall offset to move artwork away from wall surface
    position[0] += wallOffset[0];
    position[1] += wallOffset[1];
    position[2] += wallOffset[2];
    
    // Debug logging for first few artworks
    if (index < 3) {
      console.log(`📍 ${art.id}:`, {
        wall: wall.id,
        wallPos: wall.position,
        axis: wall.axis,
        finalPos: clampedPos,
        bounds: `[${safeMinPos.toFixed(2)}, ${safeMaxPos.toFixed(2)}]`,
        artworkEdges: `[${(clampedPos - halfWidth).toFixed(2)}, ${(clampedPos + halfWidth).toFixed(2)}]`,
        wallOffset,
        calculatedPos: position,
        normal: wall.normal,
        rotation: artworkRotation,
      });
    }
    
    positioned.push({
      ...art,
      position,
      rotation: artworkRotation,
    });
    
    // Move to next position
    currentPos = clampedPos + halfWidth + minSpacing;
  });
  
  return positioned;
}

/**
 * Auto-layout all artworks based on wall assignments
 */
export function autoLayoutGallery(
  artworks: Artwork[],
  walls: WallDefinition[]
): Artwork[] {
  const positioned: Artwork[] = [];
  
  // Group artworks by assigned wall
  const byWall = new Map<string, Artwork[]>();
  
  artworks.forEach(art => {
    const wallId = art.assignedWall || inferWallFromPosition(art, walls);
    if (!byWall.has(wallId)) {
      byWall.set(wallId, []);
    }
    byWall.get(wallId)!.push(art);
  });
  
  // Position artworks on each wall
  byWall.forEach((wallArtworks, wallId) => {
    const wall = walls.find(w => w.id === wallId);
    if (!wall) {
      console.warn(`Wall ${wallId} not found in registry`);
      positioned.push(...wallArtworks);
      return;
    }
    
    // Sort by order if specified
    const sorted = [...wallArtworks].sort((a, b) => {
      if (a.wallOrder !== undefined && b.wallOrder !== undefined) {
        return a.wallOrder - b.wallOrder;
      }
      // Fallback to current position
      const aPos = wall.axis === 'z' ? a.position[2] : a.position[0];
      const bPos = wall.axis === 'z' ? b.position[2] : b.position[0];
      return aPos - bPos;
    });
    
    const layouted = positionArtworksOnWall(sorted, wall);
    positioned.push(...layouted);
  });
  
  return positioned;
}

/**
 * Infer wall ID from current position (for migration)
 */
function inferWallFromPosition(artwork: Artwork, walls: WallDefinition[]): string {
  const pos = artwork.position;
  const rot = artwork.rotation;
  
  // Find closest matching wall
  for (const wall of walls) {
    const posMatch =
      Math.abs(pos[0] - wall.position[0]) < 0.3 ||
      Math.abs(pos[2] - wall.position[2]) < 0.3;
    const rotMatch = Math.abs(rot[1] - wall.rotation[1]) < 0.1;
    
    if (posMatch && rotMatch) {
      return wall.id;
    }
  }
  
  return 'unknown';
}

/**
 * Validate and report wall capacity
 */
export function validateWallCapacity(
  artworks: Artwork[],
  walls: WallDefinition[]
): { wallId: string; capacity: number; used: number; available: number }[] {
  const report: { wallId: string; capacity: number; used: number; available: number }[] = [];
  
  walls.forEach(wall => {
    const wallArtworks = artworks.filter(art => {
      const wallId = art.assignedWall || inferWallFromPosition(art, walls);
      return wallId === wall.id;
    });
    
    let totalUsed = 0;
    wallArtworks.forEach(art => {
      const size = getArtworkSize(art);
      totalUsed += size.width;
    });
    
    if (wallArtworks.length > 1) {
      totalUsed += GALLERY_CONFIG.artwork.minSpacing * (wallArtworks.length - 1);
    }
    
    const capacity = wall.maxPos - wall.minPos;
    const excludedSpace = (wall.avoidZones || []).reduce(
      (sum, zone) => sum + (zone.max - zone.min),
      0
    );
    const available = capacity - excludedSpace;
    
    report.push({
      wallId: wall.id,
      capacity: available,
      used: totalUsed,
      available: available - totalUsed,
    });
  });
  
  return report;
}

