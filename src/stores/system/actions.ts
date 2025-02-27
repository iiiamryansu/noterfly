import type { SystemActions, SystemStore } from '@stores/system/types'
import type { StateCreator } from 'zustand'

import { initialStates } from '@stores/system/states'

const systemActions: StateCreator<SystemStore, [], [], SystemActions> = (set) => ({
  resetSystemStates: () => set(initialStates),

  setSidebarMode: (mode) => set({ sidebarMode: mode }),
})

export { systemActions }
