'use client'

import { Button } from '@heroui/react'
import { Calendar03Icon, CheckmarkSquare01Icon, NoteIcon, Settings01Icon, StarIcon, StickyNote01Icon } from 'hugeicons-react'
import { usePathname, useRouter } from 'next/navigation'

const items = [
  { icon: NoteIcon, label: 'All notes', path: '/notes' },
  { icon: Calendar03Icon, label: 'Calendar', path: '/calendar' },
  { icon: CheckmarkSquare01Icon, label: 'Tasks', path: '/tasks' },
  { icon: StarIcon, label: 'Starred', path: '/notes/starred' },
  { icon: StickyNote01Icon, label: 'My templates', path: '/notes/template' },
  { icon: Settings01Icon, label: 'Settings', path: '/settings' },
]

export function NavigationPanel() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <section className="flex flex-col gap-1">
      {items.map(({ icon: Icon, label, path }) => (
        <Button
          className="justify-start"
          key={path}
          onPress={() => router.push(path)}
          size="sm"
          startContent={<Icon className="size-4" />}
          variant={pathname === path ? 'flat' : 'light'}
        >
          {label}
        </Button>
      ))}
    </section>
  )
}
