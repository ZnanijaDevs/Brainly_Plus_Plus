import * as Sentry from "@sentry/browser";

const ignoredErrors = [
  /Failed to fetch/i,
  /Extension context invalidated/i,
  /Receiving end does not exist/i,
  /not authorized/i
];

Sentry.init({ 
  enabled: ENV === "production",
  environment: ENV,
  dsn: SENTRY_DSN,
  ignoreErrors: ignoredErrors,
  release: EXTENSION_VERSION,
  attachStacktrace: true,
  beforeSend: (event) => {
    let user = globalThis.System?.viewer;

    event.tags = { "user:authorized": !!user };
    if (user) {
      event.user = {
        id: user.brainlyId.toString(),
        username: user.nick,
        ip_address: "{{auto}}"
      };
    }

    return event;
  }
});