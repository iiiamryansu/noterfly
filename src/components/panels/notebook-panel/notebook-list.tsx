'use client'

import type { Active, DataRef, DragEndEvent, DragOverEvent, DragStartEvent, Over } from '@dnd-kit/core'
import type { Note, Notebook } from '@prisma/client'
import type { NotebookWithNotesAndIsExpanded } from '@stores/notebook/types'

import { defaultDropAnimationSideEffects, DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { ScrollShadow } from '@heroui/scroll-shadow'
import { useNotebookStore } from '@stores/notebook'
import { trpc } from '@trpc/c'
import { debounce } from 'es-toolkit'
import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'

import type { DraggableData } from '~/components/panels/notebook-panel/types'

import { NoteItem } from '~/components/panels/notebook-panel/note-item'
import { NotebookItem } from '~/components/panels/notebook-panel/notebook-item'

export function NotebookList() {
  const utils = trpc.useUtils()

  const { mutate: reorderNotebook } = trpc.notebook.reorderNotebook.useMutation({
    onSuccess: () => {
      utils.notebook.getNotebooks.invalidate()
    },
  })
  const { mutate: reorderNote } = trpc.note.reorderNote.useMutation({
    onSuccess: () => {
      utils.notebook.getNotebooks.invalidate()
      utils.note.getNotes.invalidate()
    },
  })

  const debounceReorderNote = useMemo(() => debounce(reorderNote, 300), [reorderNote])
  const debounceReorderNotebook = useMemo(() => debounce(reorderNotebook, 300), [reorderNotebook])

  /* ----------------------------------------------------------------------------- */

  const { notebooks, updateNotebooks } = useNotebookStore()

  const notebookIds = useMemo(() => notebooks.map((notebook) => notebook.id), [notebooks])

  const [activeNotebook, setActiveNotebook] = useState<NotebookWithNotesAndIsExpanded | null>(null)
  const [activeNote, setActiveNote] = useState<null | Pick<Note, 'icon' | 'id' | 'order' | 'title'>>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  )

  /* ----------------------------------------------------------------------------- */

  function handleDragStart({ active }: DragStartEvent) {
    if (!hasDraggableData(active)) return

    if (active.data.current?.type === 'Notebook') {
      setActiveNotebook(active.data.current.notebook)
    } else if (active.data.current?.type === 'Note') {
      setActiveNote(active.data.current.note)
    }
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveNotebook(null)
    setActiveNote(null)

    if (!over || !hasDraggableData(active) || active.id === over.id) return

    if (active.data.current?.type === 'Notebook') {
      const activeNotebookIndex = notebooks.findIndex((nb) => nb.id === active.id)
      const overNotebookIndex = notebooks.findIndex((nb) => nb.id === over.id)

      const updatedNotebooks = arrayMove(notebooks, activeNotebookIndex, overNotebookIndex)

      updateNotebooks(updatedNotebooks)

      let newOrder: number

      if (overNotebookIndex === 0) {
        // 移动到第一位
        const secondNotebook = updatedNotebooks.length > 1 ? updatedNotebooks[1] : null

        newOrder = secondNotebook ? (secondNotebook.order + Date.now() / 1e6) / 2 : Date.now() / 1e6
      } else if (overNotebookIndex === updatedNotebooks.length - 1) {
        // 移动到最后一位
        const prevNotebook = updatedNotebooks[overNotebookIndex - 1]

        newOrder = prevNotebook.order / 2
      } else {
        // 移动到中间位置
        const prevNotebook = updatedNotebooks[overNotebookIndex - 1]
        const nextNotebook = updatedNotebooks[overNotebookIndex + 1]

        if (prevNotebook && nextNotebook) {
          newOrder = (prevNotebook.order + nextNotebook.order) / 2
        } else {
          // 防御性代码，理论上不应该发生
          newOrder = Date.now() / 1e6
        }
      }

      debounceReorderNotebook({
        newOrder,
        notebookId: active.id as Notebook['id'],
      })
    }
  }

  function handleDragOver({ active, over }: DragOverEvent) {
    if (!over || !hasDraggableData(active) || !hasDraggableData(over) || active.id === over.id) return

    if (active.data.current?.type === 'Note') {
      // 拖拽目标是 Note
      const activeNoteId = active.id

      const sourceNotebookIndex = notebooks.findIndex((nb) => nb.notes.some((n) => n.id === activeNoteId))

      if (sourceNotebookIndex === -1) return

      const sourceNotebook = notebooks[sourceNotebookIndex]

      const activeNoteIndex = sourceNotebook.notes.findIndex((n) => n.id === activeNoteId)

      const activeNote = sourceNotebook.notes[activeNoteIndex]

      if (!activeNote) return

      if (over.data.current?.type === 'Note') {
        // 放下目标是 Note
        const overNoteId = over.id

        const targetNotebookIndex = notebooks.findIndex((nb) => nb.notes.some((n) => n.id === overNoteId))

        if (targetNotebookIndex === -1) return

        const targetNotebook = notebooks[targetNotebookIndex]

        const overNoteIndex = targetNotebook.notes.findIndex((n) => n.id === overNoteId)

        const overNote = targetNotebook.notes[overNoteIndex]

        if (!overNote) return

        // 创建 notebooks 的深拷贝
        const updatedNotebooks = [
          ...notebooks.map((nb) => ({
            ...nb,
            notes: [...nb.notes],
          })),
        ]

        let newOrder: number

        if (sourceNotebookIndex === targetNotebookIndex) {
          // 同一 notebook 内移动
          const updatedNotes = arrayMove([...updatedNotebooks[sourceNotebookIndex].notes], activeNoteIndex, overNoteIndex)

          updatedNotebooks[sourceNotebookIndex].notes = updatedNotes

          if (overNoteIndex === 0) {
            // 移动到第一位
            const secondNote = updatedNotes.length > 1 ? updatedNotes[1] : null

            newOrder = secondNote ? (secondNote.order + Date.now() / 1e6) / 2 : Date.now() / 1e6
          } else if (overNoteIndex === updatedNotes.length - 1) {
            // 移动到最后一位
            const prevNote = updatedNotes[overNoteIndex - 1]

            newOrder = prevNote ? prevNote.order / 2 : 1
          } else {
            // 移动到中间位置
            const prevNote = updatedNotes[overNoteIndex - 1]
            const nextNote = updatedNotes[overNoteIndex + 1]

            newOrder = (prevNote.order + nextNote.order) / 2
          }
        } else {
          // 跨 notebooks 移动

          // 1. 删除源 notebook 中的 note
          const noteToMove = { ...updatedNotebooks[sourceNotebookIndex].notes[activeNoteIndex] }

          updatedNotebooks[sourceNotebookIndex].notes.splice(activeNoteIndex, 1)

          // 2. 添加到目标 notebook
          updatedNotebooks[targetNotebookIndex].notes.splice(overNoteIndex, 0, noteToMove)

          const updatedTargetNotes = updatedNotebooks[targetNotebookIndex].notes

          if (overNoteIndex === 0) {
            // 移动到第一位
            const secondNote = updatedTargetNotes.length > 1 ? updatedTargetNotes[1] : null

            newOrder = secondNote ? (secondNote.order + Date.now() / 1e6) / 2 : Date.now() / 1e6
          } else if (overNoteIndex === updatedTargetNotes.length - 1) {
            // 移动到最后一位
            const prevNote = updatedTargetNotes[overNoteIndex - 1]

            newOrder = prevNote ? prevNote.order / 2 : 1
          } else {
            // 移动到中间位置
            const prevNote = updatedTargetNotes[overNoteIndex - 1]
            const nextNote = updatedTargetNotes[overNoteIndex + 1]

            newOrder = (prevNote.order + nextNote.order) / 2
          }
        }

        updateNotebooks(updatedNotebooks)

        debounceReorderNote({
          newOrder,
          noteId: activeNote.id,
          targetNotebookId: targetNotebook.id,
        })
      }

      if (over.data.current?.type === 'Notebook') {
        // 放下目标是 Notebook
        const targetNotebookId = over.id as string

        if (targetNotebookId === sourceNotebook.id) return

        const targetNotebookIndex = notebooks.findIndex((nb) => nb.id === targetNotebookId)
        if (targetNotebookIndex === -1) return
        const targetNotebook = notebooks[targetNotebookIndex]

        // 创建 notebooks 的深拷贝
        const updatedNotebooks = [
          ...notebooks.map((nb) => ({
            ...nb,
            notes: [...nb.notes],
          })),
        ]

        // 1. 从源 notebook 中删除 note
        const noteToMove = { ...updatedNotebooks[sourceNotebookIndex].notes[activeNoteIndex] }
        updatedNotebooks[sourceNotebookIndex].notes.splice(activeNoteIndex, 1)

        // 2. 添加到目标 notebook 的顶部
        updatedNotebooks[targetNotebookIndex].notes.unshift(noteToMove)

        let newOrder: number

        if (targetNotebook.notes.length > 0) {
          // 如果目标 notebook 有 note，将新 note 放在第一位
          newOrder = (targetNotebook.notes[0].order + Date.now() / 1e6) / 2
        } else {
          // 如果目标 notebook 没有 note，使用时间戳计算 order
          newOrder = Date.now() / 1e6
        }

        updateNotebooks(updatedNotebooks)

        debounceReorderNote({
          newOrder,
          noteId: activeNote.id,
          targetNotebookId: targetNotebook.id,
        })
      }
    } else {
      // 拖拽目标不是 Note
      return
    }
  }

  /* ----------------------------------------------------------------------------- */

  useEffect(() => {
    return () => {
      debounceReorderNotebook.cancel()
      debounceReorderNote.cancel()
    }
  }, [debounceReorderNotebook, debounceReorderNote])

  return (
    <ScrollShadow hideScrollBar>
      <DndContext onDragEnd={handleDragEnd} onDragOver={handleDragOver} onDragStart={handleDragStart} sensors={sensors}>
        <SortableContext items={notebookIds} strategy={verticalListSortingStrategy}>
          {notebooks.map((notebook) => (
            <NotebookItem key={notebook.id} notebook={notebook} />
          ))}
        </SortableContext>

        {'document' in window &&
          createPortal(
            <DragOverlay
              dropAnimation={{
                duration: 300,
                easing: 'ease',
                sideEffects: defaultDropAnimationSideEffects({
                  styles: {
                    active: {
                      opacity: '0.5',
                    },
                  },
                }),
              }}
            >
              {activeNotebook && <NotebookItem isOverlay notebook={activeNotebook} />}
              {activeNote && <NoteItem isOverlay note={activeNote} />}
            </DragOverlay>,
            document.body,
          )}
      </DndContext>
    </ScrollShadow>
  )
}

/* ----------------------------------------------------------------------------- */

function hasDraggableData<T extends Active | Over>(
  entry: null | T | undefined,
): entry is T & {
  data: DataRef<DraggableData>
} {
  if (!entry) {
    return false
  }

  const data = entry.data.current

  if (data?.type === 'Notebook' || data?.type === 'Note') {
    return true
  }

  return false
}
