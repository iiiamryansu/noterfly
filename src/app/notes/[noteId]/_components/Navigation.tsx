'use client'

import type { RouterOutputs } from '@trpc/c'

import { BreadcrumbItem, Breadcrumbs } from '@heroui/breadcrumbs'
import { cn } from '@utils/cn'
import { Home01Icon, Note01Icon, NotebookIcon } from 'hugeicons-react'
import { useRouter } from 'next/navigation'

interface NavigationProps {
  note: RouterOutputs['note']['getNote']
}

export function Navigation({ note }: NavigationProps) {
  const router = useRouter()

  if (!note) return null

  return (
    <Breadcrumbs
      itemClasses={{
        item: cn('flex select-none items-center'),
        separator: cn('select-none px-2 text-[10px]'),
      }}
      separator="/"
      size="sm"
      variant="light"
    >
      <BreadcrumbItem onPress={() => router.push('/')} startContent={<Home01Icon className="size-3" />}>
        Home
      </BreadcrumbItem>
      <BreadcrumbItem startContent={<NotebookIcon className="size-3" />}>
        <span className="max-w-40 truncate" style={{ direction: 'ltr' }}>
          {note.notebook?.name ?? 'Unsorted'}
        </span>
      </BreadcrumbItem>
      <BreadcrumbItem startContent={<Note01Icon className="size-3" />}>
        <span className="max-w-40 truncate" style={{ direction: 'ltr' }}>
          {note.title}
        </span>
      </BreadcrumbItem>
    </Breadcrumbs>
  )
}
