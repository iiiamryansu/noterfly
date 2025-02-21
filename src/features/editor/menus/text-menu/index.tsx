'use client'

import { Button, Divider } from '@heroui/react'
import { BubbleMenu, Editor } from '@tiptap/react'
import {
  SourceCodeIcon,
  TextAlignCenterIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
  TextBoldIcon,
  TextItalicIcon,
  TextStrikethroughIcon,
  TextSubscriptIcon,
  TextSuperscriptIcon,
  TextUnderlineIcon,
} from 'hugeicons-react'
import { useCallback } from 'react'

import { hasSelectedText } from '~/features/editor/utils'
import { cn } from '~/utils/cn'

import ColorSelector from './color-selector'
import LinkEditor from './link-editor'
import TypeSelector from './type-selector'

export default function TextMenu({ editor }: { editor: Editor | null }) {
  const shouldShow = useCallback(() => {
    if (editor === null) return false

    if (['image', 'imageUploader'].some((type) => editor.isActive(type))) return false

    return hasSelectedText({ editor })
  }, [editor])

  if (editor === null) return null

  return (
    <BubbleMenu editor={editor} shouldShow={shouldShow} tippyOptions={{ duration: 100 }} updateDelay={100}>
      <nav className="inline-flex items-center gap-1 rounded-lg border border-divider/30 bg-[#ffffff] p-1 shadow-sm dark:bg-[#252525]">
        <TypeSelector editor={editor} />

        <Divider className="h-5 bg-divider" orientation="vertical" />

        <Button
          className="!size-7 min-h-7 min-w-7"
          disableAnimation
          isIconOnly
          onPress={() => editor.chain().focus().toggleBold().run()}
          radius="sm"
          size="sm"
          variant="light"
        >
          <TextBoldIcon className={cn('size-[14px]', editor.isActive('bold') && 'text-primary-500')} strokeWidth={2} />
        </Button>
        <Button
          className="!size-7 min-h-7 min-w-7"
          disableAnimation
          isIconOnly
          onPress={() => editor.chain().focus().toggleItalic().run()}
          radius="sm"
          size="sm"
          variant="light"
        >
          <TextItalicIcon className={cn('size-[14px]', editor.isActive('italic') && 'text-primary-500')} strokeWidth={2} />
        </Button>
        <Button
          className="!size-7 min-h-7 min-w-7"
          disableAnimation
          isIconOnly
          onPress={() => editor.chain().focus().toggleUnderline().run()}
          radius="sm"
          size="sm"
          variant="light"
        >
          <TextUnderlineIcon
            className={cn('size-[14px]', editor.isActive('underline') && 'text-primary-500')}
            strokeWidth={2}
          />
        </Button>
        <Button
          className="!size-7 min-h-7 min-w-7"
          disableAnimation
          isIconOnly
          onPress={() => editor.chain().focus().toggleStrike().run()}
          radius="sm"
          size="sm"
          variant="light"
        >
          <TextStrikethroughIcon
            className={cn('size-[14px]', editor.isActive('strike') && 'text-primary-500')}
            strokeWidth={2}
          />
        </Button>

        <Divider className="h-5 bg-divider" orientation="vertical" />

        <Button
          className="!size-7 min-h-7 min-w-7"
          disableAnimation
          isIconOnly
          onPress={() => editor.chain().focus().toggleCode().run()}
          radius="sm"
          size="sm"
          variant="light"
        >
          <SourceCodeIcon className={cn('size-[14px]', editor.isActive('code') && 'text-primary-500')} strokeWidth={2} />
        </Button>
        <Button
          className="!size-7 min-h-7 min-w-7"
          disableAnimation
          isIconOnly
          onPress={() => editor.chain().focus().toggleSuperscript().run()}
          radius="sm"
          size="sm"
          variant="light"
        >
          <TextSuperscriptIcon
            className={cn('size-[14px]', editor.isActive('superscript') && 'text-primary-500')}
            strokeWidth={2}
          />
        </Button>
        <Button
          className="!size-7 min-h-7 min-w-7"
          disableAnimation
          isIconOnly
          onPress={() => editor.chain().focus().toggleSubscript().run()}
          radius="sm"
          size="sm"
          variant="light"
        >
          <TextSubscriptIcon
            className={cn('size-[14px]', editor.isActive('subscript') && 'text-primary-500')}
            strokeWidth={2}
          />
        </Button>

        <LinkEditor editor={editor} />

        <Divider className="h-5 bg-divider" orientation="vertical" />

        <Button
          className="!size-7 min-h-7 min-w-7"
          disableAnimation
          isIconOnly
          onPress={() => editor.chain().focus().setTextAlign('left').run()}
          radius="sm"
          size="sm"
          variant="light"
        >
          <TextAlignLeftIcon
            className={cn('size-[14px]', editor.isActive({ textAlign: 'left' }) && 'text-primary-500')}
            strokeWidth={2}
          />
        </Button>
        <Button
          className="!size-7 min-h-7 min-w-7"
          disableAnimation
          isIconOnly
          onPress={() => editor.chain().focus().setTextAlign('center').run()}
          radius="sm"
          size="sm"
          variant="light"
        >
          <TextAlignCenterIcon
            className={cn('size-[14px]', editor.isActive({ textAlign: 'center' }) && 'text-primary-500')}
            strokeWidth={2}
          />
        </Button>
        <Button
          className="!size-7 min-h-7 min-w-7"
          disableAnimation
          isIconOnly
          onPress={() => editor.chain().focus().setTextAlign('right').run()}
          radius="sm"
          size="sm"
          variant="light"
        >
          <TextAlignRightIcon
            className={cn('size-[14px]', editor.isActive({ textAlign: 'right' }) && 'text-primary-500')}
            strokeWidth={2}
          />
        </Button>

        <Divider className="h-5 bg-divider" orientation="vertical" />

        <ColorSelector editor={editor} />
      </nav>
    </BubbleMenu>
  )
}
