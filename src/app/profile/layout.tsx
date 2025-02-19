import type { Metadata } from 'next'

import { ScrollShadow } from '@heroui/react'

export const metadata: Metadata = {
  title: 'Profile / Noterfly',
}

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ScrollShadow className="grid h-full auto-rows-min grid-cols-[256px_1fr] gap-x-16 overflow-y-auto px-10" hideScrollBar>
      {children}
    </ScrollShadow>
  )
}
