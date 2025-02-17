import type { Metadata } from 'next'

import { getLocale } from 'next-intl/server'
import { Poppins } from 'next/font/google'

import { getAllNotes } from '~/actions/note'
import { AppLayout, AppProvider, NextIntlProvider } from '~/components/global'
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()
  const notes = await getAllNotes()

  return (
    <html lang={locale}>
      <body className={poppins.className}>
        <NextIntlProvider>
          <AppProvider notes={notes}>
            <AppLayout>{children}</AppLayout>
          </AppProvider>
        </NextIntlProvider>
      </body>
    </html>
  )
}
