'use client'

import { EditorContent, useEditor } from '@tiptap/react'
import { type RefObject, useEffect, useRef } from 'react'

import EXTENSIONS from '~/features/editor/extensions'
import EditorBlockMenu from '~/features/editor/menus/block-menu'
import EditorColumnsMenu from '~/features/editor/menus/columns-menu'
import EditorImageMenu from '~/features/editor/menus/image-menu'
import EditorLinkMenu from '~/features/editor/menus/link-menu'
import EditorTextMenu from '~/features/editor/menus/text-menu'
import '~/styles/tiptap.css'

interface EditorProps {
  contentRef: RefObject<string>
  handleUpdateAction: (data: { content?: string; title?: string }) => void
  rawContent: string
}

export default function Editor({ contentRef, handleUpdateAction, rawContent }: EditorProps) {
  const editorContainerRef = useRef<HTMLDivElement>(null)

  const editor = useEditor({
    content: generateContent(rawContent),
    editorProps: {
      attributes: {
        class: 'prose prose-stone dark:prose-invert',
      },
    },
    extensions: EXTENSIONS,
    immediatelyRender: true,
    onUpdate: ({ editor }) => {
      contentRef.current = JSON.stringify(editor.getJSON())

      handleUpdateAction({ content: JSON.stringify(editor.getJSON()) })
    },
  })

  /* ---------------------- 在销毁 Editor 之前统一移除所有 Tippy 实例 ---------------------- */
  useEffect(() => {
    return () => {
      if (editor) {
        const tippyInstances = document.querySelectorAll('[data-tippy-root]')

        tippyInstances.forEach((tippyInstance) => tippyInstance.remove())

        editor.destroy()
      }
    }
  }, [editor])

  /* -------------------------------------------------------------------------- */

  return (
    <div ref={editorContainerRef}>
      <EditorContent editor={editor} />
      <EditorTextMenu editor={editor} />
      <EditorColumnsMenu appendTo={editorContainerRef as RefObject<HTMLDivElement>} editor={editor} />
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
