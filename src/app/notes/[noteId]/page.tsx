'use client'

import { BreadcrumbItem, Breadcrumbs } from '@heroui/breadcrumbs'
import { Image } from '@heroui/image'
import { ScrollShadow } from '@heroui/scroll-shadow'
import { Skeleton } from '@heroui/skeleton'
import { trpc } from '@trpc/c'
import { debounce } from 'es-toolkit'
import { Home01Icon, Note01Icon, NotebookIcon } from 'hugeicons-react'
import { useParams } from 'next/navigation'
import { useEffect, useMemo, useRef } from 'react'

import { Icon } from '~/app/notes/[noteId]/_components/Icon'
import Editor from '~/features/editor'

export default function NotePage() {
  const { noteId } = useParams()

  const contentRef = useRef<string>('')

  const utils = trpc.useUtils()

  const { data: note, isLoading: isLoadingNote } = trpc.note.getNote.useQuery(
    {
      noteId: noteId as string,
    },
    {
      staleTime: 5 * 1000,
    },
  )

  const { mutate: updateNote } = trpc.note.updateNote.useMutation({
    onSuccess: (data) => {
      utils.note.getNote.setData({ noteId: noteId as string }, (prev) => {
        if (prev) return { ...prev, ...data }
      })

      utils.note.getNotes.invalidate()
    },
  })

  const debouncedUpdateNote = useMemo(() => {
    return debounce((data: { content?: string; title?: string }) => {
      updateNote({ data, noteId: noteId as string })
    }, 1000)
  }, [noteId, updateNote])

  function handleUpdateNote(data: { content?: string; title?: string }) {
    debouncedUpdateNote(data)
  }

  useEffect(() => {
    const saveContent = () => {
      if (contentRef.current) {
        updateNote({
          data: { content: contentRef.current },
          noteId: noteId as string,
        })
      }
    }

    window.addEventListener('beforeunload', saveContent)
    window.addEventListener('popstate', saveContent)

    return () => {
      saveContent()

      window.removeEventListener('beforeunload', saveContent)
      window.removeEventListener('popstate', saveContent)
    }
  }, [noteId, updateNote])

  return (
    <ScrollShadow className="grid h-full grid-cols-1 grid-rows-[332px_1fr] gap-12 focus-visible:outline-none" hideScrollBar>
      <header className="group/header mx-auto grid max-w-[1024px] grid-cols-1 grid-rows-[40px_192px_36px_64px] px-8">
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

        <div className="group/icon relative mx-auto w-[800px]">{!isLoadingNote && note && <Icon note={note} />}</div>

        {isLoadingNote ? (
          <Skeleton className="mx-auto h-16 w-[800px] rounded-medium" classNames={{ base: '!bg-base-default' }} />
        ) : (
          <input
            className="mx-auto h-16 w-[800px] border-b border-divider bg-transparent text-4xl font-semibold selection:bg-primary focus-visible:outline-none"
            defaultValue={note?.title}
            onChange={(e) => handleUpdateNote({ title: e.target.value })}
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
        note && <Editor contentRef={contentRef} handleUpdateAction={handleUpdateNote} rawContent={note.content} />
      )}
    </ScrollShadow>
  )
}
