import { FlatCompat } from '@eslint/eslintrc'
import perfectionist from 'eslint-plugin-perfectionist'

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
})

const config = [
  perfectionist.configs['recommended-natural'],
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'prettier'),
]

export default config
