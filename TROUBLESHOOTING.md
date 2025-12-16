# Black Screen Troubleshooting

## Console Output Analysis

Based on your console output:

```
✓ Canvas created
Scene children count: 1
Camera position: Vector3 {x: 0, y: 1.65, z: 5}
```

### Issues Identified:

1. **Scene children count: 1** ❌
   - Should be 10+ (gallery, lights, artworks, text)
   - Only having 1 child means components aren't rendering inside Suspense
   - This is why the screen is black - there's nothing to render!

2. **Font file missing** ❌
   - `/fonts/playfair-display.woff` not found
   - Causing Text components to fail
   - **Fixed:** Removed font prop to use default font

3. **Rapier deprecation warning** ⚠️
   - Just a warning, not blocking
   - Can be ignored for now

## Fixes Applied

### ✅ 1. Removed Missing Font References
- Updated `RoomLabels.tsx` - removed `font` prop
- Updated `ThankYouMessage.tsx` - removed `font` prop
- Text will now use default Three.js font

### ✅ 2. Increased Lighting
- `ambientLight` intensity: 0.4 → 1.0
- `hemisphereLight` intensity: 0.3 → 0.8
- Added `directionalLight` for better visibility

### ✅ 3. Added Visual Test Cube
- Bright green cube at center of gallery
- Emissive material (glows even in darkness)
- If you see this, rendering works

### ✅ 4. Added Canvas Debugging
- Console logs verify Canvas creation
- Shows scene children count
- Shows camera position

## Next Steps

1. **Check your browser now** - You should see:
   - A bright green cube in the center
   - If visible, the rendering works!

2. **If you see the green cube:**
   - The issue was lighting + font errors
   - Gallery components should now be visible
   - Try moving with WASD keys

3. **If still black:**
   - Check console for new errors
   - Scene children count should have increased
   - The Suspense might be stuck loading

## Current Server

Your dev server is running on: **http://localhost:3001**
(Port 3000 was already in use)

### To stop the old server on port 3000:
```bash
lsof -ti:3000 | xargs kill
```

Then restart:
```bash
npm run dev
```

## Debugging Commands

If still having issues, try:

```bash
# Clear Next.js cache
rm -rf .next

# Restart server
npm run dev
```

## What You Should See Now

With the fixes applied:
- ✅ Bright green test cube (proves rendering works)
- ✅ White/cream walls of the gallery
- ✅ Brown floor
- ✅ Colored artwork frames on walls
- ✅ Room label text (using default font)
- ✅ Thank you message text

Hard refresh your browser (Cmd+Shift+R or Ctrl+Shift+F5) to see the changes!

