'use server'

import { cookies } from 'next/headers'

import { COOKIE_NAME, type Locale } from '~/lib/i18n/config'

export async function setLocale(locale: Locale) {
  ;(await cookies()).set(COOKIE_NAME, locale)
}
