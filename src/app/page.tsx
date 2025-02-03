'use client'

import { Button } from '@heroui/button'
import { useTheme } from 'next-themes'

export default function RootPage() {
  const { setTheme, theme } = useTheme()

  return (
    <div className="flex h-full flex-col items-center justify-center gap-8">
      <h1 className="text-3xl font-bold text-primary-900">Noterfly</h1>
      <Button onPress={() => setTheme(theme === 'light' ? 'dark' : 'light')}>{theme === 'light' ? 'Light' : 'Dark'}</Button>
    </div>
  )
}
