export const SESSION_COOKIE = 'abejita_admin_session'
export const SESSION_TTL_SECONDS = 60 * 60 * 8

const isProduction = process.env.NODE_ENV === 'production'

// Development-only fallbacks so the preview works out of the box.
// In production the ADMIN_* variables are mandatory; without them login is disabled.
const DEV_FALLBACK = {
  email: 'admin@abejitacakes.pe',
  password: 'abejita2026',
  secret: 'dev-only-abejita-session-secret-change-me',
}

export type AdminConfig = { email: string; password: string; secret: string }

export function getAdminConfig(): AdminConfig | null {
  const email = process.env.ADMIN_EMAIL ?? (isProduction ? undefined : DEV_FALLBACK.email)
  const password = process.env.ADMIN_PASSWORD ?? (isProduction ? undefined : DEV_FALLBACK.password)
  const secret = process.env.ADMIN_SESSION_SECRET ?? (isProduction ? undefined : DEV_FALLBACK.secret)
  if (!email || !password || !secret) return null
  return { email: email.toLowerCase(), password, secret }
}

export const usingDevCredentials =
  !isProduction && (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD)

export const devCredentialsHint = usingDevCredentials
  ? { email: DEV_FALLBACK.email, password: DEV_FALLBACK.password }
  : null

export const sessionCookieOptions = {
  httpOnly: true,
  secure: true,
  // The v0 preview renders inside a cross-site iframe, which requires SameSite=None.
  sameSite: isProduction ? ('lax' as const) : ('none' as const),
  path: '/',
  maxAge: SESSION_TTL_SECONDS,
}

export function safeAdminRedirect(target: unknown) {
  if (typeof target !== 'string') return '/admin'
  if (!target.startsWith('/admin') || target.startsWith('/admin/login') || target.includes('//')) {
    return '/admin'
  }
  return target
}
