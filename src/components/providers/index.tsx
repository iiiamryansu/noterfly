import { getAllNotes } from '~/actions/note'
import ClientProvider from '~/components/providers/client-provider'
import ServerProvider from '~/components/providers/server-provider'

export default async function AppProvider({ children }: { children: React.ReactNode }) {
  const notes = await getAllNotes()

  return (
    <ServerProvider>
      <ClientProvider notes={notes}>{children}</ClientProvider>
    </ServerProvider>
  )
}
