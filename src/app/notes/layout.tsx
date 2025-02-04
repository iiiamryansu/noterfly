import type { Metadata } from 'next'

import { getAllNotes } from '~/actions/note'
import { NotesProvider } from '~/contexts'

export const metadata: Metadata = {
  title: 'Notes / Noterfly',
}

export default async function NotesLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const allNotes = await getAllNotes()

  return (
    <NotesProvider notes={allNotes}>
      <div className="grid h-full grid-cols-1 grid-rows-[128px_1fr]">{children}</div>
    </NotesProvider>
  )
}
