import 'server-only'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Shared server-side proxy for the protected admin endpoints:
// the Supabase access token never reaches the browser.
const API_URL = process.env.API_URL
const TIMEOUT_MS = 30_000

type UpstreamError = {
  error?: {
    code?: string
    message?: string
    details?: Record<string, string[]> | null
  }
}

export function fail(status: number, code: string, message: string, details?: unknown) {
  return NextResponse.json({ error: { code, message, details: details ?? null } }, { status })
}

async function backendHeaders(): Promise<Record<string, string> | null> {
  const supabase = await createClient()
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  if (!token) return null

  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }
}

async function forward(response: Response) {
  if (response.status === 204) return new NextResponse(null, { status: 204 })

  const body = (await response.json().catch(() => null)) as UpstreamError | null
  if (response.ok) return NextResponse.json(body ?? {}, { status: response.status })

  const message =
    response.status === 401
      ? 'Tu sesión expiró. Vuelve a iniciar sesión.'
      : (body?.error?.message ?? 'No pudimos completar la operación.')

  return fail(response.status, body?.error?.code ?? 'UPSTREAM_ERROR', message, body?.error?.details)
}

export async function adminRequest(path: string, init: RequestInit = {}) {
  const headers = await backendHeaders()
  if (!headers) return fail(401, 'UNAUTHENTICATED', 'Tu sesión expiró. Vuelve a iniciar sesión.')
  if (!API_URL) return fail(500, 'INTERNAL_ERROR', 'API_URL no definida')

  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: { ...headers, ...(init.headers as Record<string, string> | undefined) },
      cache: 'no-store',
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    return await forward(res)
  } catch (error) {
    console.error(`[admin] no se pudo contactar la API (${path})`, error)
    return fail(502, 'UPSTREAM_ERROR', 'No pudimos conectar con el servicio de preguntas frecuentes.')
  }
}
