'use client'

import type { Editor } from '@tiptap/react'

import { CheckIcon } from '@heroicons/react/24/outline'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from '@heroui/react'
import { ArrowDown01Icon } from 'hugeicons-react'
import Image from 'next/image'
import { useMemo } from 'react'

export default function TypeSelector({ editor }: { editor: Editor | null }) {
  const types = useMemo(() => {
    if (editor === null) return []

    return [
      {
        activate: () => editor.chain().focus().lift('taskItem').liftListItem('listItem').setParagraph().run(),
        description: 'Just start writing with plain text.',
        id: 'text',
        image: '/editor/types/text.png',
        isActive: () =>
          editor.isActive('paragraph') &&
          !editor.isActive('orderedList') &&
          !editor.isActive('bulletList') &&
          !editor.isActive('taskList'),
        isDisabled: () => !editor.can().setParagraph(),
        label: 'Text',
      },
      {
        activate: () => editor.chain().focus().lift('taskItem').liftListItem('listItem').setHeading({ level: 1 }).run(),
        description: 'Big section heading.',
        id: 'heading-1',
        image: '/editor/types/heading-1.png',
        isActive: () => editor.isActive('heading', { level: 1 }),
        isDisabled: () => !editor.can().setHeading({ level: 1 }),
        label: 'Heading 1',
      },
      {
        activate: () => editor.chain().focus().lift('taskItem').liftListItem('listItem').setHeading({ level: 2 }).run(),
        description: 'Medium section heading.',
        id: 'heading-2',
        image: '/editor/types/heading-2.png',
        isActive: () => editor.isActive('heading', { level: 2 }),
        isDisabled: () => !editor.can().setHeading({ level: 2 }),
        label: 'Heading 2',
      },
      {
        activate: () => editor.chain().focus().lift('taskItem').liftListItem('listItem').setHeading({ level: 3 }).run(),
        description: 'Small section heading.',
        id: 'heading-3',
        image: '/editor/types/heading-3.png',
        isActive: () => editor.isActive('heading', { level: 3 }),
        isDisabled: () => !editor.can().setHeading({ level: 3 }),
        label: 'Heading 3',
      },
      {
        activate: () => editor.chain().focus().toggleBulletList().run(),
        description: 'Create a simple bulleted list.',
        id: 'bulleted-list',
        image: '/editor/types/bulleted-list.png',
        isActive: () => editor.isActive('bulletList'),
        isDisabled: () => !editor.can().toggleBulletList(),
        label: 'Bulleted list',
      },
      {
        activate: () => editor.chain().focus().toggleOrderedList().run(),
        description: 'Create a list with numbering.',
        id: 'numbered-list',
        image: '/editor/types/numbered-list.png',
        isActive: () => editor.isActive('orderedList'),
        isDisabled: () => !editor.can().toggleOrderedList(),
        label: 'Numbered list',
      },
      {
        activate: () => editor.chain().focus().toggleTaskList().run(),
        description: 'Track tasks with a to-do list.',
        id: 'to-do-list',
        image: '/editor/types/to-do-list.png',
        isActive: () => editor.isActive('taskList'),
        isDisabled: () => !editor.can().toggleTaskList(),
        label: 'To-do list',
      },
    ]
  }, [editor])

  if (editor === null) return null

  return (
    <Dropdown className="min-w-72 bg-base-default p-1">
      <DropdownTrigger>
        <Button className="!h-7 min-h-7 min-w-14 gap-1 px-2" disableAnimation radius="sm" size="sm" variant="light">
          <span className="block">{types.find((option) => option.isActive())?.label ?? 'Text'}</span>
          <ArrowDown01Icon className="size-[14px]" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Type Actions" disabledKeys={types.filter((type) => type.isDisabled()).map((type) => type.id)}>
        <DropdownSection
          classNames={{
            heading: 'text-[11px] font-medium select-none',
          }}
          title="Turn into"
        >
          {types.map((type) => (
            <DropdownItem
              endContent={type.isActive() && <CheckIcon className="size-4 text-default-500" />}
              key={type.id}
              onPress={() => type.activate()}
              textValue={type.label}
              variant="flat"
            >
              <div className="flex gap-2.5">
                <Image
                  alt="Type image"
                  className="relative top-1 size-[22px] rounded-[4px] bg-white"
                  height={138}
                  src={type.image}
                  width={138}
                />
                <div className="flex flex-col gap-[2xp]">
                  <span className="block text-sm text-default-700">{type.label}</span>
                  <span className="block text-xs text-default-500">{type.description}</span>
                </div>
              </div>
            </DropdownItem>
          ))}
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  )
}
