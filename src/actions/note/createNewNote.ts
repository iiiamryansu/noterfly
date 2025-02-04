'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { getUser } from '~/actions/auth'
import { prisma } from '~/lib/prisma'

export async function createNewNote(): Promise<void> {
  const user = await getUser()

  if (user) {
    const newNote = await prisma.note.create({
      data: {
        content: 'Hello, world! 🌏',
        title: 'New Note',
        userId: user.id,
      },
    })

    revalidatePath('/notes')
    redirect(`/notes/note/${newNote.id}`)
  }
}
