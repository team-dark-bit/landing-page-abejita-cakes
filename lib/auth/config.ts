export function safeAdminRedirect(target: unknown) {
  if (typeof target !== 'string') return '/admin'
  if (!target.startsWith('/admin') || target.startsWith('/admin/login') || target.includes('//')) {
    return '/admin'
  }
  return target
}
