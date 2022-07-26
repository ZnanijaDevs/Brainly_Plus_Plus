import storage, { ExtensionConfigDataInStorage } from "@lib/storage";

const DEFAULT_CONFIG: Partial<ExtensionConfigDataInStorage> = {
  searchEngine: "google",
  newModPanelEnabled: true,
  customDeletionReasons: [],
  slackToken: "",
  customBanMessageReasons: [],
};

export default async () => {
  /**
   * Check if the extension storage is empty.
   * Comment out the lines below if you want to update the config on reload.
   */
  // const bytesInUse = await storage.getBytesInUse();
  // if (bytesInUse !== 0) return;

  await storage.set(DEFAULT_CONFIG);
  console.debug("Set default extension config in the storage", DEFAULT_CONFIG);
};