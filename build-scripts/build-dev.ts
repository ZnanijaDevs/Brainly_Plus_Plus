import { build } from "esbuild";

import buildOptions from "./build";

build({
  ...buildOptions,
  outdir: "build",
  minify: false,
  watch: {
    onRebuild: (error, _) => {
      if (error) return console.error("build failed", error);

      console.log(`[${new Date().toLocaleString()}] build succeeded`);
    }
  }
})
  .then(_ => console.info("watching"));