import { type Editor, Extension } from '@tiptap/core'
import { PluginKey } from '@tiptap/pm/state'
import { Suggestion } from '@tiptap/suggestion'

import { type Command, COMMAND_GROUPS } from '~/components/editor/extensions/slash-commands/commands'
import { renderer } from '~/components/editor/extensions/slash-commands/renderer'

const SlashCommandsPluginKey = new PluginKey('slash-commands')

const SlashCommands = Extension.create({
  addProseMirrorPlugins() {
    return [
      Suggestion({
        allow: ({ range, state }) => {
          const $from = state.doc.resolve(range.from)

          const isRoot = $from.depth === 1 // 当前在第一层级
          const isInParagraph = $from.parent.type.name === 'paragraph' // 在 paragraph 中
          const isAtTheStartOfTheNode = $from.parent.textContent?.charAt(0) === '/' // 在 node 的开头
          const isValidAfterContent = !$from.parent.textContent
            ?.substring($from.parent.textContent?.indexOf('/'))
            ?.endsWith('  ') // '/' 后紧跟的不是两个空格

          const isInColumn = this.editor.isActive('column') // 在 column 中

          return (
            ((isRoot && isInParagraph && isAtTheStartOfTheNode) || (isInColumn && isInParagraph && isAtTheStartOfTheNode)) &&
            isValidAfterContent
          )
        },
        allowSpaces: true,
        char: '/',
        command: ({ editor, props: command }: { editor: Editor; props: Command }) => {
          const { state, view } = editor
          const { $from, $head } = view.state.selection

          const end = $from.pos
          const from = $head?.nodeBefore
            ? end - ($head.nodeBefore.text?.substring($head.nodeBefore.text?.indexOf('/')).length ?? 0)
            : $from.start()

          const tr = state.tr.deleteRange(from, end)

          view.dispatch(tr)

          command.action(editor)

          view.focus()
        },
        editor: this.editor,
        items: ({ query }: { query: string }) => {
          const filteredCommandGroups = COMMAND_GROUPS.map((commandGroup) => ({
            ...commandGroup, // id, label
            commands: commandGroup.commands.filter((command) => {
              const { aliases, label } = command

              const normalizedLabel = label.toLowerCase().trim()
              const normalizedQuery = query.toLowerCase().trim()

              return normalizedLabel.includes(normalizedQuery) || aliases.includes(normalizedQuery)
            }),
          })).filter((commandGroup) => {
            if (commandGroup.commands.length > 0) return true
            else return false
          })

          return filteredCommandGroups
        },
        pluginKey: SlashCommandsPluginKey,
        render: renderer,
        startOfLine: true,
      }),
    ]
  },
  name: 'slash-commands',
  priority: 200,
})

export default SlashCommands
