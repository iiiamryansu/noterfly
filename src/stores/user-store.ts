import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import type { User } from '~/lib/auth/client'

type UserStore = {
  currentUser: null | User
  setCurrentUser: (user: User) => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      currentUser: null,
      setCurrentUser: (user) => set({ currentUser: user }),
    }),
    {
      name: 'user-store',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
