'use client'

import { deleteUser } from '@auth/c'
import { Button } from '@heroui/button'
import { Divider } from '@heroui/divider'
import { delay } from 'es-toolkit'
import { useRouter } from 'next/navigation'
import { useCallback, useTransition } from 'react'
import { toast } from 'sonner'

import { Email } from '~/app/profile/_components/email'
import { Password } from '~/app/profile/_components/password'
import { Profile } from '~/app/profile/_components/profile'

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
