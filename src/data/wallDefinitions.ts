/**
 * Wall Definition Types
 */
export type WallDefinition = {
  id: string;
  room: string;
  name: string;
  // Wall position and orientation
  position: [number, number, number];  // Center point
  rotation: [number, number, number];  // Wall rotation
  normal: [number, number, number];    // Direction artwork faces (into room)
  // Dimensions and constraints
  length: number;  // Usable length for artworks
  axis: 'x' | 'z';  // Which axis artworks are arranged along
  minPos: number;   // Start position along axis
  maxPos: number;   // End position along axis
  // Doorway exclusion zones
  avoidZones?: Array<{ min: number; max: number; reason: string }>;
};

/**
 * Complete wall registry for the gallery
 */
export const WALL_REGISTRY: WallDefinition[] = [
  // ROOM 1: Entrance Gallery
  {
    id: 'room1-west',
    room: 'Room 1',
    name: 'West Wall',
    position: [-3.5, 1.5, 3],
    rotation: [0, Math.PI / 2, 0],
    normal: [1, 0, 0],  // Artwork faces +X (east, into room)
    length: 5,
    axis: 'z',
    minPos: 0.5,
    maxPos: 5.5,
    avoidZones: [{ min: 0.3, max: 0.7, reason: 'North archway proximity' }],
  },
  {
    id: 'room1-east',
    room: 'Room 1',
    name: 'East Wall',
    position: [3.5, 1.5, 3],
    rotation: [0, -Math.PI / 2, 0],
    normal: [-1, 0, 0],  // Artwork faces -X (west, into room)
    length: 5,
    axis: 'z',
    minPos: 0.5,
    maxPos: 5.5,
    avoidZones: [{ min: 0.3, max: 0.7, reason: 'North archway proximity' }],
  },
  {
    id: 'room1-south-left',
    room: 'Room 1',
    name: 'South Wall (Left Section)',
    position: [-2.5, 1.5, 5.5],
    rotation: [0, Math.PI, 0],
    normal: [0, 0, -1],  // Artwork faces -Z (north, into room)
    length: 2.5,
    axis: 'x',
    minPos: -3.8,
    maxPos: -1.3,
  },
  {
    id: 'room1-south-right',
    room: 'Room 1',
    name: 'South Wall (Right Section)',
    position: [2.5, 1.5, 5.5],
    rotation: [0, Math.PI, 0],
    normal: [0, 0, -1],  // Artwork faces -Z (north, into room)
    length: 2.5,
    axis: 'x',
    minPos: 1.3,
    maxPos: 3.8,
  },
  {
    id: 'room1-north-left',
    room: 'Room 1',
    name: 'North Wall (Left Section)',
    position: [-2.5, 1.5, 0.5],
    rotation: [0, 0, 0],
    normal: [0, 0, 1],  // Artwork faces +Z (south, into room)
    length: 2,
    axis: 'x',
    minPos: -3.5,
    maxPos: -1.5,
  },
  {
    id: 'room1-north-right',
    room: 'Room 1',
    name: 'North Wall (Right Section)',
    position: [2.5, 1.5, 0.5],
    rotation: [0, 0, 0],
    normal: [0, 0, 1],  // Artwork faces +Z (south, into room)
    length: 2,
    axis: 'x',
    minPos: 1.5,
    maxPos: 3.5,
  },
  
  // ROOM 2: Abstract Wing
  {
    id: 'room2-west',
    room: 'Room 2',
    name: 'West Wall',
    position: [-7.5, 1.5, -3.5],
    rotation: [0, Math.PI / 2, 0],
    normal: [1, 0, 0],  // Artwork faces +X (east, into room)
    length: 5,
    axis: 'z',
    minPos: -6,
    maxPos: -1,
  },
  {
    id: 'room2-north',
    room: 'Room 2',
    name: 'North Wall (Left Section)',
    position: [-6.5, 1.5, -6.0],
    rotation: [0, 0, 0],
    normal: [0, 0, 1],  // Artwork faces +Z (south, into room)
    length: 2,
    axis: 'x',
    minPos: -7.5,
    maxPos: -5.5,
  },
  {
    id: 'room2-divider',
    room: 'Room 2',
    name: 'East Divider (to Room 3)',
    position: [-2.5, 1.5, -3.5],
    rotation: [0, -Math.PI / 2, 0],
    normal: [-1, 0, 0],  // Artwork faces -X (west, into Room 2)
    length: 5,
    axis: 'z',
    minPos: -6,
    maxPos: -1,
  },
  {
    id: 'room2-south',
    room: 'Room 2',
    name: 'South Wall (Left Section)',
    position: [-6.5, 1.5, -1.0],
    rotation: [0, Math.PI, 0],
    normal: [0, 0, -1],  // Artwork faces -Z (north, into room)
    length: 2,
    axis: 'x',
    minPos: -7.5,
    maxPos: -5.5,
  },
  
  // ROOM 3: Early Works
  {
    id: 'room3-east',
    room: 'Room 3',
    name: 'East Wall',
    position: [7.5, 1.5, -3.5],
    rotation: [0, -Math.PI / 2, 0],
    normal: [-1, 0, 0],  // Artwork faces -X (west, into room)
    length: 5,
    axis: 'z',
    minPos: -6,
    maxPos: -1,
  },
  {
    id: 'room3-north',
    room: 'Room 3',
    name: 'North Wall (Right Section)',
    position: [6.5, 1.5, -6.0],
    rotation: [0, 0, 0],
    normal: [0, 0, 1],  // Artwork faces +Z (south, into room)
    length: 2,
    axis: 'x',
    minPos: 5.5,
    maxPos: 7.5,
  },
  {
    id: 'room3-divider',
    room: 'Room 3',
    name: 'West Divider (to Room 2)',
    position: [-2.5, 1.5, -3.5],
    rotation: [0, Math.PI / 2, 0],
    normal: [1, 0, 0],  // Artwork faces +X (east, into Room 3)
    length: 5,
    axis: 'z',
    minPos: -6,
    maxPos: -1,
  },
  {
    id: 'room3-south',
    room: 'Room 3',
    name: 'South Wall (Right Section)',
    position: [6.5, 1.5, -1.0],
    rotation: [0, Math.PI, 0],
    normal: [0, 0, -1],  // Artwork faces -Z (north, into room)
    length: 2,
    axis: 'x',
    minPos: 5.5,
    maxPos: 7.5,
  },
  
  // ROOM 4: Feature Gallery
  {
    id: 'room4-west',
    room: 'Room 4',
    name: 'West Wall',
    position: [-2.5, 1.5, -10.5],
    rotation: [0, Math.PI / 2, 0],
    normal: [1, 0, 0],  // Artwork faces +X (east, into room)
    length: 7,
    axis: 'z',
    minPos: -14,
    maxPos: -7,
  },
  {
    id: 'room4-east',
    room: 'Room 4',
    name: 'East Wall',
    position: [2.5, 1.5, -10.5],
    rotation: [0, -Math.PI / 2, 0],
    normal: [-1, 0, 0],  // Artwork faces -X (west, into room)
    length: 7,
    axis: 'z',
    minPos: -14,
    maxPos: -7,
  },
  {
    id: 'room4-north',
    room: 'Room 4',
    name: 'North Wall (Back)',
    position: [0, 2.0, -14.0],
    rotation: [0, 0, 0],
    normal: [0, 0, 1],  // Artwork faces +Z (south, into room)
    length: 5,
    axis: 'x',
    minPos: -2.5,
    maxPos: 2.5,
  },
  {
    id: 'room4-south-left',
    room: 'Room 4',
    name: 'South Wall (Left Section)',
    position: [-1.5, 1.5, -7.0],
    rotation: [0, Math.PI, 0],
    normal: [0, 0, -1],  // Artwork faces -Z (north, into room)
    length: 2,
    axis: 'x',
    minPos: -2.5,
    maxPos: -0.5,
  },
  {
    id: 'room4-south-right',
    room: 'Room 4',
    name: 'South Wall (Right Section)',
    position: [1.5, 1.5, -7.0],
    rotation: [0, Math.PI, 0],
    normal: [0, 0, -1],  // Artwork faces -Z (north, into room)
    length: 2,
    axis: 'x',
    minPos: 0.5,
    maxPos: 2.5,
  },
];

