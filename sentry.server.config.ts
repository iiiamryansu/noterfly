// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
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
