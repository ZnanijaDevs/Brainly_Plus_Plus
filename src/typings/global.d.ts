declare global {
  const EXTENSION_VERSION: string;
  const MARKET: typeof import("../locales/marketConfig").MARKET;
  const locales: typeof import("../locales").locales;
}

export {};