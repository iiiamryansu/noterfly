export type Locale = (typeof locales)[number]['key']

export const defaultLocale: Locale = 'en' as const
export const locales = [
  { key: 'en', label: 'English' },
  { key: 'zh', label: '简体中文' },
] as const
export const COOKIE_NAME = 'NEXT_LOCALE'
