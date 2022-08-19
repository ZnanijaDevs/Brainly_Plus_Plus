import fs from "fs";
import type { BuildOptions } from "esbuild";

import { sassPlugin } from "esbuild-sass-plugin";
import { copy } from "esbuild-plugin-copy";
import stylesPlugin from "@hyrious/esbuild-plugin-style";
import jsonMerge from "esbuild-plugin-json-merge";

import makeEntries from "./makeEntries";
import { version, name, author } from "../package.json";
import { version as styleguideVersion } from "brainly-style-guide/package.json";

const SENTRY_DSN = fs.readFileSync(".sentry-dsn", "utf-8");

const entryPoints = {
  ...makeEntries("styles/*/index.scss", "styles", true),
  ...makeEntries("views/*/index.t{s,sx}", "content-scripts", true),
  ...makeEntries("views/Inject.ts", "content-scripts"),
  ...makeEntries("background/index.ts", "background"),
  "sentry/index": "./src/sentry.ts",
  "popup/script": `./src/popup/scripts/index.ts`,
  "popup/style": `./src/popup/styles/index.scss`
};

const buildOptions: BuildOptions = {
  entryPoints,
  bundle: true,
  loader: {
    ".tsx": "tsx",
    ".html": "file",
    ".gql": "text"
  },
  plugins: [
    stylesPlugin(),
    sassPlugin({ filter: /\.scss$/ }),
    copy({
      assets: [
        { from: "LICENSE.md", to: "./" },
        { from: "./src/icons/*", to: "./icons/*" },
        { from: "./src/scripts/*", to: "./scripts/*" },
        { from: "./src/popup/index.html", to: "./popup/*" }
      ]
    }),
    jsonMerge({
      outfile: "manifest.json",
      entryPoints: ["manifest.json", {
        version,
        author,
        short_name: name
      }]
    })
  ],
  define: {
    EXTENSION_VERSION: JSON.stringify(version),
    STYLEGUIDE_VERSION: JSON.stringify(styleguideVersion),
    SENTRY_DSN: JSON.stringify(SENTRY_DSN)
  },
  inject: [
    "./src/locales/index.ts",
    "./src/utils/flashes.ts"
  ],
  legalComments: "eof"
};

export default buildOptions;