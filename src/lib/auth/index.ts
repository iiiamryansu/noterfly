import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { nextCookies } from 'better-auth/next-js'
import { username } from 'better-auth/plugins'

import { prisma } from '~/lib/prisma'

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [username(), nextCookies()], // make sure the nextCookies() is the last plugin in the array
  trustedOrigins: ['https://noterfly.iamryansu.com'],
})

export type User = typeof auth.$Infer.Session.user
