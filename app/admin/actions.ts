'use server'

import { createHash, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { loginSchema } from '@/lib/admin/schemas'
import { getAdminConfig, safeAdminRedirect, SESSION_COOKIE, sessionCookieOptions } from '@/lib/auth/config'
import { createSessionToken } from '@/lib/auth/session'

export type LoginState = {
  error?: string
  fieldErrors?: { email?: string; password?: string }
  email?: string
}

function safeEqual(a: string, b: string) {
  const digest = (value: string) => createHash('sha256').update(value).digest()
  return timingSafeEqual(digest(a), digest(b))
}

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: String(formData.get('email') ?? '').trim().toLowerCase(),
    password: String(formData.get('password') ?? ''),
  })
  const email = String(formData.get('email') ?? '')

  if (!parsed.success) {
    const fieldErrors: LoginState['fieldErrors'] = {}
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as 'email' | 'password'
      fieldErrors[field] ??= issue.message
    }
    return { fieldErrors, email }
  }

  const config = getAdminConfig()
  if (!config) {
    return { error: 'El acceso administrativo no está configurado en este entorno.', email }
  }

  const emailOk = safeEqual(parsed.data.email, config.email)
  const passwordOk = safeEqual(parsed.data.password, config.password)
  if (!emailOk || !passwordOk) {
    await new Promise((resolve) => setTimeout(resolve, 600))
    return { error: 'Correo o contraseña incorrectos.', email }
  }

  const store = await cookies()
  store.set(SESSION_COOKIE, await createSessionToken(config.email), sessionCookieOptions)
  redirect(safeAdminRedirect(formData.get('from')))
}

export async function logoutAction() {
  const store = await cookies()
  store.set(SESSION_COOKIE, '', { ...sessionCookieOptions, maxAge: 0 })
  redirect('/admin/login')
}
