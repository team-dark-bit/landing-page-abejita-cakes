'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { LogOut, Menu } from 'lucide-react'
import { logoutAction } from '@/app/admin/actions'
import { adminNav } from './nav-items'
import { SidebarNav } from './sidebar-nav'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

export function AdminTopbar({ email }: { email: string }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const current =
    adminNav.find((item) => item.href !== '/admin' && pathname.startsWith(item.href)) ?? adminNav[0]

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/90 px-4 backdrop-blur md:px-8">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={<Button variant="ghost" size="icon" className="lg:hidden" aria-label="Abrir menú" />}
        >
          <Menu className="size-5" aria-hidden="true" />
        </SheetTrigger>
        <SheetContent side="left" className="w-72 border-0 bg-primary p-5 text-primary-foreground">
          <SheetTitle className="mb-6 font-serif text-xl text-primary-foreground">Abejita Admin</SheetTitle>
          <SidebarNav onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      <p className="text-sm font-semibold text-muted-foreground">
        <span className="sr-only">Sección actual: </span>
        {current.label}
      </p>

      <div className="ml-auto flex items-center gap-3">
        <div className="hidden flex-col items-end sm:flex">
          <span className="text-xs text-muted-foreground">Sesión iniciada</span>
          <span className="text-sm font-semibold">{email}</span>
        </div>
        <span
          aria-hidden="true"
          className="flex size-9 items-center justify-center rounded-full bg-secondary font-serif text-sm font-semibold uppercase"
        >
          {email.charAt(0)}
        </span>
        <form action={logoutAction}>
          <Button type="submit" variant="outline" size="sm" className="rounded-full">
            <LogOut className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">Salir</span>
            <span className="sr-only sm:hidden">Cerrar sesión</span>
          </Button>
        </form>
      </div>
    </header>
  )
}
