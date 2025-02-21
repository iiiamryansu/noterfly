import { z } from 'zod'

import { User } from '~/lib/auth'

type UpdatableUserFields = Pick<User, 'image' | 'name'>

export const UpdateProfileSchema = z.object({
  image: z.string().url().optional(),
  name: z.string().min(2, { message: 'Name must be at least 2 characters long.' }).optional(),
}) satisfies z.ZodType<Partial<UpdatableUserFields>>

export const UpdatePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(1, 'New password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(32, 'Password must be at most 32 characters')
    .regex(/^\S*$/, 'Password cannot contain spaces'),
})
