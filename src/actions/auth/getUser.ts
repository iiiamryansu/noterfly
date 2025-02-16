'use server'

import { headers } from 'next/headers'

import { auth, type User } from '~/lib/auth'

export async function getUser(): Promise<null | User> {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const user = session?.user

  return user ?? null
}
