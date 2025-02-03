'use client'

import { LanguageIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import { Button } from '@heroui/react'
import { HelpCircleIcon } from 'hugeicons-react'
import { useTheme } from 'next-themes'

export function ControlPanel() {
  const { setTheme, theme } = useTheme()

  return (
    <footer className="flex items-center justify-between">
      <Button className="justify-start" size="sm" startContent={<HelpCircleIcon className="size-4" />} variant="light">
        Help Center
      </Button>

      <section className="flex items-center gap-1">
        <Button isIconOnly size="sm" variant="light">
          <LanguageIcon className="size-4" />
        </Button>
        <Button isIconOnly onPress={() => setTheme(theme === 'light' ? 'dark' : 'light')} size="sm" variant="light">
          {theme === 'light' ? <SunIcon className="size-4" /> : <MoonIcon className="size-4" />}
        </Button>
      </section>
    </footer>
  )
}
