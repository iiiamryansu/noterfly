import { usernameClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'

const auth = createAuthClient({
  plugins: [usernameClient()],
})

export const { signIn, signOut, signUp, useSession } = auth

export type User = typeof auth.$Infer.Session.user
