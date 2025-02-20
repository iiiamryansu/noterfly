import { defaultShouldDehydrateQuery, QueryClient } from '@tanstack/react-query'
import { SuperJSON } from 'superjson'

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      dehydrate: {
        serializeData: SuperJSON.serialize,
        shouldDehydrateQuery: (query) => defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
      },
      hydrate: {
        deserializeData: SuperJSON.deserialize,
      },
      queries: {
        staleTime: 60 * 1000,
      },
    },
  })
}
