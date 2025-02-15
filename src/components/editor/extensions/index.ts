import Color from '@tiptap/extension-color'
import Dropcursor from '@tiptap/extension-dropcursor'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import SubScript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import { TaskItem } from '@tiptap/extension-task-item'
import { TaskList } from '@tiptap/extension-task-list'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import Underline from '@tiptap/extension-underline'
import StarterKit from '@tiptap/starter-kit'

import Column from '~/components/editor/extensions/column/column'
import Columns from '~/components/editor/extensions/column/columns'
import Document from '~/components/editor/extensions/document'
import Image from '~/components/editor/extensions/image'
import ImageUploader from '~/components/editor/extensions/image-uploader'
import SlashCommands from '~/components/editor/extensions/slash-commands'

export const extensions = [
  Color,
  Highlight.configure({
    multicolor: true,
  }),
  Link.configure({
    openOnClick: false,
  }),
  Placeholder.configure({
    placeholder: "Write something, or press 'space' for AI, '/' for commands…",
  }),
  SubScript,
  Superscript,
  TaskList,
  TaskItem.configure({
    nested: true,
  }),
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
  TextStyle.configure({
    mergeNestedSpanStyles: true,
  }),
  Underline,
  StarterKit.configure({
    document: false,
    dropcursor: false,
  }),

  // Custom Extensions
  Column,
  Columns,
  Document,
  Dropcursor,
  Image,
  ImageUploader,
  SlashCommands,
]

/* ----------------------------- The StarterKit ----------------------------- */
// 1. Nodes

// Blockquote
// BulletList
// CodeBlock
// Document
// HardBreak
// Heading
// HorizontalRule
// ListItem
// OrderedList
// Paragraph
// Text

// 2. Marks

// Bold
// Code
// Italic
// Strike

// 3. Extensions

// Dropcursor
// Gapcursor
// History
