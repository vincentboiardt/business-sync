import { createClientForMiddleware } from '@repo/supabase/server'
import { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClientForMiddleware(request)

  // Refresh session if expired - required for Server Components
  await supabase.auth.getUser()

  // Check if user is authenticated for protected routes
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isProtectedRoute =
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/api/protected')

  if (isProtectedRoute && !user) {
    // Redirect to sign in page
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/auth/signin'
    redirectUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname)
    return Response.redirect(redirectUrl)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
