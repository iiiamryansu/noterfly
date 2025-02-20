import { z } from 'zod'

import { User } from '~/lib/auth'

type UpdatableUserFields = Pick<User, 'image' | 'name'>

export const UpdateProfileSchema = z.object({
  image: z.string().url().optional(),
  name: z.string().min(2, { message: 'Name must be at least 2 characters long.' }).optional(),
}) satisfies z.ZodType<Partial<UpdatableUserFields>>
