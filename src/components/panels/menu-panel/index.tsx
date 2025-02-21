'use client'

import { Button } from '@heroui/button'
import { trpc } from '@trpc/c'
import { Home01Icon, Note01Icon } from 'hugeicons-react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { v4 as uuid } from 'uuid'

export default function MenuPanel() {
  const utils = trpc.useUtils()

  const router = useRouter()

  const t = useTranslations('Layout.Sidebar.MenuPanel')

  const { mutate: createNote } = trpc.note.createNote.useMutation({
    onMutate: ({ noteId }) => {
      router.push(`/note/${noteId}`)
    },
    onSuccess: () => {
      utils.note.getNote.invalidate()
      utils.note.getNotes.invalidate()
    },
  })

  return (
    <section className="flex flex-col gap-1">
      <Button
        className="justify-start"
        onPress={() => router.push('/home')}
        size="sm"
        startContent={<Home01Icon className="size-4" />}
        variant="light"
      >
        {t('home')}
      </Button>
      <Button
        className="justify-start"
        onPress={() => createNote({ noteId: uuid() })}
        size="sm"
        startContent={<Note01Icon className="size-4" />}
        variant="light"
      >
        {t('new-note')}
      </Button>
    </section>
  )
}
