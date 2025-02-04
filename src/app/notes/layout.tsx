import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Notes / Noterfly',
}

export default function NotesLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div className="grid h-full grid-cols-1 grid-rows-[128px_1fr]">{children}</div>
}
