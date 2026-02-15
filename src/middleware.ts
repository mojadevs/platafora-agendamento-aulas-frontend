import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('session_token')?.value
  const role = request.cookies.get('user_role')?.value
  const { pathname } = request.nextUrl

  const isPublicRoute = pathname.endsWith('/cadastro') || pathname === '/login' || pathname === '/'

  if (!token && !isPublicRoute && (pathname.startsWith('/marketplace') || pathname.startsWith('/instrutor'))) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (token && isPublicRoute && pathname !== '/') {
     const target = role === 'ALUNO' ? '/marketplace' : '/instrutor/dashboard'
     return NextResponse.redirect(new URL(target, request.url))
  }

  if (role === 'ALUNO' && pathname.startsWith('/instrutor') && !isPublicRoute) {
    return NextResponse.redirect(new URL('/marketplace', request.url))
  }

  if (role === 'INSTRUTOR' && pathname.startsWith('/marketplace')) {
    return NextResponse.redirect(new URL('/instrutor/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/marketplace/:path*', '/instrutor/:path*', '/login', '/aluno/:path*'],
}