import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_ROUTES = [
  '/login',
  '/forgot-password',
  '/reset-password'
];
const PROTECTED_ROUTES = [
  '/home',
  '/users',
  '/settings'
];
const VALID_ROUTES = [
  ...AUTH_ROUTES,
  ...PROTECTED_ROUTES,
  '/',
  '/not-found'
];

const isRouteValid = (pathname: string) => {
  if (VALID_ROUTES.some(route => pathname === route)) {
    return true;
  }

  return VALID_ROUTES.some(route => `/${pathname.split('/')[0]}` === route);
}

export const proxy = (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  const refreshToken = request.cookies.get('refreshToken');
  const isAuthenticated = !!refreshToken;

  const isValidRoute = isRouteValid(pathname);

  if (!isValidRoute && pathname !== '/not-found') {
    return NextResponse.redirect(new URL('/not-found', request.url));
  }

  if (isAuthenticated && AUTH_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  if (!isAuthenticated && PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
