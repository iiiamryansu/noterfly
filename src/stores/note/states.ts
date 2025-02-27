import type { NoteStates } from '@stores/note/types'

const initialStates: NoteStates = {
  isLoadingNotes: false,
  notes: [],
  sortDescriptor: {
    column: 'updatedAt',
    direction: 'descending',
  },
}

export { initialStates }
