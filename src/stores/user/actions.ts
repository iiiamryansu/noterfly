import type { UserActions, UserStore } from '@stores/user/types'
import type { StateCreator } from 'zustand'

import { initialStates } from '@stores/user/states'

const userActions: StateCreator<UserStore, [], [], UserActions> = (set, get) => ({
  resetUserStates: () => set(initialStates),

  setCurrentUser: (user) => set({ currentUser: user }),

  setIsAuthed: (isAuthed) => set({ isAuthed }),

  updateCurrentUser: (user) => {
    const currentUser = get().currentUser

    if (!currentUser) return

    set({ currentUser: { ...currentUser, ...user } })
  },
})

export { userActions }
