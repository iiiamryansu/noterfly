'use client'

import type { Note } from '@prisma/client'

import { EditorContent, useEditor } from '@tiptap/react'
import { debounce } from 'lodash-es'

import { updateNoteById } from '~/actions/note'
import { extensions } from '~/components/editor/extensions'
import { TextMenu as EditorTextMenu } from '~/components/editor/menus/TextMenu'

const saveContent = debounce((noteId: string, newContent: string) => {
  updateNoteById(noteId, { content: newContent })
}, 1000)

export function Editor({ note }: { note: Note }) {
  const editor = useEditor({
    content: generateContent(note.content),
    editorProps: {
      attributes: {
        class: 'prose prose-stone dark:prose-invert',
      },
    },
    extensions,
    immediatelyRender: true,
    onUpdate: ({ editor }) => {
      handleChange(JSON.stringify(editor.getJSON()))
    },
  })

  function handleChange(newContent: string) {
    saveContent(note.id, newContent)
  }

  return (
    <>
      <EditorContent editor={editor} />
      <EditorTextMenu editor={editor} />
    </>
  )
}

function generateContent(rawContent: string) {
  if (!rawContent) {
    return {
      content: [
        {
          content: [],
          type: 'paragraph',
        },
      ],
      type: 'doc',
    }
  }

  try {
    const parsed = JSON.parse(rawContent)
    // 验证基本结构
    if (typeof parsed === 'object' && parsed.type === 'doc' && Array.isArray(parsed.content)) {
      return parsed
    }
    // 如果结构不正确，返回默认文档
    return {
      content: [
        {
          content: [],
          type: 'paragraph',
        },
      ],
      type: 'doc',
    }
  } catch {
    // JSON 解析失败时返回默认文档
    return {
      content: [
        {
          content: [],
          type: 'paragraph',
        },
      ],
      type: 'doc',
    }
  }
}
