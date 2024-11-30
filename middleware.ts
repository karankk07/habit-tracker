import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected routes that require authentication
const protectedRoutes = ['/dashboard', '/dashboard/habits', '/dashboard/achievements', '/dashboard/settings']
const authRoutes = ['/login', '/signup']

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  try {
    // Check auth state
    const {
      data: { session },
    } = await supabase.auth.getSession()

    const isProtectedRoute = protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route))
    const isAuthRoute = authRoutes.some(route => req.nextUrl.pathname.startsWith(route))

    // Redirect authenticated users away from auth pages
    if (session && isAuthRoute) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Redirect unauthenticated users away from protected pages
    if (!session && isProtectedRoute) {
      const redirectUrl = new URL('/login', req.url)
      redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    return res
  } catch (error) {
    console.error('Middleware error:', error)
    // On error, allow the request to continue but redirect to error page if it's a protected route
    if (protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
      return NextResponse.redirect(new URL('/error', req.url))
    }
    return res
  }
}

export const config = {
  matcher: [...protectedRoutes, ...authRoutes]
}