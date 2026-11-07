type ApiErrorBody = {
  error?: {
    message?: string
    details?: Record<string, string[]> | null
  }
}

/**
 * Convierte el `{ error: { message, details } }` del proxy en un mensaje
 * legible. `details` viene por campo, así que se aplana con el nombre delante.
 */
export function describeError(body: unknown, status: number) {
  const payload = body as ApiErrorBody | null
  const details = payload?.error?.details
  if (details) {
    const messages = Object.entries(details).flatMap(([field, list]) =>
      list.map((message) => `${field}: ${message}`),
    )
    if (messages.length > 0) return messages.join(' ')
  }
  return payload?.error?.message ?? `La operación falló (${status}).`
}

export async function requestJson(url: string, init?: RequestInit): Promise<unknown> {
  const res = await fetch(url, {
    ...init,
    headers: { Accept: 'application/json', ...init?.headers },
    cache: 'no-store',
  })
  const body = await res.json().catch(() => null)
  if (!res.ok) throw new Error(describeError(body, res.status))
  return body
}

export function jsonBody(method: 'POST' | 'PATCH' | 'PUT', input: unknown): RequestInit {
  return {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  }
}
