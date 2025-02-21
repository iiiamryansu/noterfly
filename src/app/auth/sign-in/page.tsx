'use client'

import { signIn } from '@auth/c'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid'
import { Button } from '@heroui/button'
import { Form } from '@heroui/form'
import { Input } from '@heroui/input'
import Link from 'next/link'
import { type FormEvent, useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

const signInFormSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

export default function SignUpPage() {
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
    <div className="flex flex-col items-center justify-center gap-8">
      <header className="flex w-80 flex-col items-center gap-1">
        <h1 className="select-none text-3xl">Welcome back</h1>
        <p className="select-none text-sm text-default-500">Sign in to your account</p>
      </header>

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

      <footer className="flex w-80 justify-center">
        <p className="select-none text-sm text-default-500">
          Don&apos;t have an account?{' '}
          <Link className="text-default-700 underline transition-all duration-300 hover:text-default-500" href="/auth/sign-up">
            Sign Up Now
          </Link>
        </p>
      </footer>
    </div>
  )
}
