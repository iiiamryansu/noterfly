import { notFound } from 'next/navigation'

import { getNoteById } from '~/actions/note'
import { Note } from '~/components/note'

export default async function NotePage({ params }: { params: Promise<{ noteId: string }> }) {
  const { noteId } = await params

  const note = await getNoteById(noteId)

  if (!note) {
    notFound()
  }

  return <Note note={note} />
}
