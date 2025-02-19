import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { nextCookies } from 'better-auth/next-js'
import { username } from 'better-auth/plugins'
import { emailOTP } from 'better-auth/plugins'

import { sendVerificationEmail } from '~/actions/auth'
import { prisma } from '~/lib/prisma'

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
          sendVerificationEmail(email, otp)
        } else {
          // Send the OTP for password reset
        }
      },
    }),
    nextCookies(),
  ], // make sure the nextCookies() is the last plugin in the array
  trustedOrigins: ['https://noterfly.iamryansu.com'],
})

export type User = typeof auth.$Infer.Session.user
