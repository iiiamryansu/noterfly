export function Main({ children }: { children: React.ReactNode }) {
  return (
    <main className="mb-2 mr-2 h-[calc(100vh-56px)] flex-1 overflow-hidden rounded-md border border-divider bg-background">
      {children}
    </main>
  )
}
