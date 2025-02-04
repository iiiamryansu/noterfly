'use client'

import type { Note } from '@prisma/client'

import { createContext, useContext } from 'react'

const NotesContext = createContext<
  | undefined
  | {
      notes: Note[]
    }
>(undefined)

export function NotesProvider({ children, notes }: { children: React.ReactNode; notes: Note[] }) {
  return <NotesContext.Provider value={{ notes }}>{children}</NotesContext.Provider>
}

export function useNotes() {
  const context = useContext(NotesContext)

  if (context === undefined) {
    throw new Error('The hook "useNotes" must be used within a NotesProvider! 💥')
  }

  return context
}
