import type { Metadata } from 'next'
import { Toaster } from '@/components/ui/sonner'

export const metadata: Metadata = {
  title: { default: 'Panel admin', template: '%s · Admin Abejita Cakes' },
  robots: { index: false, follow: false },
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster position="top-right" richColors closeButton />
    </>
  )
}
