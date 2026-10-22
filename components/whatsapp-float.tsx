import { WhatsappIcon } from './brand-icons'
import { whatsappLink } from '@/lib/whatsapp'

export function WhatsappFloat() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed right-4 bottom-4 z-50 inline-flex h-14 items-center gap-2 rounded-full bg-primary pr-5 pl-4 font-semibold text-primary-foreground shadow-xl shadow-primary/30 ring-4 ring-background transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-honey md:right-6 md:bottom-6 motion-reduce:hover:translate-y-0"
      aria-label="Pedir por WhatsApp"
    >
      <span className="relative flex size-7 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-honey/50 motion-reduce:hidden" aria-hidden="true" />
        <WhatsappIcon className="relative size-6" />
      </span>
      <span className="hidden sm:inline">Pedir por WhatsApp</span>
    </a>
  )
}
