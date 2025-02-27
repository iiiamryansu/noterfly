import type { Note, Notebook } from '@prisma/client'

type NotebookActions = {
  setIsLoadingNotebooks: (isLoadingNotebooks: boolean) => void
  setNotebooks: (notebooks: NotebookWithNotes[]) => void
  toggleNotebook: (notebookId: NotebookWithNotesAndIsExpanded['id']) => void
  updateNotebooks: (notebooks: NotebookWithNotesAndIsExpanded[]) => void
}

type NotebookStates = {
  isLoadingNotebooks: boolean
  notebooks: NotebookWithNotesAndIsExpanded[]
}

type NotebookStore = NotebookActions & NotebookStates

type NotebookWithNotes = Notebook & { notes: Pick<Note, 'icon' | 'id' | 'order' | 'title'>[] }

type NotebookWithNotesAndIsExpanded = NotebookWithNotes & { isExpanded: boolean }

export type { NotebookActions, NotebookStates, NotebookStore, NotebookWithNotes, NotebookWithNotesAndIsExpanded }
