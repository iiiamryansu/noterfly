'use client'

import { Button } from '@heroui/react'
import { Calendar03Icon, CheckmarkSquare01Icon, NoteIcon, Settings01Icon, StarIcon, StickyNote01Icon } from 'hugeicons-react'
import { useTranslations } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'

export default function NavigationPanel() {
  const pathname = usePathname()
  const router = useRouter()

  const t = useTranslations('Layout.Sidebar.NavigationPanel')

  const items = [
    { icon: NoteIcon, label: t('all-notes'), path: '/notes' },
    { icon: Calendar03Icon, label: t('calendar'), path: '/calendar' },
    { icon: CheckmarkSquare01Icon, label: t('tasks'), path: '/tasks' },
    { icon: StarIcon, label: t('starred'), path: '/notes/starred' },
    { icon: StickyNote01Icon, label: t('my-template'), path: '/notes/template' },
    { icon: Settings01Icon, label: t('settings'), path: '/settings' },
  ]

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
