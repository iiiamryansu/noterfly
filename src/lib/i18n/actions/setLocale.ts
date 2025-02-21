'use server'

import { COOKIE_NAME, type Locale } from '@i18n/config'
import { cookies } from 'next/headers'

export async function setLocale(locale: Locale) {
  ;(await cookies()).set(COOKIE_NAME, locale)
}
