import type { Note } from '@prisma/client'

import { createJSONStorage, persist } from 'zustand/middleware'
import { createStore } from 'zustand/vanilla'

type NoteAction = {
  addNote: (note: Note) => void
  deleteNote: (noteId: string) => void
  setCurrentNote: (note: Partial<Note>) => void
  setCurrentNoteId: (noteId: string) => void
  setIsCreatingNote: (state: boolean) => void
  setIsLoadingNote: (state: boolean) => void
  setNotes: (notes: Note[]) => void
  updateNoteTitle: (noteId: string, noteTitle: string) => void
}

type NoteState = {
  currentNote: Note | null
  currentNoteId: null | string
  isCreatingNote: boolean
  isLoadingNote: boolean
  notes: Note[]
}

type NoteStore = NoteAction & NoteState

const initNoteStore = (notes: Note[]): NoteState => {
  return {
    currentNote: null,
    currentNoteId: null,
    isCreatingNote: false,
    isLoadingNote: false,
    notes,
  }
}

const createNoteStore = (initNoteState: NoteState) => {
  return createStore<NoteStore>()(
    persist(
      (set, get) => ({
        ...initNoteState,
        addNote: (note) => set((state) => ({ notes: [...state.notes, note] })),
        deleteNote: (noteId) => set((state) => ({ notes: state.notes.filter((note) => note.id !== noteId) })),
        setCurrentNote: (note) => {
          const currentNote = get().currentNote

          if (currentNote) {
            set({ currentNote: { ...currentNote, ...note } as Note })
          } else {
            set({ currentNote: note as Note })
          }
        },
        setCurrentNoteId: (noteId) => set({ currentNoteId: noteId }),
        setIsCreatingNote: (state) => set({ isCreatingNote: state }),
        setIsLoadingNote: (state) => set({ isLoadingNote: state }),
        setNotes: (notes) => set({ notes }),
        updateNoteTitle: (noteId, noteTitle) => {
          set((state) => ({
            notes: state.notes.map((note) => (note.id === noteId ? { ...note, title: noteTitle } : note)),
          }))
        },
      }),
      {
        name: 'note-store',
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
  )
}

export { createNoteStore, initNoteStore, type NoteStore }

export { NoteStoreProvider, useNoteStore } from '~/stores/note-store/provider'
