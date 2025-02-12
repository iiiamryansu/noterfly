import type { SuggestionKeyDownProps, SuggestionProps } from '@tiptap/suggestion'

import { ReactRenderer } from '@tiptap/react'
import tippy, { type Instance } from 'tippy.js'

import { SlashCommandsMenu } from '~/components/editor/extensions/slash-commands/slash-commands-menu'

interface CommandsMenuRef {
  onKeyDown: (props: SuggestionKeyDownProps) => boolean
}

export const renderer = () => {
  let popup: Instance[]
  let component: ReactRenderer<CommandsMenuRef>

  return {
    onExit: () => {
      popup[0].destroy()
      component.destroy()
    },

    onKeyDown: (props: SuggestionKeyDownProps) => {
      if (!component.ref) return false

      return component.ref.onKeyDown(props) ?? false
    },

    onStart: (props: SuggestionProps) => {
      component = new ReactRenderer(SlashCommandsMenu, {
        editor: props.editor,
        props,
      }) as ReactRenderer<CommandsMenuRef>

      if (!props.clientRect) return

      popup = tippy('.tiptap', {
        content: component.element,
        getReferenceClientRect: props.clientRect as () => DOMRect,
        interactive: true,
        placement: 'bottom-start',
        showOnCreate: true,
        trigger: 'manual',
      })
    },

    onUpdate: (props: SuggestionProps) => {
      component.updateProps(props)

      if (!props.clientRect) return

      popup[0].setProps({
        getReferenceClientRect: props.clientRect as () => DOMRect,
      })
    },
  }
}
