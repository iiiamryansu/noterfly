'use client'

import { Button } from '@heroui/react'
import { Home01Icon, Note01Icon } from 'hugeicons-react'
import { useRouter } from 'next/navigation'

import { createNewNote } from '~/actions/note'

export function MenuPanel() {
  const router = useRouter()

  return (
    <section className="flex flex-col gap-1">
      <Button
        className="justify-start"
        onPress={() => router.push('/home')}
        size="sm"
        startContent={<Home01Icon className="size-4" />}
        variant="light"
      >
        Home
      </Button>
      <Button
        className="justify-start"
        onPress={createNewNote}
        size="sm"
        startContent={<Note01Icon className="size-4" />}
        variant="light"
      >
        New note
      </Button>
    </section>
  )
}
