import type { Note } from '@prisma/client'

import { NextRequest, NextResponse } from 'next/server'

import { getUser } from '~/actions/auth'
import { prisma } from '~/lib/prisma'
import { genErrorResponse, genSuccessResponse } from '~/utils'

// 获取指定 ID 的笔记
export async function GET(request: NextRequest, { params }: { params: Promise<{ noteId: string }> }): Promise<NextResponse> {
  const user = await getUser()

  if (user === null) return genErrorResponse({ message: 'Unauthorized!', status: 401 })

  try {
    const { noteId } = await params

    const note = await prisma.note.findUnique({
      where: {
        id: noteId,
        userId: user.id,
      },
    })

    if (note === null) {
      return genErrorResponse({ message: 'Note not found!', status: 404 })
    }

    return genSuccessResponse<Note>({ payload: note })
  } catch (error: unknown) {
    return genErrorResponse({ details: error, message: 'Get note error!' })
  }
}

// 更新指定 ID 的笔记
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ noteId: string }> }): Promise<NextResponse> {
  const user = await getUser()

  if (user === null) return genErrorResponse({ message: 'Unauthorized!', status: 401 })

  try {
    const { noteId } = await params

    const data = await request.json()

    await prisma.note.update({
      data,
      where: {
        id: noteId,
        userId: user.id,
      },
    })

    return genSuccessResponse({ message: 'Update note success!' })
  } catch (error: unknown) {
    return genErrorResponse({ details: error, message: 'Update note error!' })
  }
}
