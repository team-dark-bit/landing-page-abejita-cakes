import { getAdminConfig, SESSION_TTL_SECONDS } from './config'

export type AdminSession = { email: string; exp: number }

const encoder = new TextEncoder()

function toBase64Url(bytes: Uint8Array) {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64Url(value: string) {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=')
  const binary = atob(padded)
  return Uint8Array.from(binary, (char) => char.charCodeAt(0))
}

async function getKey(secret: string) {
  return crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, [
    'sign',
    'verify',
  ])
}

export async function createSessionToken(email: string) {
  const config = getAdminConfig()
  if (!config) throw new Error('Admin auth is not configured')
  const session: AdminSession = { email, exp: Date.now() + SESSION_TTL_SECONDS * 1000 }
  const payload = toBase64Url(encoder.encode(JSON.stringify(session)))
  const signature = await crypto.subtle.sign('HMAC', await getKey(config.secret), encoder.encode(payload))
  return `${payload}.${toBase64Url(new Uint8Array(signature))}`
}

export async function verifySessionToken(token: string | undefined): Promise<AdminSession | null> {
  const config = getAdminConfig()
  if (!token || !config) return null
  const [payload, signature] = token.split('.')
  if (!payload || !signature) return null
  try {
    const valid = await crypto.subtle.verify(
      'HMAC',
      await getKey(config.secret),
      fromBase64Url(signature),
      encoder.encode(payload),
    )
    if (!valid) return null
    const session = JSON.parse(new TextDecoder().decode(fromBase64Url(payload))) as AdminSession
    if (session.email !== config.email || session.exp < Date.now()) return null
    return session
  } catch {
    return null
  }
}
