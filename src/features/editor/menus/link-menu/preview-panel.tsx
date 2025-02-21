import { Button } from '@heroui/button'
import { Divider } from '@heroui/divider'
import { Copy01Icon, PencilEdit02Icon, Unlink01Icon } from 'hugeicons-react'

interface PreviewPanelProps {
  clear: () => void
  edit: () => void
  url: string
}

export default function PreviewPanel({ clear, edit, url }: PreviewPanelProps) {
  return (
    <>
      <Button
        className="group relative h-7 min-w-16 max-w-48 px-2"
        onPress={() => navigator.clipboard.writeText(url)}
        radius="sm"
        size="sm"
        variant="light"
      >
        <span className="truncate text-primary-500 underline group-hover:invisible" style={{ direction: 'ltr' }}>
          {url}
        </span>
        <Copy01Icon className="absolute hidden size-[14px] text-success-500 group-hover:block" strokeWidth={2} />
      </Button>

      <Divider className="h-5 bg-divider" orientation="vertical" />

      <Button
        className="!size-7 min-h-7 min-w-7"
        disableAnimation
        isIconOnly
        onPress={edit}
        radius="sm"
        size="sm"
        variant="light"
      >
        <PencilEdit02Icon className="size-[14px] text-warning-500" strokeWidth={2} />
      </Button>
      <Button
        className="!size-7 min-h-7 min-w-7"
        disableAnimation
        isIconOnly
        onPress={clear}
        radius="sm"
        size="sm"
        variant="light"
      >
        <Unlink01Icon className="size-[14px] text-danger-500" strokeWidth={2} />
      </Button>
    </>
  )
}
