'use client'

import { Listbox, ListboxItem, ListboxSection } from '@heroui/listbox'
import Image from 'next/image'
import { forwardRef, type KeyboardEvent, useCallback, useImperativeHandle, useState } from 'react'

import { type Command, CommandGroup } from '~/features/editor/extensions/slash-commands/commands'

export const SlashCommandsMenu = forwardRef(
  ({ command: activate, items: commandGroups }: { command: (command: Command) => void; items: CommandGroup[] }, ref) => {
    const commandIds = commandGroups.flatMap((commandGroup) => commandGroup.commands.map((command) => command.id))

    const [selectedCommandId, setSelectedCommandId] = useState<string>('text')

    const handleCommandSelection = useCallback(
      (commandId: string) => {
        const command = commandGroups
          .find((commandGroup) => commandGroup.commands.find((command) => commandId === command.id))
          ?.commands.find((command) => commandId === command.id)

        if (command) activate(command)
      },
      [activate, commandGroups],
    )

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }: { event: KeyboardEvent }) => {
        if (commandGroups.length === 0) return false

        const currentCommandIndex = commandIds.indexOf(selectedCommandId)

        if (event.key === 'ArrowUp') {
          setSelectedCommandId(commandIds[currentCommandIndex <= 0 ? commandIds.length - 1 : currentCommandIndex - 1])

          return true
        }

        if (event.key === 'ArrowDown') {
          setSelectedCommandId(commandIds[currentCommandIndex >= commandIds.length - 1 ? 0 : currentCommandIndex + 1])

          return true
        }

        if (event.key === 'Enter') {
          handleCommandSelection(selectedCommandId)

          return true
        }

        return false
      },
    }))

    if (commandGroups.length === 0) return null

    return (
      <Listbox
        aria-label="Command Actions"
        className="max-h-96 min-w-72 overflow-y-auto rounded-[14px] bg-base-default px-2 py-1.5 shadow-medium scrollbar-hide"
      >
        {commandGroups.map((commandGroup) => (
          <ListboxSection
            aria-label={commandGroup.label}
            classNames={{
              heading: 'text-[11px] font-medium select-none',
            }}
            key={commandGroup.id}
            title={commandGroup.label}
          >
            {commandGroup.commands.map((command) => (
              <ListboxItem
                aria-label={command.label}
                className={selectedCommandId === command.id ? 'bg-default-100' : ''}
                key={command.id}
                onPress={() => handleCommandSelection(command.id)}
                textValue={command.label}
              >
                <div className="flex gap-2.5">
                  <Image
                    alt="Type image"
                    className="relative top-1 size-[22px] rounded-[4px] bg-white"
                    height={138}
                    src={command.image}
                    width={138}
                  />
                  <div className="flex flex-col gap-[2xp]">
                    <span className="block text-sm text-default-700">{command.label}</span>
                    <span className="block text-xs text-default-500">{command.description}</span>
                  </div>
                </div>
              </ListboxItem>
            ))}
          </ListboxSection>
        ))}
      </Listbox>
    )
  },
)

SlashCommandsMenu.displayName = 'SlashCommandsMenu'
