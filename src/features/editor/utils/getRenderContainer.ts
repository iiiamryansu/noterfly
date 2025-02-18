import type { Editor } from '@tiptap/react'

export function getRenderContainer(editor: Editor, type: string) {
  const {
    state: {
      selection: { from },
    },
    view,
  } = editor

  const focusedElements = document.querySelectorAll('.has-focus')
  const element = focusedElements[focusedElements.length - 1]

  if (
    (element && element.getAttribute('data-type') && element.getAttribute('data-type') === type) ||
    (element && element.classList && element.classList.contains(type))
  ) {
    return element
  }

  const node = view.domAtPos(from).node as HTMLElement

  let container = node

  if (!container.tagName) {
    container = node.parentElement as HTMLElement
  }

  while (
    container &&
    !(container.getAttribute('data-type') && container.getAttribute('data-type') === type) &&
    !container.classList.contains(type)
  ) {
    container = container.parentElement as HTMLElement
  }

  return container
}
