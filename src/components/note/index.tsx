'use client'

import type { Note } from '@prisma/client'

import { ScrollShadow } from '@heroui/react'
import { BreadcrumbItem, Breadcrumbs, Image } from '@heroui/react'
import { Home01Icon, Note01Icon, NotebookIcon } from 'hugeicons-react'
import { debounce } from 'lodash-es'
import { useState } from 'react'

import { updateNoteById } from '~/actions/note'
import { Editor } from '~/components/editor'

const saveTitle = debounce((noteId: string, newTitle: string) => {
  updateNoteById(noteId, { title: newTitle })
}, 1000)

export function Note({ note }: { note: Note }) {
  const [title, setTitle] = useState(note.title ?? '')

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newTitle = e.target.value

    setTitle(newTitle)
    saveTitle(note.id, newTitle)
  }

  return (
    <ScrollShadow className="grid h-full grid-cols-1 grid-rows-[332px_1fr] gap-12" hideScrollBar>
      <header className="mx-auto grid max-w-[1024px] grid-cols-1 grid-rows-[40px_192px_36px_64px] px-8">
        <Breadcrumbs
          classNames={{ base: ['flex', 'justify-center', 'items-center'] }}
          itemClasses={{
            separator: ['text-[10px]', 'px-2'],
          }}
          separator="/"
          size="sm"
          variant="light"
        >
          <BreadcrumbItem startContent={<Home01Icon className="size-3" />}>Home</BreadcrumbItem>
          <BreadcrumbItem startContent={<NotebookIcon className="size-3" />}>Projects</BreadcrumbItem>
          <BreadcrumbItem startContent={<NotebookIcon className="size-3" />}>Noterfly</BreadcrumbItem>
          <BreadcrumbItem startContent={<Note01Icon className="size-3" />}>How I increased my visibility</BreadcrumbItem>
        </Breadcrumbs>

        <Image
          alt="Default banner"
          className="object-cover"
          height={192}
          loading="eager"
          radius="md"
          src="/default/banner.png"
          width={1024}
        />

        <div className="relative mx-auto w-[800px]">
          <span className="absolute bottom-0 z-10 block size-[72px] select-none text-7xl">🏕️</span>
        </div>

        <input
          className="mx-auto h-16 w-[800px] border-b border-divider bg-transparent text-4xl font-semibold selection:bg-primary focus-visible:outline-none"
          onChange={handleChange}
          value={title}
        />
      </header>

      <Editor note={note} />
    </ScrollShadow>
  )
}
