'use client'

import type { FormEvent } from 'react'

import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid'
import { Button, Form, Input } from '@heroui/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

import { signUp } from '~/lib/auth/client'

const signUpFormSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(32, 'Password must be at most 32 characters')
    .regex(/^\S*$/, 'Password cannot contain spaces'),
  username: z
    .string()
    .min(1, 'Username is required')
    .max(16, 'Username must be at most 16 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Please use only letters, numbers and underscores'),
})

export function SignUpForm() {
  const [username, setUsername] = useState<string>('')
  const [isUsernameInputFocused, setIsUsernameInputFocused] = useState<boolean>(false)
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({})

  const router = useRouter()

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const { data, error, success } = signUpFormSchema.safeParse(Object.fromEntries(new FormData(e.currentTarget)))

    if (success) {
      const { email, password, username } = data

      await signUp.email({
        email,
        fetchOptions: {
          onError: (ctx) => {
            if (ctx.error.status === 500) {
              toast.error(ctx.error.statusText)
            } else {
              toast.error(ctx.error.message)
            }
          },
          onRequest: () => {
            setIsSubmitting(true)
          },
          onResponse: () => {
            setIsSubmitting(false)
          },
          onSuccess: () => {
            router.push('/home')
          },
        },
        name: 'Default',
        password,
        username,
      })
    } else {
      return setFormErrors(error.flatten().fieldErrors)
    }
  }

  return (
    <Form className="flex w-80 flex-col gap-4" onSubmit={handleSubmit} validationErrors={formErrors}>
      <Input
        errorMessage={({ validationErrors }) => validationErrors[0]}
        isDisabled={isSubmitting}
        label="Username"
        labelPlacement="inside"
        name="username"
        onBlur={() => setIsUsernameInputFocused(false)}
        onChange={(e) => setUsername(e.target.value)}
        onFocus={() => setIsUsernameInputFocused(true)}
        startContent={
          isUsernameInputFocused || username.length > 0 ? (
            <span className="-mr-1 select-none font-sans text-sm text-default-500">@</span>
          ) : null
        }
        type="string"
        value={username}
        variant="bordered"
      />
      <Input
        errorMessage={({ validationErrors }) => validationErrors[0]}
        isDisabled={isSubmitting}
        label="Email"
        labelPlacement="inside"
        name="email"
        type="string"
        variant="bordered"
      />
      <Input
        endContent={
          <button
            aria-label="toggle password visibility"
            className="focus:outline-none"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            type="button"
          >
            {isPasswordVisible ? (
              <EyeSlashIcon className="pointer-events-none size-4 text-default-300" />
            ) : (
              <EyeIcon className="pointer-events-none size-4 text-default-300" />
            )}
          </button>
        }
        errorMessage={({ validationErrors }) => validationErrors[0]}
        isDisabled={isSubmitting}
        label="Password"
        labelPlacement="inside"
        name="password"
        type={isPasswordVisible ? 'text' : 'password'}
        variant="bordered"
      />
      <Button color="primary" fullWidth isLoading={isSubmitting} type="submit">
        Sign Up
      </Button>
    </Form>
  )
}
