import 'server-only'

import type { ReactElement } from 'react'

import { env } from '@env'
import { TRPCError } from '@trpc/server'
import { Resend } from 'resend'
import { z } from 'zod'

import { VerificationEmail } from '~/components/templates'
import { createTRPCRouter, publicProcedure } from '~/services/trpc'

let resend: null | Resend = null

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
        if (!resend) {
          resend = new Resend(env.RESEND_API_KEY)
        }

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
