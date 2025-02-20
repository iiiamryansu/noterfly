import type { NextRequest } from 'next/server'

import { fetchRequestHandler } from '@trpc/server/adapters/fetch'

import { env } from '~/env'
import { createTRPCContext } from '~/services/trpc'
import { appRouter } from '~/services/trpc/routers'

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a HTTP request (e.g. when you make requests from Client Components).
 */
async function createContext(req: NextRequest) {
  return createTRPCContext({
    headers: req.headers,
  })
}

function handler(req: NextRequest) {
  return fetchRequestHandler({
    createContext: () => createContext(req),
    endpoint: '/api/trpc',
    onError:
      env.NODE_ENV === 'development'
        ? ({ error, path }) => {
            console.error(`❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`)
          }
        : undefined,
    req,
    router: appRouter,
  })
}

export { handler as GET, handler as POST }
