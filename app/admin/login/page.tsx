import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { LoginForm } from '@/components/admin/login-form'
import { Logo } from '@/components/logo'
import { safeAdminRedirect } from '@/lib/auth/config'

export const metadata: Metadata = { title: 'Iniciar sesión' }

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>
}) {
  const { from } = await searchParams

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-8 bg-muted px-4 py-12">
      <div className="flex w-full max-w-sm flex-col gap-6 rounded-3xl border bg-card p-8 shadow-sm">
        <div className="flex flex-col items-start gap-4">
          <Logo />
          <div className="flex flex-col gap-1">
            <h1 className="font-serif text-2xl font-semibold text-balance">Panel de administración</h1>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Ingresa con tu cuenta para gestionar el catálogo y el contenido del sitio.
            </p>
          </div>
        </div>
        <LoginForm from={safeAdminRedirect(from)} />
      </div>
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Volver al sitio
      </Link>
    </main>
  )
}
