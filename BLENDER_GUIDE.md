# Blender Gallery Model Creation Guide

This guide will walk you through creating a realistic 3D gallery model in Blender to replace the procedural gallery.

## Prerequisites

- Blender 3.6+ installed (Download from [blender.org](https://www.blender.org))
- Basic Blender navigation knowledge (optional but helpful)

## Step-by-Step Guide

### 1. Setup

1. Open Blender
2. Delete the default cube (Select it, press X, confirm delete)
3. Set units to Metric:
   - Go to Scene Properties (right panel, camera icon)
   - Under "Units", set "Unit System" to "Metric"
   - Set "Length" to "Meters"

### 2. Create the Floor

1. Add a plane: `Shift + A` → Mesh → Plane
2. Scale it: Press `S`, type `12`, press `Enter` (for 12m x 12m)
3. In Edit Mode (`Tab`):
   - Select all (`A`)
   - Right-click → Subdivide (repeat 2-3 times for detail)
4. Name it "Floor" in the Outliner

### 3. Create the Walls

**For each wall (4 total):**

1. Add a cube: `Shift + A` → Mesh → Cube
2. Scale and position:
   
   **West Wall (Left):**
   - Scale: S → X → 0.1 (thin), S → Z → 1.5 (3m high)
   - Position: G → X → -7.5 (edge of floor)
   
   **East Wall (Right):**
   - Same scaling as West
   - Position: G → X → 7.5
   
   **North Wall (Back):**
   - Scale: S → Y → 0.1, S → Z → 1.5
   - Position: G → Y → -6
   
   **South Wall (Front with entrance):**
   - Create two smaller wall sections for an entrance opening
   - Each section: Width ~3m, gap in the middle ~2m
   - Position on either side of center

3. Name each wall in the Outliner

### 4. Create the Ceiling

1. Duplicate the floor: Select floor, `Shift + D`
2. Move up: `G` → `Z` → `3` (3 meters high)
3. Name it "Ceiling"

### 5. Create Partial Divider Walls (Optional)

Create interior partial walls to divide the space into "rooms":

1. Add cubes, make them thin (like walls)
2. Position to create sections (e.g., divide left and right areas)
3. Leave archway openings (don't connect to far wall)

### 6. Materials

#### Floor Material:
1. Select floor
2. Switch to Shading workspace (top tabs)
3. In Shader Editor, add Principled BSDF
4. Settings:
   - Base Color: #8B7355 (wood brown)
   - Roughness: 0.7
   - Metallic: 0.1

#### Wall Material:
1. Select walls
2. Principled BSDF settings:
   - Base Color: #FAF9F6 (off-white)
   - Roughness: 0.9
   - Metallic: 0

#### Ceiling Material:
1. Similar to walls
2. Base Color: #F5F1E8 (cream)
3. Roughness: 0.95

### 7. Add Lighting (for baking)

1. Add Area Lights above where artworks will hang:
   - `Shift + A` → Light → Area Light
   - Position ~2.5m high, angle toward wall (R → X → 45 degrees)
   - Energy: 100-150W
   - Size: 0.5m

2. Add 3-5 ceiling lights:
   - Point Lights at ~2.8m height
   - Energy: 50-100W
   - Spread evenly across ceiling

3. Add HDRI environment:
   - Go to World Properties (globe icon)
   - Click "Use Nodes"
   - Add → Texture → Environment Texture
   - Load an HDRI (find free HDRIs at [polyhaven.com](https://polyhaven.com))

### 8. Optional: Bake Lighting (Advanced)

Baking improves performance by pre-calculating lighting:

1. Switch to Cycles renderer (Render Properties → Render Engine → Cycles)
2. For each object:
   - In Edit Mode, unwrap UVs: `U` → "Smart UV Project"
   - Add an Image Texture node (don't connect it yet)
   - Create a new image: New → 1024x1024 → OK
3. Select object, select the new image texture
4. Go to Render Properties → Bake
5. Bake Type: "Indirect Lighting" or "Combined"
6. Click "Bake"
7. After baking, save the image and connect it to the shader

*(Baking is optional and requires more Blender knowledge. The model works fine without it.)*

### 9. Create Collision Meshes

For physics to work, create simplified collision geometry:

1. Duplicate each wall/floor (`Shift + D`, cancel, rename)
2. Name with prefix "collision_" (e.g., "collision_floor")
3. Simplify geometry (you can use simple boxes)
4. Make sure these cover the areas where the player shouldn't walk

### 10. Export as GLB

1. Select all objects (gallery mesh AND collision mesh)
2. `File` → `Export` → `glTF 2.0 (.glb/.gltf)`
3. Export settings:
   - Format: **GLB (binary)**
   - Include: **Selected Objects** (checked)
   - Transform: **+Y Up** (checked)
   - Geometry:
     - Apply Modifiers: checked
     - UVs: checked
     - Normals: checked
   - Compression: **Draco** (optional, reduces file size)
4. Navigate to your project: `public/models/`
5. Name it: `gallery.glb`
6. Click "Export glTF 2.0"

### 11. Update the Code

Once you have `gallery.glb` in `public/models/`, replace the procedural gallery:

1. Open `src/components/gallery/GalleryModel.tsx` (create if it doesn't exist):

```typescript
'use client';

import { useGLTF } from '@react-three/drei';
import { RigidBody, CuboidCollider } from '@react-three/rapier';

export function GalleryModel() {
  const { scene, nodes } = useGLTF('/models/gallery.glb');

  return (
    <>
      {/* Render visible gallery */}
      <primitive object={scene} />

      {/* Add collision meshes */}
      {Object.entries(nodes)
        .filter(([name]) => name.startsWith('collision_'))
        .map(([name, mesh]: [string, any]) => (
          <RigidBody key={name} type="fixed" colliders={false}>
            <CuboidCollider
              args={[
                mesh.geometry.boundingBox.max.x - mesh.geometry.boundingBox.min.x,
                mesh.geometry.boundingBox.max.y - mesh.geometry.boundingBox.min.y,
                mesh.geometry.boundingBox.max.z - mesh.geometry.boundingBox.min.z
              ]}
              position={mesh.position.toArray()}
            />
          </RigidBody>
        ))}
    </>
  );
}

useGLTF.preload('/models/gallery.glb');
```

2. Update `src/components/gallery/GalleryCanvas.tsx`:
   - Replace `<ProceduralGallery />` with `<GalleryModel />`

## Tips

- **Keep it simple**: A basic rectangular room works great
- **Test early**: Export and test in your app frequently
- **File size**: Keep GLB under 5MB for good load times
- **Collision meshes**: Use simple boxes for better performance
- **Lighting**: If not baking, fewer lights = better performance

## Troubleshooting

**Model not appearing:**
- Check the file path is correct: `public/models/gallery.glb`
- Verify the model exported correctly (re-export with different settings)
- Check browser console for errors

**Model too dark/bright:**
- Adjust the Environment intensity in `GalleryEnvironment.tsx`
- Add more lights in Blender before exporting

**Player falling through floor:**
- Ensure collision meshes are included
- Check collision mesh names start with "collision_"
- Verify collision geometry covers the floor area

**Model too large/small:**
- Check Blender units are set to Metric (meters)
- Scale the entire model in Blender before exporting
- Each unit in Blender = 1 meter in the app

## Resources

- [Blender Manual](https://docs.blender.org/)
- [Blender Fundamentals](https://www.youtube.com/playlist?list=PLa1F2ddGya_-UvuAqHAksYnB0qL9yWDO6)
- [Three.js and Blender Guide](https://threejs.org/docs/#manual/en/introduction/Loading-3D-models)
- [Free HDRIs](https://polyhaven.com/hdris)

---

**Note:** The procedural gallery already works well! Creating a Blender model is optional and provides a more polished, custom look. Don't feel pressured to create one if you're unfamiliar with 3D modeling.

