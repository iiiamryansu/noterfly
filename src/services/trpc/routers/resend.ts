import 'server-only'

import type { ReactElement } from 'react'

import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { VerificationEmail } from '~/components/templates'
import { resend } from '~/lib/resend'
import { createTRPCRouter, publicProcedure } from '~/services/trpc'

export const resendRouter = createTRPCRouter({
  sendVerificationEmail: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        otp: z.string(),
      }),
    )
    .mutation(async ({ input: { email, otp } }) => {
      try {
        await resend.emails.send({
          from: 'Noterfly <no-reply@resend.iamryansu.com>',
          react: VerificationEmail({ verificationCode: otp }) as ReactElement,
          subject: 'Verify your email',
          to: [email],
        })
      } catch (error: unknown) {
        throw new TRPCError({
          cause: error,
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to send verification email.',
        })
      }
    }),
})
