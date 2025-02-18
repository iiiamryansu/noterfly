import { getSessionCookie } from 'better-auth'
import { type NextRequest, NextResponse } from 'next/server'

/**
 * In Next.js middleware, it's recommended to only check for the existence of a session cookie to handle redirection.
 * To avoid blocking requests by making API or database calls.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const cookies = getSessionCookie(request)

  if (pathname === '/') {
    if (cookies) return NextResponse.redirect(new URL('/home', request.url))
    else return NextResponse.next()
  }

  if (pathname === '/home') {
    if (cookies) return NextResponse.next()
    else return NextResponse.redirect(new URL('/', request.url))
  }

  if (pathname.startsWith('/auth')) {
    if (cookies) return NextResponse.redirect(new URL('/home', request.url))
    else return NextResponse.next()
  }

  if (cookies) return NextResponse.next()
  else return NextResponse.redirect(new URL('/auth/sign-in', request.url))
}

export const config = {
  matcher: [
    '/',
    '/auth/:path*',
    '/calendar',
    '/home',
    '/note/:path*',
    '/notes',
    '/notes/:path*',
    '/profile',
    '/settings',
    '/tasks',
  ],
}
