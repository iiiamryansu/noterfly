'use client'

import {
  Button,
  Chip,
  Divider,
  Form,
  Input,
  InputOtp,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@heroui/react'
import { delay } from 'es-toolkit'
import { useRouter } from 'next/navigation'
import { type FormEvent, useCallback, useEffect, useRef, useState, useTransition } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

import { updatePassword } from '~/actions/auth'
import { Profile } from '~/app/profile/_components/profile'
import { deleteUser, sendVerificationOtp, verifyEmail } from '~/lib/auth/client'
import { useUserStore } from '~/stores/user-store'

export default function ProfilePage() {
  const [isDeleting, startTransition] = useTransition()

  const router = useRouter()

  const handleDeleteUser = useCallback(() => {
    startTransition(async () => {
      const { data } = await deleteUser()

      if (data?.success) {
        toast.success('Your account has been deleted successfully!')

        await delay(1000).then(() => router.push('/auth/sign-in')) // 延迟 1 秒后跳转至登录页面
      } else {
        toast.error('Unable to delete your account!')
      }
    })
  }, [router])

  return (
    <>
      <span className="col-span-2 block shrink-0 select-none py-6 text-3xl font-bold">Profile</span>

      <Profile />

      <section className="flex select-none items-center justify-center rounded-small border border-divider font-mono text-default-500">
        Placeholder
      </section>

      <section className="col-span-2 py-6">
        <span className="block select-none text-xl font-medium text-default-700">Account security</span>

        <Divider className="my-2" />

        <div className="flex flex-col gap-4 py-4">
          <Email />

          <Password />

          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="select-none text-sm font-medium text-default-900">2-step verification</span>
              <p className="select-none font-mono text-xs text-default-500">
                Add an additional layer of security to your account during login.
              </p>
            </div>

            <Button radius="sm" size="sm" variant="bordered">
              Add verification method
            </Button>
          </div>
        </div>
      </section>

      <section className="col-span-2 py-6">
        <span className="block select-none text-xl font-medium text-default-700">Support</span>

        <Divider className="my-2" />

        <div className="flex flex-col gap-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="select-none text-sm font-medium text-danger">Delete my account</span>
              <p className="select-none font-mono text-xs text-default-500">
                Permanently delete the account and remove access from all workspaces.
              </p>
            </div>

            <Button color="danger" isLoading={isDeleting} onPress={handleDeleteUser} radius="sm" size="sm" variant="bordered">
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}

function Email() {
  const inputOtpRef = useRef<HTMLInputElement>(null)

  const { currentUser, updateCurrentUser } = useUserStore((state) => state)

  const [value, setValue] = useState<string>('')
  const [isInvalid, setIsInvalid] = useState<boolean>(false)

  const [isSending, setIsSending] = useState<boolean>(false) // 是否正在发送验证码
  const [isSend, setIsSend] = useState<boolean>(false) // 是否发送了验证码
  const [isVerifying, setIsVerifying] = useState<boolean>(false) // 是否正在验证邮箱

  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const handleSendVerificationOtp = useCallback(async () => {
    if (!currentUser?.email) return

    try {
      setIsSending(true) // 开始发送

      const { data } = await sendVerificationOtp({
        email: currentUser?.email,
        type: 'email-verification',
      })

      if (data?.success) {
        setIsSending(false) // 结束发送
        setIsSend(true) // 已发送
        setCountdown(60) // 开始 60 秒倒计时

        toast.success('Verification code sent to your email!')

        // 使用 setTimeout 确保在状态更新后执行对 input 的 focus
        setTimeout(() => {
          inputOtpRef.current?.focus()
        }, 0)
      } else {
        setIsSending(false) // 结束发送

        toast.error('Unable to send verification code!')
      }
    } catch {
      toast.error('Something went wrong!')
    } finally {
      setIsSending(false) // 结束发送
    }
  }, [currentUser?.email, setIsSend])

  const handleVerifyEmail = useCallback(
    async (otp: string) => {
      if (!currentUser?.email) return

      try {
        setIsVerifying(true) // 开始验证

        const { data } = await verifyEmail({
          email: currentUser?.email,
          otp,
        })

        if (data?.status) {
          setIsVerifying(false) // 结束验证

          toast.success('Email verified successfully!')

          updateCurrentUser({ emailVerified: true }) // 更新用户邮箱验证的本地状态

          onOpenChange() // 关闭模态框
        } else {
          setIsVerifying(false) // 结束验证
          setIsInvalid(true) // 验证错误

          toast.error('Invalid verification code!')
        }
      } catch {
        toast.error('Verification failed!')
      } finally {
        setIsVerifying(false) // 结束验证
      }
    },
    [currentUser?.email, updateCurrentUser, onOpenChange],
  )

  /* ----------------------------------- 倒计时 ---------------------------------- */
  const [countdown, setCountdown] = useState(0) // 倒计时

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [countdown])
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (countdown === 0) {
      inputOtpRef.current?.blur() // 倒计时归零后，应当取消 input 的 focus

      setValue('') // 倒计时归零后，应当重置 value 为空
      setIsSend(false) // 倒计时归零后，应当重置 isSend 为 false 状态
    }
  }, [countdown, setIsSend])

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="select-none text-sm font-medium text-default-900">Email</span>
          <Chip
            className="h-5 select-none text-[10px]"
            color={currentUser?.emailVerified ? 'success' : 'danger'}
            size="sm"
            variant="bordered"
          >
            {currentUser?.emailVerified ? 'Verified' : 'Unverified'}
          </Chip>
        </div>
        <p className="select-none font-mono text-xs text-default-500">{currentUser?.email}</p>
      </div>

      <Button
        color={currentUser?.emailVerified ? 'default' : 'warning'}
        onPress={currentUser?.emailVerified ? undefined : () => onOpen()}
        radius="sm"
        size="sm"
        variant="bordered"
      >
        {currentUser?.emailVerified ? 'Change email' : 'Verify email'}
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
        onOpenChange={onOpenChange}
        portalContainer={document.getElementById('main-container')!}
        size="xs"
      >
        <ModalContent className="bg-base-default">
          <ModalHeader>Verify your email</ModalHeader>
          <ModalBody>
            <InputOtp
              className="mx-auto"
              errorMessage={() => null}
              isDisabled={!isSend} // 如果 isSend 为 false (未发送邮件) 则禁用输入框
              isInvalid={isInvalid}
              length={6}
              onValueChange={(value) => {
                // 如果输入框的值改变, 除了要更新 value 外, 还需要重置 isInvalid 状态为 false
                setValue(value)
                setIsInvalid(false)
              }}
              ref={inputOtpRef}
              value={value}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              className="font-mono"
              color={isSend && value.length === 6 ? 'primary' : 'default'}
              fullWidth
              isDisabled={isSend && value.length !== 6} // 如果 isSend 为 true (已发送邮件) 且输入长度不为 6 (未填满), 则禁用按钮
              isLoading={isSending || isVerifying}
              onPress={isSend ? () => handleVerifyEmail(value) : handleSendVerificationOtp}
            >
              {isSend ? (value.length === 6 ? 'Verify' : countdown > 0 ? `${countdown}s` : 'Send') : 'Send'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

const formSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(1, 'New password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(32, 'Password must be at most 32 characters')
    .regex(/^\S*$/, 'Password cannot contain spaces'),
})

function Password() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const [isUpdating, setIsUpdating] = useState<boolean>(false)
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({})

  const handleUpdatePassword = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      const { data, error, success } = formSchema.safeParse(Object.fromEntries(new FormData(e.currentTarget)))

      if (success) {
        const { currentPassword, newPassword } = data

        try {
          setIsUpdating(true) // 开始提交

          const isUpdated = await updatePassword(currentPassword, newPassword) // 更新密码

          if (isUpdated) {
            setIsUpdating(false) // 结束提交

            toast.success('Password successfully updated!')

            onOpenChange() // 关闭模态框
          } else {
            setIsUpdating(false) // 结束提交

            toast.error('Current password is incorrect!')
          }
        } catch {
          toast.error('Unable to update password!')
        } finally {
          setIsUpdating(false) // 结束提交
        }
      } else {
        return setFormErrors(error.flatten().fieldErrors)
      }
    },
    [onOpenChange],
  )

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

      <Button color="default" onPress={onOpen} radius="sm" size="sm" variant="bordered">
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
        isOpen={isOpen}
        onOpenChange={onOpenChange}
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
                Change password
              </Button>
            </ModalFooter>
          </ModalContent>
        </Form>
      </Modal>
    </div>
  )
}
