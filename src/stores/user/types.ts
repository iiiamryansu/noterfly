import type { User } from '@auth/c'

type UserActions = {
  resetUserStates: () => void
  setCurrentUser: (user: User) => void
  setIsAuthed: (isAuthed: boolean) => void
  updateCurrentUser: (user: Partial<User>) => void
}

type UserStates = {
  currentUser: null | User
  isAuthed: boolean
}

type UserStore = UserActions & UserStates

export type { UserActions, UserStates, UserStore }
