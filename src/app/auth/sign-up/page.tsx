import Link from 'next/link'

import { SignUpForm } from '~/components/form'

export default function SignUpPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <header className="flex w-80 flex-col items-center gap-1">
        <h1 className="select-none text-3xl">Get started</h1>
        <p className="select-none text-sm text-default-500">Create a new account</p>
      </header>

      <SignUpForm />

      <footer className="flex w-80 justify-center">
        <p className="select-none text-sm text-default-500">
          Have an account?{' '}
          <Link className="text-default-700 underline transition-all duration-300 hover:text-default-500" href="/auth/sign-in">
            Sign In Now
          </Link>
        </p>
      </footer>
    </div>
  )
}
