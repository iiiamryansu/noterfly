'use server'

import { cookies } from 'next/headers'

import { COOKIE_NAME, defaultLocale } from '~/lib/i18n/config'

export async function getLocale() {
  return (await cookies()).get(COOKIE_NAME)?.value || defaultLocale
}
