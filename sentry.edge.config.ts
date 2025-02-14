// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
process.env.NODE_ENV === 'production' &&
  Sentry.init({
    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false,

    dsn: 'https://4e9f24f745701123a168a0668d81a057@o4508818258329600.ingest.us.sentry.io/4508818269470725',

    // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
    tracesSampleRate: 1,
  })
