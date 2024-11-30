import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected routes
const protectedRoutes = ['/dashboard', '/dashboard/habits']

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  console.log(req.nextUrl.pathname)
  // Check auth status
  const { data: { session } } = await supabase.auth.getSession()
  console.log(session)
  // If accessing a protected route without auth, redirect to login
  if (!session && protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
    const redirectUrl = new URL('/login', req.url)
    // Store the attempted URL to redirect back after login
    redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

// Configure which routes use this middleware