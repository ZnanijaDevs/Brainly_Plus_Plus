import type { BuildOptions } from "esbuild";

import { sassPlugin } from "esbuild-sass-plugin";
import { copy } from "esbuild-plugin-copy";
import stylesPlugin from "@hyrious/esbuild-plugin-style";

import makeEntries from "./makeEntries";
import { version } from "../package.json";
import { version as styleguideVersion } from "brainly-style-guide/package.json";

const entryPoints = {
  ...makeEntries("styles/*/index.scss", "styles", true),
  ...makeEntries("views/*/index.t{s,sx}", "content-scripts", true),
  ...makeEntries("views/Inject.ts", "content-scripts"),
  ...makeEntries("background/index.ts", "background"),
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
  ],
  define: {
    EXTENSION_VERSION: JSON.stringify(version),
    STYLEGUIDE_VERSION: JSON.stringify(styleguideVersion),
  },
  inject: [
    "./src/locales/index.ts",
    "./src/utils/flashes.ts"
  ],
  legalComments: "eof"
};

export default buildOptions;