import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import type { User } from '~/lib/auth/client'

type UserStore = {
  currentUser: null | User
  setCurrentUser: (user: User) => void
  updateCurrentUser: (user: Partial<User>) => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      currentUser: null,
      setCurrentUser: (user) => set({ currentUser: user }),
      updateCurrentUser: (user) => {
        const currentUser = get().currentUser

        if (!currentUser) return

        set({ currentUser: { ...currentUser, ...user } })
      },
    }),
    {
      name: 'user-store',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
