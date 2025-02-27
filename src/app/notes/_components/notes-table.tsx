'use client'

import type { Note, Notebook } from '@prisma/client'
import type { Key, ReactNode } from 'react'

import { Button } from '@heroui/button'
import { Divider } from '@heroui/divider'
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/dropdown'
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@heroui/modal'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/table'
import { useNoteStore } from '@stores/note'
import { useNotebookStore } from '@stores/notebook'
import { trpc } from '@trpc/c'
import { cn } from '@utils/cn'
import { format, formatDistanceToNow, isThisYear } from 'date-fns'
import { Delete01Icon, MoreHorizontalIcon, Notebook01Icon, NotebookIcon, StarIcon } from 'hugeicons-react'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'

const columns = [
  {
    key: 'title',
    label: 'Title',
    sortable: true,
  },
  {
    key: 'updatedAt',
    label: 'Updated',
    sortable: true,
  },
  {
    key: 'createdAt',
    label: 'Created',
    sortable: true,
  },
  {
    key: 'actions',
    label: '',
  },
]

export function NotesTable() {
  const router = useRouter()

  const isLoadingNotes = useNoteStore((state) => state.isLoadingNotes)
  const sortDescriptor = useNoteStore((state) => state.sortDescriptor)
  const setSortDescriptor = useNoteStore((state) => state.setSortDescriptor)
  const getSortedNotes = useNoteStore((state) => state.getSortedNotes)

  const utils = trpc.useUtils()

  const { mutate: deleteNote } = trpc.note.deleteNote.useMutation({
    onSuccess: () => {
      utils.note.getNotes.refetch()

      utils.notebook.getNotebooks.invalidate()
      utils.note.getDeletedNotes.invalidate()
    },
  })

  /* ---------------------------------- Star ---------------------------------- */
  const { mutate: updateNote } = trpc.note.updateNote.useMutation({
    onSuccess: (note) => {
      utils.note.getNotes.invalidate()
      utils.note.getNote.invalidate({ noteId: note.id })
    },
  })

  /* ---------------------------- move-to-notebook ---------------------------- */

  const { isOpen: isModalOpen, onOpen: openModal, onOpenChange: toggleModalState } = useDisclosure()

  const notebooks = useNotebookStore((state) => state.notebooks)

  const [selectedNoteId, setSelectedNoteId] = useState<null | string>(null)
  const [selectedNotebookId, setSelectedNotebookId] = useState<null | string>(null)

  const { isPending: isMovingToNotebook, mutate: moveToNotebook } = trpc.note.moveToNotebook.useMutation({
    onSuccess: () => {
      utils.notebook.getNotebooks.invalidate()
      utils.note.getNotes.invalidate()

      toggleModalState()
    },
  })

  /* ----------------------------------------------------------------------------- */

  const renderCell = useCallback(
    (note: Note & { notebook: Pick<Notebook, 'id' | 'name'> }, key: Key): ReactNode => {
      switch (key) {
        /* --------------------------------- Actions -------------------------------- */
        case 'actions': {
          return (
            <Dropdown
              classNames={{
                content: ['min-w-32'],
              }}
            >
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <MoreHorizontalIcon className="size-4 text-default-500" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem
                  endContent={<StarIcon className={cn('size-4', note.isStarred && 'text-yellow-500')} />}
                  key="star"
                  onPress={() => updateNote({ data: { isStarred: !note.isStarred }, noteId: note.id })}
                  textValue={note.isStarred ? 'Unstar' : 'Star'}
                >
                  {note.isStarred ? 'Unstar' : 'Star'}
                </DropdownItem>
                <DropdownItem
                  endContent={<Notebook01Icon className="size-4" />}
                  key="move-to-notebook"
                  onPress={() => {
                    setSelectedNoteId(note.id)
                    setSelectedNotebookId(note.notebookId ?? 'unsorted')

                    openModal()
                  }}
                  textValue="Move to..."
                >
                  Move to...
                </DropdownItem>
                <DropdownItem
                  className="text-danger"
                  color="danger"
                  endContent={<Delete01Icon className="size-4" />}
                  key="delete"
                  onPress={() => deleteNote({ noteId: note.id, type: 'single' })}
                >
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )
        }

        /* --------------------------------- Created -------------------------------- */
        case 'createdAt': {
          const date = note.createdAt
          const now = new Date()

          let formattedDate

          if (date instanceof Date) {
            if (Math.abs(now.getTime() - date.getTime()) > 30 * 24 * 60 * 60 * 1000) {
              if (isThisYear(date)) {
                formattedDate = format(date, 'MM-dd')
              } else {
                formattedDate = format(date, 'yyyy-MM-dd')
              }
            } else {
              formattedDate = formatDistanceToNow(date, { addSuffix: true })
            }
          } else {
            formattedDate = 'Unknown'
          }

          return <span className="line-clamp-1 block text-xs text-default-500">{formattedDate}</span>
        }

        /* ---------------------------------- Title ---------------------------------- */
        case 'title': {
          return (
            <header className="flex flex-col">
              <h2 className="flex select-none items-center gap-1.5 text-sm text-primary-900">
                {note.isStarred && <StarIcon className="size-3 shrink-0 text-yellow-500" fill="currentColor" />}
                {note.icon !== '' && <span>{note.icon}</span>}

                <span className="truncate" style={{ direction: 'ltr' }}>
                  {note.title}
                </span>
              </h2>

              <section className="flex items-center gap-1.5 text-default-400">
                <NotebookIcon className="size-3 shrink-0" strokeWidth={1} />
                <h3 className="shrink-0 text-xs font-normal">{note.notebook ? note.notebook.name : 'Unsorted'}</h3>
                <span className="shrink-0">·</span>
                <p className="line-clamp-1 min-w-0 text-xs">
                  Enim cillum irure anim incididunt aliqua aliqua reprehenderit mollit.
                </p>
              </section>
            </header>
          )
        }

        /* --------------------------------- Updated -------------------------------- */
        case 'updatedAt': {
          const date = note.updatedAt
          const now = new Date()

          let formattedDate

          if (date instanceof Date) {
            if (Math.abs(now.getTime() - date.getTime()) > 30 * 24 * 60 * 60 * 1000) {
              if (isThisYear(date)) {
                formattedDate = format(date, 'MM-dd')
              } else {
                formattedDate = format(date, 'yyyy-MM-dd')
              }
            } else {
              formattedDate = formatDistanceToNow(date, { addSuffix: true })
            }
          } else {
            formattedDate = 'Unknown'
          }

          return <span className="line-clamp-1 block text-xs text-default-500">{formattedDate}</span>
        }

        /* -------------------------------------------------------------------------- */
        default: {
          return null
        }
      }
    },
    [openModal, updateNote, deleteNote],
  )

  return (
    <>
      <Table
        aria-label="Notes table"
        classNames={{
          tbody: ['flex w-full flex-1 flex-col'],
          td: ['self-center', 'min-w-40 last:min-w-20', 'px-0 first:px-3'],
          th: [
            'min-w-40 last:min-w-20',
            'bg-background',
            'text-default-500 leading-10',
            'border-b border-divider',
            'first:rounded-none last:rounded-none',
          ],
          thead: ['[&>tr]:hover:!bg-background [&>tr]:!border-none [&>tr]:!rounded-none'],
          tr: [
            'grid w-full grid-cols-[5.75fr_1.75fr_1.75fr_0.75fr]',
            'hover:bg-base-default hover:rounded-md',
            'border-b border-divider/30 last:border-none hover:border-b-transparent [&:has(+_tr:hover)]:border-b-transparent',
            'transition-all duration-100',
            'cursor-pointer',
          ],
        }}
        layout="fixed"
        onRowAction={(noteId) => router.push(`/notes/${noteId}`)}
        onSortChange={setSortDescriptor}
        removeWrapper
        sortDescriptor={sortDescriptor}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn align={column.key === 'title' ? 'start' : 'center'} allowsSorting={column.sortable} key={column.key}>
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody isLoading={isLoadingNotes} items={getSortedNotes()}>
          {(note) => <TableRow key={note.id}>{(columnKey) => <TableCell>{renderCell(note, columnKey)}</TableCell>}</TableRow>}
        </TableBody>
      </Table>

      <Modal
        classNames={{
          backdrop: [
            'absolute inset-0', // 相对于 wrapper 定位
          ],
          base: [
            'relative', // 使用相对定位
            'z-50', // 确保在最上层
          ],
          wrapper: [
            'absolute inset-0', // 相对于 main-container 定位
            'flex items-center justify-center',
            'h-full w-full', // 确保大小与 main-container 一致
          ],
        }}
        isOpen={isModalOpen}
        onClose={() => {
          setSelectedNotebookId(null)
          setSelectedNoteId(null)
        }}
        onOpenChange={toggleModalState}
        portalContainer={document.getElementById('main-container')!}
        size="xs"
      >
        <ModalContent className="bg-base-default">
          <ModalHeader>Move to...</ModalHeader>
          <ModalBody>
            <Button
              disableAnimation
              isDisabled={isMovingToNotebook}
              onPress={() => setSelectedNotebookId('unsorted')}
              size="sm"
              variant={selectedNotebookId === 'unsorted' ? 'solid' : 'ghost'}
            >
              Unsorted
            </Button>

            <Divider orientation="horizontal" />

            {notebooks.map((nb) => (
              <Button
                className="justify-start"
                disableAnimation
                isDisabled={isMovingToNotebook || selectedNoteId === nb.id}
                key={nb.id}
                onPress={() => setSelectedNotebookId(nb.id)}
                size="sm"
                startContent={isLoadingNotes ? null : <Notebook01Icon className="size-3" />}
                variant={selectedNotebookId === nb.id ? 'solid' : 'bordered'}
              >
                {nb.name}
              </Button>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              fullWidth
              isLoading={isMovingToNotebook}
              onPress={() =>
                selectedNoteId &&
                selectedNotebookId &&
                moveToNotebook({ notebookId: selectedNotebookId, noteId: selectedNoteId })
              }
              size="sm"
            >
              {isMovingToNotebook ? '' : 'Move'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
