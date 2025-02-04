import type { Note } from '@prisma/client'

import { Editor } from '~/components/editor'

export function Content({ note }: { note: Note }) {
  return <Editor note={note} />
}
