import type { SortDescriptor } from '@heroui/table'
import type { Note } from '@prisma/client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type NoteActions = {
  getSortedNotes: () => Note[]
  setIsLoadingNotes: (isLoadingNotes: boolean) => void
  setNotes: (notes: Note[]) => void
  setSortDescriptor: (sortDescriptor: SortDescriptor) => void
}

type NoteStates = {
  isLoadingNotes: boolean
  notes: Note[]
  sortDescriptor: SortDescriptor
}

type NoteStore = NoteActions & NoteStates

const initialState: NoteStates = {
  isLoadingNotes: false,
  notes: [],
  sortDescriptor: {
    column: 'updatedAt',
    direction: 'descending',
  },
}

export const useNoteStore = create<NoteStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      getSortedNotes: () => {
        const notes = get().notes
        const sortDescriptor = get().sortDescriptor

        return [...notes].sort((a, b) => {
          const first = a[sortDescriptor.column as keyof Note]
          const second = b[sortDescriptor.column as keyof Note]

          const cmp = first < second ? -1 : first > second ? 1 : 0

          return sortDescriptor.direction === 'descending' ? -cmp : cmp
        })
      },
      setIsLoadingNotes: (state) => set({ isLoadingNotes: state }),
      setNotes: (notes) => set({ notes }),
      setSortDescriptor: (sortDescriptor) => set({ sortDescriptor }),
    }),
    {
      name: 'note-store',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
