import Placeholder from '@tiptap/extension-placeholder'
import SubScript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import StarterKit from '@tiptap/starter-kit'

export const extensions = [
  Placeholder.configure({
    placeholder: "Write something, or press 'space' for AI, '/' for commands…",
  }),
  SubScript,
  Superscript,
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
  Underline,
  StarterKit,
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
