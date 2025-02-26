import type { UserActions, UserStore } from '@stores/user/types'
import type { StateCreator } from 'zustand'

const userActions: StateCreator<UserStore, [], [], UserActions> = (set, get) => ({
  setCurrentUser: (user) => set({ currentUser: user }),

  updateCurrentUser: (user) => {
    const currentUser = get().currentUser

    if (!currentUser) return

    set({ currentUser: { ...currentUser, ...user } })
  },
})

export { userActions }
