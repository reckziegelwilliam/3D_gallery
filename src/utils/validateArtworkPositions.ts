import { artworks } from '@/data/artworks';
import { 
  validateArtworks, 
  findOverlaps, 
  getArtworkBounds,
  getWallType,
  findDoorwayConflicts 
} from './artworkLayout';
import { GALLERY_CONFIG } from '@/data/galleryConfig';
import { Artwork } from '@/types/gallery';

/**
 * Analyze artwork distribution across rooms and walls
 */
export function analyzeDistribution(artworkList: Artwork[]) {
  const byRoom = {
    'Room 1': artworkList.filter(a => {
      // Room 1 is landscapes in the entrance area (Z > 0)
      return a.room === 'landscapes' && a.position[2] > 0;
    }),
    'Room 2': artworkList.filter(a => a.room === 'abstracts'),
    'Room 3': artworkList.filter(a => a.room === 'early-works'),
    'Room 4': artworkList.filter(a => {
      // Room 4 is landscapes in the back (Z < -7)
      return a.room === 'landscapes' && a.position[2] < -7;
    }),
  };
  
  console.log('\n📊 DISTRIBUTION ANALYSIS:\n');
  
  Object.entries(byRoom).forEach(([room, arts]) => {
    console.log(`  ${room}: ${arts.length} artworks`);
    
    // Group by wall
    const byWall = new Map<string, Artwork[]>();
    arts.forEach(art => {
      const wallType = getWallType(art.rotation);
      let wallKey = '';
      
      if (wallType === 'east-west') {
        wallKey = art.position[0] < 0 ? 'West Wall' : 'East Wall';
      } else {
        wallKey = art.position[2] < -5 ? 'North Wall' : 'South Wall';
      }
      
      if (!byWall.has(wallKey)) {
        byWall.set(wallKey, []);
      }
      byWall.get(wallKey)!.push(art);
    });
    
    byWall.forEach((wallArts, wall) => {
      console.log(`    - ${wall}: ${wallArts.length} artwork(s)`);
    });
  });
  
  // Check for imbalance
  const counts = Object.values(byRoom).map(a => a.length);
  const max = Math.max(...counts);
  const min = Math.min(...counts);
  const avg = counts.reduce((a, b) => a + b, 0) / counts.length;
  
  if (max - min > 3) {
    console.log(`\n  ⚠️  Imbalanced distribution: ${min}-${max} artworks per room`);
    console.log(`  💡 Consider moving artworks for better balance`);
    return { balanced: false, min, max, avg };
  } else {
    console.log(`\n  ✅ Good balance: ${min}-${max} artworks per room`);
    return { balanced: true, min, max, avg };
  }
}

/**
 * Suggest artwork moves for better distribution
 */
export function suggestRebalancing(artworkList: Artwork[]): string[] {
  const suggestions: string[] = [];
  
  const byRoom = {
    'Room 1': artworkList.filter(a => a.room === 'landscapes' && a.position[2] > 0).length,
    'Room 2': artworkList.filter(a => a.room === 'abstracts').length,
    'Room 3': artworkList.filter(a => a.room === 'early-works').length,
    'Room 4': artworkList.filter(a => a.room === 'landscapes' && a.position[2] < -7).length,
  };
  
  const avg = Object.values(byRoom).reduce((a, b) => a + b, 0) / 4;
  
  Object.entries(byRoom).forEach(([room, count]) => {
    if (count > avg + 1.5) {
      suggestions.push(`${room} has ${count} artworks (${(count - avg).toFixed(1)} above average) - consider moving some`);
    }
    if (count < avg - 1.5) {
      suggestions.push(`${room} has only ${count} artworks (${(avg - count).toFixed(1)} below average) - could add more`);
    }
  });
  
  return suggestions;
}

/**
 * Run comprehensive artwork validation and report to console
 */
export function runArtworkValidation() {
  console.log('🎨 Validating Artwork Positions...\n');
  console.log(`Checking ${artworks.length} artworks across 4 rooms...\n`);
  
  const validation = validateArtworks(artworks);
  
  // Report overlaps
  if (validation.overlaps.length > 0) {
    console.log(`❌ ${validation.overlaps.length} OVERLAP(S) DETECTED:\n`);
    
    validation.overlaps.forEach(([id1, id2]) => {
      const art1 = artworks.find(a => a.id === id1)!;
      const art2 = artworks.find(a => a.id === id2)!;
      const bounds1 = getArtworkBounds(art1);
      const bounds2 = getArtworkBounds(art2);
      
      const wallType = getWallType(art1.rotation);
      const axis = wallType === 'east-west' ? 'Z' : 'X';
      const distance = wallType === 'east-west' 
        ? Math.abs(bounds1.centerZ - bounds2.centerZ)
        : Math.abs(bounds1.centerX - bounds2.centerX);
      const required = bounds1.halfWidth + bounds2.halfWidth + GALLERY_CONFIG.artwork.minSpacing;
      
      console.log(`  • "${art1.title}" and "${art2.title}"`);
      console.log(`    ${id1}: [${art1.position.join(', ')}]`);
      console.log(`      Size: ${bounds1.width.toFixed(2)}m × ${bounds1.height.toFixed(2)}m`);
      console.log(`    ${id2}: [${art2.position.join(', ')}]`);
      console.log(`      Size: ${bounds2.width.toFixed(2)}m × ${bounds2.height.toFixed(2)}m`);
      console.log(`    ${axis}-Distance: ${distance.toFixed(2)}m | Required: ${required.toFixed(2)}m`);
      console.log(`    ⚠️  SHORT BY: ${(required - distance).toFixed(2)}m\n`);
    });
  }
  
  // Report doorway conflicts
  if (validation.doorwayConflicts.length > 0) {
    console.log(`🚪 ${validation.doorwayConflicts.length} DOORWAY CONFLICT(S):\n`);
    
    validation.doorwayConflicts.forEach(({ artwork, doorway }) => {
      const bounds = getArtworkBounds(artwork);
      console.log(`  • "${artwork.title}" intrudes into ${doorway}`);
      console.log(`    Position: [${artwork.position.join(', ')}]`);
      console.log(`    Size: ${bounds.width.toFixed(2)}m × ${bounds.height.toFixed(2)}m`);
      console.log(`    ⚠️  May obstruct passage\n`);
    });
  }
  
  // Report warnings
  if (validation.warnings.length > 0) {
    console.log(`⚠️  ${validation.warnings.length} WARNING(S):\n`);
    validation.warnings.forEach(warning => {
      console.log(`  • ${warning}`);
    });
    console.log('');
  }
  
  // Distribution analysis
  analyzeDistribution(artworks);
  
  // Rebalancing suggestions
  const rebalanceSuggestions = suggestRebalancing(artworks);
  if (rebalanceSuggestions.length > 0) {
    console.log('\n💡 DISTRIBUTION SUGGESTIONS:\n');
    rebalanceSuggestions.forEach(s => console.log(`  • ${s}`));
  }
  
  // Success message
  if (validation.valid) {
    console.log('✅ All artworks are properly positioned!\n');
    console.log('  - No overlaps detected');
    console.log('  - All artworks within safe height range');
    console.log(`  - Minimum spacing maintained: ${GALLERY_CONFIG.artwork.minSpacing}m\n`);
    
    // Statistics by room
    const roomStats = {
      landscapes: artworks.filter(a => a.room === 'landscapes').length,
      abstracts: artworks.filter(a => a.room === 'abstracts').length,
      'early-works': artworks.filter(a => a.room === 'early-works').length,
    };
    
    console.log('📊 Statistics:');
    console.log(`  - Landscapes: ${roomStats.landscapes} artworks`);
    console.log(`  - Abstracts: ${roomStats.abstracts} artworks`);
    console.log(`  - Early Works: ${roomStats['early-works']} artworks`);
  } else {
    console.log('❌ Validation failed. Please fix the issues above.\n');
    
    // Provide fix suggestions
    if (validation.overlaps.length > 0) {
      console.log('💡 FIX SUGGESTIONS:\n');
      validation.overlaps.forEach(([id1, id2]) => {
        const art1 = artworks.find(a => a.id === id1)!;
        const art2 = artworks.find(a => a.id === id2)!;
        const bounds1 = getArtworkBounds(art1);
        const bounds2 = getArtworkBounds(art2);
        
        const wallType = getWallType(art1.rotation);
        const required = bounds1.halfWidth + bounds2.halfWidth + GALLERY_CONFIG.artwork.minSpacing;
        
        if (wallType === 'east-west') {
          const newZ = art1.position[2] < art2.position[2]
            ? art1.position[2] + required
            : art1.position[2] - required;
          console.log(`  Move "${art2.title}" Z from ${art2.position[2]} to ${newZ.toFixed(2)}`);
        } else {
          const newX = art1.position[0] < art2.position[0]
            ? art1.position[0] + required
            : art1.position[0] - required;
          console.log(`  Move "${art2.title}" X from ${art2.position[0]} to ${newX.toFixed(2)}`);
        }
      });
    }
  }
  
  return validation;
}

/**
 * Generate detailed collision report for development
 */
export function generateCollisionReport(): string {
  const validation = validateArtworks(artworks);
  const overlaps = findOverlaps(artworks);
  
  let report = '# Artwork Collision Report\n\n';
  report += `Generated: ${new Date().toISOString()}\n`;
  report += `Total Artworks: ${artworks.length}\n\n`;
  
  if (overlaps.length === 0) {
    report += '## ✅ Status: PASS\n\n';
    report += 'No collisions detected. All artworks properly spaced.\n';
  } else {
    report += `## ❌ Status: FAIL\n\n`;
    report += `Found ${overlaps.length} collision(s):\n\n`;
    
    overlaps.forEach(([art1, art2], index) => {
      const bounds1 = getArtworkBounds(art1);
      const bounds2 = getArtworkBounds(art2);
      
      report += `### Collision ${index + 1}: ${art1.title} ↔ ${art2.title}\n\n`;
      report += `- **${art1.title}**\n`;
      report += `  - Position: [${art1.position.join(', ')}]\n`;
      report += `  - Size: ${bounds1.width.toFixed(2)}m × ${bounds1.height.toFixed(2)}m\n`;
      report += `- **${art2.title}**\n`;
      report += `  - Position: [${art2.position.join(', ')}]\n`;
      report += `  - Size: ${bounds2.width.toFixed(2)}m × ${bounds2.height.toFixed(2)}m\n\n`;
    });
  }
  
  if (validation.warnings.length > 0) {
    report += '## ⚠️  Warnings\n\n';
    validation.warnings.forEach(warning => {
      report += `- ${warning}\n`;
    });
  }
  
  return report;
}

