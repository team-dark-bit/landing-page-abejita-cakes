'use server'

import { redirect } from 'next/navigation'
import { loginSchema } from '@/lib/admin/schemas'
import { safeAdminRedirect } from '@/lib/auth/config'
import { createClient } from '@/lib/supabase/server'

export type LoginState = {
  error?: string
  fieldErrors?: { email?: string; password?: string }
  email?: string
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

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error) {
    if (error.status && error.status >= 500) {
      return { error: 'No pudimos iniciar sesión en este momento. Inténtalo más tarde.', email }
    }
    return { error: 'Correo o contraseña incorrectos.', email }
  }

  redirect(safeAdminRedirect(formData.get('from')))
}

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}
