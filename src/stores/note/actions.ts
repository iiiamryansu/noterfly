import type { NoteActions, NoteStore, NoteWithNotebook } from '@stores/note/types'
import type { StateCreator } from 'zustand'

const noteActions: StateCreator<NoteStore, [], [], NoteActions> = (set, get) => ({
  getSortedNotes: () => {
    const notes = get().notes
    const sortDescriptor = get().sortDescriptor

    return [...notes].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof NoteWithNotebook]!
      const second = b[sortDescriptor.column as keyof NoteWithNotebook]!

      const cmp = first < second ? -1 : first > second ? 1 : 0

      return sortDescriptor.direction === 'descending' ? -cmp : cmp
    })
  },

  setIsLoadingNotes: (state) => set({ isLoadingNotes: state }),

  setNotes: (notes) => set({ notes }),

  setSortDescriptor: (sortDescriptor) => set({ sortDescriptor }),

  updateNote: (noteId, data) => {
    set((state) => ({
      notes: state.notes.map((note) => (note.id === noteId ? { ...note, ...data } : note)),
    }))
  },

  updateNotes: (notes) => set({ notes }),
})

export { noteActions }
