import { mergeAttributes, Node } from '@tiptap/core'

const Column = Node.create({
  addAttributes() {
    return {
      position: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-position'), // 'left' | 'right'
        renderHTML: (attributes) => ({ 'data-position': attributes.position }),
      },
    }
  },
  content: 'block+',
  isolating: true, // 禁止按下回车时创建新节点的行为
  name: 'column',

  // 定义如何解析 HTML
  parseHTML() {
    return [{ tag: 'div[data-type="column"]' }]
  },

  // 定义如何输出 HTML
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'column' }), 0]
  },
})

export default Column
