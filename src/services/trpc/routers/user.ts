import 'server-only'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { auth } from '~/lib/auth'
import { prisma } from '~/lib/prisma'
import { authedProcedure, createTRPCRouter, publicProcedure } from '~/services/trpc'
import { UpdatePasswordSchema, UpdateProfileSchema } from '~/services/trpc/schemas/user'

export const userRouter = createTRPCRouter({
  getUser: publicProcedure.query(async ({ ctx: { userId } }) => {
    try {
      if (userId) {
        const user = await prisma.user.findUnique({
          where: {
            id: userId,
          },
        })

        return user
      } else {
        return null
      }
    } catch (error: unknown) {
      throw new TRPCError({
        cause: error,
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get user.',
      })
    }
  }),

  updatePassword: authedProcedure
    .input(UpdatePasswordSchema)
    .mutation(async ({ ctx: { userId }, input: { currentPassword, newPassword } }) => {
      try {
        const authContext = await auth.$context

        const hashedCurrentPassword = await authContext.internalAdapter
          .findAccountByUserId(userId)
          .then((account) => account[0].password)

        if (!hashedCurrentPassword) {
          return {
            message: 'Unable to update password. 🥲',
            status: 'error',
          }
        }

        const isVerified = await authContext.password.verify({ hash: hashedCurrentPassword, password: currentPassword })

        if (!isVerified) {
          return {
            message: 'Current password is incorrect. 🥲',
            status: 'error',
          }
        }

        const hashedNewPassword = await authContext.password.hash(newPassword)

        await authContext.internalAdapter.updatePassword(userId, hashedNewPassword)

        return {
          message: 'Password updated successfully. 🥳',
          status: 'success',
        }
      } catch (error: unknown) {
        throw new TRPCError({
          cause: error,
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update password.',
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
        throw new TRPCError({
          cause: error,
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update profile.',
        })
      }
    }),
})
