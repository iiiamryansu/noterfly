'use server'

import type { User } from '@prisma/client'

import { headers } from 'next/headers'

import { auth } from '~/lib/auth'

export async function getUser(): Promise<null | User> {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (session) {
    return session.user as User
  } else {
    return null
  }
}
