import type { UserStates } from '@stores/user/types'

const initialStates: UserStates = {
  currentUser: null,
  isAuthed: false,
}

export { initialStates }
