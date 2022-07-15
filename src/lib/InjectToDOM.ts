import ToBackground from "./ToBackground";

/**
 * Inject files (content scripts and stylesheets) to DOM
 * @param files An array of files
 */
export default async (files: string[]) => {
  const jsFiles = files.filter(file => file.match(/\.js$/));
  const cssFiles = files.filter(file => file.match(/\.css$/));

  if (cssFiles.length) await ToBackground("InjectStyles", cssFiles);
  if (jsFiles.length) await ToBackground("InjectScripts", jsFiles);
};