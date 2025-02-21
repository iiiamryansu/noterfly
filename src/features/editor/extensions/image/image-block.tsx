import type { Node } from '@tiptap/pm/model'

import { type Editor, NodeViewWrapper } from '@tiptap/react'
import { useCallback } from 'react'

import { cn } from '~/utils/cn'

interface ImageBlockProps {
  editor: Editor
  getPos: () => number
  node: Node & {
    attrs: {
      src: string
    }
  }
  updateAttributes: (attrs: Record<string, string>) => void
}

export default function ImageBlock({
  editor,
  getPos,
  node: {
    attrs: { align, src, width },
  },
}: ImageBlockProps) {
  const click = useCallback(() => {
    editor.commands.setNodeSelection(getPos())
  }, [editor.commands, getPos])

  return (
    <NodeViewWrapper>
      <div
        className={cn(
          align === 'left' ? 'ml-0' : 'ml-auto',
          align === 'center' && 'mx-auto',
          align === 'right' ? 'mr-0' : 'mr-auto',
        )}
        style={{ width }}
      >
        {/* eslint-disable-next-line  */}
        <img className="block" src={src} alt="Image" onClick={click} />
      </div>
    </NodeViewWrapper>
  )
}
