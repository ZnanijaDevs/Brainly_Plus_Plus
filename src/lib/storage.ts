import ext from "webextension-polyfill";

export type ExtensionConfigDataInStorage = {
  searchEngine: "yandex" | "google";
  newModPanelEnabled: boolean;
  slackToken: string;
}

const get = async <K extends keyof ExtensionConfigDataInStorage>(
  key: keyof ExtensionConfigDataInStorage
): Promise<ExtensionConfigDataInStorage[K]> => {
  const storage = await ext.storage.sync.get(key);

  return storage?.[key];
};

const set = async (data: Partial<ExtensionConfigDataInStorage>) => {
  return await ext.storage.sync.set(data);
};

export default { get, set };