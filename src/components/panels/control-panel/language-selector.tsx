'use client'

import type { Locale } from '@i18n/config'

import { CheckIcon, LanguageIcon } from '@heroicons/react/24/outline'
import { Button } from '@heroui/button'
import { Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from '@heroui/dropdown'
import { setLocale } from '@i18n/actions/setLocale'
import { locales } from '@i18n/config'
import { useLocale } from 'next-intl'

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
