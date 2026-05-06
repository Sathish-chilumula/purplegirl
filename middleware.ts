import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'hi', 'te', 'bn', 'mr', 'ta', 'gu'];
const defaultLocale = 'en';

function getLocaleFromRequest(request: NextRequest): string {
  // Check cookie first (user explicitly selected a language)
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && locales.includes(cookieLocale)) return cookieLocale;

  // Then detect from Accept-Language header
  const acceptLang = request.headers.get('accept-language') || '';
  const detected = locales.find(l => acceptLang.toLowerCase().includes(l));
  return detected || defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip internal Next.js paths, API routes, admin, and static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/login') ||
    pathname.match(/\.[^/]+$/) // has a file extension (e.g. /icon.png)
  ) {
    return NextResponse.next();
  }

  // Check if the URL already has a valid locale prefix
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Rewrite the URL to include the locale internally (English stays at root URL)
  const locale = getLocaleFromRequest(request);
  request.nextUrl.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
  return NextResponse.rewrite(request.nextUrl);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon.png|logo.png|images|api|admin|auth|login).*)',
  ],
};
