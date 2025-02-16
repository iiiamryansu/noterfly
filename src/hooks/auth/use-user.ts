import { type User, useSession } from '~/lib/auth/client'

export function useUser(): null | User {
  const { data: session } = useSession()

  const user = session?.user

  return user ?? null
}
