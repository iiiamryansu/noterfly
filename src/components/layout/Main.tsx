'use client'

import { useTheme } from 'next-themes'
import { Toaster } from 'sonner'

export function Main({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme()

  return (
    <main className="relative mb-2 mr-2 h-[calc(100vh-56px)] flex-1 overflow-hidden rounded-md border border-divider bg-background">
      <Toaster
        className="absolute"
        offset={16}
        position="top-center"
        theme={theme === 'light' ? 'dark' : 'light'}
        toastOptions={{
          classNames: {
            toast: 'bg-base-default border-divider h-12',
          },
        }}
      />

      {children}
    </main>
  )
}
