import 'server-only'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function getAdminSession() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  return data.user ? { email: data.user.email ?? '' } : null
}

export async function requireAdminSession() {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')
  return session
}
