import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GalleryState, GallerySettings } from '@/types/gallery';
import { artworks as artworksData } from '@/data/artworks';
import { GALLERY_CONFIG } from '@/data/galleryConfig';
import { autoLayoutGallery } from '@/utils/autoLayout';
import { WALL_REGISTRY } from '@/data/wallDefinitions';

// Process artworks through auto-layout system
console.log('🔄 Starting auto-layout for', artworksData.length, 'artworks...');
const layoutedArtworks = autoLayoutGallery(artworksData, WALL_REGISTRY);

console.log('✨ Auto-layout complete:', layoutedArtworks.length, 'artworks positioned');
console.log('📊 Sample positions:', layoutedArtworks.slice(0, 3).map(a => ({
  id: a.id,
  pos: a.position,
  rot: a.rotation,
})));

export const useGalleryStore = create<GalleryState>()(
  persist(
    (set, get) => ({
      // Initial state
      artworks: layoutedArtworks,
      activeArtworkId: null,
      isInspecting: false,
      inspectIndex: 0,
      tourActive: false,
      currentWaypointIndex: 0,
      settings: GALLERY_CONFIG.defaultSettings,

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
    }),
    {
      name: 'gallery-storage',
      partialize: (state) => ({ settings: state.settings }),
    }
  )
);

