'use client'

import { Button } from '@heroui/button'
import { Form } from '@heroui/form'
import { Input } from '@heroui/input'
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@heroui/modal'
import { useUserStore } from '@stores/user'
import { trpc } from '@trpc/c'
import { AddCircleIcon } from 'hugeicons-react'
import { FormEvent, useCallback, useState } from 'react'
import { z } from 'zod'

import { NotebookList } from '~/components/panels/notebook-panel/notebook-list'

export default function NotebookPanel() {
  const currentUser = useUserStore((state) => state.currentUser)

  /* ----------------------------- Create Notebook ---------------------------- */

  const { isOpen: isModalOpen, onOpen: openModal, onOpenChange: toggleModalState } = useDisclosure()

  const utils = trpc.useUtils()

  const { isPending: isCreatingNotebook, mutate: createNotebook } = trpc.notebook.createNotebook.useMutation({
    onSuccess: () => {
      utils.notebook.getNotebooks.invalidate()

      toggleModalState()
    },
  })

  const [isInvalid, setIsInvalid] = useState<boolean>(false)

  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({})

  const handleCreateNotebook = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      const { data, error, success } = z
        .object({ name: z.string().min(1, 'Notebook name is required.') })
        .safeParse(Object.fromEntries(new FormData(e.currentTarget)))

      if (success) {
        createNotebook(data)
      } else {
        setIsInvalid(true)
        setFormErrors(error.flatten().fieldErrors)
      }
    },
    [createNotebook],
  )

  /* ----------------------------------------------------------------------------- */

  return (
    <section className="flex h-[calc(100vh-470px)] flex-col overflow-y-auto pt-2">
      <header className="flex items-center justify-between pl-2">
        <span className="block select-none text-xs font-semibold text-default-500">Notebooks</span>
        <Button className="text-default-500" isIconOnly onPress={openModal} size="sm" variant="light">
          <AddCircleIcon className="size-4" />
        </Button>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsInvalid(false)}
          onOpenChange={toggleModalState}
          portalContainer={document.getElementById('main-container')!}
          size="xs"
        >
          <Form className="w-full" onSubmit={handleCreateNotebook} validationErrors={formErrors}>
            <ModalContent className="bg-base-default">
              <ModalHeader>Create New Notebook</ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  classNames={{
                    input: 'text-xs px-1',
                  }}
                  errorMessage={formErrors.name?.[0]}
                  isClearable
                  isDisabled={isCreatingNotebook}
                  isInvalid={isInvalid}
                  name="name"
                  onValueChange={() => setIsInvalid(false)}
                  placeholder="Notebook Name"
                  size="sm"
                  type="text"
                  variant="flat"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="primary" fullWidth isLoading={isCreatingNotebook} size="sm" type="submit">
                  {isCreatingNotebook ? '' : 'Create'}
                </Button>
              </ModalFooter>
            </ModalContent>
          </Form>
        </Modal>
      </header>

      {currentUser && <NotebookList />}
    </section>
  )
}
