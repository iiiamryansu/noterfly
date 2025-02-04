import type { NextConfig as Config } from 'next'

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

export default config
