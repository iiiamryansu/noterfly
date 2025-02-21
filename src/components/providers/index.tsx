import ClientProvider from '~/components/providers/client-provider'
import ServerProvider from '~/components/providers/server-provider'
import { TRPCProvider } from '~/lib/trpc/client'

export default async function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <ServerProvider>
      <TRPCProvider>
        <ClientProvider>{children}</ClientProvider>
      </TRPCProvider>
    </ServerProvider>
  )
}
