import { create } from 'zustand';
import { persist, StorageValue } from 'zustand/middleware';
import { GalleryState, GallerySettings, ArtworkPlacement, Artwork, UploadedArtwork } from '@/types/gallery';
import { artworks as artworksData } from '@/data/artworks';
import { GALLERY_CONFIG } from '@/data/galleryConfig';
import { autoLayoutGallery } from '@/utils/autoLayout';
import { WALL_REGISTRY } from '@/data/wallDefinitions';

// Process artworks through auto-layout system
console.log('🔄 Starting auto-layout for', artworksData.length, 'artworks...');
const defaultLayoutedArtworks = autoLayoutGallery(artworksData, WALL_REGISTRY);

console.log('✨ Auto-layout complete:', defaultLayoutedArtworks.length, 'artworks positioned');
console.log('📊 Sample positions:', defaultLayoutedArtworks.slice(0, 3).map(a => ({
  id: a.id,
  pos: a.position,
  rot: a.rotation,
})));

// Helper to apply saved placements to artworks
function applyPlacements(artworks: Artwork[], placements: ArtworkPlacement[]): Artwork[] {
  return artworks.map(art => {
    const placement = placements.find(p => p.id === art.id);
    if (placement) {
      return {
        ...art,
        assignedWall: placement.assignedWall ?? art.assignedWall,
        wallOrder: placement.wallOrder ?? art.wallOrder,
        heightOffset: placement.heightOffset ?? art.heightOffset,
      };
    }
    return art;
  });
}

// Helper to extract placements from artworks
function extractPlacements(artworks: Artwork[]): ArtworkPlacement[] {
  return artworks.map(({ id, assignedWall, wallOrder, heightOffset }) => ({
    id,
    assignedWall,
    wallOrder,
    heightOffset,
  }));
}

// Helper to extract uploaded artwork data for persistence
function extractUploadedArtworks(artworks: Artwork[]): UploadedArtwork[] {
  return artworks
    .filter((art): art is Artwork & { isUploaded: true } => 
      'isUploaded' in art && art.isUploaded === true
    )
    .map(({ position, rotation, ...rest }) => rest);
}

// Helper to convert uploaded artwork back to full artwork with positions
function uploadedToArtwork(uploaded: UploadedArtwork): Artwork {
  return {
    ...uploaded,
    position: [0, 0, 0] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
  };
}

// Type for persisted state
interface PersistedState {
  settings: GallerySettings;
  artworkPlacements: ArtworkPlacement[];
  uploadedArtworks: UploadedArtwork[];
}

export const useGalleryStore = create<GalleryState>()(
  persist(
    (set, get) => ({
      // Initial state
      artworks: defaultLayoutedArtworks,
      activeArtworkId: null,
      isInspecting: false,
      inspectIndex: 0,
      tourActive: false,
      currentWaypointIndex: 0,
      settings: GALLERY_CONFIG.defaultSettings,
      isAdminMode: false,

      // Actions
      setActiveArtwork: (id: string | null) => {
        set({ activeArtworkId: id });
      },

      enterInspectMode: (artworkId: string) => {
        const artworks = get().artworks;
        const index = artworks.findIndex((a) => a.id === artworkId);
        if (index !== -1) {
          set({
            activeArtworkId: artworkId,
            isInspecting: true,
            inspectIndex: index,
          });
        }
      },

      exitInspectMode: () => {
        set({
          isInspecting: false,
          activeArtworkId: null,
        });
      },

      nextArtwork: () => {
        const { artworks, inspectIndex } = get();
        const nextIndex = (inspectIndex + 1) % artworks.length;
        const nextArtwork = artworks[nextIndex];
        set({
          inspectIndex: nextIndex,
          activeArtworkId: nextArtwork.id,
        });
      },

      prevArtwork: () => {
        const { artworks, inspectIndex } = get();
        const prevIndex =
          inspectIndex === 0 ? artworks.length - 1 : inspectIndex - 1;
        const prevArtwork = artworks[prevIndex];
        set({
          inspectIndex: prevIndex,
          activeArtworkId: prevArtwork.id,
        });
      },

      startTour: () => {
        set({
          tourActive: true,
          currentWaypointIndex: 0,
        });
      },

      stopTour: () => {
        set({
          tourActive: false,
          currentWaypointIndex: 0,
        });
      },

      advanceTour: () => {
        const { currentWaypointIndex } = get();
        set({
          currentWaypointIndex: currentWaypointIndex + 1,
        });
      },

      updateSettings: (partial: Partial<GallerySettings>) => {
        set((state) => ({
          settings: {
            ...state.settings,
            ...partial,
          },
        }));
      },

      // Admin actions
      setAdminMode: (enabled: boolean) => {
        set({ isAdminMode: enabled });
      },

      updateArtworkWall: (artworkId: string, wallId: string, wallOrder: number) => {
        const { artworks } = get();
        const updated = artworks.map(art =>
          art.id === artworkId
            ? { ...art, assignedWall: wallId, wallOrder }
            : art
        );
        // Re-run auto-layout to recalculate positions
        const layouted = autoLayoutGallery(updated, WALL_REGISTRY);
        set({ artworks: layouted });
      },

      updateArtworkHeight: (artworkId: string, heightOffset: number) => {
        const { artworks } = get();
        const updated = artworks.map(art =>
          art.id === artworkId
            ? { ...art, heightOffset }
            : art
        );
        // Re-run auto-layout to recalculate positions
        const layouted = autoLayoutGallery(updated, WALL_REGISTRY);
        set({ artworks: layouted });
      },

      resetToDefaults: () => {
        set({ artworks: autoLayoutGallery(artworksData, WALL_REGISTRY) });
      },

      exportLayout: () => {
        const { artworks } = get();
        const placements = extractPlacements(artworks);
        return JSON.stringify(placements, null, 2);
      },

      importLayout: (json: string) => {
        try {
          const placements = JSON.parse(json) as ArtworkPlacement[];
          const { artworks } = get();
          // Keep uploaded artworks and apply placements to all
          const uploadedArtworks = artworks.filter(a => 'isUploaded' in a && a.isUploaded);
          const allArtworks = [...artworksData, ...uploadedArtworks];
          const merged = applyPlacements(allArtworks, placements);
          const layouted = autoLayoutGallery(merged, WALL_REGISTRY);
          set({ artworks: layouted });
          return true;
        } catch (e) {
          console.error('Failed to import layout:', e);
          return false;
        }
      },

      // Artwork CRUD actions
      addArtwork: (artwork: Artwork) => {
        const { artworks } = get();
        // Check for duplicate ID
        if (artworks.some(a => a.id === artwork.id)) {
          console.warn(`Artwork with ID "${artwork.id}" already exists`);
          return;
        }
        // Add the artwork and re-run layout
        const updated = [...artworks, { ...artwork, isUploaded: true } as Artwork];
        const layouted = autoLayoutGallery(updated, WALL_REGISTRY);
        set({ artworks: layouted });
      },

      removeArtwork: (artworkId: string) => {
        const { artworks } = get();
        const updated = artworks.filter(a => a.id !== artworkId);
        const layouted = autoLayoutGallery(updated, WALL_REGISTRY);
        set({ artworks: layouted });
      },
    }),
    {
      name: 'gallery-storage',
      partialize: (state): PersistedState => ({
        settings: state.settings,
        artworkPlacements: extractPlacements(state.artworks),
        uploadedArtworks: extractUploadedArtworks(state.artworks),
      }),
      merge: (persisted, current) => {
        const persistedState = persisted as StorageValue<PersistedState> | undefined;
        if (persistedState?.state) {
          const { artworkPlacements = [], uploadedArtworks = [], settings } = persistedState.state;
          
          // Combine default artworks with uploaded artworks
          const uploadedAsArtworks = uploadedArtworks.map(uploadedToArtwork);
          const allArtworks = [...artworksData, ...uploadedAsArtworks];
          
          // Apply placements to all artworks
          const merged = applyPlacements(allArtworks, artworkPlacements);
          const layouted = autoLayoutGallery(merged, WALL_REGISTRY);
          
          return {
            ...current,
            settings: settings ?? current.settings,
            artworks: layouted,
          };
        }
        return current;
      },
    }
  )
);

