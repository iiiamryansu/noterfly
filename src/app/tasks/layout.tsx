import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tasks / Noterfly',
}

export default function TasksLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
