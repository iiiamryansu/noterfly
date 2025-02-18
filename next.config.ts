import type { NextConfig as Config } from 'next'

import { withSentryConfig } from '@sentry/nextjs'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/lib/i18n/index.ts')

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

export default withSentryConfig(withNextIntl(config), {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  org: 'iamryansu',

  project: 'noterfly',

  // Automatically annotate React components to show their full name in breadcrumbs and session replay
  reactComponentAnnotation: {
    enabled: true,
  },

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  /**
   * The Sentry SDK has enabled source map generation for your Next.js app.
   * If you don't want to serve Source Maps to your users, either set the `sourcemaps.deleteSourcemapsAfterUpload` option to true, or manually delete the source maps after the build.
   * In future Sentry SDK versions `sourcemaps.deleteSourcemapsAfterUpload` will default to `true`.
   * If you do not want to generate and upload sourcemaps, set the `sourcemaps.disable` option in `withSentryConfig()`.
   */
  sourcemaps: {
    deleteSourcemapsAfterUpload: true,
  },

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: '/monitoring',

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,
})
