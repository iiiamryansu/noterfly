import type { Editor } from '@tiptap/core'

export type Command = {
  action: (editor: Editor) => void
  aliases: string[]
  description: string
  id: string
  image: string
  isDisabled?: (editor: Editor) => boolean
  label: string
}

export type CommandGroup = {
  commands: Command[]
  id: string
  label: string
}

export const COMMAND_GROUPS: CommandGroup[] = [
  {
    commands: [
      {
        action: (editor: Editor) => editor.chain().focus().setParagraph().run(),
        aliases: ['p'],
        description: 'Just start writing with plain text.',
        id: 'text',
        image: '/editor/types/text.png',
        label: 'Text',
      },
      {
        action: (editor: Editor) => editor.chain().focus().setHeading({ level: 1 }).run(),
        aliases: ['h1'],
        description: 'Big section heading.',
        id: 'heading-1',
        image: '/editor/types/heading-1.png',
        label: 'Heading 1',
      },
      {
        action: (editor: Editor) => editor.chain().focus().setHeading({ level: 2 }).run(),
        aliases: ['h2'],
        description: 'Medium section heading.',
        id: 'heading-2',
        image: '/editor/types/heading-2.png',
        label: 'Heading 2',
      },
      {
        action: (editor: Editor) => editor.chain().focus().setHeading({ level: 3 }).run(),
        aliases: ['h3'],
        description: 'Small section heading.',
        id: 'heading-3',
        image: '/editor/types/heading-3.png',
        label: 'Heading 3',
      },
      {
        action: (editor: Editor) => editor.chain().focus().toggleBulletList().run(),
        aliases: ['ul'],
        description: 'Create a simple bulleted list.',
        id: 'bulleted-list',
        image: '/editor/types/bulleted-list.png',
        label: 'Bulleted list',
      },
      {
        action: (editor: Editor) => editor.chain().focus().toggleOrderedList().run(),
        aliases: ['ol'],
        description: 'Create a list with numbering.',
        id: 'numbered-list',
        image: '/editor/types/numbered-list.png',
        label: 'Numbered list',
      },
      {
        action: (editor: Editor) => editor.chain().focus().toggleTaskList().run(),
        aliases: ['todo'],
        description: 'Track tasks with a to-do list.',
        id: 'to-do-list',
        image: '/editor/types/to-do-list.png',
        label: 'To-do list',
      },
    ],
    id: 'basic-blocks',
    label: 'Basic blocks',
  },
  {
    commands: [
      {
        action: (editor: Editor) => editor.chain().focus().setImageUploader().run(),
        aliases: ['img'],
        description: 'Upload or embed with a link.',
        id: 'image',
        image: '/editor/types/image.png',
        label: 'Image',
      },
      {
        action: (editor: Editor) => editor.chain().focus().setCodeBlock().run(),
        aliases: [],
        description: 'Capture a code snippet.',
        id: 'code',
        image: '/editor/types/code.png',
        label: 'Code',
      },
    ],
    id: 'media',
    label: 'Media',
  },
  {
    commands: [
      {
        action: (editor) =>
          editor
            .chain()
            .focus()
            .setColumns()
            .focus(editor.state.selection.head - 1)
            .run(),
        aliases: ['cols'],
        description: 'Create 2 columns of blocks.',
        id: '2-columns',
        image: '/editor/types/2-columns.png',
        isDisabled: (editor: Editor) => editor.isActive('columns'),
        label: '2 columns',
      },
    ],
    id: 'advanced-blocks',
    label: 'Advanced blocks',
  },
]
