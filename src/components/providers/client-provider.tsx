'use client'

import { HeroUIProvider } from '@heroui/system'
import { ThemeProvider } from 'next-themes'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { trpc } from '~/lib/trpc/client'
import { useUserStore } from '~/stores/user-store'

declare module '@react-types/shared' {
  interface RouterConfig {
    routerOptions: NonNullable<Parameters<ReturnType<typeof useRouter>['push']>[1]>
  }
}

interface ClientProviderProps {
  children: React.ReactNode
}

export default function ClientProvider({ children }: ClientProviderProps) {
  const router = useRouter()

  const setCurrentUser = useUserStore((state) => state.setCurrentUser)

  const { data: currentUser } = trpc.user.getCurrentUser.useQuery()

  useEffect(() => {
    if (currentUser) setCurrentUser(currentUser)
  }, [currentUser, setCurrentUser])

  /* ------------------------------ 避免水合阶段的不匹配问题 ------------------------------ */

  const [mounted, setMounted] = useState<boolean>(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  /* -------------------------------------------------------------------------- */

  return (
    <HeroUIProvider className="h-full" navigate={router.push}>
      <ThemeProvider attribute="class">{children}</ThemeProvider>
    </HeroUIProvider>
  )
}
