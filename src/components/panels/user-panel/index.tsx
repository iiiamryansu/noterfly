'use client'

import { signOut } from '@auth/c'
import { Avatar } from '@heroui/avatar'
import { Button } from '@heroui/button'
import { Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from '@heroui/dropdown'
import { User } from '@heroui/user'
import { useNoteStore } from '@stores/note'
import { useNotebookStore } from '@stores/notebook'
import { useSystemStore } from '@stores/system'
import { useUserStore } from '@stores/user'
import { ArrowDown01Icon, LinkBackwardIcon, LogoutSquare01Icon, Search01Icon, UserAccountIcon } from 'hugeicons-react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

export default function UserPanel() {
  const { currentUser, resetUserStates } = useUserStore()

  const { resetSystemStates, setSidebarMode, sidebarMode } = useSystemStore()
  const { resetNoteStates } = useNoteStore()
  const { resetNotebookStates } = useNotebookStore()

  const router = useRouter()

  const t = useTranslations('Layout.Sidebar.UserPanel')

  async function handleSignOut() {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          resetSystemStates()
          resetUserStates()
          resetNotebookStates()
          resetNoteStates()

          router.push('/auth/sign-in')
        },
      },
    })
  }

  return (
    <section className="flex justify-between">
      <Dropdown
        classNames={{
          content: 'p-0 border-small border-divider bg-background',
        }}
        radius="sm"
      >
        <DropdownTrigger>
          <Button
            className="px-1"
            disableRipple
            endContent={<ArrowDown01Icon className="size-4" />}
            size="sm"
            startContent={
              <Avatar className="max-h-6 max-w-6" radius="sm" size="sm" src={currentUser?.image ?? 'default/avatar.svg'} />
            }
            variant="light"
          >
            Default
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          disabledKeys={['info']}
          itemClasses={{
            base: [
              'text-default-500',
              'transition-all duration-300',
              'data-[hover=true]:bg-default-100',
              'data-[pressed=true]:opacity-70',
            ],
          }}
        >
          <DropdownSection showDivider>
            <DropdownItem className="h-14 select-none gap-2 opacity-100" key="info" textValue="Info">
              <User
                avatarProps={{
                  radius: 'sm',
                  size: 'sm',
                  src: currentUser?.image ?? 'default/avatar.svg',
                }}
                classNames={{
                  description: 'text-default-500',
                  name: 'text-default-700',
                }}
                description={`@${currentUser?.username ?? 'default'}`}
                name={currentUser?.name ?? 'Default'}
              />
            </DropdownItem>
            <DropdownItem
              className="data-[hover=true]:text-primary-500"
              endContent={<UserAccountIcon className="size-4" />}
              key="profile"
              onPress={() => router.push('/profile')}
            >
              {t('profile')}
            </DropdownItem>
          </DropdownSection>
          <DropdownSection>
            <DropdownItem
              className="data-[hover=true]:text-danger-500"
              endContent={<LogoutSquare01Icon className="size-4" />}
              key="logout"
              onPress={handleSignOut}
            >
              {t('sign-out')}
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>

      {/* Search */}
      <Button
        className="text-default-500"
        isIconOnly
        onPress={() => setSidebarMode(sidebarMode === 'normal' ? 'search' : 'normal')}
        size="sm"
        variant={sidebarMode === 'search' ? 'solid' : 'light'}
      >
        {sidebarMode === 'normal' ? <Search01Icon className="size-4" /> : <LinkBackwardIcon className="size-4" />}
      </Button>
    </section>
  )
}
