'use client'

import { HeroUIProvider } from '@heroui/system'
import { ThemeProvider } from 'next-themes'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { useUser } from '~/hooks/auth'
import { useUserStore } from '~/stores/user-store'

declare module '@react-types/shared' {
  interface RouterConfig {
    routerOptions: NonNullable<Parameters<ReturnType<typeof useRouter>['push']>[1]>
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const user = useUser()
  const setCurrentUser = useUserStore((state) => state.setCurrentUser)

  useEffect(() => {
    if (user) setCurrentUser(user)
  }, [user, setCurrentUser])

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
