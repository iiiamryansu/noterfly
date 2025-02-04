'use client'

import type { Note } from '@prisma/client'

import { ScrollShadow } from '@heroui/react'

import { Content, Header } from '~/components/note'
import '~/styles/tiptap.css'

export function Note({ note }: { note: Note }) {
  return (
    <ScrollShadow className="grid h-full grid-cols-1 grid-rows-[332px_1fr] gap-12" hideScrollBar>
      <Header note={note} />
      <Content note={note} />
    </ScrollShadow>
  )
}
