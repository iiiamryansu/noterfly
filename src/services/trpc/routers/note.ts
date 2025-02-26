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
      z.discriminatedUnion('type', [
        z.object({
          isPermanent: z.boolean().optional(),
          noteId: z.string(),
          type: z.literal('single'),
        }),
        z.object({
          isPermanent: z.boolean().optional(),
          noteIds: z.array(z.string()).min(1),
          type: z.literal('multiple'),
        }),
      ]),
    )
    .mutation(async ({ ctx: { userId }, input }) => {
      const { isPermanent, type } = input

      try {
        if (type === 'single') {
          // 处理单个 Note 的删除
          if (isPermanent) {
            await prisma.note.delete({
              where: {
                id: input.noteId,
                userId,
              },
            })
          } else {
            await prisma.note.update({
              data: {
                isDeleted: true,
                notebookId: null,
                order: Date.now() / 1e6,
              },
              where: {
                id: input.noteId,
                userId,
              },
            })
          }
        } else {
          // 处理多个 Note 的删除
          if (isPermanent) {
            await prisma.note.deleteMany({
              where: {
                id: {
                  in: input.noteIds,
                },
                userId,
              },
            })
          } else {
            await prisma.note.updateMany({
              data: {
                isDeleted: true,
                notebookId: null,
                order: Date.now() / 1e6,
              },
              where: {
                id: {
                  in: input.noteIds,
                },
                userId,
              },
            })
          }
        }
      } catch (error: unknown) {
        throw new TRPCError({
          cause: error,
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete note.',
        })
      }
    }),

  getDeletedNotes: authedProcedure.query(async ({ ctx: { userId } }) => {
    try {
      const notes = await prisma.note.findMany({
        orderBy: {
          order: 'desc',
        },
        where: {
          isDeleted: true,
          userId,
        },
      })

      return notes
    } catch (error: unknown) {
      throw new TRPCError({
        cause: error,
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get deleted notes.',
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
            isDeleted: false,
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
          isDeleted: false,
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

  restoreNote: authedProcedure
    .input(
      z.discriminatedUnion('type', [
        z.object({
          noteId: z.string(),
          type: z.literal('single'),
        }),
        z.object({
          noteIds: z.array(z.string()).min(1),
          type: z.literal('multiple'),
        }),
      ]),
    )
    .mutation(async ({ ctx: { userId }, input }) => {
      const { type } = input

      try {
        if (type === 'single') {
          // 处理单个 Note 的恢复
          await prisma.note.update({
            data: {
              isDeleted: false,
              notebookId: null,
              order: Date.now() / 1e6,
            },
            where: {
              id: input.noteId,
              userId,
            },
          })
        } else {
          // 处理多个 Note 的恢复
          await prisma.note.updateMany({
            data: {
              isDeleted: false,
              notebookId: null,
              order: Date.now() / 1e6,
            },
            where: {
              id: {
                in: input.noteIds,
              },
              userId,
            },
          })
        }
      } catch (error: unknown) {
        throw new TRPCError({
          cause: error,
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to restore note.',
        })
      }
    }),

  searchNotes: authedProcedure
    .input(
      z.object({
        query: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx: { userId }, input: { query } }) => {
      try {
        const notes = await prisma.note.findMany({
          orderBy: {
            title: 'asc',
          },
          select: {
            id: true,
            title: true,
          },
          where: {
            isDeleted: false,
            OR: [
              {
                title: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
              {
                content: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
            ],
            userId,
          },
        })

        return notes
      } catch (error: unknown) {
        throw new TRPCError({
          cause: error,
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to search notes.',
        })
      }
    }),

  updateNote: authedProcedure
    .input(
      z.object({
        data: z.object({
          content: z.string().optional(),
          isStarred: z.boolean().optional(),
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
            id: true,
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
