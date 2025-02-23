import type { Metadata } from 'next'

import { prisma } from '@prisma'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Note / Noterfly',
}

export default async function NoteLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ noteId: string }>
}>) {
  const { noteId } = await params

  const note = await prisma.note.findUnique({
    select: {
      id: true,
    },
    where: {
      id: noteId,
    },
  })

  if (!note) {
    notFound()
  }

  return <div className="row-span-2 h-full">{children}</div>
}
