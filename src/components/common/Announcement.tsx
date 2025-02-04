import Link from 'next/link'

export function Announcement() {
  return (
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
  )
}
