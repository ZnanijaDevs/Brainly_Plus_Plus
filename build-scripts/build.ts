import type { BuildOptions } from "esbuild";

import { sassPlugin } from "esbuild-sass-plugin";
import { copy } from "esbuild-plugin-copy";
import jsonMerge from "esbuild-plugin-json-merge";
import stylesPlugin from "@hyrious/esbuild-plugin-style";

import makeEntries from "./makeEntries";
import { version, author } from "../package.json";

const entryPoints = {
  ...makeEntries("styles/*/index.scss", "styles", true),
  ...makeEntries("views/*/index.t{s,sx}", "content-scripts", true),
  ...makeEntries("views/Inject.ts", "content-scripts"),
  ...makeEntries("background/index.ts", "background"),
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
      ]
    }),
    jsonMerge({
      outfile: "manifest.json",
      entryPoints: ["manifest.json", { version, author }]
    }),
  ],
  define: {
    EXTENSION_VERSION: JSON.stringify(version),
  },
  inject: ["./src/locales/index.ts"],
  legalComments: "eof"
};

export default buildOptions;