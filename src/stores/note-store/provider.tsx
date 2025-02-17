'use client'

import type { Note } from '@prisma/client'

import { createContext, type ReactNode, useContext, useRef } from 'react'
import { useStore } from 'zustand'

import { createNoteStore, initNoteStore, type NoteStore } from '~/stores/note-store'

type NoteStoreApi = ReturnType<typeof createNoteStore>

const NoteStoreContext = createContext<NoteStoreApi | undefined>(undefined)

const NoteStoreProvider = ({ children, notes }: { children: ReactNode; notes: Note[] }) => {
  const noteStoreRef = useRef<NoteStoreApi>(null)

  if (!noteStoreRef.current) {
    noteStoreRef.current = createNoteStore(initNoteStore(notes))
  }

  return <NoteStoreContext.Provider value={noteStoreRef.current}>{children}</NoteStoreContext.Provider>
}

const useNoteStore = <T,>(selector: (store: NoteStore) => T): T => {
  const noteStoreContext = useContext(NoteStoreContext)

  if (!noteStoreContext) {
    throw new Error(`The hook 'useNoteStore' must be used within NoteStoreProvider! 💥`)
  }

  return useStore(noteStoreContext, selector)
}

export { NoteStoreProvider, useNoteStore }
