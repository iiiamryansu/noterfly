import type { SortDescriptor } from '@heroui/table'
import type { Note, Notebook } from '@prisma/client'

type NoteActions = {
  getSortedNotes: () => NoteWithNotebook[]
  setIsLoadingNotes: (isLoadingNotes: boolean) => void
  setNotes: (notes: NoteWithNotebook[]) => void
  setSortDescriptor: (sortDescriptor: SortDescriptor) => void
  updateNote: (noteId: Note['id'], data: Partial<Note>) => void
  updateNotes: (notes: NoteWithNotebook[]) => void
}

type NoteStates = {
  isLoadingNotes: boolean
  notes: NoteWithNotebook[]
  sortDescriptor: SortDescriptor
}

type NoteStore = NoteActions & NoteStates

type NoteWithNotebook = Note & { notebook: Pick<Notebook, 'id' | 'name'> }

export type { NoteActions, NoteStates, NoteStore, NoteWithNotebook }
