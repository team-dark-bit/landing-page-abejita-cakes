import { NextResponse, type NextRequest } from 'next/server'
import { SESSION_COOKIE } from '@/lib/auth/config'
import { verifySessionToken } from '@/lib/auth/session'

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const session = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value)
  const isLogin = pathname === '/admin/login'

  if (isLogin && session) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  if (!isLogin && !session) {
    const loginUrl = new URL('/admin/login', request.url)
    if (pathname !== '/admin') loginUrl.searchParams.set('from', `${pathname}${search}`)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}
