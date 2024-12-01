import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Update protected routes to include all app routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/dashboard/habits',
  '/dashboard/achievements',
  '/dashboard/settings',
  // Add any other protected routes here
]

// Add public routes that should be accessible without auth
const publicRoutes = ['/', '/login', '/signup']

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Check auth status
  const { data: { session } } = await supabase.auth.getSession()

  const path = req.nextUrl.pathname
  
  // If user is not logged in and trying to access a protected route
  if (!session && protectedRoutes.some(route => path.startsWith(route))) {
    const redirectUrl = new URL('/login', req.url)
    // Store the attempted URL to redirect back after login
    redirectUrl.searchParams.set('redirectTo', path)
    return NextResponse.redirect(redirectUrl)
  }

  // If user is logged in and trying to access auth pages (login/signup)
  if (session && ['/login', '/signup'].includes(path)) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
