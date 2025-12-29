/**
 * Image Optimization Script
 * 
 * Converts PNG artwork images to WebP format and generates thumbnails.
 * Run with: npm run optimize-images
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const INPUT_DIR = path.join(__dirname, '../public/art');
const THUMBNAIL_DIR = path.join(INPUT_DIR, 'thumbnails');

// Configuration
const CONFIG = {
  webp: {
    quality: 85,        // Balance between quality and file size
    effort: 6,          // Compression effort (0-6)
  },
  thumbnail: {
    width: 256,         // Thumbnail width in pixels
    quality: 75,        // Lower quality for thumbnails
  },
};

async function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
}

async function processImage(filename) {
  const inputPath = path.join(INPUT_DIR, filename);
  const baseName = path.parse(filename).name;
  
  // Output paths
  const webpPath = path.join(INPUT_DIR, `${baseName}.webp`);
  const thumbnailPath = path.join(THUMBNAIL_DIR, `${baseName}.webp`);

  try {
    // Get original file stats for comparison
    const originalStats = fs.statSync(inputPath);
    const originalSize = originalStats.size;

    // Convert to WebP (full resolution)
    await sharp(inputPath)
      .webp({ quality: CONFIG.webp.quality, effort: CONFIG.webp.effort })
      .toFile(webpPath);

    const webpStats = fs.statSync(webpPath);
    const webpSize = webpStats.size;
    const savings = ((1 - webpSize / originalSize) * 100).toFixed(1);

    // Generate thumbnail
    await sharp(inputPath)
      .resize({ width: CONFIG.thumbnail.width, withoutEnlargement: true })
      .webp({ quality: CONFIG.thumbnail.quality })
      .toFile(thumbnailPath);

    const thumbStats = fs.statSync(thumbnailPath);

    console.log(
      `✓ ${filename}: ` +
      `${(originalSize / 1024).toFixed(0)}KB → ${(webpSize / 1024).toFixed(0)}KB ` +
      `(${savings}% smaller), thumb: ${(thumbStats.size / 1024).toFixed(0)}KB`
    );

    return {
      original: originalSize,
      webp: webpSize,
      thumbnail: thumbStats.size,
    };
  } catch (error) {
    console.error(`✗ Error processing ${filename}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🖼️  Image Optimization Script\n');
  console.log(`Input directory: ${INPUT_DIR}`);
  console.log(`Thumbnail directory: ${THUMBNAIL_DIR}\n`);

  // Ensure thumbnail directory exists
  await ensureDirectoryExists(THUMBNAIL_DIR);

  // Find all PNG files
  const files = fs.readdirSync(INPUT_DIR)
    .filter(f => f.endsWith('.png') && !f.startsWith('.'));

  if (files.length === 0) {
    console.log('No PNG files found to process.');
    return;
  }

  console.log(`Found ${files.length} PNG files to process.\n`);

  // Process all images
  const results = [];
  for (const file of files) {
    const result = await processImage(file);
    if (result) results.push(result);
  }

  // Summary
  console.log('\n📊 Summary:');
  const totalOriginal = results.reduce((sum, r) => sum + r.original, 0);
  const totalWebp = results.reduce((sum, r) => sum + r.webp, 0);
  const totalThumbnails = results.reduce((sum, r) => sum + r.thumbnail, 0);

  console.log(`   Original PNGs: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   WebP files:    ${(totalWebp / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   Thumbnails:    ${(totalThumbnails / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   Total savings: ${((1 - totalWebp / totalOriginal) * 100).toFixed(1)}%`);
  console.log(`\n✅ Processed ${results.length} images successfully!`);
}

main().catch(console.error);

