import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calendar / Noterfly',
}

export default function CalendarLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
