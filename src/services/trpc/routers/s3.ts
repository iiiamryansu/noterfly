import 'server-only'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { TRPCError } from '@trpc/server'
import { v4 as uuid } from 'uuid'
import { z } from 'zod'

import { env } from '~/env'
import { S3 } from '~/lib/s3'
import { authedProcedure, createTRPCRouter } from '~/services/trpc'

export const s3Router = createTRPCRouter({
  getSignedUrl: authedProcedure
    .input(
      z.object({
        type: z.enum(['avatar', 'image']),
      }),
    )
    .output(
      z.object({
        signedUrl: z.string().url(),
        url: z.string().url(),
      }),
    )
    .mutation(async ({ ctx: { userId }, input }) => {
      try {
        let path: string = ''

        if (input.type === 'avatar') {
          path = `users/${userId}/avatars/${uuid()}`
        } else if (input.type === 'image') {
          path = `users/${userId}/files/images/${uuid()}`
        }

        const url = `${env.CLOUDFLARE_R2_PUBLIC_URL}/${path}`

        const signedUrl = await getSignedUrl(
          S3,
          new PutObjectCommand({
            Bucket: env.CLOUDFLARE_R2_BUCKET,
            Key: path,
          }),
          {
            expiresIn: 600,
          },
        )

        return { signedUrl, url }
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Failed to get signed url: ${error.message}.`,
          })
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get signed url.',
        })
      }
    }),
})
