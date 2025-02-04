import type { NextRequest } from 'next/server'

import { betterFetch } from '@better-fetch/fetch'
import { NextResponse } from 'next/server'

import type { auth } from '~/lib/auth'

type Session = typeof auth.$Infer.Session

export default async function authMiddleware(request: NextRequest) {
  const { data: session } = await betterFetch<Session>('/api/auth/get-session', {
    baseURL: process.env.NODE_ENV === 'production' ? `http://localhost:${process.env.PORT || 3000}` : request.nextUrl.origin,
    headers: {
      //get the cookie from the request
      cookie: request.headers.get('cookie') || '',
    },
  })

  if (request.nextUrl.pathname.startsWith('/auth')) {
    if (session) {
      return NextResponse.redirect(new URL('/home', request.url))
    } else {
      return NextResponse.next()
    }
  } else {
    if (session) {
      return NextResponse.next()
    } else {
      return NextResponse.redirect(new URL('/auth/sign-in', request.url))
    }
  }
}

export const config = {
  matcher: ['/auth/:path*', '/calendar', '/home', '/notes', '/notes/:path*', '/profile', '/settings', '/tasks'],
}
