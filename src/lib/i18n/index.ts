import { getLocale } from '@i18n/actions/getLocale'
import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async () => {
  // Provide a static locale, fetch a user setting,
  // read from `cookies()`, `headers()`, etc.
  // const locale = 'en'
  const locale = await getLocale()

  return {
    locale,
    messages: (await import(`@i18n/messages/${locale}.json`)).default,
  }
})
