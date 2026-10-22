import { Logo } from './logo'
import { SocialLinks } from './social-links'
import { business, categories } from '@/lib/data'
import { whatsappLink } from '@/lib/whatsapp'

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-3 md:px-6">
        <div className="flex flex-col gap-4">
          <Logo />
          <p className="max-w-xs leading-relaxed text-muted-foreground">
            Repostería artesanal ayacuchana. Tortas y bocaditos para cumpleaños, reuniones y eventos.
          </p>
          <SocialLinks />
        </div>

        <nav aria-label="Categorías" className="flex flex-col gap-3">
          <h2 className="font-serif text-lg font-semibold">Catálogo</h2>
          <ul className="flex flex-col gap-2">
            {categories.map((c) => (
              <li key={c.id}>
                <a href="#catalogo" className="text-muted-foreground transition-colors hover:text-foreground">
                  {c.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-3">
          <h2 className="font-serif text-lg font-semibold">Contacto</h2>
          <address className="flex flex-col gap-2 not-italic text-muted-foreground">
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground hover:underline">
              {`WhatsApp: ${business.whatsappDisplay}`}
            </a>
            <span>{business.address}</span>
            {business.hours.map((h) => (
              <span key={h.days}>
                {h.days}: {h.time}
              </span>
            ))}
          </address>
        </div>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-6xl px-4 py-5 text-sm text-muted-foreground md:px-6">
          {`© ${new Date().getFullYear()} Abejita Cakes · Huamanga, Ayacucho. Todos los derechos reservados.`}
        </p>
      </div>
    </footer>
  )
}
