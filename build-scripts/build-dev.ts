import { build } from "esbuild";
import jsonMerge from "esbuild-plugin-json-merge";

import buildOptions from "./build";
import { version } from "../package.json";
import servers from "./servers.json";

buildOptions.plugins.push(
  jsonMerge({
    outfile: "manifest.json",
    entryPoints: ["manifest.json", { version }]
  })
);

buildOptions.define["API_SERVER"] = JSON.stringify(servers.dev.api);
buildOptions.define["EVENTS_SERVER"] = JSON.stringify(servers.dev.events);

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