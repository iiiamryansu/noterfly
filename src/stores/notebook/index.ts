import type { NotebookStore } from '@stores/notebook/types'

import { notebookActions } from '@stores/notebook/actions'
import { initialStates } from '@stores/notebook/states'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

const useNotebookStore = create<NotebookStore>()(
  persist(
    (set, get, api) => ({
      ...initialStates,
      ...notebookActions(set, get, api),
    }),
    {
      name: 'notebook-store',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)

export { useNotebookStore }
