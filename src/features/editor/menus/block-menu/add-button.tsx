import type { Editor } from '@tiptap/core'
import type { Node } from '@tiptap/pm/model'

import { Button } from '@heroui/react'
import { Add01Icon } from 'hugeicons-react'
import { useCallback } from 'react'

interface AddButtonProps {
  currentNode: Node | null
  currentNodePos: number
  editor: Editor | null
}

export default function AddButton({ currentNode, currentNodePos, editor }: AddButtonProps) {
  const handleAdd = useCallback(() => {
    if (currentNodePos !== -1) {
      const currentNodeSize = currentNode?.nodeSize ?? 0
      const currentNodeType = currentNode?.type.name ?? ''
      const currentNodeContentSize = currentNode?.content?.size ?? 0

      const insertNodePos = currentNodePos + currentNodeSize

      const currentNodeIsAEmptyParagraph = currentNodeType === 'paragraph' && currentNodeContentSize === 0

      const focusedNodePos = currentNodeIsAEmptyParagraph ? currentNodePos + 2 : insertNodePos + 2

      if (editor === null) return

      editor
        .chain()
        .command(({ dispatch, state, tr }) => {
          if (dispatch) {
            if (currentNodeIsAEmptyParagraph) {
              tr.insertText('/', currentNodePos, currentNodePos + 1)
            } else {
              tr.insert(insertNodePos, state.schema.nodes.paragraph.create(null, [state.schema.text('/')]))
            }

            return dispatch(tr)
          }

          return true
        })
        .focus(focusedNodePos)
        .run()
    }
  }, [editor, currentNode, currentNodePos])

  if (editor === null) return null

  return (
    <Button
      className="!size-7 min-h-7 min-w-7 rounded-[4px]"
      disableAnimation
      isIconOnly
      onPress={handleAdd}
      radius="sm"
      size="sm"
      variant="light"
    >
      <Add01Icon className="size-[14px] text-default-500" strokeWidth={2} />
    </Button>
  )
}
