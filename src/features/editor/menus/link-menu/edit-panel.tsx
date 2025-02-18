import { Button, Input } from '@heroui/react'
import { CheckmarkCircle01Icon } from 'hugeicons-react'
import { useState } from 'react'

import { linkSchema } from '~/features/editor/menus/link-menu'

interface EditPanelProps {
  submit: (value: string) => void
  url: string
}

export default function EditPanel({ submit, url }: EditPanelProps) {
  const [value, setValue] = useState<string>(url)
  const [isInvalid, setIsInvalid] = useState<boolean>(false)

  return (
    <>
      <Input
        classNames={{
          input: 'text-xs',
          inputWrapper: 'h-7 min-h-7 w-48',
        }}
        defaultValue={value}
        disableAnimation
        isClearable
        isInvalid={isInvalid}
        onValueChange={(value) => {
          setIsInvalid(false)
          setValue(value)
        }}
        placeholder="Paste link or search notes"
        radius="sm"
        size="sm"
        type="url"
      />
      <Button
        className="!size-7 min-h-7 min-w-7"
        disableAnimation
        isIconOnly
        onPress={() => {
          if (linkSchema.safeParse({ url: value }).success) {
            submit(value)
          } else {
            setIsInvalid(true)
          }
        }}
        radius="sm"
        size="sm"
        variant="light"
      >
        <CheckmarkCircle01Icon className="size-[14px] text-success-500" strokeWidth={2} />
      </Button>
    </>
  )
}
