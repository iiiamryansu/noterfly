import type { NodeViewProps, Range } from '@tiptap/core'
import type { ComponentType } from 'react'

import { mergeAttributes, Node, nodeInputRule } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'

import ImageBlock from '~/components/editor/extensions/image/image-block'

export interface ImageOptions {
  /**
   * Controls if base64 images are allowed. Enable this if you want to allow
   * base64 image urls in the `src` attribute.
   * @default false
   * @example true
   */
  allowBase64: boolean

  /**
   * HTML attributes to add to the image element.
   * @default {}
   * @example { class: 'foo' }
   */
  HTMLAttributes: Record<string, boolean | number | string>

  /**
   * Controls if the image node should be inline or not.
   * @default false
   * @example true
   */
  inline: boolean
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    image: {
      /**
       * Add an image
       * @param options The image attributes
       * @example
       * editor
       *   .commands
       *   .setImage({ src: 'https://tiptap.dev/logo.png', alt: 'tiptap', title: 'tiptap logo' })
       */
      setImage: (options: { alt?: string; src: string; title?: string }) => ReturnType

      setImageAlign: (options: { align: 'center' | 'left' | 'right' }) => ReturnType
      setImageAt: (options: { pos: number | Range; src: string }) => ReturnType
      setImageWidth: (options: { width: number }) => ReturnType
    }
  }
}

/**
 * Matches an image to a ![image](src "title") on input.
 */
export const inputRegex = /(?:^|\s)(!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\))$/

/**
 * This extension allows you to insert images.
 * @see https://www.tiptap.dev/api/nodes/image
 */
export const Image = Node.create<ImageOptions>({
  addAttributes() {
    return {
      align: {
        default: 'center',
        parseHTML: (element) => element.getAttribute('data-align'),
        renderHTML: (attributes) => ({ 'data-align': attributes.align }),
      },
      alt: {
        default: null,
        parseHTML: (element) => element.getAttribute('alt'),
        renderHTML: (attributes) => ({ alt: attributes.alt }),
      },
      src: {
        default: null,
        parseHTML: (element) => element.getAttribute('src'),
        renderHTML: (attributes) => ({ src: attributes.src }),
      },
      title: {
        default: null,
      },
      width: {
        default: '100%',
        parseHTML: (element) => element.getAttribute('data-width'),
        renderHTML: (attributes) => ({ 'data-width': attributes.width }),
      },
    }
  },

  addCommands() {
    return {
      setImage:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            attrs: options,
            type: this.name,
          })
        },

      setImageAlign:
        (options) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, {
            align: options.align,
          })
        },

      setImageAt:
        (options) =>
        ({ commands }) => {
          return commands.insertContentAt(options.pos, {
            attrs: { src: options.src },
            type: this.name,
          })
        },

      setImageWidth:
        (options) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, {
            width: `${Math.max(0, Math.min(100, options.width))}%`,
          })
        },
    }
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: inputRegex,
        getAttributes: (match) => {
          const [, , alt, src, title] = match

          return { alt, src, title }
        },
        type: this.type,
      }),
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageBlock as unknown as ComponentType<NodeViewProps>)
  },

  addOptions() {
    return {
      allowBase64: false,
      HTMLAttributes: {},
      inline: false,
    }
  },

  defining: true,

  draggable: true,

  group() {
    return this.options.inline ? 'inline' : 'block'
  },

  inline() {
    return this.options.inline
  },

  isolating: true,

  name: 'image',

  parseHTML() {
    return [
      {
        tag: this.options.allowBase64 ? 'img[src]' : 'img[src]:not([src^="data:"])',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]
  },
})

export default Image
