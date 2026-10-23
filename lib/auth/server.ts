import 'server-only'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { SESSION_COOKIE } from './config'
import { verifySessionToken } from './session'

export async function getAdminSession() {
  const store = await cookies()
  return verifySessionToken(store.get(SESSION_COOKIE)?.value)
}

export async function requireAdminSession() {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')
  return session
}
