import type { BuildOptions } from "esbuild";

import { sassPlugin } from "esbuild-sass-plugin";
import { copy } from "esbuild-plugin-copy";
import stylesPlugin from "@hyrious/esbuild-plugin-style";

import makeEntries from "./makeEntries";
import { version } from "../package.json";

const entryPoints = {
  ...makeEntries("styles/*/index.scss", "styles", true),
  ...makeEntries("views/*/index.t{s,sx}", "content-scripts", true),
  ...makeEntries("views/Inject.ts", "content-scripts"),
  ...makeEntries("background/index.ts", "background"),
  ...makeEntries("popup/scripts/index.ts", "popup")
};

const buildOptions: BuildOptions = {
  entryPoints,
  bundle: true,
  loader: {
    ".tsx": "tsx"
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
  },
  inject: ["./src/locales/index.ts"],
  legalComments: "eof"
};

export default buildOptions;