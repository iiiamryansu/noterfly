'use client'

import { Button, ScrollShadow } from '@heroui/react'
import {
  Add01Icon,
  Cancel01Icon,
  Clock01Icon,
  Comment01Icon,
  Note01Icon,
  SidebarLeft01Icon,
  SidebarRight01Icon,
  SquareLock02Icon,
  StarIcon,
} from 'hugeicons-react'
import { usePathname, useRouter } from 'next/navigation'

import { cn } from '~/utils'

let notes = [
  {
    id: '01JJ6JFM2K2E4NCFMYJ5MMQ5PM',
    title: 'Noterfly Handbook',
  },
  {
    id: '01JJ6JFY9K9ZEQHZ4XQ14HQFB5',
    title: 'Get Started: How to use Noterfly',
  },
  {
    id: '01JJ6JG2SD00YJWR824A635N97',
    title: 'Features Overview',
  },
  {
    id: '01JJ6JG6JTKC7ED2S6BD1VH8MX',
    title: 'Pricing Plans',
  },
  {
    id: '01JJ6K5TZJR0MVV27NZV7GHDSK',
    title: 'Privacy Policy',
  },
  {
    id: '01JJ6JG9NWCK64STKQPDFHQ993',
    title: 'About Noterfly',
  },
]

interface HeadbarProps {
  isSidebarExpanded: boolean
  toggleSidebarAction: () => void
}

export default function Headbar({ isSidebarExpanded, toggleSidebarAction }: HeadbarProps) {
  const pathname = usePathname()
  const router = useRouter()

  function handleNoteTabClose(noteId: string) {
    notes = notes.filter((note) => note.id !== noteId)

    if (notes.length === 0) {
      router.push('/notes')
    } else if (pathname.includes(noteId)) {
      router.push(`/note/${notes[0].id}`)
    } else {
      router.push(`/note/${noteId}`)
    }
  }

  return (
    <header className="mx-2 grid grid-cols-[32px_1fr_188px] grid-rows-1 items-center gap-2">
      {/* Toggle sidebar */}
      <Button
        className="text-default-500 hover:text-default-700"
        disableAnimation
        isIconOnly
        onPress={toggleSidebarAction}
        size="sm"
        variant="light"
      >
        {isSidebarExpanded ? <SidebarLeft01Icon className="size-4" /> : <SidebarRight01Icon className="size-4" />}
      </Button>

      {/* Note tabs */}
      <section className="flex items-center gap-1 overflow-x-scroll">
        <ScrollShadow className="flex items-center gap-1" hideScrollBar orientation="horizontal">
          {notes.map((note) => {
            const isActive = pathname.includes(note.id)

            return (
              <Button
                className={cn('group', 'min-w-36', !isActive && 'text-default-500')}
                endContent={
                  <Cancel01Icon
                    className={cn('size-4 flex-shrink-0', 'opacity-0 group-hover:opacity-100', 'transition-all duration-300')}
                    onClick={() => handleNoteTabClose(note.id)}
                  />
                }
                key={note.id}
                onPress={() => router.push(`/note/${note.id}`)}
                size="sm"
                startContent={<Note01Icon className="size-4 flex-shrink-0" />}
                variant={isActive ? 'solid' : 'ghost'}
              >
                <span className="truncate" style={{ direction: 'ltr' }}>
                  {note.title}
                </span>
              </Button>
            )
          })}
        </ScrollShadow>

        {/* Open note */}
        {notes.length !== 0 && (
          <Button className="text-default-500" isIconOnly size="sm" variant="light">
            <Add01Icon className="size-4" />
          </Button>
        )}
      </section>

      {/* Note actions */}
      <section className="flex items-center gap-1">
        <Button isIconOnly size="sm" variant="light">
          <StarIcon className="size-4" />
        </Button>
        <Button isIconOnly size="sm" variant="light">
          <Clock01Icon className="size-4" />
        </Button>
        <Button isIconOnly size="sm" variant="light">
          <Comment01Icon className="size-4" />
        </Button>
        <Button className="w-20" size="sm" startContent={<SquareLock02Icon className="size-4" />} variant="flat">
          Share
        </Button>
      </section>
    </header>
  )
}
