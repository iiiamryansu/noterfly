import { Button, Divider } from '@heroui/react'
import { BubbleMenu, Editor } from '@tiptap/react'
import { Layout2ColumnIcon, LayoutLeftIcon, LayoutRightIcon, WasteIcon } from 'hugeicons-react'
import { type RefObject, useCallback } from 'react'
import { sticky } from 'tippy.js'
import { v4 as uuid } from 'uuid'

import { ColumnLayout } from '~/features/editor/extensions/columns'
import { getRenderContainer } from '~/features/editor/utils'
import { cn } from '~/utils/cn'

export default function ColumnsMenu({ appendTo, editor }: { appendTo: RefObject<HTMLDivElement>; editor: Editor | null }) {
  const getReferenceClientRect = useCallback(() => {
    if (editor === null) return new DOMRect(-1000, -1000, 0, 0)

    return getRenderContainer(editor, 'columns')?.getBoundingClientRect() || new DOMRect(-1000, -1000, 0, 0)
  }, [editor])

  const shouldShow = useCallback(() => {
    if (editor === null) return false

    return editor.isActive('columns')
  }, [editor])

  /* ---------------------------------- Left --------------------------------- */
  const onColumnLeft = useCallback(() => {
    if (editor == null) return

    editor.chain().focus().setLayout(ColumnLayout.Left).run()
  }, [editor])

  const isLeftActive = useCallback(() => {
    return (
      editor &&
      editor.isActive('columns', {
        layout: ColumnLayout.Left,
      })
    )
  }, [editor])

  /* ---------------------------------- Right --------------------------------- */
  const onColumnRight = useCallback(() => {
    if (editor == null) return

    editor.chain().focus().setLayout(ColumnLayout.Right).run()
  }, [editor])

  const isRightActive = useCallback(() => {
    return (
      editor &&
      editor.isActive('columns', {
        layout: ColumnLayout.Right,
      })
    )
  }, [editor])

  /* ---------------------------------- Equal --------------------------------- */
  const onColumnEqual = useCallback(() => {
    if (editor == null) return

    editor.chain().focus().setLayout(ColumnLayout.Equal).run()
  }, [editor])

  const isEqualActive = useCallback(() => {
    return (
      editor &&
      editor.isActive('columns', {
        layout: ColumnLayout.Equal,
      })
    )
  }, [editor])

  if (editor === null) return null

  return (
    <BubbleMenu
      editor={editor}
      pluginKey={`columnsMenu-${uuid()}`} // 针对多个菜单需要不同的 pluginKey
      shouldShow={shouldShow}
      tippyOptions={{
        appendTo: () => appendTo?.current,
        duration: 100,
        getReferenceClientRect,
        offset: [0, 8],
        plugins: [sticky],
        popperOptions: {
          modifiers: [{ enabled: false, name: 'flip' }],
        },
        sticky: 'popper',
      }}
      updateDelay={100}
    >
      <nav className="inline-flex items-center gap-1 rounded-lg border border-divider/30 bg-[#ffffff] p-1 shadow-sm dark:bg-[#252525]">
        <Button
          className={cn('!size-7 min-h-7 min-w-7 text-default-500', isLeftActive() && 'text-primary-500')}
          disableAnimation
          isIconOnly
          onPress={onColumnLeft}
          radius="sm"
          size="sm"
          variant="light"
        >
          <LayoutLeftIcon className="size-4" />
        </Button>
        <Button
          className={cn('!size-7 min-h-7 min-w-7 text-default-500', isEqualActive() && 'text-primary-500')}
          disableAnimation
          isIconOnly
          onPress={onColumnEqual}
          radius="sm"
          size="sm"
          variant="light"
        >
          <Layout2ColumnIcon className="size-4" />
        </Button>
        <Button
          className={cn('!size-7 min-h-7 min-w-7 text-default-500', isRightActive() && 'text-primary-500')}
          disableAnimation
          isIconOnly
          onPress={onColumnRight}
          radius="sm"
          size="sm"
          variant="light"
        >
          <LayoutRightIcon className="size-4" />
        </Button>

        <Divider className="h-5 bg-divider" orientation="vertical" />

        <Button
          className="!size-7 min-h-7 min-w-7"
          color="danger"
          disableAnimation
          isIconOnly
          onPress={() => editor.chain().focus().deleteColumns().run()}
          radius="sm"
          size="sm"
          variant="light"
        >
          <WasteIcon className="size-4" />
        </Button>
      </nav>
    </BubbleMenu>
  )
}
