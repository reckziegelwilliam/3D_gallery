export const GALLERY_CONFIG = {
  // Player settings
  player: {
    eyeHeight: 1.65, // meters
    capsuleRadius: 0.3, // meters
    capsuleHeight: 1.7, // meters
    defaultSpeed: 2.5, // m/s
    jumpForce: 5.0,
  },

  // Gallery dimensions
  gallery: {
    length: 15, // meters
    width: 12, // meters
    wallHeight: 4.5, // meters (increased from 3m for grander feel)
    doorwayHeight: 2.8, // meters (proportionally increased)
    doorwayWidth: 1.2, // meters
  },

  // Artwork placement
  artwork: {
    defaultHeight: 1.5, // meters (eye level)
    minSpacing: 2.5, // meters between artworks (increased for 2x pieces)
    frameThickness: 0.06, // meters (thicker frame for larger artworks)
    frameBorderWidth: 0.15, // meters (thicker border for premium look)
    sizeMultiplier: 2.0, // Scale factor for all artworks (2x larger - statement pieces!)
  },

  // Interaction
  interaction: {
    raycastDistance: 3.0, // meters
    inspectZoomDistance: 1.5, // meters
  },

  // Camera
  camera: {
    fov: 75, // degrees
    near: 0.1,
    far: 100,
    minPitch: -85, // degrees
    maxPitch: 85, // degrees
  },

  // Default settings
  defaultSettings: {
    quality: 'high' as const,
    mouseSensitivity: 1.0,
    movementSpeed: 2.5,
    headBobEnabled: true,
    audioEnabled: true,
    musicEnabled: false,
    motionReduced: false,
  },
};

