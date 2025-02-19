'use server'

import { getUser } from '~/actions/auth'
import { auth } from '~/lib/auth'

export async function updatePassword(currentPassword: string, newPassword: string): Promise<boolean> {
  const user = await getUser()

  if (user) {
    const ctx = await auth.$context

    const hashedCurrentPassword = await ctx.internalAdapter.findAccountByUserId(user.id).then((account) => account[0].password)

    if (!hashedCurrentPassword) {
      return false
    }

    const isVerified = await ctx.password.verify({ hash: hashedCurrentPassword, password: currentPassword })

    if (!isVerified) {
      return false
    }

    const hashedNewPassword = await ctx.password.hash(newPassword)

    await ctx.internalAdapter.updatePassword(user.id, hashedNewPassword)

    return true
  } else {
    return false
  }
}
