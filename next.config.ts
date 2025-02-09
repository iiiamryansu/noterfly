import type { NextConfig as Config } from 'next'

import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/index.ts')

const config: Config = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'standalone',
  async redirects() {
    return [
      {
        destination: '/welcome',
        permanent: true,
        source: '/',
      },
    ]
  },
}

export default withNextIntl(config)
