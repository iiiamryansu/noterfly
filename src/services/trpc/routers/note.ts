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
            order: Date.now() / 1e6,
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
        include: {
          notebook: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          order: 'desc',
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

  moveToNotebook: authedProcedure
    .input(
      z.object({
        notebookId: z.string().optional(),
        noteId: z.string(),
      }),
    )
    .mutation(async ({ ctx: { userId }, input: { notebookId, noteId } }) => {
      try {
        await prisma.note.update({
          data: {
            notebookId: notebookId === 'unsorted' ? null : notebookId,
            order: Date.now() / 1e6,
          },
          where: {
            id: noteId,
            userId,
          },
        })
      } catch (error: unknown) {
        throw new TRPCError({
          cause: error,
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to move to notebook.',
        })
      }
    }),

  reorderNote: authedProcedure
    .input(
      z.object({
        newOrder: z.number(),
        noteId: z.string(),
        targetNotebookId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx: { userId }, input: { newOrder, noteId, targetNotebookId } }) => {
      try {
        await prisma.note.update({
          data: {
            order: newOrder,
            ...(targetNotebookId && { notebookId: targetNotebookId }),
          },
          where: {
            id: noteId,
            userId,
          },
        })
      } catch (error: unknown) {
        throw new TRPCError({
          cause: error,
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to reorder note.',
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
