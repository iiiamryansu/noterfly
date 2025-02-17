'use client'

import { EditorContent, useEditor } from '@tiptap/react'
import { type RefObject, useRef } from 'react'

import { extensions } from '~/components/editor/extensions'
import { TextMenu as EditorTextMenu } from '~/components/editor/menus'
import { BlockMenu as EditorBlockMenu } from '~/components/editor/menus/block-menu'
import { ColumnMenu as EditorColumnMenu } from '~/components/editor/menus/column-menu'
import { ImageMenu as EditorImageMenu } from '~/components/editor/menus/image-menu'
import { LinkMenu as EditorLinkMenu } from '~/components/editor/menus/link-menu'
import '~/styles/tiptap.css'

interface EditorProps {
  handleUpdateAction: (newContent: string) => void
  rawContent: string
}

export function Editor({ handleUpdateAction, rawContent }: EditorProps) {
  const editorContainerRef = useRef<HTMLDivElement>(null)

  const editor = useEditor({
    content: generateContent(rawContent),
    editorProps: {
      attributes: {
        class: 'prose prose-stone dark:prose-invert',
      },
    },
    extensions,
    immediatelyRender: true,
    onUpdate: ({ editor }) => {
      handleUpdateAction(JSON.stringify(editor.getJSON()))
    },
  })

  return (
    <div ref={editorContainerRef}>
      <EditorContent editor={editor} />
      <EditorTextMenu editor={editor} />
      <EditorColumnMenu appendTo={editorContainerRef as RefObject<HTMLDivElement>} editor={editor} />
      <EditorLinkMenu appendTo={editorContainerRef as RefObject<HTMLDivElement>} editor={editor} />
      <EditorImageMenu appendTo={editorContainerRef as RefObject<HTMLDivElement>} editor={editor} />
      <EditorBlockMenu editor={editor} />
    </div>
  )
}

function generateContent(rawContent: string) {
  try {
    return JSON.parse(rawContent)
  } catch {
    return undefined
  }
}
