import type { Metadata } from 'next'

import { Poppins } from 'next/font/google'

import { AppProvider } from '~/components/global'
import '~/styles/global.css'

const poppins = Poppins({
  style: ['normal', 'italic'],
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'], // light, base, medium, semibold, bold
})

export const metadata: Metadata = {
  description:
    'Noterfly - AI-powered note-taking app with GPT integration. Create, edit and share documents with real-time collaboration. Smart text processing and AI assistance for better productivity.',
  title: 'Noterfly',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  )
}
