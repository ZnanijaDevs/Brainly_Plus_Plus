import { build } from "esbuild";

import buildOptions from "./build";
import { version } from "../package.json";

buildOptions.define["ENV"] = `"production"`;
 
build({
  ...buildOptions,
  outdir: "dist",
  minify: true,
})
  .then(_ => console.info(`production build ${version} succeed`));