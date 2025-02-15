import type { Editor } from '@tiptap/core'
import type { Node } from '@tiptap/pm/model'

import { DragHandle } from '@tiptap-pro/extension-drag-handle-react'
import { useCallback, useState } from 'react'

import AddButton from '~/components/editor/menus/block-menu/add-button'
import DragButton from '~/components/editor/menus/block-menu/drag-button'

export function BlockMenu({ editor }: { editor: Editor | null }) {
  const [currentNode, setCurrentNode] = useState<Node | null>(null)
  const [currentNodePos, setCurrentNodePos] = useState<number>(-1)

  const handleNodeChange = useCallback(
    (data: { editor: Editor; node: Node | null; pos: number }) => {
      if (data.node) {
        setCurrentNode(data.node)
      }

      setCurrentNodePos(data.pos)
    },
    [setCurrentNode, setCurrentNodePos],
  )

  if (editor === null) return null

  return (
    <DragHandle
      editor={editor}
      onNodeChange={handleNodeChange}
      pluginKey="blockMenu"
      tippyOptions={{
        offset: [0, 10],
      }}
    >
      <nav className="flex items-center gap-0.5">
        <AddButton currentNode={currentNode} currentNodePos={currentNodePos} editor={editor} />
        <DragButton currentNode={currentNode} currentNodePos={currentNodePos} editor={editor} />
      </nav>
    </DragHandle>
  )
}
