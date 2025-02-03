'use client'

import { Avatar, Button, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger, User } from '@heroui/react'
import { ArrowDown01Icon, LogoutSquare01Icon, Search01Icon, UserAccountIcon } from 'hugeicons-react'
import { useRouter } from 'next/navigation'

export function UserPanel() {
  const router = useRouter()

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
            startContent={<Avatar className="max-h-6 max-w-6" radius="sm" size="sm" src="default/avatar.svg" />}
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
                  src: 'default/avatar.svg',
                }}
                classNames={{
                  description: 'text-default-500',
                  name: 'text-default-700',
                }}
                description="@default"
                name="Default"
              />
            </DropdownItem>
            <DropdownItem
              className="data-[hover=true]:text-primary-500"
              endContent={<UserAccountIcon className="size-4" />}
              key="profile"
              onPress={() => router.push('/profile')}
            >
              Profile
            </DropdownItem>
          </DropdownSection>
          <DropdownSection>
            <DropdownItem
              className="data-[hover=true]:text-danger-500"
              endContent={<LogoutSquare01Icon className="size-4" />}
              key="logout"
            >
              Log Out
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>

      {/* Search */}
      <Button className="text-default-500" isIconOnly size="sm" variant="light">
        <Search01Icon className="size-4" />
      </Button>
    </section>
  )
}
