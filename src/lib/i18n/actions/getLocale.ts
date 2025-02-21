'use server'

import { COOKIE_NAME, defaultLocale } from '@i18n/config'
import { cookies } from 'next/headers'

export async function getLocale() {
  return (await cookies()).get(COOKIE_NAME)?.value || defaultLocale
}
