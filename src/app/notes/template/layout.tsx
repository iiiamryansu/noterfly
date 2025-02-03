import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Template / Noterfly',
}

export default function TemplateLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
