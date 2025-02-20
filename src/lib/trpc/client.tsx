'use client'

import type { QueryClient } from '@tanstack/react-query'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'

import { QueryClientProvider } from '@tanstack/react-query'
import { loggerLink, unstable_httpBatchStreamLink } from '@trpc/client'
import { createTRPCReact } from '@trpc/react-query'
import { useState } from 'react'
import { SuperJSON } from 'superjson'

import type { AppRouter } from '~/services/trpc/routers'

import { createQueryClient } from '~/lib/trpc/query-client'

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>

let clientQueryClientSingleton: QueryClient | undefined

function getBaseUrl() {
  if (typeof window !== 'undefined') return window.location.origin

  return `http://localhost:${process.env.APP_PORT ?? 3000}`
}

function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return createQueryClient()
  }

  // Browser: use singleton pattern to keep the same query client
  return (clientQueryClientSingleton ??= createQueryClient())
}

export const trpc = createTRPCReact<AppRouter>()

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient()

  const [trpcClient] = useState(() => {
    return trpc.createClient({
      links: [
        loggerLink({
          enabled: (op) => process.env.NODE_ENV === 'development' || (op.direction === 'down' && op.result instanceof Error),
        }),
        unstable_httpBatchStreamLink({
          headers: () => {
            const headers = new Headers()

            headers.set('x-trpc-source', 'nextjs-react')

            return headers
          },
          transformer: SuperJSON,
          url: getBaseUrl() + '/api/trpc',
        }),
      ],
    })
  })

  return (
    <QueryClientProvider client={queryClient}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        {children}
      </trpc.Provider>
    </QueryClientProvider>
  )
}
