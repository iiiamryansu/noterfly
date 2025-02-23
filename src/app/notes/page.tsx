'use client'

import { Button } from '@heroui/button'
import { Divider } from '@heroui/divider'
import { ScrollShadow } from '@heroui/scroll-shadow'
import { useNoteStore } from '@stores/note-store'
import { trpc } from '@trpc/c'
import {
  DashboardSquare01Icon,
  DashboardSquare03Icon,
  ListViewIcon,
  MoreHorizontalCircle02Icon,
  NoteAddIcon,
  NotebookIcon,
  Sorting01Icon,
  StickyNote01Icon,
} from 'hugeicons-react'
import { useEffect } from 'react'

import { NotesTable } from '~/app/notes/_components/notes-table'

export default function NotesPage() {
  const { data: notes, isFetching: isLoadingNotes } = trpc.note.getNotes.useQuery()

  const setIsLoadingNotes = useNoteStore((state) => state.setIsLoadingNotes)
  const setNotes = useNoteStore((state) => state.setNotes)

  useEffect(() => {
    if (isLoadingNotes) setIsLoadingNotes(true)
    else setIsLoadingNotes(false)
  }, [isLoadingNotes, setIsLoadingNotes])

  useEffect(() => {
    if (!isLoadingNotes && notes) setNotes(notes)
  }, [isLoadingNotes, notes, setNotes])

  return (
    <ScrollShadow
      className="grid h-full grid-rows-[144px_1fr] overflow-y-auto px-10 pb-16 focus-visible:outline-none"
      hideScrollBar
    >
      <header className="grid grid-cols-2 grid-rows-2 gap-y-4 py-6">
        <h1 className="select-none text-3xl font-bold text-primary-900">All notes</h1>

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

      <NotesTable />
    </ScrollShadow>
  )
}
