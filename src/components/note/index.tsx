'use client'

import type { Note } from '@prisma/client'

import { ScrollShadow, Skeleton } from '@heroui/react'
import { BreadcrumbItem, Breadcrumbs, Image } from '@heroui/react'
import axios from 'axios'
import { Home01Icon, Note01Icon, NotebookIcon } from 'hugeicons-react'
import { debounce } from 'lodash-es'
import { type ChangeEvent, useEffect } from 'react'

import { Editor } from '~/components/editor'
import { useNoteStore } from '~/stores/note-store'

const updateTitle = debounce((noteId: string, newTitle: string) => {
  axios.patch(`/api/note/${noteId}`, { title: newTitle })
}, 1000)

const updateContent = debounce((noteId: string, newContent: string) => {
  axios.patch(`/api/note/${noteId}`, { content: newContent })
}, 1000)

export function Note({ noteId }: { noteId: string }) {
  const { currentNote, isLoadingNote, setCurrentNote, setIsLoadingNote } = useNoteStore((state) => state)

  function handleUpdateTitle(e: ChangeEvent<HTMLInputElement>) {
    const newTitle = e.target.value

    setCurrentNote({ title: newTitle })
    updateTitle(noteId, newTitle)
  }

  function handleUpdateContent(newContent: string) {
    setCurrentNote({ content: newContent })
    updateContent(noteId, newContent)
  }

  /* ---------------------------- Get Current Note ---------------------------- */
  useEffect(() => {
    setIsLoadingNote(true)

    axios
      .get(`/api/note/${noteId}`)
      .then((res) => {
        if (res.data.success) {
          const note = res.data.payload

          setCurrentNote(note)
        }
      })
      .finally(() => setIsLoadingNote(false))
  }, [noteId, setIsLoadingNote, setCurrentNote])

  return (
    <ScrollShadow className="grid h-full grid-cols-1 grid-rows-[332px_1fr] gap-12" hideScrollBar>
      <header className="mx-auto grid max-w-[1024px] grid-cols-1 grid-rows-[40px_192px_36px_64px] px-8">
        <div className="flex h-10 items-center justify-center">
          {!isLoadingNote && (
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
          )}
        </div>

        {isLoadingNote ? (
          <Skeleton
            className="mx-auto h-[192px] w-[1024px] rounded-medium"
            classNames={{
              base: '!bg-base-default',
            }}
          />
        ) : (
          <Image
            alt="Default banner"
            className="object-cover"
            height={192}
            loading="eager"
            radius="md"
            src="/default/banner.png"
            width={1024}
          />
        )}

        <div className="relative mx-auto w-[800px]">
          {!isLoadingNote && <span className="absolute bottom-0 z-10 block size-[72px] select-none text-7xl">🏕️</span>}
        </div>

        {isLoadingNote ? (
          <Skeleton className="mx-auto h-16 w-[800px] rounded-medium" classNames={{ base: '!bg-base-default' }} />
        ) : (
          <input
            className="mx-auto h-16 w-[800px] border-b border-divider bg-transparent text-4xl font-semibold selection:bg-primary focus-visible:outline-none"
            onChange={handleUpdateTitle}
            value={currentNote?.title}
          />
        )}
      </header>

      {isLoadingNote ? (
        <div className="mx-auto flex w-[800px] flex-col gap-10">
          <div className="flex gap-5">
            <Skeleton className="h-6 w-[196px] rounded-small" classNames={{ base: '!bg-base-default' }} />
            <Skeleton className="h-6 w-[128px] rounded-small" classNames={{ base: '!bg-base-default' }} />
          </div>

          <div className="flex flex-col gap-5">
            <Skeleton className="h-6 w-[90%] rounded-small" classNames={{ base: '!bg-base-default' }} />
            <Skeleton className="h-6 w-[75%] rounded-small" classNames={{ base: '!bg-base-default' }} />
            <Skeleton className="h-6 w-[85%] rounded-small" classNames={{ base: '!bg-base-default' }} />
            <Skeleton className="h-6 w-[65%] rounded-small" classNames={{ base: '!bg-base-default' }} />
          </div>
        </div>
      ) : (
        currentNote && <Editor handleUpdateAction={handleUpdateContent} rawContent={currentNote.content} />
      )}
    </ScrollShadow>
  )
}
