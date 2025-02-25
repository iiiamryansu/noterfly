import type { Note } from '@prisma/client'
import type { NotebookWithNotesAndIsExpanded } from '@stores/notebook/types'

type DraggableData = NotebookDragData | NoteDragData

type NotebookDragData = {
  notebook: NotebookWithNotesAndIsExpanded
  type: 'Notebook'
}

type NoteDragData = {
  note: Pick<Note, 'id' | 'order' | 'title'>
  type: 'Note'
}

export type { DraggableData, NotebookDragData, NoteDragData }
