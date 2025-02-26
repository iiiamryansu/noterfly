'use client'

import type { NotebookWithNotesAndIsExpanded } from '@stores/notebook/types'

import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from '@heroui/button'
import { useNotebookStore } from '@stores/notebook'
import { ArrowDown01Icon, ArrowRight01Icon } from 'hugeicons-react'
import { useMemo } from 'react'

import { NoteItem } from '~/components/panels/notebook-panel/note-item'

interface NotebookItemProps {
  isOverlay?: boolean
  notebook: NotebookWithNotesAndIsExpanded
}

export function NotebookItem({ isOverlay, notebook }: NotebookItemProps) {
  const noteIds = useMemo(() => notebook.notes.map((note) => note.id), [notebook.notes])

  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef: notebookSortableRef,
    transform,
    transition,
  } = useSortable({
    data: {
      notebook,
      type: 'Notebook',
    },
    id: notebook.id,
  })

  const toggleNotebook = useNotebookStore((state) => state.toggleNotebook)

  return (
    <div
      className={
        isOverlay ? 'rounded-small ring-1 ring-divider' : isDragging ? 'rounded-small opacity-30 ring-1 ring-divider' : ''
      }
      draggable
      ref={notebookSortableRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      <Button
        className="justify-start"
        disableAnimation
        draggable
        fullWidth
        onPress={() => toggleNotebook(notebook.id)}
        size="sm"
        startContent={
          notebook.isExpanded ? (
            <ArrowDown01Icon className="size-3 shrink-0 text-default-500" />
          ) : (
            <ArrowRight01Icon className="size-3 shrink-0 text-default-500" />
          )
        }
        variant="light"
        {...attributes}
        {...listeners}
      >
        <span className="truncate" style={{ direction: 'ltr' }}>
          {notebook.name}
        </span>
      </Button>

      {notebook.isExpanded && (
        <div className="ml-5 flex flex-col gap-0.5 py-0.5">
          <SortableContext items={noteIds} strategy={verticalListSortingStrategy}>
            {notebook.notes.map((note) => (
              <NoteItem key={note.id} note={note} />
            ))}
          </SortableContext>
        </div>
      )}
    </div>
  )
}
