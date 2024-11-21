import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  try {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req, res })
    
    await supabase.auth.getSession()
    return res
  } catch (error) {
    console.error('Middleware error:', error)
    // Redirect to error page or handle appropriately
    return NextResponse.redirect(new URL('/error', req.url))
  }
}

export const config = {
  matcher: ['/login', '/signup', '/dashboard/:path*', '/'],
}