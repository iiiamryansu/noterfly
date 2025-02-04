'use server'

import type { Note } from '@prisma/client'

import { getUser } from '~/actions/auth'
import { prisma } from '~/lib/prisma'

export async function getAllNotes(): Promise<Note[]> {
  const user = await getUser()

  if (user) {
    const allNotes = await prisma.note.findMany({
      where: {
        userId: user.id,
      },
    })

    return allNotes
  } else {
    return []
  }
}
