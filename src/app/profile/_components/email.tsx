'use client'

import { sendVerificationOtp, verifyEmail } from '@auth/c'
import { Button, Chip, InputOtp, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@heroui/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import { useUserStore } from '~/stores/user-store'

export function Email() {
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
