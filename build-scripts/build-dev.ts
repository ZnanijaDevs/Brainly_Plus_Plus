import { build } from "esbuild";
import jsonMerge from "esbuild-plugin-json-merge";

import buildOptions from "./build";
import { version } from "../package.json";

buildOptions.plugins.push(
  jsonMerge({
    outfile: "manifest.json",
    entryPoints: ["manifest.json", { version }]
  })
);

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