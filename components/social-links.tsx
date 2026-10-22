import { FacebookIcon, InstagramIcon, TiktokIcon } from './brand-icons'
import { business } from '@/lib/data'
import { cn } from '@/lib/utils'

const links = [
  { href: business.social.instagram, label: 'Instagram', Icon: InstagramIcon },
  { href: business.social.facebook, label: 'Facebook', Icon: FacebookIcon },
  { href: business.social.tiktok, label: 'TikTok', Icon: TiktokIcon },
]

export function SocialLinks({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  return (
    <ul className="flex gap-3">
      {links.map(({ href, label, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'inline-flex size-11 items-center justify-center rounded-full transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40',
              tone === 'dark'
                ? 'bg-primary-foreground/10 text-primary-foreground hover:bg-honey hover:text-honey-foreground'
                : 'bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground',
            )}
          >
            <Icon className="size-5" />
            <span className="sr-only">{`Abejita Cakes en ${label}`}</span>
          </a>
        </li>
      ))}
    </ul>
  )
}
