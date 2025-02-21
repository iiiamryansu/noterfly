import { TRPCProvider } from '@trpc/c'

import ClientProvider from '~/components/providers/client-provider'
import ServerProvider from '~/components/providers/server-provider'

export default async function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <ServerProvider>
      <TRPCProvider>
        <ClientProvider>{children}</ClientProvider>
      </TRPCProvider>
    </ServerProvider>
  )
}
