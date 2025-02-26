import type { User } from '@auth/c'

type UserActions = {
  setCurrentUser: (user: User) => void
  updateCurrentUser: (user: Partial<User>) => void
}

type UserStates = {
  currentUser: null | User
}

type UserStore = UserActions & UserStates

export type { UserActions, UserStates, UserStore }
