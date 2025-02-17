'use server'

import { revalidatePath } from 'next/cache'

import { getUser } from '~/actions/auth'
import { prisma } from '~/lib/prisma'

export async function updateNoteById(id: string, data: { content?: string; title?: string }): Promise<void> {
  const user = await getUser()

  if (user) {
    await prisma.note.update({
      data,
      where: {
        id,
        userId: user.id,
      },
    })

    revalidatePath(`/note/${id}`)
  }
}
