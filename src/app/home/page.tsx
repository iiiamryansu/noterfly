import type { User } from '@prisma/client'

import { prisma } from '~/lib/prisma'

export default async function HomePage() {
  const users = await prisma.user.findMany()

  return (
    <div className="flex h-full flex-col items-center justify-center gap-8">
      <h1 className="text-3xl font-bold text-primary-900">Home</h1>
      <ul>
        {users.map((user: User) => (
          <li className="mb-2" key={user.id}>
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  )
}
