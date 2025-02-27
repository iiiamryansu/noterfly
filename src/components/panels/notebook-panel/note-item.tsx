'use client'

import type { Note } from '@prisma/client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from '@heroui/button'
import { cn } from '@utils/cn'
import { usePathname, useRouter } from 'next/navigation'

interface NoteItemProps {
  isOverlay?: boolean
  note: Pick<Note, 'icon' | 'id' | 'order' | 'title'>
}

export function NoteItem({ isOverlay, note }: NoteItemProps) {
  const pathname = usePathname()
  const router = useRouter()

  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef: noteSortableRef,
    transform,
    transition,
  } = useSortable({
    data: {
      note,
      type: 'Note',
    },
    id: note.id,
  })

  return (
    <Button
      className={cn('justify-start', isOverlay ? 'ring-1 ring-divider' : isDragging ? 'opacity-30 ring-1 ring-divider' : '')}
      disableAnimation
      draggable
      fullWidth
      onPress={() => router.push(`/notes/${note.id}`)}
      ref={noteSortableRef}
      size="sm"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
      variant={pathname === `/notes/${note.id}` ? 'solid' : 'light'}
      {...attributes}
      {...listeners}
    >
      {note.icon !== '' && <span>{note.icon}</span>}

      <span className="truncate" style={{ direction: 'ltr' }}>
        {note.title}
      </span>
    </Button>
  )
}
