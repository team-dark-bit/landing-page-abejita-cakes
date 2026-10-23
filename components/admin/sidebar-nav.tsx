'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ExternalLink } from 'lucide-react'
import { adminNav } from './nav-items'
import { cn } from '@/lib/utils'

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <nav aria-label="Administración" className="flex flex-1 flex-col gap-1">
      {adminNav.map((item) => {
        const active = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors',
              active
                ? 'bg-honey text-honey-foreground'
                : 'text-primary-foreground/75 hover:bg-primary-foreground/10 hover:text-primary-foreground',
            )}
          >
            <Icon className="size-4.5 shrink-0" aria-hidden="true" />
            {item.label}
          </Link>
        )
      })}
      <div className="mt-auto pt-6">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-primary-foreground/75 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground"
        >
          <ExternalLink className="size-4.5" aria-hidden="true" />
          Ver sitio público
        </Link>
      </div>
    </nav>
  )
}
