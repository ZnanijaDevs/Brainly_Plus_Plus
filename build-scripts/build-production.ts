import fs from "fs";
import { build } from "esbuild";
import jsonMerge from "esbuild-plugin-json-merge";

import buildOptions from "./build";

import { version, author, name } from "../package.json";
import { content_scripts } from "../manifest.json";
import servers from "./servers.json";

// Add Sentry
const SENTRY_DSN = fs.readFileSync(".sentry-dsn", "utf-8");
buildOptions.entryPoints["sentry/index"] = "./src/sentry.ts";

content_scripts[0].js.unshift("sentry/index.js");

buildOptions.plugins.push(
  jsonMerge({
    outfile: "manifest.json",
    entryPoints: ["manifest.json", {
      content_scripts,
      version,
      author,
      short_name: name
    }]
  })
);

buildOptions.define["SENTRY_DSN"] = JSON.stringify(SENTRY_DSN);
buildOptions.define["API_SERVER"] = JSON.stringify(servers.production.api);
buildOptions.define["EVENTS_SERVER"] = JSON.stringify(servers.production.events);
 
build({
  ...buildOptions,
  outdir: "dist",
  minify: true,
  banner: {
    js: `/* Copyright (c) 2022 vlaex7@gmail.com. See LICENSE.md for details */`
  }
})
  .then(_ => console.info(`production build ${version} succeed`));