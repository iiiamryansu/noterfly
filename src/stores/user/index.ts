import type { UserStore } from '@stores/user/types'

import { userActions } from '@stores/user/actions'
import { initialStates } from '@stores/user/states'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

const useUserStore = create<UserStore>()(
  persist(
    (set, get, api) => ({
      ...initialStates,
      ...userActions(set, get, api),
    }),
    {
      name: 'user-store',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)

export { useUserStore }
