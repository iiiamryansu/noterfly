import type { Metadata } from 'next'

import { getLocale } from 'next-intl/server'
import { Poppins } from 'next/font/google'
import { cookies } from 'next/headers'

import AppLayout from '~/components/layouts'
import AppProvider from '~/components/providers'
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

  async function getDefaultLayout() {
    const defaultLayout = (await cookies()).get('react-resizable-panels:layout')?.value

    return JSON.parse(defaultLayout ?? '[25, 75]')
  }

  return (
    <html lang={locale}>
      <body className={poppins.className}>
        <AppProvider>
          <AppLayout defaultLayout={await getDefaultLayout()}>{children}</AppLayout>
        </AppProvider>
      </body>
    </html>
  )
}
