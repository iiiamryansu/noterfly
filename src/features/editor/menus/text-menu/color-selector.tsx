'use client'

import type { Editor } from '@tiptap/react'

import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from '@heroui/react'
import { ArrowDown01Icon } from 'hugeicons-react'

import { cn } from '~/utils/cn'

const textColors = [
  { key: 'default', label: 'Default', value: 'var(--editor-text-default)' },
  { key: 'grey', label: 'Grey', value: 'var(--editor-text-grey)' },
  { key: 'brown', label: 'Brown', value: 'var(--editor-text-brown)' },
  { key: 'orange', label: 'Orange', value: 'var(--editor-text-orange)' },
  { key: 'yellow', label: 'Yellow', value: 'var(--editor-text-yellow)' },
  { key: 'green', label: 'Green', value: 'var(--editor-text-green)' },
  { key: 'blue', label: 'Blue', value: 'var(--editor-text-blue)' },
  { key: 'purple', label: 'Purple', value: 'var(--editor-text-purple)' },
  { key: 'pink', label: 'Pink', value: 'var(--editor-text-pink)' },
  { key: 'red', label: 'Red', value: 'var(--editor-text-red)' },
] as const

const backgroundColors = [
  { key: 'default', label: 'Default', value: 'var(--editor-background-default)' },
  { key: 'grey', label: 'Grey', value: 'var(--editor-background-grey)' },
  { key: 'brown', label: 'Brown', value: 'var(--editor-background-brown)' },
  { key: 'orange', label: 'Orange', value: 'var(--editor-background-orange)' },
  { key: 'yellow', label: 'Yellow', value: 'var(--editor-background-yellow)' },
  { key: 'green', label: 'Green', value: 'var(--editor-background-green)' },
  { key: 'blue', label: 'Blue', value: 'var(--editor-background-blue)' },
  { key: 'purple', label: 'Purple', value: 'var(--editor-background-purple)' },
  { key: 'pink', label: 'Pink', value: 'var(--editor-background-pink)' },
  { key: 'red', label: 'Red', value: 'var(--editor-background-red)' },
] as const

export default function ColorSelector({ editor }: { editor: Editor | null }) {
  if (editor === null) return null

  function setTextColor(editor: Editor, color: (typeof textColors)[number]) {
    const { key, value } = color

    if (key === 'default') {
      editor.chain().focus().unsetColor().run()
    } else {
      editor.chain().focus().setColor(value).run()
    }
  }

  function setBackgroundColor(editor: Editor, color: (typeof backgroundColors)[number]) {
    const { key, value } = color

    if (key === 'default') {
      editor.chain().focus().unsetHighlight().run()
    } else {
      editor.chain().focus().setHighlight({ color: value }).run()
    }
  }

  return (
    <Dropdown className="min-w-0 bg-base-default p-3">
      <DropdownTrigger>
        <Button className="!h-7 min-h-7 min-w-14 gap-0.5 px-0" disableAnimation radius="sm" size="sm" variant="light">
          <span
            className={cn('flex size-6 items-center justify-center', 'border border-divider', 'rounded-md')}
            style={{
              backgroundColor: backgroundColors.find((backgroundColor) =>
                editor.isActive('highlight', { color: backgroundColor.value }),
              )?.value,
              color: textColors.find((textColor) => editor.isActive('textStyle', { color: textColor.value }))?.value,
            }}
          >
            A
          </span>
          <ArrowDown01Icon className="size-[14px]" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Color Actions">
        <DropdownSection
          classNames={{
            base: 'mb-4',
            group: 'grid grid-cols-5 grid-rows-2 gap-2',
            heading: 'text-[11px] font-medium select-none',
          }}
          title="Text color"
        >
          {textColors.map((textColor) => (
            <DropdownItem
              classNames={{
                base: cn(
                  '!size-[26px] rounded-md p-0 text-center',
                  'border border-default hover:border-[1.75px]',
                  editor.isActive('textStyle', { color: textColor.value }) && `border-2`,
                  textColor.key === 'default' &&
                    editor.isActive({ color: undefined }) &&
                    !editor.isActive('textStyle') &&
                    'border-2',
                ),
              }}
              key={textColor.key}
              onPress={() => setTextColor(editor, textColor)}
              style={{
                borderColor: textColor.key !== 'default' ? `color-mix(in srgb, ${textColor.value} 30%, transparent)` : '',
                color: textColor.value,
              }}
              textValue={textColor.label}
              title="A"
              variant="light"
            />
          ))}
        </DropdownSection>
        <DropdownSection
          classNames={{
            group: 'grid grid-cols-5 grid-rows-2 gap-2',
            heading: 'text-[11px] font-medium select-none',
          }}
          title="Background color"
        >
          {backgroundColors.map((backgroundColor) => (
            <DropdownItem
              classNames={{
                base: cn(
                  '!size-[26px] rounded-md p-0 text-center',
                  'border border-default hover:border-[1.75px]',
                  editor.isActive('highlight', { color: backgroundColor.value }) && 'border-2',
                  backgroundColor.key === 'default' && !editor.isActive('highlight') && 'border-2',
                ),
              }}
              key={backgroundColor.key}
              onPress={() => setBackgroundColor(editor, backgroundColor)}
              style={{
                backgroundColor: backgroundColor.value,
                borderColor:
                  backgroundColor.key !== 'default'
                    ? `color-mix(in srgb, ${textColors.find((textColor) => textColor.key === backgroundColor.key)?.value} 30%, transparent)`
                    : '',
              }}
              textValue={backgroundColor.label}
              variant="light"
            />
          ))}
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  )
}
