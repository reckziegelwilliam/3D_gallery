import { NextRequest, NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const ART_DIR = path.join(process.cwd(), 'public', 'art');
const THUMB_DIR = path.join(ART_DIR, 'thumbnails');

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check auth cookie
    const adminCookie = request.cookies.get('gallery-admin-session');
    if (adminCookie?.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Artwork ID required' }, { status: 400 });
    }

    // Sanitize ID to prevent path traversal
    const safeId = id.replace(/[^a-z0-9-]/gi, '-');
    
    const mainFile = path.join(ART_DIR, `${safeId}.webp`);
    const thumbFile = path.join(THUMB_DIR, `${safeId}.webp`);

    const deleted: string[] = [];
    const notFound: string[] = [];

    // Delete main file if it exists
    if (existsSync(mainFile)) {
      await unlink(mainFile);
      deleted.push(mainFile);
      console.log(`🗑️ Deleted: ${mainFile}`);
    } else {
      notFound.push(mainFile);
    }

    // Delete thumbnail if it exists
    if (existsSync(thumbFile)) {
      await unlink(thumbFile);
      deleted.push(thumbFile);
      console.log(`🗑️ Deleted: ${thumbFile}`);
    } else {
      notFound.push(thumbFile);
    }

    return NextResponse.json({
      success: true,
      id: safeId,
      deleted,
      notFound,
    });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete files' },
      { status: 500 }
    );
  }
}

