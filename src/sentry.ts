import * as Sentry from "@sentry/browser";

Sentry.init({ 
  dsn: SENTRY_DSN,
  ignoreErrors: [
    /Failed to fetch/i,
    /Extension context invalidated/i,
    /Receiving end does not exist/i,
    /not authorized/i
  ],
  release: EXTENSION_VERSION
});