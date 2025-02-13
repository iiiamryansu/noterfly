import type { Editor } from '@tiptap/react'

import { isTextSelection } from '@tiptap/core'

export function hasSelectedText({ editor }: { editor: Editor }) {
  const {
    state: {
      doc,
      selection,
      selection: { empty, from, to },
    },
  } = editor

  /**
   * 此处需注意仅仅检查 `empty` 是不够的
   * 例如双击一个空段落会返回一个大小为2 的节点
   * 所以我们需要检查文本内容是否为空
   */
  if (empty || (!doc.textBetween(from, to).length && isTextSelection(selection)) || !editor.isEditable) {
    return false
  }

  return true
}
