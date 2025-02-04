import type { Metadata } from 'next'

import { Announcement } from '~/components/common'
import { ParticlesWrapper } from '~/components/ui'

export const metadata: Metadata = {
  title: 'Sign Up / Noterfly',
}

export default function SignUpLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ParticlesWrapper>
      <div className="grid h-full grid-cols-1 grid-rows-[1fr_48px]">
        {children}

        <Announcement />
      </div>
    </ParticlesWrapper>
  )
}
