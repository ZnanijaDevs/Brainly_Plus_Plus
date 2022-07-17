import * as Sentry from "@sentry/browser";

Sentry.init({ 
  dsn: SENTRY_DSN,
  ignoreErrors: [/Failed to fetch/i]
});