import type { Editor } from '@tiptap/core'
import type { Node } from '@tiptap/pm/model'
import type { NodeSelection } from '@tiptap/pm/state'

import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger, Input } from '@heroui/react'
import { Comment01Icon, CommentAdd01Icon, Copy01Icon, DragDropVerticalIcon, WasteIcon } from 'hugeicons-react'
import { useCallback } from 'react'

interface DragButtonProps {
  currentNode: Node | null
  currentNodePos: number
  editor: Editor | null
}

export default function DragButton({ currentNode, currentNodePos, editor }: DragButtonProps) {
  const duplicateNode = useCallback(() => {
    if (editor === null) return

    editor.commands.setNodeSelection(currentNodePos)

    const selectedNode = editor.state.selection.$anchor.node(1) || (editor.state.selection as NodeSelection).node
    const nextNodePos = currentNodePos + (currentNode?.nodeSize || 0)

    editor.chain().insertContentAt(nextNodePos, selectedNode.toJSON()).focus(nextNodePos).run()
  }, [editor, currentNodePos, currentNode?.nodeSize])

  const deleteNode = useCallback(() => {
    if (editor === null) return

    editor.chain().setNodeSelection(currentNodePos).deleteSelection().focus(currentNodePos).run()
  }, [editor, currentNodePos])

  if (editor === null) return null

  return (
    <Dropdown className="min-w-52 bg-base-default p-1" placement="left">
      <DropdownTrigger>
        <Button
          className="h-7 min-h-7 w-5 min-w-5 cursor-grab rounded-[4px]"
          disableAnimation
          draggable
          isIconOnly
          onPress={() => editor.chain().focus().toggleBold().run()}
          radius="sm"
          size="sm"
          variant="light"
        >
          <DragDropVerticalIcon className="size-[18px] text-default-500" strokeWidth={3} />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Block Actions">
        <DropdownSection
          classNames={{
            base: 'mb-0',
          }}
        >
          <DropdownItem
            classNames={{
              base: 'px-0',
            }}
            isReadOnly
            key="search"
            textValue="search"
            variant="light"
          >
            <Input
              classNames={{
                input: 'text-xs',
              }}
              placeholder="Search actions..."
              radius="sm"
              size="sm"
              variant="bordered"
            />
          </DropdownItem>
        </DropdownSection>
        <DropdownSection
          className="text-default-700"
          classNames={{
            base: 'mb-1',
          }}
          showDivider
        >
          <DropdownItem
            classNames={{
              shortcut: 'border-none',
            }}
            key="comment"
            shortcut="⌘⇧M"
            startContent={<Comment01Icon className="size-4" />}
            textValue="comment"
            title="Comment"
            variant="flat"
          />
          <DropdownItem
            classNames={{
              shortcut: 'border-none ',
            }}
            key="suggest"
            shortcut="⌘⇧X"
            startContent={<CommentAdd01Icon className="size-4" />}
            textValue="suggest"
            title="Suggest"
            variant="flat"
          />
        </DropdownSection>
        <DropdownSection
          className="text-default-700"
          classNames={{
            base: 'mb-0',
          }}
        >
          <DropdownItem
            classNames={{
              shortcut: 'border-none',
            }}
            key="duplicate"
            onPress={duplicateNode}
            shortcut="⌘D"
            startContent={<Copy01Icon className="size-4" />}
            textValue="duplicate"
            title="Duplicate"
            variant="flat"
          />
          <DropdownItem
            classNames={{
              shortcut: 'border-none  ',
            }}
            color="danger"
            key="delete"
            onPress={deleteNode}
            shortcut="Del"
            startContent={<WasteIcon className="size-4" />}
            textValue="delete"
            title="Delete"
            variant="flat"
          />
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  )
}
