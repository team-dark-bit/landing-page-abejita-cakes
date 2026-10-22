import { business } from './data'

export const defaultWhatsappMessage =
  '¡Hola Abejita Cakes! Quisiera hacer un pedido.'

export function whatsappLink(message: string = defaultWhatsappMessage) {
  return `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(message)}`
}

export function productWhatsappLink(productName: string, size: string) {
  return whatsappLink(
    `¡Hola Abejita Cakes! Me interesa "${productName}" (${size}). ¿Me pueden dar más información para mi pedido?`,
  )
}

export function formatPrice(value: number) {
  return `S/ ${value.toLocaleString('es-PE')}`
}
