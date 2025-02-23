'use client'

import type { Note } from '@prisma/client'
import type { Key, ReactNode } from 'react'

import { Button } from '@heroui/button'
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/dropdown'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/table'
import { useNoteStore } from '@stores/note-store'
import { trpc } from '@trpc/c'
import { format, formatDistanceToNow, isThisYear } from 'date-fns'
import { Delete01Icon, MoreHorizontalIcon, NotebookIcon } from 'hugeicons-react'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

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
    },
  })

  const renderCell = useCallback(
    (note: Note, key: Key): ReactNode => {
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
                  className="text-danger"
                  color="danger"
                  endContent={<Delete01Icon className="size-4" />}
                  key="delete"
                  onPress={() => deleteNote({ noteId: note.id })}
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
              <h2 className="line-clamp-1 select-none text-sm text-primary-900">{note.title}</h2>

              <section className="flex items-center gap-1.5 text-default-400">
                <NotebookIcon className="size-3 shrink-0" strokeWidth={1} />
                <h3 className="shrink-0 text-xs font-normal">Notebook</h3>
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
          const value = note[key as keyof Note]

          return typeof value === 'object' ? value.toString() : value
        }
      }
    },
    [deleteNote],
  )

  return (
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
  )
}
