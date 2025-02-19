'use client'

import { useRef, useState } from 'react'
import { type ImperativePanelHandle, Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'

import Headbar from '~/components/layouts/headbar'
import Main from '~/components/layouts/main'
import Sidebar from '~/components/layouts/sidebar'

interface AppLayoutProps {
  children: React.ReactNode
  defaultLayout: number[]
}

export default function AppLayout({ children, defaultLayout }: AppLayoutProps) {
  const sidebarPanelRef = useRef<ImperativePanelHandle>(null)

  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(true)

  function toggleSidebar() {
    const sidebarPanel = sidebarPanelRef.current

    if (sidebarPanel) {
      if (sidebarPanel.isExpanded()) {
        sidebarPanel.collapse()
        setIsSidebarExpanded(false)
      } else {
        sidebarPanel.expand()
        setIsSidebarExpanded(true)
      }
    }
  }

  function persistLayout(sizes: number[]) {
    document.cookie = `react-resizable-panels:layout=${JSON.stringify(sizes)}`
  }

  return (
    <PanelGroup autoSaveId="example" className="h-full bg-base-default" direction="horizontal" onLayout={persistLayout}>
      <Panel className="max-w-64" collapsible defaultSize={defaultLayout[0]} minSize={25} ref={sidebarPanelRef}>
        <Sidebar />
      </Panel>
      <PanelResizeHandle disabled />
      <Panel className="grid grid-cols-1 grid-rows-[48px_1fr]" defaultSize={defaultLayout[1]}>
        <Headbar isSidebarExpanded={isSidebarExpanded} toggleSidebarAction={toggleSidebar} />
        <Main>{children}</Main>
      </Panel>
    </PanelGroup>
  )
}
