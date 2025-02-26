import type { NoteStore } from '@stores/note/types'

import { noteActions } from '@stores/note/actions'
import { initialStates } from '@stores/note/states'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

const useNoteStore = create<NoteStore>()(
  persist(
    (set, get, api) => ({
      ...initialStates,
      ...noteActions(set, get, api),
    }),
    {
      name: 'note-store',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)

export { useNoteStore }
