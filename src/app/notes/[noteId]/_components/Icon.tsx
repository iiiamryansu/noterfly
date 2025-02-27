'use client'

import type { Note } from '@prisma/client'

import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { Button } from '@heroui/button'
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/dropdown'
import { trpc } from '@trpc/c'
import { CancelCircleIcon, SmileIcon } from 'hugeicons-react'
import { useLocale } from 'next-intl'
import { useTheme } from 'next-themes'
import { useState } from 'react'

interface IconProps {
  note: Note
}

export function Icon({ note }: IconProps) {
  const { theme } = useTheme()

  const locale = useLocale()

  const [icon, setIcon] = useState(note.icon)
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)

  const utils = trpc.useUtils()

  const { mutate: updateNote } = trpc.note.updateNote.useMutation({
    onMutate: ({ data }) => {
      setIcon(data.icon ?? '')
      setIsEmojiPickerOpen(false)
    },
    onSuccess: (note) => {
      utils.notebook.getNotebooks.invalidate()
      utils.note.getNotes.invalidate()
      utils.note.getNote.invalidate({ noteId: note.id })
    },
  })

  return (
    <>
      <Dropdown
        classNames={{
          content: 'p-0',
        }}
        isOpen={isEmojiPickerOpen}
        onOpenChange={setIsEmojiPickerOpen}
      >
        <DropdownTrigger>
          {icon === '' ? (
            <Button
              className="absolute bottom-0 h-7 text-default-500 opacity-0 transition-all duration-300 group-hover/header:opacity-100"
              radius="sm"
              size="sm"
              startContent={<SmileIcon className="size-3" />}
              variant="flat"
            >
              Add icon
            </Button>
          ) : (
            <Button
              className="absolute bottom-0 size-[76px] min-h-[76px] min-w-[76px] text-7xl"
              isIconOnly
              radius="sm"
              variant="light"
            >
              {icon}
            </Button>
          )}
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Emoji Picker"
          classNames={{
            base: 'p-0',
          }}
          disableAnimation
        >
          <DropdownItem
            classNames={{
              base: 'p-0',
            }}
            disableAnimation
            isReadOnly
            key="emoji-picker"
            textValue="Emoji Picker"
            variant="light"
          >
            <Picker
              autoFocus
              data={data}
              emojiButtonRadius="8px"
              locale={locale}
              onEmojiSelect={(emoji: { native: string }) => updateNote({ data: { icon: emoji.native }, noteId: note.id })}
              theme={theme}
            />
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      {icon !== '' && (
        <Button
          className="absolute bottom-0 left-20 h-7 text-default-500 opacity-0 transition-all duration-300 group-hover/icon:opacity-100"
          onPress={() => updateNote({ data: { icon: '' }, noteId: note.id })}
          radius="sm"
          size="sm"
          startContent={<CancelCircleIcon className="size-3" />}
          variant="flat"
        >
          Remove icon
        </Button>
      )}
    </>
  )
}
