import type { SystemStore } from '@stores/system/types'

import { systemActions } from '@stores/system/actions'
import { initialStates } from '@stores/system/states'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

const useSystemStore = create<SystemStore>()(
  persist(
    (set, get, api) => ({
      ...initialStates,
      ...systemActions(set, get, api),
    }),
    {
      name: 'system-store',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)

export { useSystemStore }
