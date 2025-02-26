'use client'

import { Button } from '@heroui/button'
import { useDisclosure } from '@heroui/modal'
import { useUserStore } from '@stores/user'
import { trpc } from '@trpc/c'
import { Home01Icon, Note01Icon, WasteIcon } from 'hugeicons-react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { v4 as uuid } from 'uuid'

import { RecentlyDeletedModal } from '~/components/modals/recently-deleted-modal'

export default function MenuPanel() {
  const utils = trpc.useUtils()

  const router = useRouter()

  const t = useTranslations('Layout.Sidebar.MenuPanel')

  const { mutate: createNote } = trpc.note.createNote.useMutation({
    onMutate: ({ noteId }) => {
      router.push(`/notes/${noteId}`)
    },
    onSuccess: () => {
      utils.note.getNote.invalidate()
      utils.note.getNotes.invalidate()
    },
  })

  /* ------------------------- Recently Deleted Modal ------------------------- */

  const currentUser = useUserStore((state) => state.currentUser)

  const { isOpen: isModalOpen, onOpen: openModal, onOpenChange: toggleModalState } = useDisclosure()

  /* ----------------------------------------------------------------------------- */

  return (
    <section className="flex flex-col gap-1">
      <Button
        className="justify-start"
        onPress={() => router.push('/home')}
        size="sm"
        startContent={<Home01Icon className="size-4" />}
        variant="light"
      >
        {t('home')}
      </Button>
      <Button
        className="justify-start"
        onPress={() => createNote({ noteId: uuid() })}
        size="sm"
        startContent={<Note01Icon className="size-4" />}
        variant="light"
      >
        {t('new-note')}
      </Button>

      {currentUser && (
        <>
          <Button
            className="justify-start"
            onPress={openModal}
            size="sm"
            startContent={<WasteIcon className="size-4" />}
            variant="light"
          >
            Recently Deleted
          </Button>
          <RecentlyDeletedModal isOpen={isModalOpen} onOpenChange={toggleModalState} />
        </>
      )}
    </section>
  )
}
