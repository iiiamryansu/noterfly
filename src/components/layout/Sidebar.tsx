'use client'

import { Divider } from '@heroui/react'

import { ControlPanel, LogoPanel, MenuPanel, NavigationPanel, NotebookPanel, UserPanel } from '~/components/panel'

export function Sidebar() {
  return (
    <aside className="grid h-full w-full flex-none grid-cols-1 grid-rows-[48px_68px_17px_40px_212px_1fr_1px_48px] pl-2">
      <LogoPanel />
      <MenuPanel />
      <Divider className="my-2" />
      <UserPanel />
      <NavigationPanel />
      <NotebookPanel />
      <Divider />
      <ControlPanel />
    </aside>
  )
}
