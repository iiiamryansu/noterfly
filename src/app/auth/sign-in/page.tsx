import Link from 'next/link'

import { SignInForm } from '~/components/form'

export default function SignUpPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <header className="flex w-80 flex-col items-center gap-1">
        <h1 className="select-none text-3xl">Welcome back</h1>
        <p className="select-none text-sm text-default-500">Sign in to your account</p>
      </header>

      <SignInForm />

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
