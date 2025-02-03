import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Note / Noterfly',
}

export default function NoteLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
