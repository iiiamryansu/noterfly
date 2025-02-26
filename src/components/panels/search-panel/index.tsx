'use client'

import type { Note } from '@prisma/client'

import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { ScrollShadow } from '@heroui/scroll-shadow'
import { trpc } from '@trpc/c'
import { debounce } from 'es-toolkit'
import { Loading03Icon, Note01Icon, Search01Icon } from 'hugeicons-react'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

import { cn } from '~/utils/cn'

export default function SearchPanel() {
  const pathname = usePathname()
  const router = useRouter()

  /* --------------------------------- Search --------------------------------- */

  const [searchResults, setSearchResults] = useState<Pick<Note, 'id' | 'title'>[]>([])

  const { isPending: isSearchingNotes, mutate: searchNotes } = trpc.note.searchNotes.useMutation({
    onSuccess: (data) => {
      setSearchResults(data)
    },
  })

  const debounceSearchNotes = useMemo(
    () =>
      debounce((query: string) => {
        if (query.length !== 0) searchNotes({ query })
      }, 700),
    [searchNotes],
  )

  /* ----------------------------------------------------------------------------- */

  useEffect(() => {
    return () => {
      debounceSearchNotes.cancel()
    }
  }, [debounceSearchNotes])

  return (
    <section className="flex h-full flex-col gap-2">
      <Input
        classNames={{
          input: cn('text-xs'),
        }}
        onValueChange={debounceSearchNotes}
        placeholder="Search your notes..."
        size="sm"
        startContent={<Search01Icon className="size-3" />}
        variant="bordered"
      />

      {isSearchingNotes ? (
        <div className="flex flex-1 items-center justify-center">
          <Loading03Icon className="size-4 animate-spin text-default-500" />
        </div>
      ) : searchResults.length === 0 ? (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm text-default-500">No results found.</p>
        </div>
      ) : (
        <ScrollShadow className="flex-1 space-y-1 pb-16" hideScrollBar>
          {searchResults.map((note) => (
            <Button
              className="justify-start"
              fullWidth
              key={note.id}
              onPress={() => router.push(`/notes/${note.id}`)}
              size="sm"
              startContent={<Note01Icon className="size-3 shrink-0" />}
              variant={pathname === `/notes/${note.id}` ? 'solid' : 'light'}
            >
              <span className="truncate" style={{ direction: 'ltr' }}>
                {note.title}
              </span>
            </Button>
          ))}

          <p className="h-16 select-none text-center text-xs leading-[64px] text-default-500">
            {searchResults.length} results found.
          </p>
        </ScrollShadow>
      )}
    </section>
  )
}
