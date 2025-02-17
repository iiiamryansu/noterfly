import type { Note } from '@prisma/client'

import { createStore } from 'zustand/vanilla'

type NoteAction = {
  addNote: (note: Note) => void
  deleteNote: (noteId: string) => void
  setCurrentNoteId: (noteId: string) => void
  setIsCreatingNote: (state: boolean) => void
  setIsLoadingNote: (state: boolean) => void
  setNotes: (notes: Note[]) => void
  updateNoteTitle: (noteId: string, noteTitle: string) => void
}

type NoteState = {
  currentNoteId: null | string
  isCreatingNote: boolean
  isLoadingNote: boolean
  notes: Note[]
}

type NoteStore = NoteAction & NoteState

const initNoteStore = (notes: Note[]): NoteState => {
  return {
    currentNoteId: null,
    isCreatingNote: false,
    isLoadingNote: false,
    notes,
  }
}

const createNoteStore = (initNoteState: NoteState) => {
  return createStore<NoteStore>()((set) => ({
    ...initNoteState,
    addNote: (note) => set((state) => ({ notes: [...state.notes, note] })),
    deleteNote: (noteId) => set((state) => ({ notes: state.notes.filter((i) => i.id !== noteId) })),
    setCurrentNoteId: (noteId) => set({ currentNoteId: noteId }),
    setIsCreatingNote: (state) => set({ isCreatingNote: state }),
    setIsLoadingNote: (state) => set({ isLoadingNote: state }),
    setNotes: (notes) => set({ notes }),
    updateNoteTitle: (noteId, noteTitle) => {
      set((state) => ({
        notes: state.notes.map((i) => (i.id === noteId ? { ...i, title: noteTitle } : i)),
      }))
    },
  }))
}

export { createNoteStore, initNoteStore, type NoteStore }

export { NoteStoreProvider, useNoteStore } from '~/stores/note-store/provider'
