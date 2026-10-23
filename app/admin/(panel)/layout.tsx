import Link from 'next/link'
import { AdminTopbar } from '@/components/admin/admin-topbar'
import { SidebarNav } from '@/components/admin/sidebar-nav'
import { requireAdminSession } from '@/lib/auth/server'

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdminSession()

  return (
    <div className="flex min-h-dvh bg-muted/60">
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col gap-8 bg-primary p-5 text-primary-foreground lg:flex">
        <Link href="/admin" className="flex flex-col px-3 pt-2">
          <span className="font-serif text-xl font-semibold">Abejita Cakes</span>
          <span className="text-xs font-semibold uppercase tracking-widest text-honey">Panel admin</span>
        </Link>
        <SidebarNav />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar email={session.email} />
        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 md:px-8 md:py-8">
          {children}
        </main>
      </div>
    </div>
  )
}
