import { NextRequest, NextResponse } from 'next/server';

// Dynamic import of sharp to prevent bundling in serverless functions
// This route only works in development (Vercel has read-only filesystem)
const getSharp = async () => {
  const sharp = await import('sharp');
  return sharp.default;
};

export async function POST(request: NextRequest) {
  // Check if we're in production (Vercel) - uploads won't work due to read-only filesystem
  if (process.env.VERCEL) {
    return NextResponse.json(
      { error: 'File uploads are not supported in production. Use local development or configure cloud storage.' },
      { status: 501 }
    );
  }

  // Dynamic imports for development only
  const { writeFile, mkdir } = await import('fs/promises');
  const { existsSync } = await import('fs');
  const path = await import('path');
  const sharp = await getSharp();

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const ART_DIR = path.join(process.cwd(), 'public', 'art');
  const THUMB_DIR = path.join(ART_DIR, 'thumbnails');

  // WebP conversion settings (matching scripts/optimize-images.js)
  const WEBP_CONFIG = {
    quality: 85,
    effort: 6,
  };

  const THUMBNAIL_CONFIG = {
    width: 256,
    quality: 75,
  };

  try {
    // Check auth cookie
    const adminCookie = request.cookies.get('gallery-admin-session');
    if (adminCookie?.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const metadataStr = formData.get('metadata') as string | null;

    // Validate file exists
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type. Allowed: JPEG, PNG, WebP, GIF` },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    // Parse metadata
    let metadata: Record<string, unknown> = {};
    if (metadataStr) {
      try {
        metadata = JSON.parse(metadataStr);
      } catch {
        return NextResponse.json({ error: 'Invalid metadata JSON' }, { status: 400 });
      }
    }

    // Generate unique filename from ID or timestamp
    const timestamp = Date.now();
    const rawId = (metadata.id as string) || `artwork-${timestamp}`;
    // Sanitize ID: lowercase, replace non-alphanumeric with hyphens
    const safeId = rawId
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    const filename = `${safeId}.webp`;
    const thumbFilename = `${safeId}.webp`;

    // Check for existing file with same name
    const fullPath = path.join(ART_DIR, filename);
    if (existsSync(fullPath)) {
      // Append timestamp to make unique
      const uniqueId = `${safeId}-${timestamp}`;
      const uniqueFilename = `${uniqueId}.webp`;
      return NextResponse.json(
        { error: `File "${filename}" already exists. Suggested ID: ${uniqueId}` },
        { status: 409 }
      );
    }

    // Ensure directories exist
    if (!existsSync(ART_DIR)) {
      await mkdir(ART_DIR, { recursive: true });
    }
    if (!existsSync(THUMB_DIR)) {
      await mkdir(THUMB_DIR, { recursive: true });
    }

    // Read file buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Validate image and get dimensions using Sharp
    let imageInfo: { width?: number; height?: number };
    try {
      imageInfo = await sharp(buffer).metadata();
    } catch {
      return NextResponse.json(
        { error: 'Invalid or corrupt image file' },
        { status: 400 }
      );
    }

    if (!imageInfo.width || !imageInfo.height) {
      return NextResponse.json(
        { error: 'Could not determine image dimensions' },
        { status: 400 }
      );
    }

    // Convert to WebP (full resolution)
    console.log(`📸 Converting ${file.name} to WebP...`);
    const webpBuffer = await sharp(buffer)
      .webp({ quality: WEBP_CONFIG.quality, effort: WEBP_CONFIG.effort })
      .toBuffer();

    // Generate thumbnail
    console.log(`🖼️ Generating thumbnail...`);
    const thumbBuffer = await sharp(buffer)
      .resize({ width: THUMBNAIL_CONFIG.width, withoutEnlargement: true })
      .webp({ quality: THUMBNAIL_CONFIG.quality })
      .toBuffer();

    // Write files
    await writeFile(path.join(ART_DIR, filename), webpBuffer);
    await writeFile(path.join(THUMB_DIR, thumbFilename), thumbBuffer);

    // Calculate file sizes for logging
    const originalSize = file.size;
    const webpSize = webpBuffer.length;
    const thumbSize = thumbBuffer.length;
    const savings = ((1 - webpSize / originalSize) * 100).toFixed(1);

    console.log(
      `✅ Upload complete: ${file.name} → ${filename}`,
      `(${(originalSize / 1024).toFixed(0)}KB → ${(webpSize / 1024).toFixed(0)}KB, ${savings}% smaller)`
    );

    // Calculate real-world size (assume ~100 DPI for art prints)
    // This gives a reasonable default that can be adjusted
    const PIXELS_PER_METER = 3937; // ~100 DPI
    const calculatedWidth = Math.round((imageInfo.width / PIXELS_PER_METER) * 100) / 100;
    const calculatedHeight = Math.round((imageInfo.height / PIXELS_PER_METER) * 100) / 100;

    // Use provided dimensions or calculate from image, capped at reasonable gallery sizes
    const realWidth = (metadata.width as number) || Math.min(calculatedWidth, 1.5);
    const realHeight = (metadata.height as number) || Math.min(calculatedHeight, 1.2);

    // Return success with complete artwork data
    const artwork = {
      id: safeId,
      imagePath: `/art/${filename}`,
      thumbnailPath: `/art/thumbnails/${thumbFilename}`,
      realSizeMeters: {
        width: realWidth,
        height: realHeight,
      },
      year: (metadata.year as number) || new Date().getFullYear(),
      medium: (metadata.medium as string) || 'Digital',
      description: (metadata.description as string) || '',
      room: (metadata.room as string) || 'landscapes',
      assignedWall: (metadata.assignedWall as string) || 'room1-west',
      wallOrder: (metadata.wallOrder as number) ?? 0,
      heightOffset: (metadata.heightOffset as number) ?? 0,
      position: [0, 0, 0] as [number, number, number],
      rotation: [0, 0, 0] as [number, number, number],
      isUploaded: true,
    };

    return NextResponse.json({
      success: true,
      artwork,
      conversion: {
        originalSize,
        webpSize,
        thumbnailSize: thumbSize,
        savingsPercent: parseFloat(savings),
      },
      originalDimensions: {
        width: imageInfo.width,
        height: imageInfo.height,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process upload' },
      { status: 500 }
    );
  }
}

