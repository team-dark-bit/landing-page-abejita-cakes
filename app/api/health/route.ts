import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Temporary diagnostic route: checks that the Next.js server can reach the Spring Boot API.
export async function GET() {
  const base = process.env.API_URL
  if (!base) {
    return NextResponse.json({ ok: false, error: 'API_URL no definida' }, { status: 500 })
  }

  try {
    // Generous timeout to tolerate Render cold starts.
    const res = await fetch(`${base}/actuator/health`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(60_000),
    })
    const body = await res.json().catch(() => null)
    return NextResponse.json({ ok: res.ok, status: res.status, body })
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 502 })
  }
}
