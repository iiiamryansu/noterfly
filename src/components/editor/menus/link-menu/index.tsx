'use client'

import { BubbleMenu, type Editor } from '@tiptap/react'
import { useCallback, useState } from 'react'
import { v4 as uuid } from 'uuid'
import { z } from 'zod'

import EditPanel from '~/components/editor/menus/link-menu/edit-panel'
import PreviewPanel from '~/components/editor/menus/link-menu/preview-panel'

export const linkSchema = z.object({
  url: z.string().url('Please enter a valid URL!'),
})

export function LinkMenu({ appendTo, editor }: { appendTo: React.RefObject<HTMLDivElement>; editor: Editor | null }) {
  const [mode, setMode] = useState<'edit' | 'preview'>('preview')

  const shouldShow = useCallback(() => {
    if (editor === null) return false

    return editor.isActive('link') && editor.state.selection.empty
  }, [editor])

  const getCurrentHref = useCallback(() => {
    if (editor === null) return ''

    return editor.getAttributes('link').href ?? ''
  }, [editor])

  function handleSubmit(value: string) {
    if (editor) {
      editor.chain().extendMarkRange('link').setLink({ href: value, target: '_blank' }).run()
    }
  }

  function handleClear() {
    if (editor) {
      editor.chain().extendMarkRange('link').unsetLink().run()
    }
  }

  if (editor === null) return null

  return (
    <BubbleMenu
      editor={editor}
      pluginKey={`linkMenu-${uuid()}`}
      shouldShow={shouldShow}
      tippyOptions={{
        appendTo: () => appendTo?.current,
        duration: 100,
        onHidden: () => setMode('preview'),
        popperOptions: {
          modifiers: [{ enabled: false, name: 'flip' }],
        },
      }}
      updateDelay={100}
    >
      <nav className="inline-flex items-center gap-1 rounded-lg border border-divider/30 bg-[#ffffff] p-1 shadow-sm dark:bg-[#252525]">
        {mode === 'preview' ? (
          <PreviewPanel clear={handleClear} edit={() => setMode('edit')} url={getCurrentHref()} />
        ) : (
          <EditPanel submit={handleSubmit} url={getCurrentHref()} />
        )}
      </nav>
    </BubbleMenu>
  )
}
