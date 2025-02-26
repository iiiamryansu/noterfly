'use client'

import { Divider } from '@heroui/divider'
import { Tab, Tabs } from '@heroui/tabs'
import { useSystemStore } from '@stores/system'
import { useUserStore } from '@stores/user'

import ControlPanel from '~/components/panels/control-panel'
import LogoPanel from '~/components/panels/logo-panel'
import MenuPanel from '~/components/panels/menu-panel'
import NavigationPanel from '~/components/panels/navigation-panel'
import NotebookPanel from '~/components/panels/notebook-panel'
import SearchPanel from '~/components/panels/search-panel'
import UserPanel from '~/components/panels/user-panel'

export default function Sidebar() {
  const currentUser = useUserStore((state) => state.currentUser)
  const sidebarMode = useSystemStore((state) => state.sidebarMode)

  return (
    <aside className="grid h-full w-full flex-none grid-cols-1 grid-rows-[48px_104px_17px_40px_1fr_1px_48px] pl-2">
      <LogoPanel />
      <MenuPanel />
      <Divider className="my-2" />
      <UserPanel />

      <Tabs
        aria-label="Sidebar's 'normal' and 'search' mode"
        classNames={{
          base: 'hidden',
          panel: 'p-0 h-[calc(100vh-258px)]',
        }}
        selectedKey={sidebarMode}
      >
        <Tab key="normal" title="Normal">
          <NavigationPanel />
          {currentUser ? <NotebookPanel /> : <div></div>}
        </Tab>
        <Tab key="search" title="Search">
          <SearchPanel />
        </Tab>
      </Tabs>

      <Divider />
      <ControlPanel />
    </aside>
  )
}
