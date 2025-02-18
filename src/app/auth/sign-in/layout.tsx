import type { Metadata } from 'next'

import Link from 'next/link'

import { ParticlesWrapper } from '~/components/ui'

export const metadata: Metadata = {
  title: 'Sign In / Noterfly',
}

export default function SignInLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ParticlesWrapper>
      <div className="grid h-full grid-cols-1 grid-rows-[1fr_48px]">
        {children}

        <footer className="flex h-12 items-center justify-center">
          <p className="max-w-[512px] select-none text-center text-xs text-default-500">
            By continuing, you agree to Noterfly&apos;s{' '}
            <Link className="underline transition-all duration-300 hover:text-default-700" href="/terms">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link className="underline transition-all duration-300 hover:text-default-700" href="/privacy">
              Privacy Policy
            </Link>
            , and to receive periodic emails with updates.
          </p>
        </footer>
      </div>
    </ParticlesWrapper>
  )
}
