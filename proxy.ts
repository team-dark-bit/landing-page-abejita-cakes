import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/proxy'

function redirectWithCookies(url: URL, from: NextResponse) {
  const redirect = NextResponse.redirect(url)
  from.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie))
  return redirect
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const { user, response } = await updateSession(request)
  const isLogin = pathname === '/admin/login'

  if (isLogin && user) {
    return redirectWithCookies(new URL('/admin', request.url), response)
  }

  if (!isLogin && !user) {
    const loginUrl = new URL('/admin/login', request.url)
    if (pathname !== '/admin') loginUrl.searchParams.set('from', `${pathname}${search}`)
    return redirectWithCookies(loginUrl, response)
  }

  return response
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}
