# Artwork Setup Guide

This guide explains how to add your artwork images to the gallery.

## Quick Start

1. **Prepare your artwork images**
2. **Add them to the public/art/ folder**
3. **Update the artwork data**
4. **Test in the gallery**

## Step 1: Prepare Artwork Images

### Image Requirements

- **Format:** JPG or PNG (JPG recommended for smaller file sizes)
- **Dimensions:** 1024-2048px on the longest side
- **File size:** Under 500KB per image (compress if needed)
- **Aspect ratio:** Any (the gallery will display them correctly)

### Image Optimization Tools

**Online (Free):**
- [TinyPNG](https://tinypng.com/) - Compress PNG/JPG files
- [Squoosh](https://squoosh.app/) - Google's image compression tool
- [CompressJPEG](https://compressjpeg.com/) - Batch compression

**Desktop:**
- Photoshop: File → Export → Save for Web
- GIMP: File → Export As → adjust quality
- Preview (Mac): Tools → Adjust Size

### Recommended Workflow

1. Start with high-quality scans or photos of artworks
2. Crop to just the artwork (or include frame if desired)
3. Resize to 1024-2048px max dimension
4. Save as JPG with 80-90% quality
5. Verify file size is under 500KB

## Step 2: Add Images to Project

### File Naming

Images should be named sequentially to match the code:

```
public/art/
├── artwork-01.jpg
├── artwork-02.jpg
├── artwork-03.jpg
└── ... (up to artwork-15.jpg or more)
```

### For This Project

The project is set up for 15 artworks. You can:
- **Use all 15 slots**: Add artwork-01.jpg through artwork-15.jpg
- **Add more**: Add artwork-16.jpg, artwork-17.jpg, etc. (update `artworks.ts` accordingly)
- **Use fewer**: Remove unused entries from `src/data/artworks.ts`

### Creating Thumbnails (Optional)

For faster loading in the 2D fallback view:

1. Create smaller versions (300-500px wide)
2. Save to `public/art/thumbnails/`
3. Name them identically: `artwork-01.jpg`, etc.

## Step 3: Update Artwork Data

Edit `src/data/artworks.ts` for each artwork:

```typescript
{
  id: 'mountain-sunrise',           // Unique ID
  title: 'Mountain Sunrise',        // Artwork title
  year: 2020,                       // Year created
  medium: 'Oil on Canvas',          // Medium used
  imagePath: '/art/artwork-01.jpg', // ← FILE PATH (must match actual file)

  // Descriptions
  description: 'A breathtaking view of mountains at dawn...',
  personalNote: 'Mom, I remember when you painted this...',

  // 3D Positioning (adjust as needed)
  position: [-7, 1.5, 0],           // [x, y, z] in meters
  rotation: [0, Math.PI/2, 0],      // Rotation
  realSizeMeters: { width: 0.9, height: 0.7 }, // Physical size

  // Organization
  room: 'landscapes',               // Room/section name
  tourStop: 1                       // Include in guided tour (optional)
}
```

### Key Fields to Update

**For Each Artwork:**
1. `imagePath` - Must match the actual filename in `public/art/`
2. `title` - The artwork's title
3. `year` - When it was created
4. `medium` - What materials were used
5. `description` - General description of the artwork
6. `personalNote` - Your personal message about this piece

**Optional:**
- `realSizeMeters` - Adjust if you know the actual physical dimensions
- `position` - Change where it appears on walls
- `tourStop` - Remove to exclude from guided tour

## Step 4: Position Artworks

### Understanding Positions

The `position` array is `[x, y, z]` in meters:
- **X axis**: Left (-) to Right (+)
- **Y axis**: Down (-) to Up (+)  [1.5m is typical eye level]
- **Z axis**: Back (-) to Forward (+)

### Wall Positions

Current gallery layout:
- **West Wall (left)**: x = -7
- **East Wall (right)**: x = 7
- **North Wall (back)**: z = -8.5
- **South Wall (front)**: z = 5-8

### Spacing Artworks

- Artworks should be ~1.5m apart horizontally
- All at ~1.5m height (y = 1.5) for consistency
- Face toward gallery center

### Example Placements

**West Wall (left side):**
```typescript
position: [-7, 1.5, 0]    // Center of west wall
position: [-7, 1.5, -3]   // North section
position: [-7, 1.5, 3]    // South section
```

**East Wall (right side):**
```typescript
position: [7, 1.5, 0]
position: [7, 1.5, -3]
position: [7, 1.5, 3]
```

**North Wall (back):**
```typescript
position: [0, 1.5, -8.5]
position: [-3, 1.5, -8.5]
position: [3, 1.5, -8.5]
```

### Rotations

Artworks must face inward:
- **West wall**: `rotation: [0, Math.PI/2, 0]` (face east)
- **East wall**: `rotation: [0, -Math.PI/2, 0]` (face west)
- **North wall**: `rotation: [0, 0, 0]` (face south)
- **South wall**: `rotation: [0, Math.PI, 0]` (face north)

## Step 5: Test

1. Start the dev server:
   ```bash
   npm run dev
   ```

2. Visit `http://localhost:3000`

3. Check:
   - ✓ All images load correctly
   - ✓ Artworks are positioned well
   - ✓ Inspect mode shows correct info
   - ✓ Guided tour includes featured pieces
   - ✓ 2D fallback view works

## Customizing Further

### Artwork Sizes

Adjust `realSizeMeters` to match physical dimensions:
```typescript
realSizeMeters: {
  width: 1.2,   // 1.2 meters (120cm) wide
  height: 0.9   // 0.9 meters (90cm) tall
}
```

Common sizes in meters:
- Small: 0.4m x 0.3m (40cm x 30cm)
- Medium: 0.7m x 0.5m (70cm x 50cm)
- Large: 1.0m x 0.8m (100cm x 80cm)
- Extra Large: 1.5m x 1.2m (150cm x 120cm)

### Room Categories

Organize by theme:
```typescript
room: 'landscapes'        // Landscape paintings
room: 'abstracts'         // Abstract works
room: 'early-works'       // Earlier pieces
room: 'portraits'         // Portrait paintings
room: 'still-life'        // Still life
```

Update room labels in `src/components/gallery/RoomLabels.tsx` if you change these.

### Guided Tour

To include an artwork in the tour:
```typescript
tourStop: 1  // First stop
tourStop: 2  // Second stop
// etc.
```

Leave undefined to exclude from tour.

Update tour narration in `src/data/galleryTour.ts`.

## Troubleshooting

### Images not appearing

**Problem:** Artwork shows as gray placeholder

**Solutions:**
1. Check filename matches exactly (case-sensitive)
2. Verify file is in `public/art/` folder
3. Check browser console for 404 errors
4. Ensure file extension matches (.jpg vs .jpeg vs .png)

### Images too large/slow

**Problem:** Gallery loads slowly

**Solutions:**
1. Compress images with TinyPNG or Squoosh
2. Reduce image dimensions to 1024-2048px
3. Convert PNG to JPG (usually smaller)
4. Lower quality setting to 80-85%

### Artwork positioned wrong

**Problem:** Artwork floating or stuck in wall

**Solutions:**
1. Check position coordinates
2. Verify rotation matches wall orientation
3. Adjust Y position (height)
4. Test in 3D gallery and adjust

### Personal notes not showing

**Problem:** Personal message missing in inspect mode

**Solutions:**
1. Verify `personalNote` field has content
2. Check for typos in field name
3. Ensure description is different from personalNote

## Need More Help?

Check these files:
- `src/data/artworks.ts` - Artwork data examples
- `src/data/galleryConfig.ts` - Gallery dimensions and settings
- `README.md` - Overall project documentation

## Quick Reference

### File Checklist
- [ ] Images in `public/art/`
- [ ] Named sequentially (artwork-01.jpg, etc.)
- [ ] Compressed/optimized (< 500KB each)
- [ ] Matching entries in `artworks.ts`
- [ ] Titles, years, descriptions filled in
- [ ] Personal notes written
- [ ] Positions set correctly
- [ ] Tested in browser

---

**Remember:** Start with a few artworks and add more gradually. Test frequently to ensure everything looks right!

