import 'server-only'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { prisma } from '~/lib/prisma'
import { authedProcedure, createTRPCRouter } from '~/services/trpc'
import { UpdateProfileSchema } from '~/services/trpc/schemas/user'

export const userRouter = createTRPCRouter({
  getCurrentUser: authedProcedure.query(async ({ ctx: { userId } }) => {
    try {
      const currentUser = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      })

      return currentUser
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to get current user: ${error.message}.`,
        })
      }

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get current user.',
      })
    }
  }),
  updateProfile: authedProcedure
    .input(
      z.object({
        data: UpdateProfileSchema,
      }),
    )
    .mutation(async ({ ctx: { userId }, input: { data } }) => {
      try {
        const updatedUser = await prisma.user.update({
          data,
          select: {
            image: true,
            name: true,
          },
          where: {
            id: userId,
          },
        })

        return updatedUser
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Failed to update user: ${error.message}.`,
          })
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update user.',
        })
      }
    }),
})
