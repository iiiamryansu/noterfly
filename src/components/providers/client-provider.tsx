'use client'

import { HeroUIProvider } from '@heroui/system'
import { useNotebookStore } from '@stores/notebook'
import { trpc } from '@trpc/c'
import { ThemeProvider } from 'next-themes'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

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

  const { setIsLoadingNotebooks, setNotebooks } = useNotebookStore()

  const { data: user } = trpc.user.getUser.useQuery()
  const { data: notebooks, isLoading: isLoadingNotebooks } = trpc.notebook.getNotebooks.useQuery()

  useEffect(() => {
    if (user) setCurrentUser(user)
  }, [user, setCurrentUser])

  useEffect(() => {
    if (isLoadingNotebooks) setIsLoadingNotebooks(true)
    else setIsLoadingNotebooks(false)
  }, [isLoadingNotebooks, setIsLoadingNotebooks])

  useEffect(() => {
    if (notebooks && !isLoadingNotebooks) setNotebooks(notebooks)
  }, [notebooks, isLoadingNotebooks, setNotebooks])

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
