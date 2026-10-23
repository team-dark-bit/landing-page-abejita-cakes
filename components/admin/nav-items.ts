import { CakeSlice, LayoutDashboard, MessageCircleQuestion, MessageSquareQuote, Tags } from 'lucide-react'

export const adminNav = [
  { href: '/admin', label: 'Resumen', icon: LayoutDashboard },
  { href: '/admin/productos', label: 'Productos', icon: CakeSlice },
  { href: '/admin/categorias', label: 'Categorías', icon: Tags },
  { href: '/admin/testimonios', label: 'Testimonios', icon: MessageSquareQuote },
  { href: '/admin/faqs', label: 'Preguntas frecuentes', icon: MessageCircleQuestion },
]
