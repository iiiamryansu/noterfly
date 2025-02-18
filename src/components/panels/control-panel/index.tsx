'use client'

import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import { Button } from '@heroui/react'
import { HelpCircleIcon } from 'hugeicons-react'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'

import LanguageSelector from '~/components/panels/control-panel/language-selector'

export default function ControlPanel() {
  const { setTheme, theme } = useTheme()

  const t = useTranslations('Layout.Sidebar.ControlPanel')

  return (
    <footer className="flex items-center justify-between">
      <Button className="justify-start" size="sm" startContent={<HelpCircleIcon className="size-4" />} variant="light">
        {t('help-center')}
      </Button>

      <section className="flex items-center gap-1">
        <LanguageSelector />
        <Button isIconOnly onPress={() => setTheme(theme === 'light' ? 'dark' : 'light')} size="sm" variant="light">
          {theme === 'light' ? <SunIcon className="size-4" /> : <MoonIcon className="size-4" />}
        </Button>
      </section>
    </footer>
  )
}
