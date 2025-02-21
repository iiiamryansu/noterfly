'use client'

import type { Editor } from '@tiptap/react'

import { Button } from '@heroui/button'
import { Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from '@heroui/dropdown'
import { Input } from '@heroui/input'
import { ArrowDown01Icon, CheckmarkCircle01Icon, Link01Icon } from 'hugeicons-react'
import { useCallback, useEffect, useState } from 'react'

import { linkSchema } from '~/features/editor/menus/link-menu'

export default function LinkEditor({ editor }: { editor: Editor | null }) {
  const getCurrentHref = useCallback(() => {
    if (editor === null) return ''

    return editor.getAttributes('link').href ?? ''
  }, [editor])

  const [value, setValue] = useState<string>(getCurrentHref())
  const [isInvalid, setIsInvalid] = useState<boolean>(false)

  function handleSubmit(value: string) {
    if (editor) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: value, target: '_blank' }).run()
    }
  }

  useEffect(() => {
    setValue(getCurrentHref())
  }, [editor?.state.selection, getCurrentHref])

  if (editor === null) return null

  return (
    <Dropdown className="min-w-64 bg-base-default p-1">
      <DropdownTrigger>
        <Button className="!h-7 min-h-7 min-w-11 gap-0.5 px-0" disableAnimation radius="sm" size="sm" variant="light">
          <Link01Icon className="size-[14px]" strokeWidth={2} />
          <ArrowDown01Icon className="size-[14px]" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Link Actions">
        <DropdownSection
          classNames={{
            group: 'grid grid-cols-[1fr_32px] grid-rows-1 gap-1',
            heading: 'text-[11px] font-medium select-none',
          }}
          title="Link"
        >
          <DropdownItem className="cursor-default p-0" isReadOnly key="edit" textValue="Edit" variant="light">
            <Input
              classNames={{
                input: 'text-xs',
              }}
              defaultValue={value}
              disableAnimation
              isClearable
              isInvalid={isInvalid}
              onValueChange={(value) => {
                setIsInvalid(false)
                setValue(value)
              }}
              placeholder="Paste link or search notes"
              radius="sm"
              size="sm"
              type="url"
            />
          </DropdownItem>
          <DropdownItem className="cursor-default p-0" isReadOnly key="confirm" textValue="Confirm" variant="light">
            <Button
              className="!size-8 min-h-8 min-w-8"
              disableAnimation
              isIconOnly
              onPress={() => {
                if (linkSchema.safeParse({ url: value }).success) {
                  handleSubmit(value)
                } else {
                  setIsInvalid(true)
                }
              }}
              radius="sm"
              size="sm"
              variant="light"
            >
              <CheckmarkCircle01Icon className="size-[14px] text-success-500" strokeWidth={2} />
            </Button>
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  )
}
