import type { SystemActions, SystemStore } from '@stores/system/types'
import type { StateCreator } from 'zustand'

const systemActions: StateCreator<SystemStore, [], [], SystemActions> = (set) => ({
  setSidebarMode: (mode) => set({ sidebarMode: mode }),
})

export { systemActions }
