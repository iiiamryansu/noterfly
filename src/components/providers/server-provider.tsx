import { NextIntlClientProvider as NextIntlProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'

export default async function ServerProvider({ children }: { children: React.ReactNode }) {
  const messages = await getMessages()

  return <NextIntlProvider messages={messages}>{children}</NextIntlProvider>
}
