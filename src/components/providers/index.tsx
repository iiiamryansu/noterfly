import { getAllNotes } from '~/actions/note'
import ClientProvider from '~/components/providers/client-provider'
import ServerProvider from '~/components/providers/server-provider'
import { TRPCProvider } from '~/lib/trpc/client'

export default async function AppProvider({ children }: { children: React.ReactNode }) {
  const notes = await getAllNotes()

  return (
    <ServerProvider>
      <TRPCProvider>
        <ClientProvider notes={notes}>{children}</ClientProvider>
      </TRPCProvider>
    </ServerProvider>
  )
}
