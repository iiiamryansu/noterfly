'use client'

import type { Note } from '@prisma/client'

import { Button, Chip, Divider, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react'
import { format, formatDistanceToNow, isThisYear } from 'date-fns'
import {
  DashboardSquare01Icon,
  DashboardSquare03Icon,
  ListViewIcon,
  MoreHorizontalCircle02Icon,
  MoreHorizontalIcon,
  NoteAddIcon,
  NotebookIcon,
  Sorting01Icon,
  StickyNote01Icon,
} from 'hugeicons-react'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

import { useNotes } from '~/contexts'

const columns = [
  { name: 'Title', uid: 'title' },
  { name: 'Notebook', uid: 'notebookId' },
  { name: 'Updated', uid: 'updatedAt' },
  { name: 'Actions', uid: 'actions' },
]

export default function NotesPage() {
  const { notes } = useNotes()

  const router = useRouter()

  const renderCell = useCallback((note: Note, columnKey: React.Key): React.ReactNode => {
    switch (columnKey) {
      case 'actions': {
        return (
          <Button isIconOnly size="sm" variant="light">
            <MoreHorizontalIcon className="size-4 text-default-500" />
          </Button>
        )
      }

      case 'notebookId': {
        return (
          <Chip className="h-5 select-none text-[10px]" size="sm" variant="flat">
            {/* {getNotebookTitle(note.notebookId)} */}
            Placeholder
          </Chip>
        )
      }

      case 'title': {
        return (
          <header>
            <h3 className="text-bold line-clamp-1 select-none text-sm">{note.title}</h3>
            <p className="line-clamp-1 select-none text-xs text-default-500">{note.content}</p>
          </header>
        )
      }

      case 'updatedAt': {
        const date = note.updatedAt
        const now = new Date()

        let formattedDate

        if (Math.abs(now.getTime() - date.getTime()) > 30 * 24 * 60 * 60 * 1000) {
          if (isThisYear(date)) {
            formattedDate = format(date, 'MM-dd')
          } else {
            formattedDate = format(date, 'yyyy-MM-dd')
          }
        } else {
          formattedDate = formatDistanceToNow(date, { addSuffix: true })
        }

        return <span className="block min-w-24 text-xs text-default-500">{formattedDate}</span>
      }

      default: {
        const value = note[columnKey as keyof Note]

        return typeof value === 'object' ? value.toString() : value
      }
    }
  }, [])

  return (
    <>
      <header className="grid h-32 grid-cols-2 grid-rows-2 gap-y-4 px-8 py-4">
        <h2 className="select-none text-xl font-semibold leading-10 text-primary-900">All Notes</h2>

        <section className="flex items-center justify-end gap-1">
          <Button isIconOnly size="sm" variant="light">
            <DashboardSquare03Icon className="size-4 text-default-500" />
          </Button>
          <Button isIconOnly size="sm" variant="light">
            <DashboardSquare01Icon className="size-4 text-default-500" />
          </Button>
          <Button isIconOnly size="sm" variant="light">
            <ListViewIcon className="size-4 text-default-500" />
          </Button>

          <Divider className="h-5" orientation="vertical" />

          <Button isIconOnly size="sm" variant="light">
            <Sorting01Icon className="size-4 text-default-500" />
          </Button>

          <Divider className="h-5" orientation="vertical" />

          <Button isIconOnly size="sm" variant="light">
            <MoreHorizontalCircle02Icon className="size-4 text-default-500" />
          </Button>
        </section>

        <section className="col-span-2 flex items-center gap-2">
          <Button color="primary" radius="sm" startContent={<NoteAddIcon className="size-4" />} variant="flat">
            Note
          </Button>
          <Button color="secondary" radius="sm" startContent={<NotebookIcon className="size-4" />} variant="flat">
            Notebook
          </Button>
          <Button color="warning" radius="sm" startContent={<StickyNote01Icon className="size-4" />} variant="flat">
            Templates
          </Button>
        </section>
      </header>

      <Table
        aria-labelledby="all notes table"
        classNames={{
          base: ['px-8', 'overflow-y-auto'],
          th: ['text-default-500', 'bg-background', 'border-b', 'border-divider'],
          tr: ['!shadow-none', 'hover:bg-base-default'],
        }}
        isHeaderSticky
        removeWrapper
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn align={column.uid === 'actions' ? 'center' : 'start'} key={column.uid}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={notes}>
          {(note) => {
            return (
              <TableRow className="cursor-pointer" key={note.id} onClick={() => router.push(`/notes/note/${note.id}`)}>
                {(columnKey) => {
                  return <TableCell>{renderCell(note, columnKey)}</TableCell>
                }}
              </TableRow>
            )
          }}
        </TableBody>
      </Table>
    </>
  )
}

// function getNotebookTitle(notebookId: string): string {
//   return notebooks.find((notebook) => notebook.id === notebookId)?.title ?? 'Unsorted'
// }
