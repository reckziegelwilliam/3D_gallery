import { NextRequest, NextResponse } from 'next/server';

const ADMIN_COOKIE_NAME = 'gallery-admin-session';
const ADMIN_COOKIE_VALUE = 'authenticated';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (!adminPassword) {
      return NextResponse.json(
        { error: 'Admin password not configured' },
        { status: 500 }
      );
    }
    
    if (password !== adminPassword) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }
    
    // Create response with success message
    const response = NextResponse.json({ success: true });
    
    // Set HTTP-only cookie for 24 hours
    response.cookies.set(ADMIN_COOKIE_NAME, ADMIN_COOKIE_VALUE, {
      httpOnly: false, // Need to read from client for admin mode
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });
    
    return response;
  } catch {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  
  // Clear the cookie
  response.cookies.set(ADMIN_COOKIE_NAME, '', {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });
  
  return response;
}

