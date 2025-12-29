'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { WALL_REGISTRY, WallDefinition } from '@/data/wallDefinitions';
import { useGalleryStore } from '@/store/galleryStore';
import { isAdminAuthenticated } from '@/utils/adminAuth';
import { ArtworkUploader } from '@/components/admin/ArtworkUploader';

// Scale and offset for 2D canvas
const SCALE = 28;
const OFFSET = { x: 300, y: 500 };

// Convert 3D position to 2D canvas coordinates
function toCanvas(pos: [number, number, number]): { x: number; y: number } {
  return {
    x: pos[0] * SCALE + OFFSET.x,
    y: -pos[2] * SCALE + OFFSET.y,
  };
}

// Get wall rectangle properties for rendering
function getWallRect(wall: WallDefinition) {
  const center = toCanvas(wall.position);
  const length = wall.length * SCALE;
  const thickness = 8;
  
  if (wall.axis === 'z') {
    // Vertical wall (runs along Z axis)
    return {
      x: center.x - thickness / 2,
      y: center.y - length / 2,
      width: thickness,
      height: length,
    };
  } else {
    // Horizontal wall (runs along X axis)
    return {
      x: center.x - length / 2,
      y: center.y - thickness / 2,
      width: length,
      height: thickness,
    };
  }
}

export default function EditorPage() {
  const router = useRouter();
  const [selectedArtwork, setSelectedArtwork] = useState<string | null>(null);
  const [draggedArtwork, setDraggedArtwork] = useState<string | null>(null);
  const [showExport, setShowExport] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [importJson, setImportJson] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  const artworks = useGalleryStore((s) => s.artworks);
  const updateArtworkWall = useGalleryStore((s) => s.updateArtworkWall);
  const updateArtworkHeight = useGalleryStore((s) => s.updateArtworkHeight);
  const exportLayout = useGalleryStore((s) => s.exportLayout);
  const importLayout = useGalleryStore((s) => s.importLayout);
  const resetToDefaults = useGalleryStore((s) => s.resetToDefaults);
  const setAdminMode = useGalleryStore((s) => s.setAdminMode);
  const removeArtwork = useGalleryStore((s) => s.removeArtwork);

  // Check authentication on mount
  useEffect(() => {
    if (isAdminAuthenticated()) {
      setAuthenticated(true);
      setAdminMode(true);
    } else {
      router.push('/admin');
    }
  }, [router, setAdminMode]);

  // Handle dropping artwork onto a wall
  const handleWallDrop = useCallback((wallId: string) => {
    if (!draggedArtwork) return;
    
    // Count existing artworks on this wall
    const existingOnWall = artworks.filter(a => a.assignedWall === wallId);
    const newOrder = existingOnWall.length;
    
    updateArtworkWall(draggedArtwork, wallId, newOrder);
    setDraggedArtwork(null);
  }, [draggedArtwork, artworks, updateArtworkWall]);

  // Handle import
  const handleImport = () => {
    const success = importLayout(importJson);
    if (success) {
      setShowImport(false);
      setImportJson('');
    }
  };

  // Handle logout
  const handleLogout = async () => {
    await fetch('/api/admin/login', { method: 'DELETE' });
    setAdminMode(false);
    router.push('/admin');
  };

  // Handle delete artwork
  const handleDeleteArtwork = async (artworkId: string) => {
    if (!confirm(`Delete artwork "${artworkId}"? This will also remove the image files.`)) {
      return;
    }

    setDeleting(true);
    try {
      // Delete files from server
      const response = await fetch(`/api/admin/artwork/${artworkId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete');
      }

      // Remove from store
      removeArtwork(artworkId);
      setSelectedArtwork(null);
    } catch (error) {
      console.error('Delete error:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete artwork');
    } finally {
      setDeleting(false);
    }
  };

  const selected = artworks.find(a => a.id === selectedArtwork);
  const artworksOnSelectedWall = selected 
    ? artworks.filter(a => a.assignedWall === selected.assignedWall).length 
    : 0;

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link 
            href="/gallery" 
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← Gallery
          </Link>
          <h1 className="text-xl font-light tracking-wider">Layout Editor</h1>
          <span className="text-xs text-purple-400 bg-purple-900/30 px-2 py-1 rounded">
            {artworks.length} artworks
          </span>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowUpload(true)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm font-medium transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Upload
          </button>
          <button
            onClick={() => setShowImport(true)}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-sm transition-colors"
          >
            Import
          </button>
          <button
            onClick={() => setShowExport(true)}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-sm transition-colors"
          >
            Export
          </button>
          <button
            onClick={() => {
              if (confirm('Reset all artwork placements to defaults?')) {
                resetToDefaults();
              }
            }}
            className="px-4 py-2 bg-red-900/30 hover:bg-red-900/50 border border-red-900/50 rounded text-sm transition-colors"
          >
            Reset
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-sm transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Floor Plan Canvas */}
        <div className="flex-1 p-6 overflow-auto bg-[#0d0d14]">
          <div className="flex items-center justify-center min-h-full">
            <svg
              width="700"
              height="800"
              viewBox="0 0 700 800"
              className="border border-white/5 rounded-lg bg-[#08080c]"
            >
              {/* Grid pattern */}
              <defs>
                <pattern id="grid" width={SCALE} height={SCALE} patternUnits="userSpaceOnUse">
                  <path 
                    d={`M ${SCALE} 0 L 0 0 0 ${SCALE}`} 
                    fill="none" 
                    stroke="#1a1a2e" 
                    strokeWidth="0.5" 
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Room labels */}
              <text x="300" y="420" fill="#333" fontSize="14" textAnchor="middle" fontWeight="300">
                Room 1 - Entrance
              </text>
              <text x="180" y="300" fill="#333" fontSize="14" textAnchor="middle" fontWeight="300">
                Room 2 - Abstract
              </text>
              <text x="420" y="300" fill="#333" fontSize="14" textAnchor="middle" fontWeight="300">
                Room 3 - Early Works
              </text>
              <text x="300" y="160" fill="#333" fontSize="14" textAnchor="middle" fontWeight="300">
                Room 4 - Feature
              </text>

              {/* Render walls */}
              {WALL_REGISTRY.map(wall => {
                const rect = getWallRect(wall);
                const isHighlighted = selected?.assignedWall === wall.id;
                
                return (
                  <g key={wall.id}>
                    <rect
                      {...rect}
                      fill={isHighlighted ? '#4a3a7a' : '#2a2a4a'}
                      stroke={isHighlighted ? '#8b7ac9' : '#3a3a5a'}
                      strokeWidth="1"
                      className="cursor-pointer transition-colors"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => handleWallDrop(wall.id)}
                      onClick={() => {
                        if (selectedArtwork) {
                          const current = artworks.find(a => a.id === selectedArtwork);
                          if (current && current.assignedWall !== wall.id) {
                            const existingOnWall = artworks.filter(a => a.assignedWall === wall.id);
                            updateArtworkWall(selectedArtwork, wall.id, existingOnWall.length);
                          }
                        }
                      }}
                    />
                    <title>{`${wall.room}: ${wall.name}`}</title>
                  </g>
                );
              })}

              {/* Render artwork positions */}
              {artworks.map(art => {
                const pos = toCanvas(art.position);
                const isSelected = selectedArtwork === art.id;
                const isDragging = draggedArtwork === art.id;
                
                return (
                  <g
                    key={art.id}
                    transform={`translate(${pos.x}, ${pos.y})`}
                    className="cursor-pointer"
                    onMouseDown={() => setDraggedArtwork(art.id)}
                    onMouseUp={() => setDraggedArtwork(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedArtwork(art.id);
                    }}
                  >
                    <circle
                      r={isSelected ? 12 : 8}
                      fill={isDragging ? '#fbbf24' : isSelected ? '#a78bfa' : '#6366f1'}
                      stroke={isSelected ? '#fff' : 'transparent'}
                      strokeWidth="2"
                      className="transition-all duration-150"
                    />
                    {isSelected && (
                      <text
                        y={-18}
                        textAnchor="middle"
                        fill="#fff"
                        fontSize="11"
                        fontWeight="500"
                        className="pointer-events-none"
                      >
                        {art.id.length > 15 ? art.id.slice(0, 15) + '...' : art.id}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-96 border-l border-white/10 flex flex-col">
          {selected ? (
            <div className="flex-1 overflow-y-auto">
              {/* Selected artwork header */}
              <div className="p-4 border-b border-white/10">
                <button
                  onClick={() => setSelectedArtwork(null)}
                  className="text-sm text-gray-400 hover:text-white mb-2 flex items-center gap-1"
                >
                  ← All Artworks
                </button>
                <h2 className="text-lg font-medium truncate">{selected.id}</h2>
                <p className="text-sm text-gray-500">
                  {selected.year} • {selected.medium}
                </p>
              </div>

              {/* Artwork preview */}
              <div className="p-4 border-b border-white/10">
                <div className="relative aspect-square w-full bg-white/5 rounded-lg overflow-hidden">
                  <Image
                    src={selected.thumbnailPath}
                    alt={selected.id}
                    fill
                    className="object-contain p-2"
                  />
                </div>
              </div>

              {/* Placement controls */}
              <div className="p-4 space-y-4">
                <h3 className="text-sm font-medium text-purple-400 uppercase tracking-wider">
                  Placement
                </h3>

                {/* Wall selector */}
                <div>
                  <label className="block text-xs text-gray-500 mb-2">Wall Location</label>
                  <select
                    title="Wall Location"
                    value={selected.assignedWall || ''}
                    onChange={(e) => updateArtworkWall(selected.id, e.target.value, 0)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
                  >
                    {Object.entries(
                      WALL_REGISTRY.reduce((acc, wall) => {
                        if (!acc[wall.room]) acc[wall.room] = [];
                        acc[wall.room].push(wall);
                        return acc;
                      }, {} as Record<string, WallDefinition[]>)
                    ).map(([room, walls]) => (
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

                {/* Position on wall */}
                <div>
                  <label className="block text-xs text-gray-500 mb-2">
                    Position on Wall ({(selected.wallOrder ?? 0) + 1} of {artworksOnSelectedWall})
                  </label>
                  <input
                    title="Position on Wall"
                    type="range"
                    min={0}
                    max={Math.max(0, artworksOnSelectedWall - 1)}
                    value={selected.wallOrder ?? 0}
                    onChange={(e) => updateArtworkWall(
                      selected.id, 
                      selected.assignedWall!, 
                      parseInt(e.target.value)
                    )}
                    className="w-full accent-purple-500"
                  />
                  <div className="flex justify-between text-xs text-gray-600 mt-1">
                    <span>Left</span>
                    <span>Right</span>
                  </div>
                </div>

                {/* Height offset */}
                <div>
                  <label className="block text-xs text-gray-500 mb-2">
                    Height Offset: {(selected.heightOffset ?? 0).toFixed(2)}m
                  </label>
                  <input
                    title="Height Offset"
                    type="range"
                    min={-0.5}
                    max={1.0}
                    step={0.05}
                    value={selected.heightOffset ?? 0}
                    onChange={(e) => updateArtworkHeight(selected.id, parseFloat(e.target.value))}
                    className="w-full accent-purple-500"
                  />
                  <div className="flex justify-between text-xs text-gray-600 mt-1">
                    <span>Lower</span>
                    <span>Higher</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="p-4 border-t border-white/10">
                <p className="text-sm text-gray-400 leading-relaxed">
                  {selected.description}
                </p>
              </div>

              {/* Delete button - only for uploaded artworks */}
              {(selected as { isUploaded?: boolean }).isUploaded && (
                <div className="p-4 border-t border-white/10">
                  <button
                    onClick={() => handleDeleteArtwork(selected.id)}
                    disabled={deleting}
                    className="w-full px-4 py-2 bg-red-900/30 hover:bg-red-900/50 disabled:opacity-50 border border-red-900/50 rounded-lg text-sm text-red-400 transition-colors flex items-center justify-center gap-2"
                  >
                    {deleting ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete Artwork
                      </>
                    )}
                  </button>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    This will permanently remove the image files
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 border-b border-white/10">
                <h2 className="font-medium">All Artworks</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Click to select, drag to reposition
                </p>
              </div>
              <div className="p-2">
                {artworks.map(art => (
                  <div
                    key={art.id}
                    onClick={() => setSelectedArtwork(art.id)}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    <div className="relative w-12 h-12 bg-white/5 rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={art.thumbnailPath}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm truncate">{art.id}</div>
                      <div className="text-xs text-gray-500 truncate">
                        {art.assignedWall}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* Export Modal */}
      {showExport && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a2e] rounded-xl p-6 w-full max-w-lg">
            <h3 className="text-lg font-medium mb-4">Export Layout</h3>
            <p className="text-sm text-gray-400 mb-4">
              Copy this JSON to save your current layout configuration.
            </p>
            <textarea
              readOnly
              value={exportLayout()}
              className="w-full h-64 bg-black/50 border border-white/10 p-3 rounded-lg font-mono text-xs resize-none focus:outline-none"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(exportLayout());
                }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm transition-colors"
              >
                Copy to Clipboard
              </button>
              <button
                onClick={() => setShowExport(false)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImport && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a2e] rounded-xl p-6 w-full max-w-lg">
            <h3 className="text-lg font-medium mb-4">Import Layout</h3>
            <p className="text-sm text-gray-400 mb-4">
              Paste a previously exported layout JSON to restore it.
            </p>
            <textarea
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              placeholder="Paste JSON here..."
              className="w-full h-64 bg-black/50 border border-white/10 p-3 rounded-lg font-mono text-xs resize-none focus:outline-none focus:border-purple-500"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => {
                  setShowImport(false);
                  setImportJson('');
                }}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                disabled={!importJson.trim()}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 disabled:cursor-not-allowed rounded-lg text-sm transition-colors"
              >
                Import
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <ArtworkUploader onClose={() => setShowUpload(false)} />
      )}
    </div>
  );
}

