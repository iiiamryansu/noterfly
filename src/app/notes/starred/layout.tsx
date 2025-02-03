import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Starred / Noterfly',
}

export default function StarredLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
