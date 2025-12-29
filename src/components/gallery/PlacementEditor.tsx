'use client';

import { WALL_REGISTRY, WallDefinition } from '@/data/wallDefinitions';
import { useGalleryStore } from '@/store/galleryStore';
import { Artwork } from '@/types/gallery';

interface PlacementEditorProps {
  artwork: Artwork;
}

export function PlacementEditor({ artwork }: PlacementEditorProps) {
  const updateArtworkWall = useGalleryStore((s) => s.updateArtworkWall);
  const updateArtworkHeight = useGalleryStore((s) => s.updateArtworkHeight);
  const artworks = useGalleryStore((s) => s.artworks);

  // Group walls by room for easier selection
  const wallsByRoom = WALL_REGISTRY.reduce((acc, wall) => {
    if (!acc[wall.room]) acc[wall.room] = [];
    acc[wall.room].push(wall);
    return acc;
  }, {} as Record<string, WallDefinition[]>);

  // Count artworks on the currently selected wall
  const artworksOnWall = artworks.filter(a => a.assignedWall === artwork.assignedWall).length;

  return (
    <div className="mt-6 pt-6 border-t border-gallery-accent/20 space-y-4">
      <h3 className="text-sm font-semibold text-gallery-accent uppercase tracking-wider flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Placement Controls
      </h3>

      {/* Wall Selector */}
      <div>
        <label className="block text-xs text-gray-500 mb-1.5">Wall Location</label>
        <select
          title="Wall Location"
          value={artwork.assignedWall || ''}
          onChange={(e) => updateArtworkWall(artwork.id, e.target.value, 0)}
          className="w-full bg-gallery-darkWood/80 text-gallery-cream border border-gallery-accent/30 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gallery-accent focus:ring-1 focus:ring-gallery-accent transition-colors"
        >
          {Object.entries(wallsByRoom).map(([room, walls]) => (
            <optgroup key={room} label={room}>
              {walls.map(wall => (
                <option key={wall.id} value={wall.id}>
                  {wall.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* Position on Wall */}
      <div>
        <label className="block text-xs text-gray-500 mb-1.5">
          Position on Wall ({(artwork.wallOrder ?? 0) + 1} of {artworksOnWall})
        </label>
        <input
          title="Position on Wall"
          type="range"
          min={0}
          max={Math.max(0, artworksOnWall - 1)}
          value={artwork.wallOrder || 0}
          onChange={(e) => updateArtworkWall(artwork.id, artwork.assignedWall!, parseInt(e.target.value))}
          className="w-full h-2 bg-gallery-darkWood rounded-lg appearance-none cursor-pointer accent-gallery-accent"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Left</span>
          <span>Right</span>
        </div>
      </div>

      {/* Height Adjustment */}
      <div>
        <label className="block text-xs text-gray-500 mb-1.5">
          Height Offset: {(artwork.heightOffset || 0) > 0 ? '+' : ''}{(artwork.heightOffset || 0).toFixed(2)}m
        </label>
        <input
          title="Height Offset"
          type="range"
          min={-0.5}
          max={1.0}
          step={0.05}
          value={artwork.heightOffset || 0}
          onChange={(e) => updateArtworkHeight(artwork.id, parseFloat(e.target.value))}
          className="w-full h-2 bg-gallery-darkWood rounded-lg appearance-none cursor-pointer accent-gallery-accent"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Lower</span>
          <span>Eye Level</span>
          <span>Higher</span>
        </div>
      </div>

      {/* Link to full editor */}
      <a
        href="/admin/editor"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full mt-4 py-2.5 bg-gallery-accent/10 hover:bg-gallery-accent/20 text-gallery-accent border border-gallery-accent/30 rounded-lg text-sm font-medium transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
        </svg>
        Open Floor Plan Editor
      </a>
    </div>
  );
}

