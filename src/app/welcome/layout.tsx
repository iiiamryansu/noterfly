import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Welcome / Noterfly',
}

export default function WelcomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
