import { Headbar, Main, Sidebar } from '~/components/layout'

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid h-full grid-cols-[256px_1fr] grid-rows-[48px_1fr] bg-base-default">
      <Sidebar />
      <Headbar />
      <Main>{children}</Main>
    </div>
  )
}
