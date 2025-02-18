import type { ComponentType } from 'react'

import { Node, type NodeViewProps, ReactNodeViewRenderer } from '@tiptap/react'

import ImageUploaderBlock from '~/features/editor/extensions/image-uploader/image-uploader-block'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageUploader: {
      setImageUploader: () => ReturnType
    }
  }
}

export const ImageUploader = Node.create({
  addCommands() {
    return {
      setImageUploader:
        () =>
        ({ commands }) => {
          return commands.insertContent(`<div data-type="${this.name}"></div>`)
        },
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageUploaderBlock as unknown as ComponentType<NodeViewProps>)
  },

  defining: true,

  draggable: true,

  group: 'block',

  inline: false,

  isolating: true,

  name: 'imageUploader',

  parseHTML() {
    return [
      {
        tag: `div[data-type="${this.name}"]`,
      },
    ]
  },

  renderHTML() {
    return ['div', { 'data-type': this.name }]
  },

  selectable: true,
})

export default ImageUploader
