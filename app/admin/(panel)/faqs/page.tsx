import type { Metadata } from 'next'
import { FaqsManager } from '@/components/admin/faqs/faqs-manager'

export const metadata: Metadata = { title: 'Preguntas frecuentes' }

export default function FaqsPage() {
  return <FaqsManager />
}
