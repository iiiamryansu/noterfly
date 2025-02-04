'use server'

import { revalidatePath } from 'next/cache'

import { getUser } from '~/actions/auth'
import { prisma } from '~/lib/prisma'

export async function deleteNoteById(id: string): Promise<void> {
  const user = await getUser()

  if (user) {
    await prisma.note.delete({
      where: {
        id,
        userId: user.id,
      },
    })

    revalidatePath('/notes')
  }
}
