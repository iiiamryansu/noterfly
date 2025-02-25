import type { NotebookActions, NotebookStore } from '@stores/notebook/types'
import type { StateCreator } from 'zustand'

const notebookActions: StateCreator<NotebookStore, [], [], NotebookActions> = (set) => ({
  setIsLoadingNotebooks: (state) => set({ isLoadingNotebooks: state }),

  setNotebooks: (notebooks) => {
    set((state) => ({
      notebooks: notebooks.map((nb) => ({
        ...nb,
        isExpanded: state.notebooks.find((n) => n.id === nb.id)?.isExpanded ?? false,
      })),
    }))
  },

  toggleNotebook: (notebookId) => {
    set((state) => ({
      notebooks: state.notebooks.map((nb) => (nb.id === notebookId ? { ...nb, isExpanded: !nb.isExpanded } : nb)),
    }))
  },

  updateNotebooks: (notebooks) => set({ notebooks }),
})

export { notebookActions }
