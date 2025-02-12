import { Node } from '@tiptap/core'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    columns: {
      deleteColumns: () => ReturnType
      setColumns: () => ReturnType
      setLayout: (layout: ColumnLayout) => ReturnType
    }
  }
}

export enum ColumnLayout {
  Equal = 'equal',
  Left = 'left',
  Right = 'right',
}

const Columns = Node.create({
  addAttributes() {
    return {
      layout: {
        default: ColumnLayout.Equal,
      },
    }
  },
  addCommands() {
    return {
      deleteColumns:
        () =>
        ({ commands }) =>
          commands.deleteNode('columns'),
      setColumns:
        () =>
        ({ commands }) =>
          commands.insertContent(
            // `data-type="column"` 和 `data-position="left"` 都是在 column.ts 中定义的
            `<div data-type="columns"><div data-type="column" data-position="left"><p></p></div><div data-type="column" data-position="right"><p></p></div></div>`,
          ),
      setLayout:
        (layout: ColumnLayout) =>
        ({ commands }) =>
          commands.updateAttributes('columns', { layout }),
    }
  },
  content: 'column column',
  defining: true, // https://tiptap.dev/docs/editor/api/schema#defining
  group: 'columns', // https://tiptap.dev/docs/editor/api/schema#group
  isolating: true,
  name: 'columns',
  parseHTML() {
    return [{ tag: 'div[data-type="columns"]' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', { 'class': `layout-${HTMLAttributes.layout}`, 'data-type': 'columns' }, 0]
  },
})

export default Columns
