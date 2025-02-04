'use server'

import type { Note } from '@prisma/client'

import { getUser } from '~/actions/auth'
import { prisma } from '~/lib/prisma'

export async function getNoteById(id: string): Promise<Note | null> {
  const user = await getUser()

  if (user) {
    const note = await prisma.note.findUnique({
      where: {
        id,
        userId: user.id,
      },
    })

    return note
  }

  return null
}
