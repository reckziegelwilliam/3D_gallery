# Leslie's Gallery 🎨

A beautiful, immersive 3D virtual art gallery built with Next.js, Three.js, and React Three Fiber. This project creates a realistic virtual space to showcase artwork with first-person exploration, guided tours, and accessible 2D fallback viewing.

## Features

- ✨ **3D Gallery Experience** - First-person walkthrough with realistic physics
- 🖼️ **Artwork Display** - View paintings on walls with proper lighting and framing
- 🔍 **Inspect Mode** - Get close-up views with descriptions and personal notes
- 🎯 **Guided Tour** - Automated tour through featured artworks
- ⚙️ **Settings Panel** - Customize sensitivity, speed, graphics quality, and accessibility options
- 📱 **2D Fallback** - Responsive grid view for devices that don't support WebGL
- 🎨 **Personal Touches** - Room labels, thank you messages, and heartfelt descriptions

## Tech Stack

- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **3D Rendering:** Three.js, React Three Fiber, Drei
- **Physics:** Rapier Physics
- **Post-Processing:** React Three Postprocessing
- **State Management:** Zustand

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or pnpm package manager

### Installation

1. Clone or navigate to this repository:
```bash
cd 3D_gallery
```

2. Install dependencies:
```bash
npm install
```

3. Add your artwork images:
   - Place artwork images in `public/art/` directory
   - Name them as: `artwork-01.jpg`, `artwork-02.jpg`, etc. (matching the `imagePath` in `src/data/artworks.ts`)
   - Recommended format: JPG or PNG
   - Recommended size: 1024-2048px max dimension for optimal performance

4. (Optional) Create thumbnail versions:
   - Place smaller versions in `public/art/thumbnails/` for faster loading in fallback view

5. Customize artwork data:
   - Edit `src/data/artworks.ts` to update titles, descriptions, personal notes, and positions
   - Edit `src/data/galleryTour.ts` to customize the guided tour

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
3D_gallery/
├── app/                      # Next.js app directory
│   ├── page.tsx             # Landing page
│   ├── gallery/             # 3D gallery route
│   └── fallback/            # 2D fallback view
├── src/
│   ├── components/
│   │   ├── gallery/         # 3D gallery components
│   │   └── ui/              # Reusable UI components
│   ├── data/                # Artwork data and configuration
│   ├── hooks/               # Custom React hooks
│   ├── store/               # Zustand state management
│   ├── types/               # TypeScript interfaces
│   └── utils/               # Utility functions
├── public/
│   ├── art/                 # Artwork images (ADD YOUR IMAGES HERE)
│   ├── models/              # 3D models (optional)
│   └── audio/               # Audio files (optional)
└── README.md
```

## Customization

### Adding/Editing Artworks

Edit `src/data/artworks.ts`:

```typescript
{
  id: 'unique-id',
  title: 'Artwork Title',
  year: 2024,
  medium: 'Oil on Canvas',
  imagePath: '/art/artwork-01.jpg',
  description: 'Description of the artwork...',
  personalNote: 'Personal message about this piece...',
  position: [-7, 1.5, 0],  // X, Y, Z coordinates in meters
  rotation: [0, Math.PI/2, 0],  // Rotation angles
  realSizeMeters: { width: 0.9, height: 0.7 },  // Physical size
  room: 'landscapes',
  tourStop: 1  // Optional: include in guided tour
}
```

### Modifying Gallery Layout

The gallery uses a procedural layout defined in `src/components/gallery/ProceduralGallery.tsx`. You can:
- Adjust wall positions
- Change gallery dimensions (edit `GALLERY_CONFIG` in `src/data/galleryConfig.ts`)
- Replace with a Blender model (export as GLB to `public/models/gallery.glb`)

### Customizing the Tour

Edit `src/data/galleryTour.ts` to modify tour waypoints, narration, and timing.

### Adjusting Colors and Styling

Modify Tailwind colors in `tailwind.config.ts`:

```typescript
colors: {
  gallery: {
    cream: '#F5F1E8',
    gold: '#D4AF37',
    // ... customize colors
  }
}
```

## Controls

### 3D Gallery
- **WASD / Arrow Keys** - Move around
- **Mouse** - Look around (click to lock pointer)
- **E** - Inspect artwork up close
- **M** - Open settings menu
- **ESC** - Exit inspect mode / Close menus
- **Arrow Keys** - Navigate between artworks in inspect mode

### 2D Fallback
- **Click** artwork cards to view details
- Fully responsive and touch-friendly

## Deployment

### Deploy to Vercel

1. Push your code to a Git repository (GitHub, GitLab, Bitbucket)

2. Go to [vercel.com](https://vercel.com) and sign in

3. Click "New Project" and import your repository

4. Vercel will auto-detect Next.js and configure build settings

5. Click "Deploy"

Your gallery will be live at `your-project.vercel.app`

### Custom Domain (Optional)

In Vercel project settings, you can add a custom domain for a more personal touch.

## Performance Tips

1. **Optimize Images:**
   - Use JPG format for artwork images
   - Compress images (tools: TinyPNG, Squoosh)
   - Keep max dimension around 1024-2048px

2. **Graphics Settings:**
   - Users with older devices can lower quality in settings
   - Motion-reduced mode disables post-processing effects

3. **Loading:**
   - The app loads progressively
   - Textures are loaded on-demand

## Accessibility

- WebGL detection with automatic fallback to 2D view
- Motion-reduced mode for users sensitive to animations
- Keyboard navigation throughout
- Alt text for images
- Settings persistence via localStorage

## Browser Support

- **Recommended:** Chrome, Firefox, Edge, Safari (latest versions)
- **3D Gallery:** Requires WebGL 2.0 support
- **Fallback View:** Works on all modern browsers and mobile devices

## Troubleshooting

### Artwork not appearing
- Check that image files exist in `public/art/`
- Verify file names match `imagePath` in `artworks.ts`
- Check browser console for loading errors

### Performance issues
- Lower graphics quality in settings
- Enable motion-reduced mode
- Reduce image file sizes
- Try the 2D fallback view

### Controls not working
- Click on the canvas to enable pointer lock
- Check that you're not in inspect mode or tour mode
- Try refreshing the page

## Future Enhancements

- [ ] Blender gallery model for more realistic environment
- [ ] Audio system (ambient sounds, footsteps, music)
- [ ] VR support
- [ ] Mobile touch controls for 3D view
- [ ] Guest book feature
- [ ] Admin panel for artwork management

## License

This is a personal project created as a gift. Feel free to use and modify for your own purposes.

## Credits

Built with love for Leslie 💝

**Technologies:**
- [Next.js](https://nextjs.org/)
- [Three.js](https://threejs.org/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand](https://github.com/pmndrs/zustand)

---

*Merry Christmas 2024* 🎄

