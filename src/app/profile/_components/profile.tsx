'use client'

import type { ChangeEvent, FormEvent } from 'react'

import {
  Button,
  Form,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@heroui/react'
import { Camera01Icon } from 'hugeicons-react'
import { useCallback, useRef, useState } from 'react'
import { toast } from 'sonner'

import { trpc } from '~/lib/trpc/client'
import { UpdateProfileSchema } from '~/services/trpc/schemas/user'
import { useUserStore } from '~/stores/user-store'
import { compressImage } from '~/utils'

export function Profile() {
  const { isOpen, onOpen: openModal, onOpenChange: toggleModalState } = useDisclosure()

  const { currentUser, updateCurrentUser } = useUserStore((state) => state)

  const avatarInputRef = useRef<HTMLInputElement>(null)

  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null) // 已选中的头像 (file)
  const [uploadedAvatar, setUploadedAvatar] = useState<null | string>(null) // 已上传的头像 (url)

  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({})

  /* ---------------------------------- 更新用户 ---------------------------------- */
  const { isPending: isUpdatingProfile, mutate: updateProfile } = trpc.user.updateProfile.useMutation({
    onSuccess: (updatedProfile) => {
      updateCurrentUser(updatedProfile) // 更新当前用户状态

      toast.success('Profile updated successfully. ☺️')

      toggleModalState() // 关闭模态框
    },
  })

  /* ---------------------------------- 上传头像 ---------------------------------- */
  const { isPending: isUploadingAvatar, mutate: uploadAvatar } = trpc.s3.getSignedUrl.useMutation({
    onError: () => {
      toast.error('Unable to upload avatar. 🫠')
    },
    onSuccess: async ({ signedUrl, url }) => {
      try {
        const res = await fetch(signedUrl, {
          body: await compressImage(selectedAvatar!, 508),
          headers: {
            'Content-Type': selectedAvatar!.type,
          },
          method: 'PUT',
        })

        if (res.ok) {
          // 头像上传成功

          setUploadedAvatar(url) // 更新已上传的头像状态
        } else {
          // 头像上传失败

          toast.error('Unable to upload avatar. 🫠')
        }
      } catch {
        toast.error('Unable to upload avatar. 🫠')
      }
    },
  })

  /* --------------------------------- 处理头像变化 --------------------------------- */
  const handleAvatarChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        setSelectedAvatar(e.target.files[0]) // 更新已选中的头像状态

        uploadAvatar({ type: 'avatar' }) // 上传头像
      }
    },
    [uploadAvatar],
  )

  /* --------------------------------- 处理更新用户 --------------------------------- */
  const handleUpdateProfile = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      const { data, error, success } = UpdateProfileSchema.safeParse(Object.fromEntries(new FormData(e.currentTarget)))

      if (success) {
        // 表单验证成功

        updateProfile({
          data: uploadedAvatar ? { ...data, image: uploadedAvatar } : data, // 如果有已上传的头像, 则包含它
        })
      } else {
        // 表单验证失败

        return setFormErrors(error.flatten().fieldErrors)
      }
    },
    [updateProfile, uploadedAvatar],
  )

  /* ----------------------------------------------------------------------------- */

  return (
    <section className="flex w-64 flex-col gap-4 py-6">
      <Image
        alt="Avatar"
        className="size-64 border border-divider"
        draggable={false}
        height={256}
        isZoomed={true}
        loading="eager"
        radius="full"
        src={currentUser?.image ?? 'default/avatar.svg'}
        width={256}
      />

      <div className="flex flex-col gap-1">
        <h1 className="select-none text-xl font-bold text-default-900">{currentUser?.name}</h1>
        <span className="select-none font-mono text-sm text-default-500">@{currentUser?.username}</span>
      </div>

      <Button onPress={openModal} radius="sm" size="sm" variant="bordered">
        Update profile
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
        isOpen={isOpen}
        onOpenChange={toggleModalState}
        portalContainer={document.getElementById('main-container')!}
        size="xs"
      >
        <Form className="w-full" onSubmit={handleUpdateProfile} validationErrors={formErrors}>
          <ModalContent className="bg-base-default">
            <ModalHeader>Update profile</ModalHeader>
            <ModalBody>
              <div className="relative flex justify-center">
                <Image
                  alt="Avatar"
                  className="z-90 size-64 border border-divider"
                  draggable={false}
                  height={256}
                  loading="lazy"
                  radius="full"
                  src={uploadedAvatar ?? currentUser?.image ?? 'default/avatar.svg'}
                  width={256}
                />
                <Button
                  className="z-100 group absolute bottom-5 right-5 bg-base-default"
                  isIconOnly
                  isLoading={isUploadingAvatar}
                  onPress={() => avatarInputRef.current?.click()}
                  radius="full"
                  size="sm"
                  variant="bordered"
                >
                  <Camera01Icon className="size-4 text-default-500 group-hover:text-primary-500" />
                </Button>
                <input accept="image/*" className="hidden" onChange={handleAvatarChange} ref={avatarInputRef} type="file" />
              </div>
              <Input
                defaultValue={currentUser?.username ?? 'default'}
                isDisabled
                isReadOnly
                label="Username"
                name="username"
                type="text"
                variant="bordered"
              />
              <Input
                defaultValue={currentUser?.name ?? 'Default'}
                errorMessage={({ validationErrors }) => validationErrors[0]}
                isClearable
                isDisabled={isUpdatingProfile}
                label="Name"
                name="name"
                onValueChange={() => setFormErrors((prev) => ({ ...prev, name: [] }))}
                placeholder="Name"
                type="text"
                variant="bordered"
              />
            </ModalBody>
            <ModalFooter>
              <Button color="primary" fullWidth isLoading={isUpdatingProfile} type="submit">
                {isUpdatingProfile ? '' : 'Save'}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Form>
      </Modal>
    </section>
  )
}
