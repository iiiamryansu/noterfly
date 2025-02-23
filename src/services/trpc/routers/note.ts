import 'server-only'
import { prisma } from '@prisma'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { authedProcedure, createTRPCRouter } from '~/services/trpc'

export const noteRouter = createTRPCRouter({
  createNote: authedProcedure
    .input(
      z.object({
        noteId: z.string(),
      }),
    )
    .mutation(async ({ ctx: { userId }, input: { noteId } }) => {
      try {
        const note = await prisma.note.create({
          data: {
            content: `{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Hello, world! 🌏"}]}]}`,
            id: noteId,
            title: 'New Note',
            userId,
          },
        })

        return note
      } catch (error: unknown) {
        throw new TRPCError({
          cause: error,
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create note.',
        })
      }
    }),

  deleteNote: authedProcedure
    .input(
      z.object({
        noteId: z.string(),
      }),
    )
    .mutation(async ({ ctx: { userId }, input: { noteId } }) => {
      try {
        await prisma.note.delete({
          where: {
            id: noteId,
            userId,
          },
        })
      } catch (error: unknown) {
        throw new TRPCError({
          cause: error,
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete note.',
        })
      }
    }),

  getNote: authedProcedure
    .input(
      z.object({
        noteId: z.string(),
      }),
    )
    .query(async ({ ctx: { userId }, input: { noteId } }) => {
      try {
        const note = await prisma.note.findUnique({
          where: {
            id: noteId,
            userId,
          },
        })

        return note
      } catch (error: unknown) {
        throw new TRPCError({
          cause: error,
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get note.',
        })
      }
    }),

  getNotes: authedProcedure.query(async ({ ctx: { userId } }) => {
    try {
      const notes = await prisma.note.findMany({
        orderBy: {
          updatedAt: 'desc',
        },
        where: {
          userId,
        },
      })

      return notes
    } catch (error: unknown) {
      throw new TRPCError({
        cause: error,
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get notes.',
      })
    }
  }),

  updateNote: authedProcedure
    .input(
      z.object({
        data: z.object({
          content: z.string().optional(),
          title: z.string().optional(),
        }),
        noteId: z.string(),
      }),
    )
    .mutation(async ({ ctx: { userId }, input: { data, noteId } }) => {
      try {
        const updatedNote = await prisma.note.update({
          data,
          select: {
            content: true,
            title: true,
          },
          where: {
            id: noteId,
            userId,
          },
        })

        return updatedNote
      } catch (error: unknown) {
        throw new TRPCError({
          cause: error,
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update note.',
        })
      }
    }),
})
