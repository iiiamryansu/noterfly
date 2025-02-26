type SystemActions = {
  setSidebarMode: (mode: SystemStates['sidebarMode']) => void
}

type SystemStates = {
  sidebarMode: 'normal' | 'search'
}

type SystemStore = SystemActions & SystemStates

export type { SystemActions, SystemStates, SystemStore }
