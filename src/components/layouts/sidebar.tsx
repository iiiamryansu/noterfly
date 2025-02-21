'use client'

import { Divider } from '@heroui/divider'

import ControlPanel from '~/components/panels/control-panel'
import LogoPanel from '~/components/panels/logo-panel'
import MenuPanel from '~/components/panels/menu-panel'
import NavigationPanel from '~/components/panels/navigation-panel'
import NotebookPanel from '~/components/panels/notebook-panel'
import UserPanel from '~/components/panels/user-panel'

export default function Sidebar() {
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
