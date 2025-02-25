import type { NoteStates } from '@stores/note/types'

const initialState: NoteStates = {
  isLoadingNotes: false,
  notes: [],
  sortDescriptor: {
    column: 'updatedAt',
    direction: 'descending',
  },
}

export { initialState }
