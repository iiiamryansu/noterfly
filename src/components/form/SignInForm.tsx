'use client'

import type { FormEvent } from 'react'

import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid'
import { Button, Form, Input } from '@heroui/react'
import { useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

import { signIn } from '~/lib/auth/client'

const signInFormSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

export function SignInForm() {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({})

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const { data, error, success } = signInFormSchema.safeParse(Object.fromEntries(new FormData(e.currentTarget)))

    if (success) {
      const { email, password } = data

      await signIn.email({
        callbackURL: '/home',
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
        },
        password,
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
        Sign In
      </Button>
    </Form>
  )
}
