import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  // Allow landing page always — no redirect
  if (pathname === '/') {
    return NextResponse.next()
  }

  // Allow login and register always
  if (pathname === '/login' || pathname === '/register') {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // All other routes need token
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/register',
    '/dashboard/:path*',
    '/devices/:path*',
    '/alerts/:path*',
    '/tickets/:path*',
    '/topology/:path*',
    '/analytics/:path*',
    '/users/:path*',
  ],
}