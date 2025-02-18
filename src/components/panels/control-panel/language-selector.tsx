'use client'

import { CheckIcon, LanguageIcon } from '@heroicons/react/24/outline'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from '@heroui/react'
import { useLocale } from 'next-intl'

import type { Locale } from '~/lib/i18n/config'

import { setLocale } from '~/actions/i18n'
import { locales } from '~/lib/i18n/config'

export default function LanguageSelector() {
  const currentLocale = useLocale()

  return (
    <Dropdown backdrop="blur">
      <DropdownTrigger>
        <Button isIconOnly size="sm" variant="light">
          <LanguageIcon className="size-4" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Language Actions"
        defaultSelectedKeys={currentLocale}
        onAction={(locale) => setLocale(locale as Locale)}
        selectionMode="single"
      >
        <DropdownSection title="Languages">
          {locales.map((locale) => (
            <DropdownItem
              endContent={locale.key === currentLocale && <CheckIcon className="size-4 text-default-500" />}
              key={locale.key}
              title={locale.label}
            />
          ))}
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  )
}
