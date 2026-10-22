'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { CtaLink } from './cta-link'
import { WhatsappIcon } from './brand-icons'
import { Logo } from './logo'
import { whatsappLink } from '@/lib/whatsapp'

const navItems = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#catalogo', label: 'Catálogo' },
  { href: '#galeria', label: 'Galería' },
  { href: '#testimonios', label: 'Testimonios' },
  { href: '#contacto', label: 'Contacto' },
  { href: '#faq', label: 'Preguntas' },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 md:h-18 md:px-6">
        <a href="#inicio" className="rounded-lg focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40" aria-label="Abejita Cakes, ir al inicio">
          <Logo />
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="rounded-full px-3 py-2 text-sm font-semibold text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <CtaLink href={whatsappLink()} className="hidden sm:inline-flex">
            <WhatsappIcon className="size-4" />
            Pedir ahora
          </CtaLink>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-card lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
            <span className="sr-only">{open ? 'Cerrar menú' : 'Abrir menú'}</span>
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Móvil" className="border-t border-border/70 bg-background lg:hidden">
          <ul className="mx-auto flex max-w-6xl flex-col px-4 py-3">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-3 text-base font-semibold transition-colors hover:bg-secondary"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
