import { getRequestConfig } from 'next-intl/server'

import { getLocale } from '~/actions/i18n'

export default getRequestConfig(async () => {
  // Provide a static locale, fetch a user setting,
  // read from `cookies()`, `headers()`, etc.
  // const locale = 'en'
  const locale = await getLocale()

  return {
    locale,
    messages: (await import(`~/lib/i18n/messages/${locale}.json`)).default,
  }
})
