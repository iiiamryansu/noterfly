import { prisma } from '@prisma'
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { nextCookies } from 'better-auth/next-js'
import { username } from 'better-auth/plugins'
import { emailOTP } from 'better-auth/plugins'

import { trpc } from '~/lib/trpc/server'

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    username(),
    emailOTP({
      disableSignUp: true,
      expiresIn: 10 * 60,
      otpLength: 6,
      sendVerificationOnSignUp: false,
      async sendVerificationOTP({ email, otp, type }) {
        if (type === 'sign-in') {
          // Send the OTP for sign-in
        } else if (type === 'email-verification') {
          // Send the OTP for email verification
          await trpc.resend.sendVerificationEmail({ email, otp })
        } else {
          // Send the OTP for password reset
        }
      },
    }),
    nextCookies(),
  ], // make sure the nextCookies() is the last plugin in the array

  // https://www.better-auth.com/docs/guides/optimizing-for-performance#cookie-cache
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
    },
  },

  trustedOrigins: ['https://noterfly.iamryansu.com'],
  user: {
    deleteUser: {
      enabled: true,
    },
  },
})

export type User = typeof auth.$Infer.Session.user
