'use client'

import { HeroUIProvider } from '@heroui/system'
import { useNotebookStore } from '@stores/notebook'
import { useUserStore } from '@stores/user'
import { trpc } from '@trpc/c'
import { ThemeProvider } from 'next-themes'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

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

  const { isAuthed, setCurrentUser } = useUserStore()

  const { setIsLoadingNotebooks, setNotebooks } = useNotebookStore()

  const { data: user, isFetching: isLoadingUser } = trpc.user.getUser.useQuery(undefined, {
    enabled: !!isAuthed,
  })
  const { data: notebooks, isFetching: isLoadingNotebooks } = trpc.notebook.getNotebooks.useQuery(undefined, {
    enabled: !!isAuthed,
  })

  useEffect(() => {
    if (!isLoadingUser && user) setCurrentUser(user)
  }, [isLoadingUser, user, setCurrentUser])

  useEffect(() => {
    if (isLoadingNotebooks) setIsLoadingNotebooks(true)
    else setIsLoadingNotebooks(false)
  }, [isLoadingNotebooks, setIsLoadingNotebooks])

  useEffect(() => {
    if (!isLoadingNotebooks && notebooks) setNotebooks(notebooks)
  }, [isLoadingNotebooks, notebooks, setNotebooks])

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
