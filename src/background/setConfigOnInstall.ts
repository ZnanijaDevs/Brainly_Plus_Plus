import storage, { ExtensionConfigDataInStorage } from "@lib/storage";

const DEFAULT_CONFIG: Partial<ExtensionConfigDataInStorage> = {
  searchEngine: "google",
  newModPanelEnabled: true,

};

export default async () => {
  await storage.set(DEFAULT_CONFIG);
  console.debug("Set default extension config in the storage", DEFAULT_CONFIG);
};