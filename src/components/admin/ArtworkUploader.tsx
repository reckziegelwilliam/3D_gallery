'use client';

import { useState, useRef, useCallback } from 'react';
import { useGalleryStore } from '@/store/galleryStore';
import { WALL_REGISTRY } from '@/data/wallDefinitions';

interface ArtworkUploaderProps {
  onClose: () => void;
}

interface UploadMetadata {
  id: string;
  year: number;
  medium: string;
  description: string;
  room: string;
  assignedWall: string;
  width: number;
  height: number;
}

export function ArtworkUploader({ onClose }: ArtworkUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addArtwork = useGalleryStore((s) => s.addArtwork);

  // Form state
  const [metadata, setMetadata] = useState<UploadMetadata>({
    id: '',
    year: new Date().getFullYear(),
    medium: 'Oil on Canvas',
    description: '',
    room: 'landscapes',
    assignedWall: 'room1-west',
    width: 0.8,
    height: 0.6,
  });

  const handleFileSelect = useCallback((selected: File) => {
    // Validate type
    if (!selected.type.startsWith('image/')) {
      setError('Please select an image file (JPEG, PNG, WebP, or GIF)');
      return;
    }

    // Validate size (10MB)
    if (selected.size > 10 * 1024 * 1024) {
      setError('File must be under 10MB');
      return;
    }

    setFile(selected);
    setError(null);

    // Generate preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(selected);

    // Auto-generate ID from filename
    const baseName = selected.name.replace(/\.[^.]+$/, '');
    const cleanId = baseName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    
    setMetadata((m) => ({ ...m, id: cleanId }));

    // Try to get image dimensions for aspect ratio
    const img = new Image();
    img.onload = () => {
      const aspectRatio = img.width / img.height;
      // Default to ~0.8m width, calculate height from aspect ratio
      const defaultWidth = 0.8;
      const calculatedHeight = Math.round((defaultWidth / aspectRatio) * 100) / 100;
      setMetadata((m) => ({
        ...m,
        width: defaultWidth,
        height: Math.min(calculatedHeight, 1.2), // Cap at 1.2m
      }));
    };
    img.src = URL.createObjectURL(selected);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      handleFileSelect(selected);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) {
      handleFileSelect(dropped);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    // Validate required fields
    if (!metadata.id.trim()) {
      setError('Artwork ID is required');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('metadata', JSON.stringify(metadata));

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      // Log conversion results
      if (data.conversion) {
        console.log(
          `✅ Image converted to WebP: ${(data.conversion.originalSize / 1024).toFixed(0)}KB → ` +
          `${(data.conversion.webpSize / 1024).toFixed(0)}KB (${data.conversion.savingsPercent}% smaller)`
        );
      }

      // Add to store
      addArtwork(data.artwork);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const updateMetadata = <K extends keyof UploadMetadata>(
    key: K,
    value: UploadMetadata[K]
  ) => {
    setMetadata((m) => ({ ...m, [key]: value }));
  };

  // Group walls by room
  const wallsByRoom = WALL_REGISTRY.reduce((acc, wall) => {
    if (!acc[wall.room]) acc[wall.room] = [];
    acc[wall.room].push(wall);
    return acc;
  }, {} as Record<string, typeof WALL_REGISTRY>);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1a2e] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-xl font-medium">Upload New Artwork</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1"
            title="Close"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* File Drop Zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              dragOver
                ? 'border-purple-500 bg-purple-500/10'
                : preview
                ? 'border-purple-500/50'
                : 'border-white/20 hover:border-white/40'
            }`}
          >
            {preview ? (
              <div className="space-y-3">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-48 mx-auto rounded shadow-lg"
                />
                <p className="text-sm text-gray-400">
                  {file?.name} ({((file?.size || 0) / 1024).toFixed(0)} KB)
                </p>
                <p className="text-xs text-purple-400">Click or drop to replace</p>
              </div>
            ) : (
              <div className="text-gray-400 space-y-2">
                <svg
                  className="w-12 h-12 mx-auto text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-lg">Drop image here or click to select</p>
                <p className="text-sm">PNG, JPEG, WebP, GIF up to 10MB</p>
                <p className="text-xs text-purple-400">
                  Will be converted to optimized WebP format
                </p>
              </div>
            )}
            <input
              title="Select Image"
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Metadata Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">
                Artwork ID <span className="text-red-400">*</span>
              </label>
              <input
                title="Artwork ID"
                type="text"
                value={metadata.id}
                onChange={(e) => updateMetadata('id', e.target.value)}
                placeholder="e.g., sunset-over-mountains"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Year</label>
              <input
                title="Year"
                type="number"
                value={metadata.year}
                onChange={(e) => updateMetadata('year', parseInt(e.target.value) || new Date().getFullYear())}
                min={1900}
                max={2100}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Medium</label>
              <input
                type="text"
                value={metadata.medium}
                onChange={(e) => updateMetadata('medium', e.target.value)}
                placeholder="e.g., Oil on Canvas"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Collection</label>
              <select
                title="Collection"
                value={metadata.room}
                onChange={(e) => updateMetadata('room', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
              >
                <option value="landscapes">Landscapes</option>
                <option value="abstracts">Abstracts</option>
                <option value="early-works">Early Works</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Width (meters)</label>
              <input
                title="Width (meters)"
                type="number"
                step="0.05"
                min="0.1"
                max="3"
                value={metadata.width}
                onChange={(e) => updateMetadata('width', parseFloat(e.target.value) || 0.8)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Height (meters)</label>
              <input
                title="Height (meters)"
                type="number"
                step="0.05"
                min="0.1"
                max="3"
                value={metadata.height}
                onChange={(e) => updateMetadata('height', parseFloat(e.target.value) || 0.6)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm text-gray-400 mb-1.5">Initial Wall Placement</label>
              <select
                title="Initial Wall Placement"
                value={metadata.assignedWall}
                onChange={(e) => updateMetadata('assignedWall', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
              >
                {Object.entries(wallsByRoom).map(([room, walls]) => (
                  <optgroup key={room} label={room}>
                    {walls.map((wall) => (
                      <option key={wall.id} value={wall.id}>
                        {wall.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm text-gray-400 mb-1.5">Description</label>
              <textarea
                value={metadata.description}
                onChange={(e) => updateMetadata('description', e.target.value)}
                rows={3}
                placeholder="Describe this artwork..."
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded-lg flex items-start gap-2">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!file || uploading}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            {uploading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Converting to WebP...
              </>
            ) : (
              'Upload Artwork'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

