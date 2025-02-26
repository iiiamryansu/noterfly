'use client'

import { Button } from '@heroui/button'
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/modal'
import { trpc } from '@trpc/c'
import { Loading03Icon, Note01Icon } from 'hugeicons-react'
import { useState } from 'react'

interface RecentlyDeletedModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

export function RecentlyDeletedModal({ isOpen, onOpenChange }: RecentlyDeletedModalProps) {
  const [selectedNoteIds, setSelectedNoteIds] = useState<string[]>([])

  const utils = trpc.useUtils()

  const { data: deletedNotes, isFetching: isLoadingDeletedNotes } = trpc.note.getDeletedNotes.useQuery()

  const { isPending: isRestoringNote, mutate: restoreNote } = trpc.note.restoreNote.useMutation({
    onSuccess: () => {
      utils.note.getNotes.invalidate()
      utils.note.getDeletedNotes.invalidate()

      setSelectedNoteIds([])

      onOpenChange(false)
    },
  })

  const { isPending: isDeletingNote, mutate: deleteNote } = trpc.note.deleteNote.useMutation({
    onSuccess: () => {
      utils.note.getDeletedNotes.invalidate()

      setSelectedNoteIds([])

      onOpenChange(false)
    },
  })

  function handleRestoreNote() {
    if (selectedNoteIds.length === 1) {
      restoreNote({
        noteId: selectedNoteIds[0],
        type: 'single',
      })
    } else if (selectedNoteIds.length > 1) {
      restoreNote({
        noteIds: selectedNoteIds,
        type: 'multiple',
      })
    } else {
      return
    }
  }

  function handleDeleteNote() {
    if (selectedNoteIds.length === 1) {
      deleteNote({
        isPermanent: true,
        noteId: selectedNoteIds[0],
        type: 'single',
      })
    } else if (selectedNoteIds.length > 1) {
      deleteNote({
        isPermanent: true,
        noteIds: selectedNoteIds,
        type: 'multiple',
      })
    } else {
      return
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setSelectedNoteIds([])}
      onOpenChange={onOpenChange}
      portalContainer={document.getElementById('main-container')!}
      size="xs"
    >
      <ModalContent className="bg-base-default">
        <ModalHeader>Recently Deleted</ModalHeader>
        <ModalBody>
          {isLoadingDeletedNotes ? (
            <div className="flex h-full items-center justify-center">
              <Loading03Icon className="size-4 animate-spin text-default-500" />
            </div>
          ) : deletedNotes?.length === 0 ? (
            <p className="select-none text-center text-sm text-default-500">No recently deleted notes.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {deletedNotes?.map((note) => (
                <Button
                  className="justify-start"
                  key={note.id}
                  onPress={() =>
                    setSelectedNoteIds((selectedNoteIds) =>
                      selectedNoteIds.includes(note.id)
                        ? selectedNoteIds.filter((noteId) => noteId !== note.id)
                        : [...selectedNoteIds, note.id],
                    )
                  }
                  size="sm"
                  startContent={<Note01Icon className="size-3" />}
                  variant={selectedNoteIds.includes(note.id) ? 'solid' : 'ghost'}
                >
                  {note.title}
                </Button>
              ))}
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            color="warning"
            isDisabled={selectedNoteIds.length === 0}
            isLoading={isRestoringNote}
            onPress={handleRestoreNote}
            variant="ghost"
          >
            {isRestoringNote ? '' : selectedNoteIds.length > 1 ? 'Restore Selected' : 'Restore'}
          </Button>
          <Button
            color="danger"
            isDisabled={selectedNoteIds.length === 0}
            isLoading={isDeletingNote}
            onPress={handleDeleteNote}
            variant="ghost"
          >
            {isDeletingNote ? '' : selectedNoteIds.length > 1 ? 'Delete Selected' : 'Delete'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
