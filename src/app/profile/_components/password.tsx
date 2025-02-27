'use client'

import type { FormEvent } from 'react'

import { Button } from '@heroui/button'
import { Form } from '@heroui/form'
import { Input } from '@heroui/input'
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@heroui/modal'
import { trpc } from '@trpc/c'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'

import { UpdatePasswordSchema } from '~/services/trpc/schemas/user'

export function Password() {
  const { isOpen: isModalOpen, onOpen: openModal, onOpenChange: toggleModalState } = useDisclosure()

  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({})

  /* ---------------------------------- 更新密码 ---------------------------------- */
  const { isPending: isUpdating, mutate: updatePassword } = trpc.user.updatePassword.useMutation({
    onSuccess: ({ message, status }) => {
      if (status === 'success') {
        toast.success(message)

        toggleModalState()
      } else {
        toast.error(message)
      }
    },
  })

  const handleUpdatePassword = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      const { data, error, success } = UpdatePasswordSchema.safeParse(Object.fromEntries(new FormData(e.currentTarget)))

      if (success) {
        updatePassword(data)
      } else {
        setFormErrors(error.flatten().fieldErrors)
      }
    },
    [updatePassword],
  )

  /* ----------------------------------------------------------------------------- */

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-1">
        <div className="flex flex-col gap-1">
          <span className="select-none text-sm font-medium text-default-900">Password</span>
          <p className="select-none font-mono text-xs text-default-500">
            If you lose access to your email address, you&apos;ll be able to log in using your password.
          </p>
        </div>
      </div>

      <Button color="default" onPress={openModal} radius="sm" size="sm" variant="bordered">
        Change password
      </Button>
      <Modal
        classNames={{
          backdrop: [
            'absolute inset-0', // 相对于 wrapper 定位
          ],
          base: [
            'relative', // 使用相对定位
            'z-50', // 确保在最上层
          ],
          wrapper: [
            'absolute inset-0', // 相对于 main-container 定位
            'flex items-center justify-center',
            'h-full w-full', // 确保大小与 main-container 一致
          ],
        }}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        isOpen={isModalOpen}
        onOpenChange={toggleModalState}
        portalContainer={document.getElementById('main-container')!}
        size="xs"
      >
        <Form className="w-full" onSubmit={handleUpdatePassword} validationErrors={formErrors}>
          <ModalContent className="bg-base-default">
            <ModalHeader>Change password</ModalHeader>
            <ModalBody>
              <Input
                errorMessage={({ validationErrors }) => validationErrors[0]}
                isClearable
                isDisabled={isUpdating}
                label="Enter your current password"
                name="currentPassword"
                placeholder="Current password"
                type="password"
                variant="bordered"
              />
              <Input
                errorMessage={({ validationErrors }) => validationErrors[0]}
                isClearable
                isDisabled={isUpdating}
                label="Enter a new password"
                name="newPassword"
                placeholder="New password"
                type="password"
                variant="bordered"
              />
            </ModalBody>
            <ModalFooter>
              <Button color="primary" fullWidth isLoading={isUpdating} type="submit">
                {isUpdating ? '' : 'Save'}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Form>
      </Modal>
    </div>
  )
}
