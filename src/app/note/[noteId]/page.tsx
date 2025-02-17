import { notFound } from 'next/navigation'

import { Note } from '~/components/note'
import { prisma } from '~/lib/prisma'

export default async function NotePage({ params }: { params: Promise<{ noteId: string }> }) {
  const { noteId } = await params

  const note = await prisma.note.findUnique({
    select: { id: true },
    where: { id: noteId },
  })

  if (!note) notFound()

  return <Note noteId={noteId} />
}
