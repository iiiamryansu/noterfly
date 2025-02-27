import 'server-only'
import { prisma } from '@prisma'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { authedProcedure, createTRPCRouter, publicProcedure } from '~/services/trpc'

export const notebookRouter = createTRPCRouter({
  createNotebook: authedProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx: { userId }, input: { name } }) => {
      try {
        await prisma.notebook.create({
          data: {
            name,
            order: Date.now() / 1e6,
            userId,
          },
        })
      } catch (error: unknown) {
        throw new TRPCError({
          cause: error,
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create notebook.',
        })
      }
    }),

  getNotebooks: publicProcedure.query(async ({ ctx: { userId } }) => {
    try {
      if (userId) {
        const notebooks = await prisma.notebook.findMany({
          include: {
            notes: {
              orderBy: {
                order: 'desc',
              },
              select: {
                icon: true,
                id: true,
                order: true,
                title: true,
              },
              where: {
                isDeleted: false,
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

        return notebooks
      } else {
        return []
      }
    } catch (error: unknown) {
      throw new TRPCError({
        cause: error,
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get notebooks.',
      })
    }
  }),

  reorderNotebook: authedProcedure
    .input(
      z.object({
        newOrder: z.number(),
        notebookId: z.string(),
      }),
    )
    .mutation(async ({ ctx: { userId }, input: { newOrder, notebookId } }) => {
      try {
        await prisma.notebook.update({
          data: {
            order: newOrder,
          },
          where: {
            id: notebookId,
            userId,
          },
        })
      } catch (error: unknown) {
        throw new TRPCError({
          cause: error,
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to reorder notebook.',
        })
      }
    }),
})
