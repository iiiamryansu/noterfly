import 'server-only'
import { createHydrationHelpers } from '@trpc/react-query/rsc'
import { headers } from 'next/headers'
import { cache } from 'react'

import type { AppRouter } from '~/services/trpc/routers'

import { auth } from '~/lib/auth'
import { createQueryClient } from '~/lib/trpc/query-client'
import { createTRPCContext } from '~/services/trpc'
import { createCaller } from '~/services/trpc/routers'

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
  const newHeaders = new Headers(await headers())

  newHeaders.set('x-trpc-source', 'rsc')

  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const userId = session?.user?.id || null

  return createTRPCContext({
    headers: newHeaders,
    userId,
  })
})

const getQueryClient = cache(createQueryClient)

const caller = createCaller(createContext)

export const { HydrateClient, trpc } = createHydrationHelpers<AppRouter>(caller, getQueryClient)
