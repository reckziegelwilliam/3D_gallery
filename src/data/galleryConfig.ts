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
    wallHeight: 6.0, // meters (increased for grand, spacious feel)
    doorwayHeight: 3.2, // meters (proportionally increased)
    doorwayWidth: 1.2, // meters
  },

  // Artwork placement
  artwork: {
    defaultHeight: 1.5, // meters (eye level)
    minSpacing: 0.8, // meters between artworks (optimized for 40 artworks)
    frameThickness: 0.06, // meters (lighter frame for better performance)
    frameBorderWidth: 0.10, // meters (thinner border for cleaner look)
    sizeMultiplier: 1.0, // Scale factor for all artworks (1.0x - actual size)
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

