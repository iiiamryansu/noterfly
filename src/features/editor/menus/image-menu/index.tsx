import { Button } from '@heroui/button'
import { Divider } from '@heroui/divider'
import { Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from '@heroui/dropdown'
import { BubbleMenu, type Editor } from '@tiptap/react'
import { cn } from '@utils/cn'
import { ArrowRight01Icon, Layout2ColumnIcon, LayoutLeftIcon, LayoutRightIcon } from 'hugeicons-react'
import { type RefObject, useCallback } from 'react'
import { sticky } from 'tippy.js'
import { v4 as uuid } from 'uuid'

export default function ImageMenu({ appendTo, editor }: { appendTo: RefObject<HTMLDivElement>; editor: Editor | null }) {
  const shouldShow = useCallback(() => {
    if (editor === null) return false

    return editor.isActive('image')
  }, [editor])

  /* ---------------------------------- Left ---------------------------------- */
  const onImageLeft = useCallback(() => {
    if (editor == null) return

    editor.chain().setImageAlign({ align: 'left' }).run()
  }, [editor])

  const isLeftActive = useCallback(() => {
    return (
      editor &&
      editor.isActive('image', {
        align: 'left',
      })
    )
  }, [editor])

  /* -------------------------------- Center -------------------------------- */
  const onImageCenter = useCallback(() => {
    if (editor == null) return

    editor.chain().setImageAlign({ align: 'center' }).run()
  }, [editor])

  const isCenterActive = useCallback(() => {
    return (
      editor &&
      editor.isActive('image', {
        align: 'center',
      })
    )
  }, [editor])

  /* -------------------------------- Right -------------------------------- */
  const onImageRight = useCallback(() => {
    if (editor == null) return

    editor.chain().setImageAlign({ align: 'right' }).run()
  }, [editor])

  const isRightActive = useCallback(() => {
    return (
      editor &&
      editor.isActive('image', {
        align: 'right',
      })
    )
  }, [editor])

  /* ---------------------------------- Width --------------------------------- */
  const changeWidth = useCallback(
    (value: number) => {
      if (editor == null) return

      editor.chain().setImageWidth({ width: value }).run()
    },
    [editor],
  )

  if (editor === null) return null

  return (
    <BubbleMenu
      editor={editor}
      pluginKey={`imageMenu-${uuid()}`}
      shouldShow={shouldShow}
      tippyOptions={{
        appendTo: () => appendTo?.current,
        duration: 100,
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
          onPress={onImageLeft}
          radius="sm"
          size="sm"
          variant="light"
        >
          <LayoutLeftIcon className="size-4" />
        </Button>
        <Button
          className={cn('!size-7 min-h-7 min-w-7 text-default-500', isCenterActive() && 'text-primary-500')}
          disableAnimation
          isIconOnly
          onPress={onImageCenter}
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
          onPress={onImageRight}
          radius="sm"
          size="sm"
          variant="light"
        >
          <LayoutRightIcon className="size-4" />
        </Button>

        <Divider className="h-5 bg-divider" orientation="vertical" />

        <Dropdown
          className="min-w-0 items-center gap-1 rounded-lg border border-divider/30 bg-[#ffffff] p-1 shadow-sm dark:bg-[#252525]"
          offset={12}
          placement="right"
        >
          <DropdownTrigger>
            <Button className="!h-7 min-h-7 min-w-14 gap-1 px-2" disableAnimation radius="sm" size="sm" variant="light">
              <span className="block text-success-500">{editor.getAttributes('image').width}</span>
              <ArrowRight01Icon className="size-[14px] text-default-500" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Type Actions" className="h-7 p-0">
            <DropdownSection
              classNames={{
                group: 'grid grid-cols-4 grid-rows-1 gap-1',
              }}
            >
              {['25', '50', '75', '100'].map((value) => (
                <DropdownItem className="cursor-default p-0" isReadOnly key={value} textValue={value} variant="light">
                  <Button
                    className="h-7 min-h-7 w-10 min-w-7 text-default-500"
                    disableAnimation
                    onPress={() => changeWidth(Number(value))}
                    radius="sm"
                    size="sm"
                    variant="light"
                  >
                    {value}%
                  </Button>
                </DropdownItem>
              ))}
            </DropdownSection>
          </DropdownMenu>
        </Dropdown>
      </nav>
    </BubbleMenu>
  )
}
