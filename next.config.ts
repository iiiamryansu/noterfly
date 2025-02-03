import type { NextConfig as Config } from 'next'

const config: Config = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'standalone',
}

export default config
