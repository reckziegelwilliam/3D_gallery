/**
 * Admin Authentication Utilities
 * Simple password-based authentication using cookies
 */

const ADMIN_COOKIE_NAME = 'gallery-admin-session';
const ADMIN_COOKIE_VALUE = 'authenticated';

/**
 * Validate admin password against environment variable
 */
export function validatePassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    console.warn('ADMIN_PASSWORD environment variable not set');
    return false;
  }
  return password === adminPassword;
}

/**
 * Check if admin session cookie exists (client-side)
 */
export function isAdminAuthenticated(): boolean {
  if (typeof document === 'undefined') return false;
  return document.cookie.includes(`${ADMIN_COOKIE_NAME}=${ADMIN_COOKIE_VALUE}`);
}

/**
 * Set admin session cookie (client-side)
 */
export function setAdminCookie(): void {
  if (typeof document === 'undefined') return;
  // Cookie expires in 24 hours
  const expires = new Date();
  expires.setTime(expires.getTime() + 24 * 60 * 60 * 1000);
  document.cookie = `${ADMIN_COOKIE_NAME}=${ADMIN_COOKIE_VALUE}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;
}

/**
 * Remove admin session cookie (client-side)
 */
export function clearAdminCookie(): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${ADMIN_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

/**
 * Check admin cookie from request headers (server-side)
 */
export function checkAdminCookieFromHeaders(cookieHeader: string | null): boolean {
  if (!cookieHeader) return false;
  return cookieHeader.includes(`${ADMIN_COOKIE_NAME}=${ADMIN_COOKIE_VALUE}`);
}

