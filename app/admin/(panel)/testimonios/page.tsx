import type { Metadata } from 'next'
import { TestimonialsManager } from '@/components/admin/testimonials/testimonials-manager'

export const metadata: Metadata = { title: 'Testimonios' }

export default function TestimonialsPage() {
  return <TestimonialsManager />
}
