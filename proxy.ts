import { NextRequest, NextResponse } from 'next/server';
import { parseSetCookie } from 'cookie';

import { checkSession } from './lib/api/serverApi';

const privateRoutes = ['/notes', '/profile'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  const isPrivateRoute = privateRoutes.some(
    route => pathname === route || pathname.startsWith(`${route}/`)
  );

  const isPublicRoute = publicRoutes.includes(pathname);

  let isAuthenticated = Boolean(accessToken);
  let newCookies: string[] = [];

  if (!accessToken && refreshToken) {
    try {
      const session = await checkSession(request.headers.get('cookie') ?? '');

      isAuthenticated = session.data.success;

      const setCookie = session.headers['set-cookie'];

      newCookies = Array.isArray(setCookie) ? setCookie : setCookie ? [setCookie] : [];
    } catch {
      isAuthenticated = false;
    }
  }

  let response: NextResponse;

  if (isPrivateRoute && !isAuthenticated) {
    response = NextResponse.redirect(new URL('/sign-in', request.url));
  } else if (isPublicRoute && isAuthenticated) {
    response = NextResponse.redirect(new URL('/', request.url));
  } else {
    response = NextResponse.next();
  }

  if (isAuthenticated) {
    for (const cookieString of newCookies) {
      const parsedCookie = parseSetCookie(cookieString);

      if (parsedCookie && parsedCookie.value !== undefined) {
        response.cookies.set(parsedCookie.name, parsedCookie.value, {
          path: parsedCookie.path,
          domain: parsedCookie.domain,
          maxAge: parsedCookie.maxAge,
          expires: parsedCookie.expires,
          httpOnly: parsedCookie.httpOnly,
          secure: parsedCookie.secure,
          sameSite: parsedCookie.sameSite,
        });
      }
    }
  }

  return response;
}

export const config = {
  matcher: ['/notes/:path*', '/profile/:path*', '/sign-in', '/sign-up'],
};
