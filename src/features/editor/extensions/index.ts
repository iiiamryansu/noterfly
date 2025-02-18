import Color from '@tiptap/extension-color'
import Dropcursor from '@tiptap/extension-dropcursor'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import SubScript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import Underline from '@tiptap/extension-underline'
import StarterKit from '@tiptap/starter-kit'

import Column from '~/features/editor/extensions/column'
import Columns from '~/features/editor/extensions/columns'
import Document from '~/features/editor/extensions/document'
import Image from '~/features/editor/extensions/image'
import ImageUploader from '~/features/editor/extensions/image-uploader'
import SlashCommands from '~/features/editor/extensions/slash-commands'

const EXTENSIONS = [
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

export default EXTENSIONS

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
