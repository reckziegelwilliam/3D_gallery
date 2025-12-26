export interface Artwork {
  id: string;
  title: string;
  year: number;
  medium: string;
  imagePath: string; // e.g., "/art/artwork-01.jpg"

  // Personal story
  description: string;
  personalNote?: string; // Your message to mom

  // 3D placement
  position: [number, number, number]; // xyz in meters
  rotation: [number, number, number]; // euler angles in radians
  realSizeMeters: { width: number; height: number };

  // Theming
  room?: string; // e.g., "landscapes", "early-works", "abstracts"
  tourStop?: number; // Order in guided tour (if featured)
  
  // NEW: Auto-layout system (optional, for future migration)
  assignedWall?: string;  // Wall ID from wall registry
  wallOrder?: number;     // Order on wall (1, 2, 3...)
  heightOffset?: number;  // Optional Y-axis adjustment from wall default
}

export interface GallerySettings {
  quality: 'low' | 'medium' | 'high';
  mouseSensitivity: number; // 0.1 - 2.0
  movementSpeed: number; // 1.0 - 3.0 m/s
  headBobEnabled: boolean;
  audioEnabled: boolean;
  musicEnabled: boolean;
  motionReduced: boolean; // Accessibility mode
}

export interface TourWaypoint {
  id: string;
  position: [number, number, number];
  lookAt: [number, number, number];
  dwellSeconds: number;
  artworkId?: string;
  narration?: string; // Text shown during stop
}

export interface GalleryState {
  // Artwork management
  artworks: Artwork[];
  activeArtworkId: string | null;
  isInspecting: boolean;
  inspectIndex: number; // For next/prev in inspect mode

  // Tour state
  tourActive: boolean;
  currentWaypointIndex: number;

  // Settings
  settings: GallerySettings;

  // Actions
  setActiveArtwork: (id: string | null) => void;
  enterInspectMode: (artworkId: string) => void;
  exitInspectMode: () => void;
  nextArtwork: () => void;
  prevArtwork: () => void;
  startTour: () => void;
  stopTour: () => void;
  advanceTour: () => void;
  updateSettings: (partial: Partial<GallerySettings>) => void;
}

