import { build } from "esbuild";

import buildOptions from "./build";
import { version } from "../package.json";

build({
  ...buildOptions,
  outdir: "dist",
  minify: true,
  banner: {
    js: `
    /*
    * Copyright (c) 2022 vlaex7@gmail.com
    * See LICENSE.md for details
    */
    `
  }
})
  .then(_ => console.info(`production build ${version} succeed`));